const windowInnerWidth = document.documentElement.clientWidth - 20
const windowInnerHeight = document.documentElement.clientHeight - 20

const mobStatus = { expectation: 'expectation', chase: 'chase' }
var player;
var players = [];
var bombs;
var mobs = [];

var bx;
var by;
var chase = false
var cursors;
var hpText;
var mpText;

var nameTexttarget;
var hpTexttarget;
var mpTexttarget;

var timer;
var btn;

var dragpx = 100
var dragpy = windowInnerHeight - 100

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

    update() {
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

    constructor(obj,name) {
        this.obj = obj;
        this.status = null
        this.name = name;
        this.hp = 100;
        this.maxhp = 100;
        this.mp = 100;
        this.maxhp = 100;
        this.speed = 120;
        this.target = null;
    }

    update() {

        this.getTarget()
        this.chaseTarget()

    }

    chaseTarget() {

        if (this.target == null) {
            this.obj.setVelocityX(0);
            this.obj.setVelocityY(0);
            return
        }

        let velocityx = 0
        let velocityy = 0

        let newx = this.target.obj.x - this.obj.x
        let newy = this.target.obj.y - this.obj.y

        if (newx < 0) {
            newx = newx * -1
        }
        if (newy < 0) {
            newy = newy * -1
        }

        let sp = Math.sqrt(this.speed ** 2 / (newx ** 2 + newy ** 2))

        velocityx = sp * newx
        velocityy = sp * newy

        if (this.target.obj.x < this.obj.x) {
            velocityx = velocityx * -1
        }

        if (this.target.obj.y < this.obj.y) {
            velocityy = velocityy * -1
        }

        this.obj.setVelocityX(velocityx)
        this.obj.setVelocityY(velocityy);

    }

    getTarget() {

        let distance = Math.sqrt((player.obj.x - this.obj.x) ** 2 + (player.obj.y - this.obj.y) ** 2);

        if (distance > 30 && distance < 250) {
            this.target = player;
        }
        else {
            this.target = null;
        }


    }

}

class Controls extends Phaser.Scene {

    preload() {
        this.load.image('btn', 'assets/star.png');
        this.load.image('SilverSword', 'assets/SilverSword.png')
    }

    create() {

        this.add.text(0, 0, player.name, { fontSize: '32px', fill: '#000' });
        hpText = this.add.text(0, 35, 'HP: ' + 0, { fontSize: '32px', fill: '#000' });
        mpText = this.add.text(0, 70, 'MP: ' + 0, { fontSize: '32px', fill: '#000' });

        nameTexttarget = this.add.text(windowInnerWidth / 2, 0, '...', { fontSize: '32px', fill: '#000' });
        hpTexttarget = this.add.text(windowInnerWidth / 2, 35, 'HP: ' + 0, { fontSize: '32px', fill: '#000' });
        mpTexttarget = this.add.text(windowInnerWidth / 2, 70, 'MP: ' + 0, { fontSize: '32px', fill: '#000' });

        let sword = this.add.sprite(windowInnerWidth-50, windowInnerHeight-100, 'SilverSword').setInteractive(); 
        sword.on('pointerdown', function (pointer, gameObject) {

            console.log('Чет произошло');

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

        drag.on('pointerout', function (pointer) {

            drag.setPosition(dragpx, dragpy)
            drgX = dragpx;
            drgY = dragpy;

        });

    }

    update(p1, p2) {

        hpText.setText('HP: ' + player.hp);
        mpText.setText('MP: ' + player.mp);

        if (player.target != null) {
            nameTexttarget.setText(player.target.name);
            hpTexttarget.setText('HP: ' + player.target.hp);
            mpTexttarget.setText('MP: ' + player.target.mp);
            nameTexttarget.visible = true;
            hpTexttarget.visible = true;
            mpTexttarget.visible = true;
        }
        else {
            nameTexttarget.visible = false;
            hpTexttarget.visible = false;
            mpTexttarget.visible = false;
        }

    }


}


class MainScene extends Phaser.Scene {

    preload() {
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/chars.png', { frameWidth: 16, frameHeight: 24 });
        this.load.image('btn', 'assets/star.png');
        this.load.image('grass', 'assets/map/Texture/TX Tileset Grass.png')
        this.load.tilemapTiledJSON('map', 'assets/map/map.json')
    }

    create() {

        const map = this.make.tilemap({ key: 'map' })
        const tiles = map.addTilesetImage('grass', 'grass')
        let pw = 32 * map.layers[0].width / 2 * -1;
        let ph = 32 * map.layers[0].height / 2 * -1;
        const layer = map.createLayer('layer1', tiles, pw, ph);

        //     // The player and its settings
        // this.physics.add.collider(player, layer2);

        player = new Player(this.physics.add.sprite(400, 300, 'dude').setScale(3))

        players.push(player)

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
        bx = player.obj.x + 250
        by = player.obj.y
        let mob = bombs.create(bx, by, 'bomb').setScale(3);
        mob.setInteractive();
        mobs.push(new Mob(mob,'шляпа1'))


        bx = player.obj.x
        by = player.obj.y + 250
        mob = bombs.create(bx, by, 'bomb').setScale(2);
        mob.setInteractive();
        mobs.push(new Mob(mob,'шляпа2'))

        this.input.on('pointerdown', function (pointer, gameObject) {

            if (gameObject.length) {

                for (let i in mobs) {
                    let mobelement = mobs[i];
                    if (mobelement.obj == gameObject[0]){
                        player.target = mobelement;
                        break
                    }
                }

            }
            else{
                player.target = null;
            }

        });


        this.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
        this.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
        this.cameras.main.startFollow(player.obj);

        this.scene.add('Controls', Controls, true, { x: 400, y: 300 });

        // var image = this.add.sprite(100, 100, 'btn').setInteractive();
        // image.on('pointerdown', function (pointer) {

        //     this.setTint(0xff0000);
        //     hpText.visible = !hpText.visible;

        // });

        // image.on('pointerout', function (pointer) {

        //     this.clearTint();

        // });

        // image.on('pointerup', function (pointer) {

        //     this.clearTint();

        // });


    }

    update(p1, p2) {

        player.update();
        this.mobsUpdate();

    }

    mobsUpdate() {
        let mob;
        for (let i in mobs) {
            mob = mobs[i]
            mob.update();
        }
    
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