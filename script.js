const windowInnerWidth = document.documentElement.clientWidth - 20
const windowInnerHeight = document.documentElement.clientHeight - 20

const mobStatus = {expectation:'expectation', chase:'chase'}
var player;
var players = [];
// var stars;
var bombs;
var bomb;
var mobs = [];

var bx;
var by;
var chase = false
var cursors;
// var gameOver = false;
var hpText;
var mpText;

var hpTexttarget;
var mpTexttarget;

var timer;
var btn;

var dragpx = windowInnerWidth - 200
var dragpy = windowInnerHeight - 200

var drgX;
var drgY;



class Player {

    constructor(obj) {
        this.obj = obj;
        this.thisplayer = true
        this.name = 'Milhard';
        this.hp = 100;
        this.maxhp = 100;
        this.mp = 100;
        this.maxhp = 100;
        this.speed = 150;
        this.target = null;
    }

    update(){
        this.moving()   
    }

    moving() {

        let left = (drgX < dragpx - 25) || cursors.left.isDown;
        let right = (drgX > dragpx + 25) || cursors.right.isDown;
        let up = (drgY < dragpy - 25) || cursors.up.isDown;
        let down = (drgY > dragpy + 25) || cursors.down.isDown;


        if (left && up) {
            let speed = Math.sqrt((this.speed ** 2) / 2)
            this.obj.setVelocityX(-1 * speed);
            this.obj.setVelocityY(-1 * speed);
            this.obj.anims.play('upleft');
        }
        else if (right && up) {
            let speed = Math.sqrt((this.speed ** 2) / 2)
            this.obj.setVelocityX(speed);
            this.obj.setVelocityY(-1 * speed);
            this.obj.anims.play('upright');
        }
        else if (left && down) {
            let speed = Math.sqrt((this.speed ** 2) / 2)
            this.obj.setVelocityX(-1 * speed);
            this.obj.setVelocityY(speed);
            this.obj.anims.play('downleft');
        }
        else if (right && down) {
            let speed = Math.sqrt((this.speed ** 2) / 2)
            this.obj.setVelocityX(speed);
            this.obj.setVelocityY(speed);
            this.obj.anims.play('downright');
        }
        else if (left) {
            this.obj.setVelocityX(-1 * this.speed);
            this.obj.setVelocityY(0);
            this.obj.anims.play('left');
        }
        else if (right) {
            this.obj.setVelocityX(this.speed);
            this.obj.setVelocityY(0);
            this.obj.anims.play('right');
        }
        else if (up) {
            this.obj.setVelocityX(0);
            this.obj.setVelocityY(-1 * this.speed);
            this.obj.anims.play('up');
        }
        else if (down) {
            this.obj.setVelocityX(0);
            this.obj.setVelocityY(this.speed);
            this.obj.anims.play('down');
        }
        else {
            this.obj.anims.play('turn');
            this.obj.setVelocityX(0);
            this.obj.setVelocityY(0);
        }
    }



}

class Mob {

    constructor(obj) {
        this.obj = obj;
        this.status = null
        this.name = 'Шляпа';
        this.hp = 100;
        this.maxhp = 100;
        this.mp = 100;
        this.maxhp = 100;
        this.speed = 120;
        this.target = null;
    }

    update() {

        this.ChaseThePlayer() 

    }

    ChaseThePlayer() {

        if (this.target = null){
            return
        }

        let distance = Math.sqrt((this.target.x - this.obj.x) ** 2 + (this.target.y - this.obj.y) ** 2);
    
        let chase = (distance > 30 && distance < 250)
        let velocityx = 0
        let velocityy = 0
    
    
        if (chase) {
    
            newx = this.target.x - this.obj.x
            newy = this.target.y - this.obj.y
    
            if (newx < 0) {
                newx = newx * -1
            }
            if (newy < 0) {
                newy = newy * -1
            }
    
            sp = Math.sqrt(this.speed**2 / (newx ** 2 + newy ** 2))
    
            velocityx = sp * newx
            velocityy = sp * newy
    
            if (this.target.x < this.obj.x) {
                velocityx = velocityx * -1
            }
    
            if (this.target.y < this.obj.y) {
                velocityy = velocityy * -1
            }
    
            this.obj.setVelocityX(velocityx)
            this.obj.setVelocityY(velocityy);
    
        }
        else {
            this.obj.setVelocityX(0);
            this.obj.setVelocityY(0);    
        }
    
    }

