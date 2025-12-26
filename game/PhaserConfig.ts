import { Types, AUTO } from 'phaser';
import { MainScene } from './scenes/MainScene';

export const config: Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // This ID must match the div in our React component
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // Top down game, no gravity
            debug: true // Enable debug bodies to see hitboxes
        }
    },
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.RESIZE, // Auto resize to fit window
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};
