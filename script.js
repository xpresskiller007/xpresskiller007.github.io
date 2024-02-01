const windowInnerWidth = document.documentElement.clientWidth - 20
const windowInnerHeight = document.documentElement.clientHeight - 20

var client_id = Date.now()


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

    constructor(sprite) {
        this.id = 0;
        this.sprite = sprite;
        this.thisplayer = true;
        this.name = String(client_id);
        this.hp = 100;
        this.maxhp = 100;
        this.mp = 100;
        this.maxhp = 100;
        this.speed = 150;
        this.target = null;
        this.x = 0;
        this.y = 0;
    }

    update() {
        this.moving();
    }

    moving() {

        let left = false;
        let right = false;
        let up = false;
        let down = false;

        if (this.thisplayer) {

            left = (drgX < dragpx - 25) || cursors.left.isDown;
            right = (drgX > dragpx + 25) || cursors.right.isDown;
            up = (drgY < dragpy - 25) || cursors.up.isDown;
            down = (drgY > dragpy + 25) || cursors.down.isDown;

            if (left && up) {
                let speed = Math.sqrt((this.speed ** 2) / 2)
                this.sprite.setVelocityX(-1 * speed);
                this.sprite.setVelocityY(-1 * speed);
                this.sprite.anims.play('upleft');
            }
            else if (right && up) {
                let speed = Math.sqrt((this.speed ** 2) / 2)
                this.sprite.setVelocityX(speed);
                this.sprite.setVelocityY(-1 * speed);
                this.sprite.anims.play('upright');
            }
            else if (left && down) {
                let speed = Math.sqrt((this.speed ** 2) / 2)
                this.sprite.setVelocityX(-1 * speed);
                this.sprite.setVelocityY(speed);
                this.sprite.anims.play('downleft');
            }
            else if (right && down) {
                let speed = Math.sqrt((this.speed ** 2) / 2)
                this.sprite.setVelocityX(speed);
                this.sprite.setVelocityY(speed);
                this.sprite.anims.play('downright');
            }
            else if (left) {
                this.sprite.setVelocityX(-1 * this.speed);
                this.sprite.setVelocityY(0);
                this.sprite.anims.play('left');
            }
            else if (right) {
                this.sprite.setVelocityX(this.speed);
                this.sprite.setVelocityY(0);
                this.sprite.anims.play('right');
            }
            else if (up) {
                this.sprite.setVelocityX(0);
                this.sprite.setVelocityY(-1 * this.speed);
                this.sprite.anims.play('up');
            }
            else if (down) {
                this.sprite.setVelocityX(0);
                this.sprite.setVelocityY(this.speed);
                this.sprite.anims.play('down');
            }
            else {
                if (this.x != this.sprite.x || this.y != this.sprite.y) {
                    this.sprite.setVelocityX(0);
                    this.sprite.setVelocityY(0);
                    this.sprite.anims.play('turn');
                }
            }

            if (this.x != this.sprite.x || this.y != this.sprite.y) {
                this.x = this.sprite.x;
                this.y = this.sprite.y;
                let message = {
                    'Command': 'Moving',
                    'id': client_id,
                    'x': this.x,
                    'y': this.y
                }
                ws.send(JSON.stringify(message))
            }

        }
        else if (this.x != this.sprite.x || this.y != this.sprite.y) {
            left = this.sprite.x < this.x;
            right = this.sprite.x > this.x;
            up = this.sprite.y < this.y;
            down = this.sprite.y > this.y;

            if (left && up) {
                this.sprite.setPosition(this.x, this.y)
                this.sprite.anims.play('downright');
            }
            else if (right && up) {
                this.sprite.setPosition(this.x, this.y)
                this.sprite.anims.play('downleft');
            }
            else if (left && down) {
                this.sprite.setPosition(this.x, this.y)
                this.sprite.anims.play('upright');
            }
            else if (right && down) {
                this.sprite.setPosition(this.x, this.y)
                this.sprite.anims.play('upleft');
            }
            else if (left) {
                this.sprite.setPosition(this.x, this.y)
                this.sprite.anims.play('right');
            }
            else if (right) {
                this.sprite.setPosition(this.x, this.y)
                this.sprite.anims.play('left');
            }
            else if (up) {
                this.sprite.setPosition(this.x, this.y)
                this.sprite.anims.play('down');
            }
            else if (down) {
                this.sprite.setPosition(this.x, this.y)
                this.sprite.anims.play('up');
            }
            else {
                this.sprite.anims.play('turn');
            }
        }

    }

}

class Mob {

    constructor(sprite, name) {
        this.sprite = sprite;
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
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
            return
        }

