const windowInnerWidth = window.innerWidth - 20
const windowInnerHeight = window.innerHeight - 20


var client_id = Date.now()


const mobStatus = { Chase: 'Chase', Attack: 'Attack', Revert: 'Revert', Expectation: 'Expectation', Dead: 'Dead' }
const targetType = { Player: 'Player', Mob: 'Mob' }
var player;
var players = [];
var bombs;
var mobs = [];
var drops = [];

var bx;
var by;
var chase = false
var cursors;

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

var bagFrame;

var scene_main;

class Spell {

    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.damage = data.damage
        this.distance = data.distance
        this.mp = data.mp
        this.colldownn = data.colldownn
        this.timeattack = Date.now() / 1000
    }

    checkattack() {
        if (player.target == null) {
            return false;
        }
        if ((Date.now() / 1000 - this.timeattack) < this.colldownn) {
            return false;
        }
        if (Math.sqrt((player.sprite.x - player.target.sprite.x) ** 2 + (player.sprite.y - player.target.sprite.y) ** 2) > this.distance) {
            return false;
        }
        if (this.mp > player.mp) {
            return false;
        }
        return true;
    }
}

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
        this.spell1 = null;
        this.spell2 = null;
        this.spell3 = null;
        this.bag = [null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null];
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
        this.maxmp = data.maxmp;
        this.speed = 120;
        this.target = null;
        this.x = this.sprite.x;
        this.y = this.sprite.y;
        this.respx = data.respx;
        this.respy = data.respy;
        this.status = mobStatus[data.status]

        // this.sprite.on('pointerdown', function (pointer, gameObject) {
        //     console.log('Выбран: ' + this.name);
        // });
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

class Item {
    constructor(id, name, image, stack, stacksize) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.sprite = null;
        this.stack = stack;
        this.stacksize = stacksize;

    }
}

class Drop {
    constructor(sprite) {
        this.sprite = sprite;
        this.loot = [];
    }
}

class BagCell {
    constructor() {
        this.index = 0;
        this.x = 0;
        this.y = 0;
        this.item = null;
        this.quantity = 0;
    }
}

class TargetFrame extends Phaser.Scene {

    preload() {
    }

    create() {

        this.frback = this.add.graphics();
        this.frback.fillStyle(0x000000, 0.2);
        this.frback.fillRect(250, 10, 200, 50);
        this.nameTexttarget = this.add.text(250, 10, '...', { fontSize: '20px', fill: '#000' });
        this.hpmpbar = this.add.graphics();
        this.hpmpbar.fillStyle(0xff0000, 1);
        this.hpmpbar.fillRect(252, 30, 198, 15);
        this.hpTexttarget = this.add.text(252, 28, 0, { fontSize: '20px', fill: '#000' });
        this.hpmpbar.fillStyle(0x0000ff, 1);
        this.hpmpbar.fillRect(252, 45, 198, 15);
        this.mpTexttarget = this.add.text(252, 45, 0, { fontSize: '20px', fill: '#000' });


    }

    update(p1, p2) {
        if (player.target != null) {
            if (Math.sqrt((player.sprite.x - player.target.sprite.x) ** 2 + (player.sprite.y - player.target.sprite.y) ** 2) > 700) {
                player.target = null;
            }
        }

        if (player.target != null) {
            this.frback.visible = true;
            this.hpmpbar.visible = true;
            this.nameTexttarget.visible = true;
            this.hpTexttarget.visible = true;
            this.mpTexttarget.visible = true;
            this.nameTexttarget.setText(player.target.name + ',lvl ' + String(player.target.lvl));
            this.hpTexttarget.setText(player.target.hp);
            this.mpTexttarget.setText(player.target.mp);
            this.hpmpbar.clear();
            this.hpmpbar.fillStyle(0xff0000, 1);
            this.hpmpbar.fillRect(252, 30, 198 * (player.target.hp / player.target.maxhp), 15);
            this.hpmpbar.fillStyle(0x0000ff, 1);
            this.hpmpbar.fillRect(252, 45, 198 * (player.target.mp / player.target.maxmp), 15);
        }
        else {
            this.frback.visible = false;
            this.hpmpbar.visible = false;
            this.nameTexttarget.visible = false;
            this.hpTexttarget.visible = false;
            this.mpTexttarget.visible = false;
        }


    }


}

