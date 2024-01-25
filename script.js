const windowInnerWidth = document.documentElement.clientWidth - 20
const windowInnerHeight = document.documentElement.clientHeight - 20

var player;
// var stars;
var bombs;
var bomb
var bx
var by
var chase = false
var cursors;
var hp = 100;
// var gameOver = false;
var hpText;
var timer;
var button;

var game = new Phaser.Game(config);

class Controls extends Phaser.Scene {

    preload() {
        // this.load.image('face', 'assets/pics/bw-face.png');
    }

    create(data) {
        hpText = this.add.text(0, 0, 'HP: ' + hp, { fontSize: '32px', fill: '#000' });

        button = game.add.button(80, 300, 'button', actionOnClick, this, 2, 1, 0);

        button.onInputOver.add(over, this);
        button.onInputOut.add(out, this);
        button.onInputUp.add(up, this);

    }

    update(p1, p2) {
        hpText.setText('HP: ' + hp);
    }

}

function actionOnClick(){
    
}

class BootScene extends Phaser.Scene {

    preload() {
        // this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'ground.png');
        this.load.image('house', 'house.png');
        this.load.image('platform', 'platform.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'chars.png', { frameWidth: 16, frameHeight: 24 });
    }

    create() {
        //  A simple background for our game
        this.add.image(400, 300, 'ground');

        //     //  The platforms group contains the ground and the 2 ledges we can jump on
        let houses = this.physics.add.staticGroup();

        //     //  Here we create the ground.
        //     //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        //     platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //     //  Now let's create some ledges
        houses.create(500, 600, 'house');
        houses.create(50, 250, 'house');
        houses.create(750, 220, 'house');

        //     // The player and its settings
        player = this.physics.add.sprite(400, 300, 'dude');


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



        //     //  Input Events
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
        bx = player.x + 50
        by = player.y + 50
        bomb = bombs.create(bx, by, 'bomb');
        bomb.setBounce(1);

        //     //  The score
        //     scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //     //  Collide the player and the stars with the platforms
        this.physics.add.collider(player, houses)
        // this.physics.add.collider(player, platforms)

        //     //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        //     this.physics.add.overlap(player, stars, collectStar, null, this);

        //     this.physics.add.collider(player, bombs, hitBomb, null, this);

        this.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
        this.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
        this.cameras.main.startFollow(player);

        // game.vjoy = game.plugins.add(Phaser.Plugin.VJoy);
        // game.vjoy.inputEnable(0, 0, 400, 600);

        this.scene.add('Controls', Controls, true, { x: 400, y: 300 });

    }

    update(p1, p2) {

        let speed = 150

        if (cursors.left.isDown && cursors.up.isDown) {
            speed = Math.sqrt((speed ** 2) / 2)
            player.setVelocityX(-1 * speed);
            player.setVelocityY(-1 * speed);
            player.anims.play('upleft');
        }
        else if (cursors.right.isDown && cursors.up.isDown) {
            speed = Math.sqrt((speed ** 2) / 2)
            player.setVelocityX(speed);
            player.setVelocityY(-1 * speed);
            player.anims.play('upright');
        }
        else if (cursors.left.isDown && cursors.down.isDown) {
            speed = Math.sqrt((speed ** 2) / 2)
            player.setVelocityX(-1 * speed);
            player.setVelocityY(speed);
            player.anims.play('downleft');
        }
        else if (cursors.right.isDown && cursors.down.isDown) {
            speed = Math.sqrt((speed ** 2) / 2)
            player.setVelocityX(speed);
            player.setVelocityY(speed);
            player.anims.play('downright');
        }
        else if (cursors.left.isDown) {
            player.setVelocityX(-1 * speed);
            player.setVelocityY(0);
            player.anims.play('left');
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(speed);
            player.setVelocityY(0);
            player.anims.play('right');
        }
        else if (cursors.up.isDown) {
            player.setVelocityX(0);
            player.setVelocityY(-1 * speed);
            player.anims.play('up');
        }
        else if (cursors.down.isDown) {
            player.setVelocityX(0);
            player.setVelocityY(speed);
            player.anims.play('down');
        }
        else {
            player.anims.play('turn');
            player.setVelocityX(0);
            player.setVelocityY(0);
        }

        ChaseThePlayer(player, bomb)


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
    scene: BootScene
};

function ChaseThePlayer(player, bomb) {

    distancepb = Math.sqrt((player.x - bomb.x) ** 2 + (player.y - bomb.y) ** 2);

    distanceb = Math.sqrt((bx - bomb.x) ** 2 + (by - bomb.y) ** 2);

    chase = (distancepb > 30 && distancepb < 250)
    velocityx = 0
    velocityy = 0

    speed = 100


    if (chase) {

        newx = player.x - bomb.x
        newy = player.y - bomb.y

        if (newx < 0) {
            newx = newx * -1
        }
        if (newy < 0) {
            newy = newy * -1
        }

        sp = Math.sqrt(10000 / (newx ** 2 + newy ** 2))

        velocityx = sp * newx
        velocityy = sp * newy

        if (player.x < bomb.x) {
            velocityx = velocityx * -1
        }

        if (player.y < bomb.y) {
            velocityy = velocityy * -1
        }

        bomb.setVelocityX(velocityx)
        bomb.setVelocityY(velocityy);

    }
    else {

        // if (distancepb <= 30) {

        // }
        bomb.setVelocityX(0);
        bomb.setVelocityY(0);

        // if (distanceb > 5 && distancepb > 250) {

        //     newx = bx - bomb.x
        //     newy = by - bomb.y

        //     if (newx < 0) {
        //         newx = newx * -1
        //     }
        //     if (newy < 0) {
        //         newy = newy * -1
        //     }

        //     sp = Math.sqrt(10000 / (newx ** 2 + newy ** 2))

        //     velocityx = sp * newx
        //     velocityy = sp * newy

        //     if (bx < bomb.x) {
        //         velocityx = velocityx * -1
        //     }

        //     if (by < bomb.y) {
        //         velocityy = velocityy * -1
        //     }

        //     bomb.setVelocityX(velocityx)
        //     bomb.setVelocityY(velocityy);

        // }

    }

}