        let velocityx = 0
        let velocityy = 0

        let newx = this.target.sprite.x - this.sprite.x
        let newy = this.target.sprite.y - this.sprite.y

        if (newx < 0) {
            newx = newx * -1
        }
        if (newy < 0) {
            newy = newy * -1
        }

        let sp = Math.sqrt(this.speed ** 2 / (newx ** 2 + newy ** 2))

        velocityx = sp * newx
        velocityy = sp * newy

        if (this.target.sprite.x < this.sprite.x) {
            velocityx = velocityx * -1
        }

        if (this.target.sprite.y < this.sprite.y) {
            velocityy = velocityy * -1
        }

        this.sprite.setVelocityX(velocityx)
        this.sprite.setVelocityY(velocityy);

    }

    getTarget() {

        // let distance = Math.sqrt((player.sprite.x - this.sprite.x) ** 2 + (player.sprite.y - this.sprite.y) ** 2);

        // if (distance > 30 && distance < 250) {
        //     this.target = player;
        // }
        // else {
        //     this.target = null;
        // }


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

        let sword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 100, 'SilverSword').setInteractive();
        sword.on('pointerdown', function (pointer, gameObject) {

            console.log('Чет произошло');
            let text = { 'Command': 'пиструн' }
            // ws.send(JSON.stringify(text))

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

        bombs = this.physics.add.group();
        bx = 400 + 250
        by = 300
        let mob = bombs.create(bx, by, 'bomb').setScale(3);
        mob.setInteractive();
        mobs.push(new Mob(mob, 'шляпа1'))


        bx = 400
        by = 300 + 250
        mob = bombs.create(bx, by, 'bomb').setScale(2);
        mob.setInteractive();
        mobs.push(new Mob(mob, 'шляпа2'))

        this.input.on('pointerdown', function (pointer, gameObject) {

            if (gameObject.length) {

                for (let i in mobs) {
                    let mobelement = mobs[i];
                    if (mobelement.sprite == gameObject[0]) {
                        player.target = mobelement;
                        return
                    }
                }

                for (let i in players) {
                    let playelement = players[i];
                    if (playelement.sprite == gameObject[0]) {
                        player.target = playelement;
                        return
                    }
                }

            }

        });

    }

    update(p1, p2) {

        this.playersUpdate();
        this.mobsUpdate();

    }

    mobsUpdate() {
        let mob;
        for (let i in mobs) {
            mob = mobs[i]
            mob.update();
        }

    }

    playersUpdate() {

        let player;
        for (let i in players) {
            player = players[i]
            player.update();
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

var ws = new WebSocket(`ws://192.168.0.12:8000/ws/${client_id}`);

ws.onmessage = function (event) {

    console.log(event.data);

    if (event.data == 'CreatePlayer') {
        createplayer();
    }
    else {
        let data = JSON.parse(event.data);
        if (data.Command == 'NewPlayer') {
            addPlayer(data);
        }
        else if (data.Command == 'Moving') {
            setСoordinates(data);
        }
        else if (data.Command == 'Disconnect') {
            disconnectPlayer(data);
        }
    }

};

function createplayer() {
    let scene = game.scene.scenes[0]
    player = new Player(scene.physics.add.sprite(400, 300, 'dude').setScale(3));
    player.id = client_id;
    player.x = 400;
    player.y = 300;

    player.sprite.anims.play('turn');

    players.push(player)

    let inf = {
        'Command': 'NewPlayer',
        'id': client_id,
        'x': player.x,
        'y': player.y
    }
    ws.send(JSON.stringify(inf))

    scene.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
    scene.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
    scene.cameras.main.startFollow(player.sprite);
    scene.scene.add('Controls', Controls, true, { x: 400, y: 300 });
}

function addPlayer(data) {

    let scene = game.scene.scenes[0]
    let newplayer = new Player(scene.physics.add.sprite(data.x, data.y, 'dude').setScale(3));
    newplayer.sprite.setInteractive();
    newplayer.id = data.id;
    newplayer.thisplayer = false;
    newplayer.x = data.x;
    newplayer.y = data.y;

    newplayer.sprite.anims.play('turn');

    players.push(newplayer)

}

function setСoordinates(data) {

    let pl;
    for (let i in players) {
        pl = players[i];
        if (pl.id == data.id) {
            pl.x = data.x;
            pl.y = data.y;
            break
        }
    }

}

function disconnectPlayer(data) {

    let pl;
    for (let i in players) {
        pl = players[i];
        if (pl.id == data.id) {
            pl.sprite.destroy()
            players.delete[i]
            break
        }
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