import { Scene } from 'phaser';

export class MainScene extends Scene {
    private player: Phaser.GameObjects.Sprite | undefined;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private wasd: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    } | undefined;
    private interactKey: Phaser.Input.Keyboard.Key | undefined;
    private sitKey: Phaser.Input.Keyboard.Key | undefined;
    private speed: number = 200;

    // Groups
    private doors: Phaser.Physics.Arcade.StaticGroup | undefined;
    private chairs: Phaser.Physics.Arcade.StaticGroup | undefined;
    private isSitting: boolean = false;

    // Colors
    private colors = {
        floor: 0x808080,
        wall: 0x333333,
        door: 0xA0522D, // Sienna
        doorOpen: 0xCD853F, // Peru (Lighter)
        table: 0x8B4513, 
        chair: 0x4169E1, 
        managerChair: 0x800000, 
        player: 0x00ff00
    };

    constructor() {
        super('MainScene');
    }

    // ... (previous code) ...

    preload() {
        // Load the player sprite
        this.load.image('player', '/assets/player.png');
    }

    create() {
        // --- Setup World ---
        // Increase world size to fit the expanded office
        this.physics.world.setBounds(0, 0, 2000, 2000);
        this.cameras.main.setBackgroundColor(this.colors.floor);
        this.cameras.main.setBounds(0, 0, 2000, 2000);

        // --- Groups ---
        const walls = this.physics.add.staticGroup();
        const furniture = this.physics.add.staticGroup();
        this.chairs = this.physics.add.staticGroup();
        this.doors = this.physics.add.staticGroup();

        // --- Create Layout with Doors ---
        // Wide corridors: ~300px gap between rooms (enough for 3-5 chars)
        this.createMeetingRoom(walls, furniture, 50, 50); // Ends at x=750, y=450
        this.createManagerRoom(walls, furniture, 1050, 50); // Starts at x=1050 (Gap=300)
        this.createEmployeeArea(walls, furniture, 50, 750); // Starts at y=750 (Gap=300 from top rooms)

        // --- Player ---
        // Spawn in the wide hallway
        this.player = this.physics.add.sprite(900, 500, 'player');
        
        // Scale down 
        this.player.setScale(0.15); 
        
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        
        // --- Hitbox Adjustment ---
        // Making it smaller (40% width, 40% height)
        body.setSize(this.player.width * 0.4, this.player.height * 0.4);
        body.setOffset(this.player.width * 0.3, this.player.height * 0.3);

        // --- Collisions ---
        this.physics.add.collider(this.player, walls);
        this.physics.add.collider(this.player, furniture);
        this.physics.add.collider(this.player, this.chairs);
        this.physics.add.collider(this.player, this.doors);

        // --- Camera ---
        this.cameras.main.startFollow(this.player);
        
        // --- Controls ---
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.wasd = this.input.keyboard.addKeys({
                W: Phaser.Input.Keyboard.KeyCodes.W,
                A: Phaser.Input.Keyboard.KeyCodes.A,
                S: Phaser.Input.Keyboard.KeyCodes.S,
                D: Phaser.Input.Keyboard.KeyCodes.D
            }) as any;
            
            this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.sitKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        }

        // --- Text ---
        this.add.text(16, 40, 'Space: Door | E: Sit/Leave', {
            fontSize: '18px',
            color: '#fff',
            backgroundColor: '#000'
        }).setScrollFactor(0);
    }
    
    // ... (rest of the file) ...

    update() {
        if (!this.player || !this.cursors || !this.wasd || !this.interactKey || !this.sitKey) return;

        // --- Movement ---
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);

        // --- Interaction: Sit/Stand ---
        if (this.isSitting) {
             if (Phaser.Input.Keyboard.JustDown(this.sitKey)) {
                this.handleChairInteraction();
            }
            return;
        }

        if (this.cursors.left.isDown || this.wasd.A.isDown) body.setVelocityX(-this.speed);
        else if (this.cursors.right.isDown || this.wasd.D.isDown) body.setVelocityX(this.speed);

        if (this.cursors.up.isDown || this.wasd.W.isDown) body.setVelocityY(-this.speed);
        else if (this.cursors.down.isDown || this.wasd.S.isDown) body.setVelocityY(this.speed);

        // --- Interaction: Doors ---
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.handleDoorInteraction();
        }

        // --- Interaction: Sit ---
        if (Phaser.Input.Keyboard.JustDown(this.sitKey)) {
            this.handleChairInteraction();
        }
    }

    private handleDoorInteraction() {
        if (!this.player || !this.doors) return;

        const playerCenter = this.player.getCenter();
        let closestDoor: Phaser.GameObjects.Rectangle | null = null;
        let minDist = 120; // Increased range for larger doors

        this.doors.getChildren().forEach((child) => {
            const door = child as Phaser.GameObjects.Rectangle;
            const dist = Phaser.Math.Distance.BetweenPoints(playerCenter, door.getCenter());
            if (dist < minDist) {
                minDist = dist;
                closestDoor = door;
            }
        });

        if (closestDoor) {
            const door = closestDoor as Phaser.GameObjects.Rectangle;
            const doorBody = door.body as Phaser.Physics.Arcade.StaticBody;

            if (doorBody.enable) {
                doorBody.enable = false;
                door.setFillStyle(this.colors.doorOpen, 0.5);
            } else {
                doorBody.enable = true;
                door.setFillStyle(this.colors.door, 1);
            }
        }
    }

    private handleChairInteraction() {
        if (!this.player || !this.chairs) return;

        // 1. Handle Standing Up
        if (this.isSitting) {
            this.isSitting = false;
            const body = this.player.body as Phaser.Physics.Arcade.Body;
            body.enable = true; // Re-enable collisions
            return;
        }

        // 2. Handle Sitting
        const playerCenter = this.player.getCenter();
        let closestChair: Phaser.GameObjects.Rectangle | null = null;
        let minDist = 60; 

        this.chairs.getChildren().forEach((child) => {
            const chair = child as Phaser.GameObjects.Rectangle;
            const dist = Phaser.Math.Distance.BetweenPoints(playerCenter, chair.getCenter());
            if (dist < minDist) {
                minDist = dist;
                closestChair = chair;
            }
        });

        if (closestChair) {
            const chair = closestChair as Phaser.GameObjects.Rectangle;
            this.isSitting = true;
            this.player.setPosition(chair.x, chair.y);
            const body = this.player.body as Phaser.Physics.Arcade.Body;
            body.enable = false; 
        }
    }

    private createMeetingRoom(walls: Phaser.Physics.Arcade.StaticGroup, furniture: Phaser.Physics.Arcade.StaticGroup, x: number, y: number) {
        // Wall with Door Gap at Bottom Center
        this.createRoomWallsWithDoor(walls, x, y, 700, 400, "bottom");

        // Door Object (Bottom Center)
        this.createDoor(x + 350, y + 400);

        // Furniture (Table + Chairs)
        const table = this.add.rectangle(x + 350, y + 200, 500, 100, this.colors.table);
        furniture.add(table);
        const startX = x + 125;
        for (let i = 0; i < 10; i++) {
            const chair1 = this.add.rectangle(startX + (i * 50), y + 140, 45, 45, this.colors.chair);
            const chair2 = this.add.rectangle(startX + (i * 50), y + 260, 45, 45, this.colors.chair);
            
            if (this.chairs) {
                this.chairs.add(chair1);
                this.chairs.add(chair2);
            } else {
                furniture.add(chair1);
                furniture.add(chair2);
            }
        }
        this.addLabel(x, y, "Meeting Room");
    }

    private createManagerRoom(walls: Phaser.Physics.Arcade.StaticGroup, furniture: Phaser.Physics.Arcade.StaticGroup, x: number, y: number) {
        // Wall with Door Gap at Bottom Left
        this.createRoomWallsWithDoor(walls, x, y, 700, 400, "bottom-left");
        
        // Door Object (Bottom Left-ish)
        this.createDoor(x + 100, y + 400);

        // Furniture
        const deskX = x + 350;
        const deskY = y + 100;
        furniture.add(this.add.rectangle(deskX, deskY, 200, 80, this.colors.table));
        if (this.chairs) {
             this.chairs.add(this.add.rectangle(deskX, deskY - 60, 50, 50, this.colors.managerChair)); // Manager chair
             this.chairs.add(this.add.rectangle(deskX - 50, deskY + 60, 45, 45, this.colors.chair));
             this.chairs.add(this.add.rectangle(deskX + 50, deskY + 60, 45, 45, this.colors.chair));
        }
        this.addLabel(x, y, "Manager Office");
    }

    private createEmployeeArea(walls: Phaser.Physics.Arcade.StaticGroup, furniture: Phaser.Physics.Arcade.StaticGroup, x: number, y: number) {
        // Wall with Door Gap at Top Center
        // Width spans both top rooms + gap = 700 + 300 + 700 = 1700
        this.createRoomWallsWithDoor(walls, x, y, 1700, 1100, "top");

        // Door Object (Top Center)
        this.createDoor(x + 850, y);

        // Furniture
        const rows = 5;
        const cols = 6;
        const startX = x + 150;
        const startY = y + 100;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const deskX = startX + (c * 200);
                const deskY = startY + (r * 180); // Increased spacing from 120 to 180
                furniture.add(this.add.rectangle(deskX, deskY, 100, 60, this.colors.table));
                if (this.chairs) this.chairs.add(this.add.rectangle(deskX, deskY + 40, 45, 45, this.colors.chair));
            }
        }
        this.addLabel(x, y, "Workspace");
    }

    // Creates specific walls with gaps for doors
    private createRoomWallsWithDoor(walls: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, w: number, h: number, doorPos: 'bottom' | 'top' | 'bottom-left') {
        const t = 10; // thickness
        
        // Full Walls
        walls.add(this.add.rectangle(x, y + h/2, t, h, this.colors.wall)); // Left
        walls.add(this.add.rectangle(x + w, y + h/2, t, h, this.colors.wall)); // Right

        if (doorPos === 'bottom') {
            walls.add(this.add.rectangle(x + w/2, y, w, t, this.colors.wall)); // Top Full
            // Bottom Split: Gap in center (120px wide)
            // Left segment: from x to x + w/2 - 60
            walls.add(this.add.rectangle(x + (w/2 - 60)/2, y + h, (w/2 - 60), t, this.colors.wall)); 
            // Right segment: from x + w - (w/2 - 60) to x + w
            walls.add(this.add.rectangle(x + w - (w/2 - 60)/2, y + h, (w/2 - 60), t, this.colors.wall));

        } else if (doorPos === 'bottom-left') {
            walls.add(this.add.rectangle(x + w/2, y, w, t, this.colors.wall)); // Top Full
            
            // Bottom Split: Gap of 120px from x+30? No, let's say door center is x+60
            // Previous was: x+30 (w60) -> gap80 -> x+140+ (wRem).
            // Let's make door at x + 100 center. Width 120 -> 40 to 160.
            
            // Wall 1: x to x+40. Width 40. Center x+20.
            walls.add(this.add.rectangle(x + 20, y + h, 40, t, this.colors.wall)); 
            
            // Wall 2: x+160 to x+w. Width w-160. Center x+160 + (w-160)/2
            const remW = w - 160;
            walls.add(this.add.rectangle(x + 160 + remW/2, y + h, remW, t, this.colors.wall));

        } else if (doorPos === 'top') {
            walls.add(this.add.rectangle(x + w/2, y + h, w, t, this.colors.wall)); // Bottom Full
            // Top Split: Gap in center (120px)
             walls.add(this.add.rectangle(x + (w/2 - 60)/2, y, w/2 - 60, t, this.colors.wall));
             walls.add(this.add.rectangle(x + w - (w/2 - 60)/2, y, w/2 - 60, t, this.colors.wall));
        }
    }

    private createDoor(x: number, y: number) {
        if (!this.doors) return;
        // Door enlarged to 120x10
        const door = this.add.rectangle(x, y, 120, 10, this.colors.door);
        this.doors.add(door);
    }

    private addLabel(x: number, y: number, text: string) {
        this.add.text(x + 20, y + 20, text, { color: '#000', fontSize: '16px', backgroundColor: '#fff' });
    }
}