    getTarget(){

        if (this.target != null){
            return
        }

        for (let i = 0; i < players.length; i++) {
            trgt = players[i];

            let distance = Math.sqrt((this.target.x - this.obj.x) ** 2 + (this.target.y - this.obj.y) ** 2);
    
            if (distance > 30 && distance < 250){
                this.target = trgt
                break
            }
          }


    }

}

class Controls extends Phaser.Scene {

    preload() {
        this.load.image('btn', 'assets/star.png');
    }

    create() {

        hpText = this.add.text(0, 0, 'HP: ' + 0, { fontSize: '32px', fill: '#000' });
        mpText = this.add.text(0, 35, 'MP: ' + 0, { fontSize: '32px', fill: '#000' });

        hpTexttarget = this.add.text(windowInnerWidth/2, 0, 'HP: ' + 0, { fontSize: '32px', fill: '#000' });
        mpTexttarget = this.add.text(windowInnerWidth/2, 35, 'MP: ' + 0, { fontSize: '32px', fill: '#000' });

        let image = this.add.sprite(100, 100, 'btn').setInteractive();
        image.on('pointerdown', function (pointer) {

            this.setTint(0xff0000);

        });

        image.on('pointerout', function (pointer) {

            this.clearTint();

        });

        image.on('pointerup', function (pointer) {

            this.clearTint();

        });

        let drag = this.add.sprite(dragpx, dragpy, 'btn').setInteractive({ draggable: true });
        drag.setScale(3)
        drag.on('drag', function (pointer, dragX, dragY) {


            drag.setPosition(dragX, dragY)

            drgX = dragX;
            drgY = dragY;

        });

        drag.on('pointerup', function (pointer) {

            drag.setPosition(dragpx, dragpy)
            drgX = dragpx;
            drgY = dragpy;


        });

        image.on('pointerout', function (pointer) {

            drag.setPosition(dragpx, dragpy)
            drgX = dragpx;
            drgY = dragpy;

        });

    }

    update(p1, p2) {

        hpText.setText('HP: ' + player.hp);
        mpText.setText('MP: ' + player.mp);

        if (player.target != null) {
            hpTexttarget.setText('HP: ' + player.target.hp);
            mpTexttarget.setText('MP: ' + player.target.mp);
            hpTexttarget.visible = true;
            mpTexttarget.visible = true;
        }
        else {
            hpTexttarget.visible = false;
            mpTexttarget.visible = false;
        }

    }


}


class MainScene extends Phaser.Scene {

