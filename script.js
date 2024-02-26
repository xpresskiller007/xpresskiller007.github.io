const windowInnerWidth = window.innerWidth - 20
const windowInnerHeight = window.innerHeight - 20


var client_id = Date.now()


const mobStatus = { Chase: 'Chase', Attack: 'Attack', Revert: 'Revert', Expectation: 'Expectation', Dead: 'Dead' }
const targetType = { Player: 'Player', Mob: 'Mob' }
var player;
var players = [];
var bombs;
var mobs = [];

var bx;
var by;
var chase = false
var cursors;

var nameTexttarget;
var hpTexttarget;
var mpTexttarget;

var xpbar;

var timer;
var btn;

var dragpx = 100
var dragpy = windowInnerHeight - 100

var drgX;
var drgY;

var ws;

var map;

var scene_main;
var scene_UI;

class Player {

    constructor(sprite) {
        this.id = 0;
        this.sprite = sprite;
        this.thisplayer = true;
        this.type = targetType.Player
        this.name = String(client_id);
        this.hp = 100;
        this.maxhp = 100;
        this.mp = 100;
        this.maxmp = 100;
        this.speed = 150;
        this.target = null;
        this.x = this.sprite.x;
        this.y = this.sprite.y;
        this.lvl = 1;
        this.xp = 0;
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

            let joystick = false;
            if (drgX != dragpx && drgY != dragpy) {

                left = (drgX < dragpx - 1);
                right = (drgX > dragpx + 1);
                up = (drgY < dragpy - 1);
                down = (drgY > dragpy + 1);

                let chacepointx = player.sprite.x;
                let chacepointy = player.sprite.y;

                if (left && up) {

                    chacepointx = chacepointx - (dragpx - drgX);
                    chacepointy = chacepointy - (dragpy - drgY);
                }
                else if (right && up) {
                    chacepointx = chacepointx + (drgX - dragpx);
                    chacepointy = chacepointy - (dragpy - drgY);
                }
                else if (left && down) {
                    chacepointx = chacepointx - (dragpx - drgX);
                    chacepointy = chacepointy + (drgY - dragpy);
                }
                else if (right && down) {
                    chacepointx = chacepointx + (drgX - dragpx);
                    chacepointy = chacepointy + (drgY - dragpy);
                }
                else if (left) {
                    chacepointx = chacepointx - (dragpx - drgX);
                }
                else if (right) {
                    chacepointx = chacepointx + (drgX - dragpx);
                }
                else if (up) {
                    chacepointy = chacepointy - (dragpy - drgY);
                }
                else if (down) {
                    chacepointy = chacepointy + (drgY - dragpy);
                }

                if (chacepointx != player.sprite.x || chacepointy != player.sprite.y) {
                    let velocityx = 0
                    let velocityy = 0

                    let newx = chacepointx - this.sprite.x
                    let newy = chacepointy - this.sprite.y

                    if (newx < 0) {
                        newx = newx * -1;
                    }
                    if (newy < 0) {
                        newy = newy * -1;
                    }

                    let sp = Math.sqrt(this.speed ** 2 / (newx ** 2 + newy ** 2));

                    velocityx = sp * newx;
                    velocityy = sp * newy;

                    if (chacepointx < this.sprite.x) {
                        velocityx = velocityx * -1;
                    }

                    if (chacepointy < this.sprite.y) {
                        velocityy = velocityy * -1;
                    }

                    this.sprite.setVelocityX(velocityx);
                    this.sprite.setVelocityY(velocityy);


                }

                joystick = true;

            }

            if (!joystick) {
                left = cursors.left.isDown;
                right = cursors.right.isDown;
                up = cursors.up.isDown;
                down = cursors.down.isDown;
            }

            if (left && up) {
                if (!joystick) {
                    let speed = Math.sqrt((this.speed ** 2) / 2)
                    this.sprite.setVelocityX(-1 * speed);
                    this.sprite.setVelocityY(-1 * speed);
                }
                this.sprite.anims.play('upleft');
            }
            else if (right && up) {
                if (!joystick) {
                    let speed = Math.sqrt((this.speed ** 2) / 2)
                    this.sprite.setVelocityX(speed);
                    this.sprite.setVelocityY(-1 * speed);
                }
                this.sprite.anims.play('upright');
            }
            else if (left && down) {
                if (!joystick) {
                    let speed = Math.sqrt((this.speed ** 2) / 2)
                    this.sprite.setVelocityX(-1 * speed);
                    this.sprite.setVelocityY(speed);
                }
                this.sprite.anims.play('downleft');
            }
            else if (right && down) {
                if (!joystick) {
                    let speed = Math.sqrt((this.speed ** 2) / 2)
                    this.sprite.setVelocityX(speed);
                    this.sprite.setVelocityY(speed);
                }
                this.sprite.anims.play('downright');
            }
            else if (left) {
                if (!joystick) {
                    this.sprite.setVelocityX(-1 * this.speed);
                    this.sprite.setVelocityY(0);
                }
                this.sprite.anims.play('left');
            }
            else if (right) {
                if (!joystick) {
                    this.sprite.setVelocityX(this.speed);
                    this.sprite.setVelocityY(0);
                }
                this.sprite.anims.play('right');
            }
            else if (up) {
                if (!joystick) {
                    this.sprite.setVelocityX(0);
                    this.sprite.setVelocityY(-1 * this.speed);
                }
                this.sprite.anims.play('up');
            }
            else if (down) {
                if (!joystick) {
                    this.sprite.setVelocityX(0);
                    this.sprite.setVelocityY(this.speed);
                }
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
        this.sprite = bombs.create(data.x, data.y, 'bomb').setScale(2).setInteractive();
        this.type = targetType.Mob
        this.id = data.id;
        this.name = data.name;
        this.lvl = data.lvl
        this.hp = data.hp;
        this.maxhp = data.maxhp;
        this.mp = data.mp;
        this.maxhp = data.maxmp;
        this.speed = 120;
        this.target = null;
        this.x = this.sprite.x;
        this.y = this.sprite.y;
        this.respx = data.respx;
        this.respy = data.respy;
        this.status = mobStatus[data.status]
    }

    update() {

        if (this.status == mobStatus.Dead) {
            return
        }

        this.chaseTarget()
        this.revert()
        this.stopMiving()


    }

    stopMiving() {
        if ((this.status == mobStatus.Expectation
            || this.status == mobStatus.Attack)) {
            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0);
            if (this.sprite.x != this.x || this.sprite.y != this.y) {
                this.x = this.sprite.x
                this.y = this.sprite.y
            }
            if (this.status == mobStatus.Expectation && this.hp != this.maxhp) {
                this.hp = this.maxhp
            }
        }
    }