class UI extends Phaser.Scene {

    preload() {
        this.load.image('btn', 'assets/star.png');
        this.load.image('SilverSword', 'assets/SilverSword.png');
        this.load.image('WoodenSword', 'assets/WoodenSword.png');
        this.load.image('GoldenSword', 'assets/GoldenSword.png');
        this.load.image('Bag', 'assets/Bag.png')
    }

    create() {

        this.frback = this.add.graphics();
        this.frback.fillStyle(0x000000, 0.2);
        this.frback.fillRect(10, 10, 200, 50);
        this.add.text(10, 10, player.name, { fontSize: '20px', fill: '#000' });
        this.hpmpbar = this.add.graphics();
        this.hpmpbar.fillStyle(0xff0000, 1);
        this.hpmpbar.fillRect(12, 30, 198, 15);
        this.hpText = this.add.text(12, 28, player.hp, { fontSize: '20px', fill: '#000' });
        this.hpmpbar.fillStyle(0x0000ff, 1);
        this.hpmpbar.fillRect(12, 45, 198, 15);
        this.mpText = this.add.text(12, 45, player.mp, { fontSize: '20px', fill: '#000' });

        this.input.addPointer(2);

        this.frback.fillStyle(0x000000, 0.5);
        let xpbackwidth = windowInnerWidth - 100;
        this.frback.fillRect(windowInnerWidth / 2 - xpbackwidth / 2, windowInnerHeight - 30, xpbackwidth, 20);

        this.xpbar = this.add.graphics();

        if (player.spell1 != null) {
            let WoodenSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'WoodenSword').setInteractive();
            WoodenSword.on('pointerdown', function (pointer, gameObject) {
                if (player.spell1.checkattack()) {
                    let inf = {
                        cmd: 'Attack',
                        cell: 1,
                        targettype: player.target.type,
                        target: player.target.id
                    }
                    ws.send(JSON.stringify(inf))
                }
            });
        }

        if (player.spell2 != null) {
            let SilverSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 150, 'SilverSword').setInteractive();
            SilverSword.on('pointerdown', function (pointer, gameObject) {
                if (player.spell2.checkattack()) {
                    let inf = {
                        cmd: 'Attack',
                        cell: 2,
                        targettype: player.target.type,
                        target: player.target.id
                    }
                    ws.send(JSON.stringify(inf))
                }
            });
        }

        if (player.spell3 != null) {
            let GoldenSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 100, 'GoldenSword').setInteractive();
            GoldenSword.on('pointerdown', function (pointer, gameObject) {
                if (player.spell3.checkattack()) {
                    let inf = {
                        cmd: 'Attack',
                        cell: 3,
                        targettype: player.target.type,
                        target: player.target.id
                    }
                    ws.send(JSON.stringify(inf))
                }
            });
        }


        let bag = this.add.sprite(windowInnerWidth - 150, windowInnerHeight - 70, 'Bag').setInteractive();
        bag.on('pointerdown', function (pointer, gameObject) {

            bagFrame.bagisopen = !bagFrame.bagisopen;

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

        this.hpText.setText(player.hp);
        this.mpText.setText(player.mp);

        this.hpmpbar.clear();

        this.hpmpbar.fillStyle(0xff0000, 1);
        this.hpmpbar.fillRect(12, 30, 198 * (player.hp / player.maxhp), 15);
        this.hpmpbar.fillStyle(0x0000ff, 1);
        this.hpmpbar.fillRect(12, 45, 198 * (player.mp / player.maxmp), 15);

        this.xpbar.clear()
        this.xpbar.fillStyle(0x0000ff, 1);
        this.xpbar.fillRect(51, windowInnerHeight - 30, (windowInnerWidth - 102) * (player.xp / 100), 18);

    }


}

class BagFrame extends Phaser.Scene {

