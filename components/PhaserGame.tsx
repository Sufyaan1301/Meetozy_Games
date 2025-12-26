'use client';

import { useEffect, useRef } from 'react';

export default function PhaserGame() {
    // Reference to the game instance to handle cleanup
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        // We need to import Phaser dynamically or ensure this code only runs on client
        // because Phaser interacts with 'window' which doesn't exist on server.
        let phaserGame: Phaser.Game | null = null;

        const initPhaser = async () => {
             // Dynamic import to avoid SSR "window is not defined" error
            const Phaser = (await import('phaser')).default;
            const { config } = await import('../game/PhaserConfig');

            if (!gameRef.current) {
                // Create the game instance
                phaserGame = new Phaser.Game(config);
                gameRef.current = phaserGame;
            }
        };

        initPhaser();

        // Cleanup function (runs when component unmounts)
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true); // true = destroy scene and remove canvas
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div 
            id="game-container" 
            className="w-full h-screen overflow-hidden"
            // You can add styling here to ensure it takes full space
        />
    );
}