    revert() {

        if (this.status != mobStatus.Revert) {
            return
        }

        let distance = Math.sqrt((this.sprite.x - this.respx) ** 2 + (this.sprite.y - this.respy) ** 2)

        if (distance >= 0 && distance <= 10) {

            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0);

            this.x = this.sprite.x;
            this.y = this.sprite.y;

            this.status = mobStatus.Expectation

            if (this.target == player) {
                let message = {
                    cmd: 'MobExpectation',
                    'id': this.id,
                    'x': this.x,
                    'y': this.y
                }
                ws.send(JSON.stringify(message))
            }

            this.target = null

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

    }

    chaseTarget() {

        if (this.target == isNaN && this.status == mobStatus.Chase) {
            return
        }

        let velocityx = 0
        let velocityy = 0
        try {

            let newx = this.target.sprite.x - this.sprite.x
            let newy = this.target.sprite.y - this.sprite.y

            if (newx < 0) {
                newx = newx * -1;
            }
            if (newy < 0) {
                newy = newy * -1;
            }

            let sp = Math.sqrt(this.speed ** 2 / (newx ** 2 + newy ** 2));

            velocityx = sp * newx;
            velocityy = sp * newy;

            if (this.target.sprite.x < this.sprite.x) {
                velocityx = velocityx * -1;
            }

            if (this.target.sprite.y < this.sprite.y) {
                velocityy = velocityy * -1;
            }

            this.sprite.setVelocityX(velocityx);
            this.sprite.setVelocityY(velocityy);

            this.x = this.sprite.x;
            this.y = this.sprite.y;

            if (this.target == player) {
                let message = {
                    cmd: 'MobMoving',
                    'id': this.id,
                    'x': this.x,
                    'y': this.y
                }
                ws.send(JSON.stringify(message))
            }


        } catch (err) {

            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0);
            return
        }

    }

}

class PlayerFrame extends Phaser.Scene {

    preload() {
    }

