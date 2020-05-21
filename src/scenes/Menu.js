class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    "use strict";

    create(){
        // Temporary Menu Text 
        // Will replace in future version
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'center', 
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;

        this.add.text(centerX - 100, centerY - 64, 'Tears of Time', menuConfig);
        this.add.text(centerX - 125, centerY, 'Press "F" to play', menuConfig);
        this.add.text(centerX - 155, centerY + 64, 'Use Arrow Keys to move', menuConfig);
        this.add.text(centerX - 155, centerY + 94, 'Collect Tokens to Grow', menuConfig);
        this.add.text(centerX - 155, centerY + 124, 'Use Spacebar to Shrink', menuConfig);


        // menu controls
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.start('playScene');
        }
    }
}