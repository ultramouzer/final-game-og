class Play extends Phaser.Scene {
    constructor() {
        super("playScene");//playScene is a Scene
    }

    preload() {
        //Load art
        this.load.image('ball', './Assets/Art/Ball.png');
        this.load.image('token', './Assets/Art/Token.png');
        this.load.image('wall', './Assets/Art/Wall.png');
        this.load.image('stars', './Assets/Art/Stars.png');

        //Load sound
        this.load.audio('sfx_absorb', './Assets/Sounds/protoAbsorb.wav');
        this.load.audio('sfx_purge', './Assets/Sounds/protoPurge.wav');
    }

    create() {
        //define keys
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //create temporary stars (will replace later on)
        this.stars = this.add.tileSprite(100, 0, 800, 720, 'stars').setOrigin(0,0);

        //create player
        this.player = new Ball(this, game.config.width / 2, 250, 'ball');
        this.physics.world.enable(this.player);

        //create tokens
        this.tokens = this.physics.add.group({
            defaultKey: 'token',
            runChildUpdate: true
        });    

        //initial generation of tokens
        for(var i = 0; i < game.settings.maxTokens; i++){
            this.generateTokens(Phaser.Math.RND.between(200, 600), game.config.height);
        }

        this.physics.world.enable(this.tokens);

        //create temporary rectangles (will replace with a tilemap later on)
        this.leftRect = this.physics.add.image(game.config.width / 8, 0, 'wall').setOrigin(0,0);
        this.rightRect = this.physics.add.image(game.config.width * 7 / 8, 0, 'wall').setOrigin(0,0);
        this.leftRect.setImmovable();
        this.rightRect.setImmovable();

        //create colliders
        this.physics.add.collider(this.player, this.tokens, this.tokenCollision, null, this);
        this.physics.add.collider(this.player, this.leftRect);
        this.physics.add.collider(this.player, this.rightRect);
    }

    update() {
        //updates for prefabs
        this.player.update();
        this.tokens.preUpdate();

        //stars movement
        this.stars.tilePositionY -= 4 * game.global.timeDilation;

        //if player has destroyed a token then game will spawn one in
        if(game.global.destroyedToken){
            console.log("Respawning tokens!");
            console.log(this.tokens.countActive() + 1);
            while(this.tokens.countActive() < game.settings.maxTokens){
                this.generateTokens(Phaser.Math.RND.between(200, 600), game.config.height);
            }
            game.global.destroyedToken = false;
        }
    }

    //generates a token at a random location
    generateTokens(x, y){
        y = y + 400 * Math.random();
        this.tokens.add(new Token(this, x, y, 'token', 0));
    }

    //collision with token
    tokenCollision(player, object){
        console.log("Collided with a token!");
        this.sound.play('sfx_absorb');
        this.sound.setVolume(0.2);
        this.sound.rate = 1 - ((1 - game.global.timeDilation) / 2);
        object.destroy();
        object.reset();
        game.global.destroyedToken = true;
        player.grow();
        this.timeDilation();
    }

    //time dilation management 
    //guide: (1 is normal speed, 0 is full freeze, 2 is 2x speed)
    timeDilation(){
        if(game.global.timeDilation > 0){
            console.log("Beginning time dilation!");
            game.global.timeDilation -= 0.1;
            console.log(game.global.timeDilation);
        } else {
            console.log("Max time dilation reached!");
        }
    }
    //random text
}