    create() {

        this.hpmpbar = this.add.graphics();

        let xpback = this.add.graphics();
        xpback.fillStyle(0x000000, 0.2);
        xpback.fillRect(10, 10, 200, 50);
        this.add.text(10, 10, player.name, { fontSize: '20px', fill: '#000' });
        this.hpmpbar.fillStyle(0xff0000, 1);
        this.hpmpbar.fillRect(12, 30, 198, 15);
        this.hpText = this.add.text(12, 28, player.hp, { fontSize: '20px', fill: '#000' });
        this.hpmpbar.fillStyle(0x0000ff, 1);
        this.hpmpbar.fillRect(12, 45, 198, 15);
        this.mpText = this.add.text(12, 45, player.mp, { fontSize: '20px', fill: '#000' });

    }

    update(p1, p2) {

        this.hpText.setText(player.hp);
        this.mpText.setText(player.mp);

        this.hpmpbar.clear();

        this.hpmpbar.fillStyle(0xff0000, 1);
        this.hpmpbar.fillRect(12, 30, 198*(player.hp/player.maxhp), 15);
        this.hpmpbar.fillStyle(0x0000ff, 1);
        this.hpmpbar.fillRect(12, 45, 198*(player.mp/player.maxmp), 15);

    }


}

class UI extends Phaser.Scene {

    preload() {
        this.load.image('btn', 'assets/star.png');
        this.load.image('SilverSword', 'assets/SilverSword.png');
        this.load.image('WoodenSword', 'assets/WoodenSword.png');
        this.load.image('GoldenSword', 'assets/GoldenSword.png');
    }

    create() {

        scene_UI = this;

        this.input.addPointer(2);

        let xpback = this.add.graphics();
        xpback.fillStyle(0x000000, 0.5);
        let xpbackwidth = windowInnerWidth - 100;
        xpback.fillRect(windowInnerWidth / 2 - xpbackwidth / 2, windowInnerHeight - 30, xpbackwidth, 20);

        xpbar = this.add.graphics();


        // this.add.text(0, 0, player.name, { fontSize: '32px', fill: '#000' });
        // hpText = this.add.text(0, 35, 'HP: ' + 0, { fontSize: '32px', fill: '#000' });
        // mpText = this.add.text(0, 70, 'MP: ' + 0, { fontSize: '32px', fill: '#000' });

        nameTexttarget = this.add.text(windowInnerWidth / 2, 0, '...', { fontSize: '32px', fill: '#000' });
        hpTexttarget = this.add.text(windowInnerWidth / 2, 35, 'HP: ' + 0, { fontSize: '32px', fill: '#000' });
        mpTexttarget = this.add.text(windowInnerWidth / 2, 70, 'MP: ' + 0, { fontSize: '32px', fill: '#000' });


        let WoodenSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'WoodenSword').setInteractive();
        WoodenSword.on('pointerdown', function (pointer, gameObject) {
            if (player.target != null) {
                let inf = {
                    cmd: 'Attack',
                    name: 'WoodenSword',
                    targettype: player.target.type,
                    target: player.target.id
                }
                ws.send(JSON.stringify(inf))
            }
        });

