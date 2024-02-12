// const windowInnerWidth = document.documentElement.clientWidth - 20
// const windowInnerHeight = document.documentElement.clientHeight - 20
const windowInnerWidth = window.innerWidth-20
const windowInnerHeight = window.innerHeight-20


var client_id = Date.now()


const mobStatus = { Chase: 'Chase', Attack: 'Attack', Revert: 'Revert', Expectation: 'Expectation' }
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

var ws;

var map

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
        this.x = this.sprite.x;
        this.y = this.sprite.y;
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
                    cmd: 'PlayerMoving',
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

    constructor(data) {
        this.sprite = bombs.create(data.x, data.y, 'bomb').setScale(2);
        this.sprite.setInteractive();
        this.id = data.id;
        this.name = data.name;
        this.hp = 100;
        this.maxhp = 100;
        this.mp = 100;
        this.maxhp = 100;
        this.speed = 120;
        this.target = null;
        this.x = this.sprite.x;
        this.y = this.sprite.y;
        this.respx = data.respx;
        this.respy = data.respy;
        this.lastattack = 0
        this.status = mobStatus.Expectation
    }

    update() {

        this.chaseTarget()
        this.attack()
        this.revert()

    }

    revert(){
        
        if (this.status != mobStatus.Revert){
            return
        }

        let velocityx = 0
        let velocityy = 0

        let newx = this.respx - this.sprite.x
        let newy = this.respy - this.sprite.y

        if (newx < 0) {
            newx = newx * -1
        }
        if (newy < 0) {
            newy = newy * -1
        }

        let sp = Math.sqrt(this.speed ** 2 / (newx ** 2 + newy ** 2))

        velocityx = sp * newx
        velocityy = sp * newy

        if (this.respx < this.sprite.x) {
            velocityx = velocityx * -1
        }

        if (this.respy < this.sprite.y) {
            velocityy = velocityy * -1
        }

        this.sprite.setVelocityX(velocityx)
        this.sprite.setVelocityY(velocityy);

        this.x = this.sprite.x;
        this.y = this.sprite.y;

        let message = {
            cmd: 'MobMoving',
            'id': this.id,
            'x': this.x,
            'y': this.y
        }
        ws.send(JSON.stringify(message))

    }

    attack() {

        if (this.target == null) {
            return
        }

        let distancetotarget = Math.sqrt((this.target.x - this.x) ** 2 + (this.target.y - this.y) ** 2)
        let nowtime = Date.now() / 1000;
        let timeattack = nowtime - this.lastattack;

        if (timeattack > 3 && distancetotarget<=31) {
            this.lastattack = nowtime;
            let message = {
                cmd: 'MobAttack',
                'mob': this.id,
                'target': this.target.id,
                'timeattack': this.lastattack
            }
            ws.send(JSON.stringify(message))
        }


    }

    chaseTarget() {

        if (this.target == null) {
            return
        }

        if (this.status != mobStatus.Chase){
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

        this.x = this.sprite.x;
        this.y = this.sprite.y;

        let message = {
            cmd: 'MobMoving',
            'id': this.id,
            'x': this.x,
            'y': this.y
        }
        ws.send(JSON.stringify(message))

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
            let text = { 'cmd': 'пиструн' }
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
        this.load.image('SummerTiles', 'assets/map/SummerTiles.png')
        this.load.tilemapTiledJSON('map', 'assets/map/map.json')
    }

    create() {

        map = this.make.tilemap({ key: 'map' })
        const tiles = map.addTilesetImage('SummerTiles', 'SummerTiles')
        const layer = map.createLayer('layer1', tiles, 0, 0);


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

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

        ws = new WebSocket(`ws://192.168.0.13:8000/ws/${client_id}`);
        ws.onmessage = function (event) {

            console.log(event.data);

            if (event.data == 'CreatePlayer') {
                createplayer();
            }
            else {
                let data = JSON.parse(event.data);
                if (data.cmd == 'NewPlayer') {
                    addPlayer(data);
                }
                else if (data.cmd == 'PlayerMoving') {
                    setСoordinates(data);
                }
                else if (data.cmd == 'Disconnect') {
                    disconnectPlayer(data);
                }
                else if (data.cmd == 'CreateMob') {
                    createMob(data);
                }
                else if (data.cmd == 'setMobParameters') {
                    setMobParameters(data);
                }
                else if (data.cmd == 'PlayerDamageReceived'){
                    playerDamageReceived(data)
                }
            }

        };


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


}

function playerDamageReceived(data){
    let player;
        for (let i in players) {
            player = players[i]
            if (player.id == data.id){
                player.hp = player.hp - data.damage;
                break
            }
            
        }
}

function createplayer() {
    let scene = game.scene.scenes[0]
    player = new Player(scene.physics.add.sprite(400, 300, 'dude').setScale(3));
    player.id = client_id;
    player.x = 400;
    player.y = 300;

    // player.sprite.setCollideWorldBounds(true)

    player.sprite.anims.play('turn');

    players.push(player)

    let inf = {
        'cmd': 'NewPlayer',
        'id': client_id,
        'x': player.x,
        'y': player.y
    }
    ws.send(JSON.stringify(inf))

    scene.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
    scene.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
    scene.cameras.main.startFollow(player.sprite);
    // scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    scene.scene.add('Controls', Controls, true, { x: 400, y: 300 });
}

function addPlayer(data) {

    let newplayer = new Player(game.scene.scenes[0].physics.add.sprite(data.x, data.y, 'dude').setScale(3));
    newplayer.sprite.setInteractive();
    newplayer.id = data.id;
    newplayer.thisplayer = false;
    newplayer.x = data.x;
    newplayer.y = data.y;

    newplayer.sprite.anims.play('turn');

    players.push(newplayer)

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

function createMob(data) {
    let mob = new Mob(data)
    mobs.push(mob)
}

function setMobParameters(data) {

    for (let i in mobs) {
        let mobelement = mobs[i];
        if (mobelement.id == data.id) {
            if (data.target == null) {
                mobelement.target = null;
                mobelement.status = mobStatus[data.status]
                return
            }
            else {
                for (let i in players) {
                    let playelement = players[i];
                    if (playelement.id == data.target) {
                        mobelement.target = playelement;
                        mobelement.status = mobStatus[data.status]
                        return
                    }
                }
            }

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
            debug: true
        }
    },
    fps: 30,
    scene: MainScene
};

var game = new Phaser.Game(config);