    preload() {
        this.load.image('ClsdBtn', 'assets/closedbuttonpng.png');
        this.load.image('Apple', 'assets/equipment/Apple.png');
        this.load.image('Beer', 'assets/equipment/Beer.png');
        this.load.image('Bread', 'assets/equipment/Bread.png');
        this.load.image('Cheese', 'assets/equipment/Cheese.png');
        this.load.image('Ham', 'assets/equipment/Ham.png');
        this.load.image('Mushroom', 'assets/equipment/Mushroom.png');
        this.load.image('Wine', 'assets/equipment/Wine.png');
        this.load.image('CopperCoin', 'assets/CopperCoin.png');
        this.load.image('GoldenCoin', 'assets/GoldenCoin.png');
        this.load.image('SilverCoin', 'assets/SilverCoin.png');
    }

    create() {

        bagFrame = this;
        this.dragobg = null;
        this.bagisopen = false;
        this.bagisrendered = false;
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            bagFrame.bagisopen = false;
        });

        this.input.on('pointerdown', function (pointer, gameObject) {
            console.log('я сделаль');
        });

        this.drop = null;
        this.dropisopen = false;
        this.graphicsdrop = this.add.graphics();
        this.dropisrendered = false;
        this.ClsdBtndrop = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'ClsdBtn').setInteractive();
        this.ClsdBtndrop.visible = false;
        this.ClsdBtndrop.on('pointerdown', function (pointer, gameObject) {
            bagFrame.dropisopen = false;
        });

        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            obj.setPosition(dragX, dragY);
            this.dragobg = obj;
        });

        this.input.on('pointerup', function (pointer, obj) {
            if (obj.length == 0) {
                return;
            }
            let dragobg = bagFrame.dragobg;
            let dragcell = null;
            let dragitem = null;
            for (let i in player.bag) {
                if (player.bag[i].item != null) {
                    if (player.bag[i].item.sprite == dragobg) {
                        dragcell = player.bag[i];
                        dragitem = dragcell.item;
                        break
                    }
                }
            }

            if (dragitem != null) {
                let distance = Math.sqrt((dragitem.sprite.x - dragcell.x) ** 2 + (dragitem.sprite.y - dragcell.y) ** 2);

                if (distance <= 25) {
                    dragitem.sprite.setPosition(dragcell.x, dragcell.y);
                    return
                }

                let replacecell = null;

                for (let i in player.bag) {
                    if (dragcell.index == i) {
                        continue;
                    }
                    let replaceelement = player.bag[i];
                    let replacedistance = Math.sqrt((dragitem.sprite.x - replaceelement.x) ** 2 + (dragitem.sprite.y - replaceelement.y) ** 2);
                    if (replacedistance <= 25) {
                        replacecell = replaceelement;
                        break;
                    }
                }

                if (replacecell == null) {
                    dragitem.sprite.setPosition(dragitem.x, dragitem.y);
                }
                else {

                    let replaceitem = replacecell.item;
                    replaceitem = replacecell.item;
                    replacecell.item = dragitem;
                    dragitem.sprite.setPosition(replacecell.x, replacecell.y);
                    dragcell.item = replaceitem;
                    if (replaceitem != null) {
                        replaceitem.sprite.setPosition(dragcell.x, dragcell.y);
                    }

                }
            }

        });


    }


    update() {

        if (this.dropisopen && !this.dropisrendered){

            this.dropisrendered = true;

            let xsize = windowInnerWidth / 2 - 100;
            let ysize = windowInnerHeight / 2 - 200;

            let columns = Math.floor(Math.sqrt(this.drop.loot.length)) + 1;

            let rows = Math.floor(this.drop.loot.length / columns);

            if (rows < this.drop.loot.length / columns) {
                rows += 1;
            }

            this.graphicsdrop.fillStyle(0x0000ff, 0.5);
            this.graphicsdrop.fillRect(xsize, ysize, columns * 50, rows * 50 + 25);

            let cellxsize = xsize;
            let cellysize = ysize + 20;

            this.graphicsdrop.fillStyle(0x0000ff);
            this.graphicsdrop.fillRect(xsize, ysize, columns * 50, rows + 15);

            this.graphicsdrop.fillStyle(0x000000);
            this.graphicsdrop.fillRect(xsize + columns * 50 - 20, ysize, 20, rows + 15);

            this.ClsdBtndrop.visible = true;
            this.ClsdBtndrop.setPosition(xsize + columns * 50 - 10, ysize + 11)

            cellysize = ysize + 25;

            let counterstring = 0;

            for (let i in this.drop.loot) {

                if (i == 0) {
                    cellxsize = cellxsize + 5;
                    cellysize = cellysize + 5;
                }
                else if (i % columns == 0) {
                    counterstring = counterstring + 1;
                    cellxsize = xsize;
                    cellysize = ysize + 25 + 50 * counterstring;

                    cellxsize = cellxsize + 5;
                    cellysize = cellysize + 5;
                }
                else {
                    cellxsize = cellxsize + 45;
                    cellysize = cellysize - 5;
                }

                this.graphicsdrop.fillStyle(0x000000, 0.5);
                this.graphicsdrop.fillRect(cellxsize, cellysize, 40, 40);

                cellxsize = cellxsize + 5;
                cellysize = cellysize + 5;
                this.graphicsdrop.fillStyle(0x000000, 1);
                this.graphicsdrop.fillRect(cellxsize, cellysize, 30, 30);

                let bagcell = this.drop.loot[i];
                let bagcellx = cellxsize + 16;
                let bagcelly = cellysize + 16;
                let item = bagcell.item;
                if (item != null) {

                    if (item.name != null) {
                        if (item.sprite == null) {
                            item.sprite = this.add.sprite(bagcellx, bagcelly, item.image).setInteractive();
                        }
                        item.sprite.visible = true;
                    }
                    else{
                        item.sprite.setPosition(bagcellx, bagcelly);
                    }

                }

            }
        }
        else if (!this.dropisopen && this.dropisrendered){

            this.graphicsdrop.clear();
            this.ClsdBtndrop.visible = false;
            for (let i in this.drop.loot) {
                let item = this.drop.loot[i].item;
                if (item != null) {
                    if (item.sprite != null) {
                        item.sprite.visible = false;
                    }
                }
            }
            this.drop = null;
            this.dropisopen = false
            this.dropisrendered = false;
        }

        if (this.bagisopen && !this.bagisrendered) {

            this.bagisrendered = true;

            let xsize = windowInnerWidth / 2 + 50;
            let ysize = windowInnerHeight / 2 - 200;

            let columns = Math.floor(Math.sqrt(player.bag.length)) + 1;

            let rows = Math.floor(player.bag.length / columns);

            if (rows < player.bag.length / columns) {
                rows += 1;
            }

            this.graphics.fillStyle(0x0000ff, 0.5);
            this.graphics.fillRect(xsize, ysize, columns * 50, rows * 50 + 25);

            let cellxsize = xsize;
            let cellysize = ysize + 20;

            this.graphics.fillStyle(0x0000ff);
            this.graphics.fillRect(xsize, ysize, columns * 50, rows + 15);

            this.graphics.fillStyle(0x000000);
            this.graphics.fillRect(xsize + columns * 50 - 20, ysize, 20, rows + 15);

            this.ClsdBtn.visible = true;
            this.ClsdBtn.setPosition(xsize + columns * 50 - 10, ysize + 11)


            cellysize = ysize + 25;

            let counterstring = 0;

            for (let i in player.bag) {

                if (i == 0) {
                    cellxsize = cellxsize + 5;
                    cellysize = cellysize + 5;
                }
                else if (i % columns == 0) {
                    counterstring = counterstring + 1;
                    cellxsize = xsize;
                    cellysize = ysize + 25 + 50 * counterstring;

                    cellxsize = cellxsize + 5;
                    cellysize = cellysize + 5;
                }
                else {
                    cellxsize = cellxsize + 45;
                    cellysize = cellysize - 5;
                }

                this.graphics.fillStyle(0x000000, 0.5);
                this.graphics.fillRect(cellxsize, cellysize, 40, 40);

                cellxsize = cellxsize + 5;
                cellysize = cellysize + 5;
                this.graphics.fillStyle(0x000000, 1);
                this.graphics.fillRect(cellxsize, cellysize, 30, 30);

                let bagcell = player.bag[i];
                bagcell.x = cellxsize + 16;
                bagcell.y = cellysize + 16;
                let item = bagcell.item;
                if (item != null) {

                    if (item.name != null) {
                        if (item.sprite == null) {
                            item.sprite = this.add.sprite(bagcell.x, bagcell.y, item.image).setInteractive();
                            bagFrame.input.setDraggable(item.sprite);
                        }
                        item.sprite.visible = true;
                    }
                    else {
                        item.sprite.setPosition(bagcell.x, bagcell.y);
                    }

                }

            }
        }
        else if (!this.bagisopen && this.bagisrendered) {
            this.graphics.clear();
            this.ClsdBtn.visible = false;
            for (let i in player.bag) {
                let item = player.bag[i].item;
                if (item != null) {
                    if (item.sprite != null) {
                        item.sprite.visible = false;
                    }
                }
            }
            this.bagisrendered = false;
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
        this.load.image('Chest', 'assets/Chest.png');
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

                for (let i in drops) {
                    let element = drops[i];
                    if (element.sprite == gameObject[0]) {
                        bagFrame.drop = element;
                        bagFrame.dropisopen = true;
                        return
                    }
                }
                
                for (let i in mobs) {
                    let mobelement = mobs[i];
                    if (mobelement.sprite == gameObject[0]) {
                        player.target = mobelement;
                        console.log(mobelement.status)
                        console.log(mobelement.target)
                        return
                    }
                }

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
            else{
                player.target = null;    
            }

        });

        ws = new WebSocket(`ws://192.168.0.12:8000/ws/${client_id}`);
        ws.onmessage = function (event) {

            console.log(event.data);

            let data = JSON.parse(event.data);

            if (data.cmd == 'CreatePlayer') {
                createplayer(data);
            }
            else if (data.cmd == 'NewPlayer') {
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
            let resplootx = mob.x;
            let resplooty = mob.y;
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
            if (data.loot != null) {
                let drop = new Drop(scene_main.physics.add.sprite(resplootx, resplooty, 'Chest')    .setInteractive());
                for (let i in data.loot) {
                    let loot = data.loot[i];

                    drop.loot.push({
                        'item': new Item(loot.id, loot.name, loot.image, loot.stack, loot.stacksize),
                        'quantity': loot.quantity
                    })

                }
                drops.push(drop);
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
    playerelement = null;
    if (player.id == data.player) {
        playerelement = player;
    }
    else {
        let pl;
        for (let i in players) {
            pl = players[i].id;
            if (pl == data.player) {
                playerelement = pl;
                break
            }
        }
    }
    if (playerelement == null) {
        return
    }
    playerelement.mp = playerelement.mp - data.mp;
    if (data.cell == 1) {
        playerelement.spell1.timeattack = data.timeattack;
    }
    if (data.cell == 2) {
        playerelement.spell2.timeattack = data.timeattack;
    }
    if (data.cell == 3) {
        playerelement.spell3.timeattack = data.timeattack;
    }
    if (data.targettype == targetType.Mob) {
        let mob;
        for (let i in mobs) {
            mob = mobs[i]
            if (mob.id == data.target) {
                mob.hp = mob.hp - data.damage;
                return
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

function createplayer(data) {
    player = new Player(scene_main.physics.add.sprite(700, 700, 'dude').setScale(3));
    player.id = client_id;
    player.x = 700;
    player.y = 700;

    for (let i in data.spells) {
        let spelldata = data.spells[i];
        if (spelldata.cell == 1) {
            player.spell1 = new Spell(spelldata);
        }
        else if (spelldata.cell == 2) {
            player.spell2 = new Spell(spelldata);
        }
        else if (spelldata.cell == 3) {
            player.spell3 = new Spell(spelldata);
        }
    }

    player.sprite.anims.play('turn');

    players.push(player)

    let inf = {
        'cmd': 'NewPlayer',
        'id': client_id,
        'x': player.x,
        'y': player.y
    }
    ws.send(JSON.stringify(inf))

    for (let i in player.bag) {
        player.bag[i] = new BagCell()
        player.bag[i].index = i;
    }

    scene_main.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
    scene_main.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
    scene_main.cameras.main.startFollow(player.sprite);
    scene_main.scene.add('UI', UI, true, { x: 400, y: 300 });
    scene_main.scene.add('TargetFrame', TargetFrame, true, { x: 400, y: 300 })
    scene_main.scene.add('BagFrame', BagFrame, true, { x: 400, y: 300 })
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