    preload() {
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'chars.png', { frameWidth: 16, frameHeight: 24 });
        this.load.image('btn', 'assets/star.png');
        this.load.image('grass', 'assets/map/Texture/TX Tileset Grass.png')
        this.load.tilemapTiledJSON('map', 'assets/map/map.json')
    }

    create() {
        //  A simple background for our game
        // this.add.image(400, 300, 'ground');

        const map = this.make.tilemap({ key: 'map' })
        const tiles = map.addTilesetImage('grass', 'grass')
        let pw = 32 * map.layers[0].width / 2 * -1;
        let ph = 32 * map.layers[0].height / 2 * -1;
        const layer = map.createLayer('layer1', tiles, pw, ph);

        // const layer2 = map.createLayer('layer2', tiles, -2400, -2400);
        // layer2.setCollisionByProperty({colide: true})

        //     //  The platforms group contains the ground and the 2 ledges we can jump on
        // let houses = this.physics.add.staticGroup();

        // //     //  Here we create the ground.
        // //     //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        // //     platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        // //     //  Now let's create some ledges
        // houses.create(500, 600, 'house');
        // houses.create(50, 250, 'house');
        // houses.create(750, 220, 'house');

        //     // The player and its settings
        // this.physics.add.collider(player, layer2);

        // let player2 = this.physics.add.sprite(500, 300, 'dude').setScale(3);

        player = new Player(this.physics.add.sprite(400, 300, 'dude').setScale(3))

        players.push(player)


        //     //  Player physics properties. Give the little guy a slight bounce.
        //     player.setBounce(0.2);
        //     player.setCollideWorldBounds(true);

        //     //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 14, end: 14 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 11, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 20 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upleft',
            frames: this.anims.generateFrameNumbers('dude', { start: 15, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upright',
            frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downleft',
            frames: this.anims.generateFrameNumbers('dude', { start: 23, end: 23 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downright',
            frames: this.anims.generateFrameNumbers('dude', { start: 13, end: 13 }),
            frameRate: 10,
            repeat: -1
        });


        cursors = this.input.keyboard.createCursorKeys();

        //     //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        //     stars = this.physics.add.group({
        //         key: 'star',
        //         repeat: 11,
        //         setXY: { x: 12, y: 0, stepX: 70 }
        //     });

        //     stars.children.iterate(function (child) {

        //         //  Give each star a slightly different bounce
        //         child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        //     });

        bombs = this.physics.add.group();
        bx = player.obj.x + 50
        by = player.obj.y + 50
        bomb = bombs.create(bx, by, 'bomb');
        bomb.setInteractive();
        bomb.on('pointerdown', function (pointer) {

            // this.setTint(0xff0000);
            // hpText.visible = !hpText.visible;
            // hp = hp - 10;

        });

        // bomb.on('pointerout', function (pointer) {

        //     this.clearTint();

        // });

        // bomb.on('pointerup', function (pointer) {

        //     this.clearTint();

        // });

        //     //  The score
        //     scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //     //  Collide the player and the stars with the platforms
        // this.physics.add.collider(player, houses)
        // this.physics.add.collider(player, platforms)

        //     //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        //     this.physics.add.overlap(player, stars, collectStar, null, this);

        //     this.physics.add.collider(player, bombs, hitBomb, null, this);

        this.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
        this.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
        this.cameras.main.startFollow(player.obj);

        // game.vjoy = game.plugins.add(Phaser.Plugin.VJoy);
        // game.vjoy.inputEnable(0, 0, 400, 600);

        this.scene.add('Controls', Controls, true, { x: 400, y: 300 });

        var image = this.add.sprite(100, 100, 'btn').setInteractive();
        image.on('pointerdown', function (pointer) {

            this.setTint(0xff0000);
            hpText.visible = !hpText.visible;
            // hp = hp - 10;

        });

        image.on('pointerout', function (pointer) {

            this.clearTint();

        });

        image.on('pointerup', function (pointer) {

            this.clearTint();

        });


    }

    update(p1, p2) {

        player.update();


        // width: windowInnerWidth,
        // height: windowInnerHeight,


    }

    collectStar(player, star) {
        // star.disableBody(true, true);

        // //  Add and update the score
        // score += 10;
        // scoreText.setText('Score: ' + score);

        // if (stars.countActive(true) === 0)
        // {
        //     //  A new batch of stars to collect
        //     stars.children.iterate(function (child) {

        //         child.enableBody(true, child.x, 0, true, true);

        //     });

        //     var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        //     var bomb = bombs.create(x, 16, 'bomb');
        //     bomb.setBounce(1);
        //     bomb.setCollideWorldBounds(true);
        //     bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        //     bomb.allowGravity = false;

        // }
    }

    hitBomb(player, bomb) {
        // this.physics.pause();

        // player.setTint(0xff0000);

        // player.anims.play('turn');

        // gameOver = true;
    }

}





var config = {
    type: Phaser.AUTO,
    width: windowInnerWidth,
    height: windowInnerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: MainScene
};


var game = new Phaser.Game(config);