        let SilverSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 150, 'SilverSword').setInteractive();
        SilverSword.on('pointerdown', function (pointer, gameObject) {
            if (player.target != null) {
                let inf = {
                    cmd: 'Attack',
                    name: 'SilverSword',
                    targettype: player.target.type,
                    target: player.target.id
                }
                ws.send(JSON.stringify(inf))
            }
        });

        let GoldenSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 100, 'GoldenSword').setInteractive();
        GoldenSword.on('pointerdown', function (pointer, gameObject) {
            if (player.target != null) {
                player.mp = player.mp - 10;
                let inf = {
                    cmd: 'Attack',
                    name: 'GoldenSword',
                    targettype: player.target.type,
                    target: player.target.id
                }
                ws.send(JSON.stringify(inf))
            }
        });

        let drag = this.add.sprite(dragpx, dragpy, 'btn').setInteractive({ draggable: true });
        drgX = dragpx;
        drgY = dragpy;
        drag.setScale(3)
        drag.on('drag', function (pointer, dragX, dragY) {

            this.x = dragX;
            this.y = dragY;

            drgX = dragX;
            drgY = dragY;

        });

        drag.on('pointerup', function (pointer) {

            this.x = dragpx;
            this.y = dragpy;
            drgX = dragpx;
            drgY = dragpy;


        });

        drag.on('pointerout', function (pointer) {

            this.x = dragpx;
            this.y = dragpy;
            drgX = dragpx;
            drgY = dragpy;

        });

    }

    update(p1, p2) {

        // hpText.setText('HP: ' + player.hp);
        // mpText.setText('MP: ' + player.mp);

        xpbar.clear()
        xpbar.fillStyle(0x0000ff, 1);
        let xpwidth = (windowInnerWidth - 102) * (player.xp / 100);
        xpbar.fillRect(51, windowInnerHeight - 30, xpwidth, 18);

        if (player.target != null) {
            nameTexttarget.setText(player.target.name + ',lvl ' + String(player.target.lvl));
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

        scene_main = this;

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
                        console.log(mobelement.status)
                        console.log(mobelement.target)
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
                else if (data.cmd == 'PlayerDamageReceived') {
                    playerDamageReceived(data)
                }
                else if (data.cmd == 'MobAttack') {
                    mobAttack(data)
                }
                else if (data.cmd == 'TargetAttack') {
                    targetAttack(data)
                }
                else if (data.cmd == 'respPlayer') {
                    respPlayer(data)
                }
                else if (data.cmd == 'mobDead') {
                    mobDead(data)
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

function mobDead(data) {
    for (let i in mobs) {
        let mob = mobs[i]
        if (mob.id == data.id) {
            if (mob.status == mobStatus.Expectation) {
                return
            }
            mob.status = mobStatus.Dead;
            mob.sprite.setPosition(mob.respx, mob.respy);
            mob.x = mob.respx;
            mob.y = mob.respy;
            mob.hp = mob.maxhp;
            mob.status = mobStatus.Expectation
            playerelement = null
            if (player.id == data.player) {
                playerelement = player
            }
            else {
                for (let i in players) {
                    if (players[i].id == data.player) {
                        playerelement = players[i]
                        break
                    }
                }
            }
            playerelement.xp = playerelement.xp + data.xp
            if (playerelement.xp >= 100) {
                playerelement.xp = playerelement.xp - 100
                playerelement.lvl = playerelement.lvl + 1
                playerelement.maxhp = playerelement.maxhp + 50
                playerelement.hp = playerelement.maxhp
                playerelement.maxmp = playerelement.maxmp + 50
                playerelement.mp = playerelement.maxmp
            }
            return
        }
    }
}

function respPlayer(data) {
    let playerelement = null
    if (player.id == data.id) {
        playerelement = player;
    }
    else {
        for (let i in players) {
            if (players[i].id == data.id) {
                playerelement = players[i];
                break
            }
        }
    }
    if (playerelement != null) {
        playerelement.sprite.setPosition(data.x, data.y);
        playerelement.x = data.x;
        playerelement.y = data.y;
        playerelement.hp = player.maxhp
    }
}

function targetAttack(data) {
    if (data.targettype == targetType.Mob) {
        let mob;
        for (let i in mobs) {
            mob = mobs[i]
            if (mob.id == data.target) {
                mob.hp = mob.hp - data.damage;
                break
            }
        }
    }
    else {
        console.log('Еще не готово');
    }

}

function mobAttack(data) {
    let mob;
    for (let i in mobs) {
        mob = mobs[i];
        if (mob.id == data.id) {
            mob.target.hp = mob.target.hp - data.damage;
        }
    }
}

function playerDamageReceived(data) {
    let player;
    for (let i in players) {
        player = players[i]
        if (player.id == data.id) {
            player.hp = player.hp - data.damage;
            break
        }

    }
}

function createplayer() {
    player = new Player(scene_main.physics.add.sprite(700, 700, 'dude').setScale(3));
    player.id = client_id;
    player.x = 700;
    player.y = 700;

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

    scene_main.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
    scene_main.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
    scene_main.cameras.main.startFollow(player.sprite);
    // scene_main.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    scene_main.scene.add('UI', UI, true, { x: 400, y: 300 });
    scene_main.scene.add('PlayerFrame', PlayerFrame, true,{x: 400, y: 300})
}

function addPlayer(data) {

    let newplayer = new Player(scene_main.physics.add.sprite(data.x, data.y, 'dude').setScale(3));
    newplayer.sprite.setInteractive();
    newplayer.id = data.id;
    newplayer.thisplayer = false;
    newplayer.x = data.x;
    newplayer.y = data.y;

    newplayer.sprite.anims.play('turn');

    players.push(newplayer);

}

function disconnectPlayer(data) {

    let pl;
    for (let i in players) {
        pl = players[i];
        if (pl.id == data.id) {
            pl.sprite.destroy();
            players.splice(i, 1);
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