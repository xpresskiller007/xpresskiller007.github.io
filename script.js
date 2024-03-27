const windowInnerWidth = window.innerWidth
const windowInnerHeight = window.innerHeight


var client_id = Date.now()


const mobStatus = { Chase: 'Chase', Attack: 'Attack', Revert: 'Revert', Expectation: 'Expectation', Dead: 'Dead', Respawn: 'Respawn' }
const targetType = { Player: 'Player', Mob: 'Mob', NPC: 'NPC' }
var player;
var players = [];
var bombs;
var mobs = [];
var npcs = [];
var drops = [];

var mobsdata = [
    { "uid": 1, "id": 2, "skin": "bomb", "name": "Чушпан", "hp": 110, "maxhp": 110, "mp": 10, "maxmp": 10, "x": 100, "y": 100, "respx": 100, "respy": 100, "status": "Expectation", "lvl": 1, xp: 25 },
    { "uid": 2, "id": 2, "skin": "bomb", "name": "Чушпан", "hp": 110, "maxhp": 110, "mp": 10, "maxmp": 10, "x": 200, "y": 100, "respx": 200, "respy": 100, "status": "Expectation", "lvl": 1, xp: 25 },
    { "uid": 3, "id": 3, "skin": "bomb", "name": "Чущпенсел", "hp": 120, "maxhp": 120, "mp": 20, "maxmp": 20, "x": 300, "y": 100, "respx": 300, "respy": 100, "status": "Expectation", "lvl": 2, xp: 50 },
    { "uid": 4, "id": 4, "skin": "bomb", "name": "Чушпанище", "hp": 130, "maxhp": 130, "mp": 30, "maxmp": 30, "x": 400, "y": 100, "respx": 400, "respy": 100, "status": "Expectation", "lvl": 3, xp: 75 }
];

var npcsdata = [
    { "id": 6, "skin": "Female1", "name": "Female1", "respx": 900, "respy": 100 },
    { "id": 7, "skin": "Female2", "name": "Female2", "respx": 1000, "respy": 100 },
    { "id": 8, "skin": "Male1", "name": "Male1", "respx": 1100, "respy": 100 },
    { "id": 9, "skin": "Male2", "name": "Male2", "respx": 1200, "respy": 100 },
    { "id": 10, "skin": "Male3", "name": "Male3", "respx": 1300, "respy": 100 }
];

var bx;
var by;
var chase = false
var cursors;

var hpTexttarget;
var mpTexttarget;

var timer;
var btn;

var dragpx = 100
var dragpy = windowInnerHeight - 100

var drgX;
var drgY;

var ws;

var map;

var scene_main;
var scene_BagFrame;
var scene_DropFrame;
var scene_NpcDialoge;
var scene_SpellsFrames;
var scene_CastFrame;

var loot = []

loot.push({
    'item': { id: 1, name: 'Apple', image: 'Apple', stack: true, stacksize: 20 },
    'quantity': 1,
    'chance': 100
})

loot.push({
    'item': { id: 2, name: 'Bread', image: 'Bread', stack: true, stacksize: 20 },
    'quantity': 1,
    'chance': 90
})

loot.push({
    'item': { id: 3, name: 'Cheese', image: 'Cheese', stack: true, stacksize: 10 },
    'quantity': 1,
    'chance': 80
})

loot.push({
    'item': { id: 4, name: 'Ham', image: 'Ham', stack: true, stacksize: 5 },
    'quantity': 1,
    'chance': 70
})

loot.push({
    'item': { id: 5, name: 'Mushroom', image: 'Mushroom', stack: true, stacksize: 3 },
    'quantity': 1,
    'chance': 50
})

loot.push({
    'item': { id: 6, name: 'Wine', image: 'Wine', stack: false, stacksize: 0 },
    'quantity': 1,
    'chance': 25
})

loot.push({
    'item': { id: 7, name: 'Beer', image: 'Beer', stack: false, stacksize: 0 },
    'quantity': 1,
    'chance': 10
})

var spellsdata = [];

var spells = [];

var lvldata = { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600, 7: 700, 8: 800, 9: 900, 10: 0 }

let exemp = [];

exemp = [{
    startx: - 250, starty: - 50, x: 0, y: 0,
    direction: [
        { stepx: 5, stepy: -5, steps: 40, stepcounter: 0 },
        { stepx: -10, stepy: 0, steps: 20, stepcounter: 0 },
        { stepx: 5, stepy: 5, steps: 40, stepcounter: 0 },
    ]
},
{
    startx: - 150, starty: - 40, x: 0, y: 0,
    direction: [{ stepx: 0, stepy: -10, steps: 25, stepcounter: 0 }]
}
];
spellsdata.push({ 'id': 1, damage: 20, mp: 5, cooldown: 0, distance: 300, 'sprite': 'spell1', 'spelldata': [['rightup', 'left', 'rightdown'], ['up']], exemple: exemp })

exemp = [{
    startx: - 50, starty: - 270, x: 0, y: 0,
    direction: [
        { stepx: -5, stepy: 5, steps: 40, stepcounter: 0 },
        { stepx: 10, stepy: 0, steps: 20, stepcounter: 0 },
        { stepx: -5, stepy: -5, steps: 40, stepcounter: 0 },
    ]
},
{
    startx: - 150, starty: - 40, x: 0, y: 0,
    direction: [{ stepx: 0, stepy: -10, steps: 25, stepcounter: 0 }]
}
];
spellsdata.push({ 'id': 2, damage: 40, mp: 10, cooldown: 2000, distance: 300, 'sprite': 'spell2', 'spelldata': [['leftdown', 'right', 'leftup'], ['up']], exemple: exemp })

exemp = [{
    startx: - 100, starty: - 270, x: 0, y: 0,
    direction: [
        { stepx: -5, stepy: 5, steps: 20, stepcounter: 0 },
        { stepx: 10, stepy: 0, steps: 10, stepcounter: 0 },
        { stepx: -5, stepy: 5, steps: 20, stepcounter: 0 },
    ]
},
{
    startx: - 150, starty: - 40, x: 0, y: 0,
    direction: [{ stepx: 0, stepy: -10, steps: 25, stepcounter: 0 }]
}
];
spellsdata.push({ 'id': 3, damage: 60, mp: 15, cooldown: 3000, distance: 300, 'sprite': 'spell3', 'spelldata': [['leftdown', 'right', 'leftdown'], ['up']], exemple: exemp })

exemp = [{
    startx: - 150, starty: - 260, x: 0, y: 0,
    direction: [
        { stepx: -5, stepy: 5, steps: 20, stepcounter: 0 },
        { stepx: 5, stepy: 5, steps: 20, stepcounter: 0 },
        { stepx: 5, stepy: -5, steps: 20, stepcounter: 0 },
        { stepx: -5, stepy: -5, steps: 20, stepcounter: 0 },

    ]
},
{
    startx: - 150, starty: - 40, x: 0, y: 0,
    direction: [{ stepx: 0, stepy: -10, steps: 25, stepcounter: 0 }]
}
];
spellsdata.push({ 'id': 4, damage: 100, mp: 25, cooldown: 5000, distance: 300, 'sprite': 'spell4', 'spelldata': [['leftdown', 'rightdown', 'rightup', 'leftup'], ['up']], exemple: exemp })


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
        this.respx = this.x;
        this.respy = this.y;
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
        this.respawn();
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

            // if (this.x != this.sprite.x || this.y != this.sprite.y) {
            //     this.x = this.sprite.x;
            //     this.y = this.sprite.y;
            //     let message = {
            //         cmd: 'PlayerMoving',
            //         'id': client_id,
            //         'x': this.x,
            //         'y': this.y
            //     }
            //     ws.send(JSON.stringify(message))
            // }

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

    respawn() {
        if (this.hp <= 0) {
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
            this.sprite.setPosition(this.respx, this.respy);
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            this.hp = this.maxhp;
            this.mp = this.maxmp;
        }
    }

    addXp(xp) {

        this.xp += xp;

        let lvlinf = lvldata[this.lvl];

        if (lvlinf) {
            if (this.xp > lvlinf) {
                this.xp -= lvlinf;
                this.lvl += 1;
                this.hp = this.maxhp;
                this.mp = this.maxmp;
            }
        }

    }
}

class Mob {

    constructor(data) {
        this.sprite = bombs.create(data.x, data.y, data.skin).setScale(2).setInteractive();
        this.type = targetType.Mob
        this.id = data.id;
        this.uid = data.uid;
        this.name = data.name;
        this.lvl = data.lvl;
        this.xp = data.xp;
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
        this.status = mobStatus[data.status];
        this.attackdistance = 50;
        this.damage = 5 * this.lvl;
        this.timeattack = 2000;//мсек
        this.lastattack = 0;
        this.deathtime = 0;
        this.resptime = 20000;


    }

    update() {

        if (this.status == mobStatus.Dead) {
            return
        }

        this.setStatus();
        this.chaseTarget();
        this.revert();
        this.stopMiving();
        this.atack();
        this.death();
        this.respawn();


    }

    atack() {

        if (this.status == mobStatus.Attack
            && this.target != null
            && this.target.hp > 0
            && Date.now() - this.lastattack >= this.timeattack) {
            this.target.hp = this.target.hp - this.damage;
            this.lastattack = Date.now();
        }

    }

    setStatus() {

        if (this.hp <= 0) {
            this.status = mobStatus.Dead;
        }

        if (this.status == mobStatus.Revert || this.status == mobStatus.Dead || this.status == mobStatus.Respawn) {
            return
        }

        let distance = Math.sqrt((player.sprite.x - this.sprite.x) ** 2 + (player.sprite.y - this.sprite.y) ** 2)

        if (this.target == null) {
            if (distance > this.attackdistance && distance < 250 && this.status != mobStatus.Chase && player.hp > 0) {
                this.target = player
                this.status = mobStatus.Chase
            }
        }
        else {
            let dopdist = 0;
            if (this.hp < this.maxhp) {
                dopdist = 100;
            }
            let distancetoresp = Math.sqrt((this.respx - this.sprite.x) ** 2 + (this.respy - this.sprite.y) ** 2)
            if (distance - dopdist > 250 || distancetoresp >= 500 || this.target.hp <= 0) {
                this.status = mobStatus.Revert;
                this.target = null;
            }
            else if (distance < this.attackdistance && this.status != mobStatus.Attack) {
                this.status = mobStatus.Attack
            }
            else if (distance > this.attackdistance && distance - dopdist < 250 && this.status != mobStatus.Chase) {
                this.status = mobStatus.Chase
            }
            else if (distance <= 10) {
                this.status = mobStatus.Expectation
                this.target = null;
                this.hp = this.maxhp
                this.hp = this.maxmp
            }
        }

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

            this.status = mobStatus.Expectation;

            // if (this.target == player) {
            //     let message = {
            //         cmd: 'MobExpectation',
            //         'uid': this.uid,
            //         'x': this.x,
            //         'y': this.y
            //     }
            //     ws.send(JSON.stringify(message))
            // }

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

            // if (this.target == player) {
            //     let message = {
            //         cmd: 'MobMoving',
            //         'uid': this.uid,
            //         'x': this.x,
            //         'y': this.y
            //     }
            //     ws.send(JSON.stringify(message))
            // }


        } catch (err) {

            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0);
            return
        }

    }

    death() {

        if (this.status != mobStatus.Dead) {
            return
        }

        let resplootx = this.x;
        let resplooty = this.y;

        this.target = null;
        this.sprite.setPosition(this.respx, this.respy);
        this.sprite.visible = false;
        this.hp = this.maxhp;
        this.mp = this.maxmp;
        this.deathtime = Date.now();
        this.status = mobStatus.Respawn;

        let drop = []
        for (let i in loot) {
            let element = loot[i];
            if (element.chance < 100) {
                let rand = Math.random() * 100;
                if (rand > element.chance) {
                    continue
                }
                let item = element.item;
                drop.push(
                    {
                        'id': item.id,
                        'name': item.name,
                        'image': item.image,
                        'stack': item.stack,
                        'stacksize': item.stacksize,
                        'quantity': item.quantity
                    }
                )
            }

        }

        if (drop.length) {
            let Chest = new Drop(scene_main.physics.add.sprite(resplootx, resplooty, 'Chest').setInteractive());
            for (let i in drop) {
                let item = drop[i];

                Chest.loot.push({
                    'item': new Item(item.id, item.name, item.image, item.stack, item.stacksize),
                    'quantity': item.quantity
                })

            }
            drops.push(Chest);
        }

    }

    respawn() {

        if (this.status != mobStatus.Respawn) {
            return
        }

        if (Date.now() - this.deathtime >= this.resptime) {
            this.sprite.visible = true;
            this.deathtime = 0;
            this.status = mobStatus.Expectation;
        }

    }


}

class NPC {

    constructor(data) {
        this.sprite = scene_main.physics.add.sprite(data.respx, data.respy, data.skin).setInteractive();
        this.type = targetType.NPC
        this.id = data.id;
        this.uid = data.uid;
        this.name = data.name;
        if (data.skin == 'Female1') {
            this.sprite.anims.play('f1turn');
        }
        if (data.skin == 'Female2') {
            this.sprite.anims.play('f2turn');
        }
        if (data.skin == 'Male1') {
            this.sprite.anims.play('m1turn');
        }
        if (data.skin == 'Male2') {
            this.sprite.anims.play('m2turn');
        }
        if (data.skin == 'Male3') {
            this.sprite.anims.play('m3turn');
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
        this.quantitytext = null;
    }
}

class XPBar extends Phaser.Scene {

    create() {
        this.xpbar = this.add.graphics();
    }

    update() {
        this.xpbar.clear()
        this.xpbar.fillStyle(0x000000, 0.5);
        let xpbackwidth = windowInnerWidth - 100;
        this.xpbar.fillRect(windowInnerWidth / 2 - xpbackwidth / 2, windowInnerHeight - 30, xpbackwidth, 20);
        this.xpbar.fillStyle(0x0000ff, 1);

        let xp = 0;
        let maxXp = lvldata[player.lvl];
        if (maxXp) {
            xp = (windowInnerWidth - 102) * (player.xp / maxXp);
        }
        this.xpbar.fillRect(51, windowInnerHeight - 30, xp, 18);

    }

}

class PlayerFrame extends Phaser.Scene {

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

    }

    update() {

        this.hpText.setText(player.hp);
        this.mpText.setText(player.mp);

        this.hpmpbar.clear();

        this.hpmpbar.fillStyle(0xff0000, 1);
        this.hpmpbar.fillRect(12, 30, 198 * (player.hp / player.maxhp), 15);
        this.hpmpbar.fillStyle(0x0000ff, 1);
        this.hpmpbar.fillRect(12, 45, 198 * (player.mp / player.maxmp), 15);

    }


}

class Joystick extends Phaser.Scene {

    preload() {
        this.load.image('Joystick', 'assets/star.png');
    }

    create() {
        let drag = this.add.sprite(dragpx, dragpy, 'Joystick').setInteractive({ draggable: true });
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
}

class TargetFrame extends Phaser.Scene {

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
            if (player.target.type == targetType.NPC) {
                if (Math.sqrt((player.sprite.x - player.target.sprite.x) ** 2 + (player.sprite.y - player.target.sprite.y) ** 2) > 200) {
                    player.target = null;
                    scene_NpcDialoge.closedialoge();
                }
            }
        }

        if (player.target != null && player.target.type != targetType.NPC) {
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

class SpellsFrames extends Phaser.Scene {

    create() {

        scene_SpellsFrames = this;

        let step = 50 * spellsdata.length;
        for (let i in spellsdata) {
            let spelldata = spellsdata[i];
            let newspell = new Spell(spelldata, windowInnerWidth - 40, windowInnerHeight - step);
            spells.push(newspell);

            step -= 50;
        }

        this.input.on('pointerdown', function (pointer, gameObject) {

            if (!gameObject.length) {
                return;
            }

            for (let i in spells) {
                let element = spells[i];
                if (element.sprite == gameObject[0]) {
                    if (!element.check()) {
                        return
                    }
                    if (scene_CastFrame.castopen) {
                        scene_CastFrame.close();
                    }
                    scene_CastFrame.open(element);
                }
            }


        });

        // if (player.spell1 != null) {
        //     let WoodenSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'WoodenSword').setInteractive();
        //     WoodenSword.on('pointerdown', function (pointer, gameObject) {
        //         // if (player.spell1.checkattack()) {
        //         //     let inf = {
        //         //         cmd: 'Attack',
        //         //         cell: 1,
        //         //         targettype: player.target.type,
        //         //         target: player.target.uid
        //         //     }
        //         //     ws.send(JSON.stringify(inf))
        //         // }
        //     });
        // }

        // if (player.spell2 != null) {
        //     let SilverSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 150, 'SilverSword').setInteractive();
        //     SilverSword.on('pointerdown', function (pointer, gameObject) {
        //         // if (player.spell2.checkattack()) {
        //         //     let inf = {
        //         //         cmd: 'Attack',
        //         //         cell: 2,
        //         //         targettype: player.target.type,
        //         //         target: player.target.uid
        //         //     }
        //         //     ws.send(JSON.stringify(inf))
        //         // }
        //     });
        // }

        // if (player.spell3 != null) {
        //     let GoldenSword = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 100, 'GoldenSword').setInteractive();
        //     GoldenSword.on('pointerdown', function (pointer, gameObject) {
        //         // if (player.spell3.checkattack()) {
        //         //     let inf = {
        //         //         cmd: 'Attack',
        //         //         cell: 3,
        //         //         targettype: player.target.type,
        //         //         target: player.target.uid
        //         //     }
        //         //     ws.send(JSON.stringify(inf))
        //         // }
        //     });
        // }

    }
}

class CastFrame extends Phaser.Scene {

    create() {
        scene_CastFrame = this;

        this.castopen = false;
        this.spell = null;
        this.exemple = [];
        this.spelldata = [];
        this.isDraw = false;
        this.beginDraw = 0;
        this.nowDraw = 0;
        this.drawPoint = []

        this.resultDraw = this.add.graphics();
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 100, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_CastFrame.close()
        });

        this.exemplestep = Date.now();
        this.exempleGraph = this.add.graphics();
        this.drawGraph = this.add.graphics();
        this.zone = this.add.zone(windowInnerWidth - 155, windowInnerHeight - 155, 300, 300).setInteractive();
        this.zone.visible = false;

        this.zone.on('pointermove', pointer => {

            if (pointer.isDown) {

                if (!this.isDraw) {
                    this.clearExemple()
                }

                this.isDraw = true;

                if (!this.drawPoint.length) {
                    this.beginDraw = Date.now() / 1000;
                }

                this.drawPoint.push({ 'x': pointer.x, 'y': pointer.y })

                let dx = pointer.position.x;
                let dy = pointer.position.y;
                let x = pointer.prevPosition.x;
                let y = pointer.prevPosition.y;

                this.drawGraph.beginPath();
                this.drawGraph.moveTo(x, y);
                this.drawGraph.lineTo(dx, dy);
                this.drawGraph.stroke();
                this.drawGraph.closePath();
            }

        });

        this.zone.on('pointerup', function (pointer) {

            scene_CastFrame.direction();
            scene_CastFrame.drawPoint.splice(0, scene_CastFrame.drawPoint.length);
            scene_CastFrame.isDraw = false;

        });

        this.zone.on('pointerout', function (pointer) {

            scene_CastFrame.direction();
            scene_CastFrame.drawPoint.splice(0, scene_CastFrame.drawPoint.length);
            scene_CastFrame.isDraw = false;

        });


    }

    update(p1, p2) {

        if (!this.exemple.length) {
            return;
        }

        if (this.castopen && !this.isDraw) {
            if (!this.spell.check()) {
                this.close();
                return;
            }
            for (let ii in this.spelldata) {

                if (this.spelldata[ii].Done) {
                    continue;
                }

                let exemp = this.exemple[ii];

                for (let i in exemp.direction) {
                    while (exemp.direction[i].stepcounter <= exemp.direction[i].steps - 1 && Date.now() - this.exemplestep > 15) {

                        let x1 = 0;
                        let y1 = 0;
                        if (exemp.direction[i].stepcounter == 0 && i == 0) {
                            x1 = exemp.startx + windowInnerWidth;
                            y1 = exemp.starty + windowInnerHeight;
                        }
                        else {
                            x1 = exemp.x;
                            y1 = exemp.y;
                        }

                        let x2 = x1 + exemp.direction[i].stepx;
                        let y2 = y1 + exemp.direction[i].stepy;

                        exemp.x = x2;
                        exemp.y = y2;

                        this.exempleGraph.beginPath();
                        this.exempleGraph.moveTo(x1, y1);
                        this.exempleGraph.lineTo(x2, y2);
                        this.exempleGraph.stroke();
                        this.exempleGraph.closePath();
                        exemp.direction[i].stepcounter += 1;
                        this.exemplestep = Date.now();

                    }

                }

            }

        }

        let exemp = this.exemple[this.exemple.length - 1];
        let lastdir = exemp.direction[exemp.direction.length - 1];
        let clear = lastdir.stepcounter == lastdir.steps
        if (clear) {
            this.clearExemple()
        }

    }

    clearExemple() {

        for (let ii in this.exemple) {
            let exemp = this.exemple[ii];
            exemp.x = 0;
            exemp.y = 0;
            for (let i in exemp.direction) {
                exemp.direction[i].stepcounter = 0;
            }
        }
        this.exempleGraph.clear();
        this.exempleGraph.lineStyle(7, 0x0000ff);
    }

    direction() {
        this.beginDraw = 0;
        this.nowDraw = 0;
        let step = 2;

        let x = 0;
        let y = 0;
        let i = 0;

        let lastdirection = '';

        let maxind = this.drawPoint.length - 1;
        let dirarray = [];
        while (i <= maxind) {

            let direction = '';

            x = this.drawPoint[i].x;
            y = this.drawPoint[i].y;

            i += step;
            if (i > maxind) {
                i = maxind;
            }
            direction = this.calculateDirection(x, y, this.drawPoint[i].x, this.drawPoint[i].y);
            while (direction == '' && i <= maxind) {
                i += step;
                if (i > maxind) {
                    break;
                }
                direction = this.calculateDirection(x, y, this.drawPoint[i].x, this.drawPoint[i].y);
            }

            if (lastdirection != direction) {
                lastdirection = direction;
                dirarray.push({ 'direction': direction, 'counter': 1 });
                console.log(direction);
            }
            else {
                if (dirarray.length) {
                    dirarray[dirarray.length - 1].counter += 1;
                }
            }

            i += step;
        }

        this.processArrayDirections(dirarray);

        let arr = false;

        for (let ii in this.spelldata) {

            if (this.spelldata[ii].Done) {
                continue;
            }

            if (this.spelldata[ii].data.length != dirarray.length) {
                arr = true;
            }
            else {

                for (let i in dirarray) {
                    let result = dirarray[i];
                    let spelldata = this.spelldata[ii].data[i];
                    if (result != spelldata) {
                        arr = true;
                        break;
                    }
                }

            }

            if (arr) {
                console.log('не шмогла');
                this.drawGraph.clear();
                this.drawGraph.lineStyle(5, 0x0000ff);
                return;
            }
            else {
                this.spelldata[ii].Done = true;

                this.drawResult(ii);

                if (this.spelldata[this.spelldata.length - 1].Done) {
                    this.spell.use();
                    this.close();
                    return;
                }
                else {
                    this.drawGraph.clear();
                    this.drawGraph.lineStyle(5, 0x0000ff);
                    return;
                }
            }

        }


    }

    drawResult(ind) {

        let exemp = this.exemple[ind];

        for (let i in exemp.direction) {
            while (exemp.direction[i].stepcounter <= exemp.direction[i].steps - 1) {

                let x1 = 0;
                let y1 = 0;
                if (exemp.direction[i].stepcounter == 0 && i == 0) {
                    x1 = exemp.startx + windowInnerWidth;
                    y1 = exemp.starty + windowInnerHeight;
                }
                else {
                    x1 = exemp.x;
                    y1 = exemp.y;
                }

                let x2 = x1 + exemp.direction[i].stepx;
                let y2 = y1 + exemp.direction[i].stepy;

                exemp.x = x2;
                exemp.y = y2;

                this.resultDraw.beginPath();
                this.resultDraw.moveTo(x1, y1);
                this.resultDraw.lineTo(x2, y2);
                this.resultDraw.stroke();
                this.resultDraw.closePath();
                exemp.direction[i].stepcounter += 1;

            }

        }

    }

    processArrayDirections(array) {

        let i = 0;
        while (i <= array.length - 1) {
            let strarray = array[i];
            if (strarray.counter <= 2) {
                array.splice(i, 1);
                continue;
            }

            array[i] = strarray.direction;

            i += 1;
        }

        i = 0;
        while (i <= array.length - 1) {
            if (i + 1 <= array.length - 1) {
                if (array[i] == array[i + 1]) {
                    array.splice(i + 1, 1);
                }
            }
            i += 1;
        }

    }

    calculateDirection(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);

        if (angle < 0) {
            angle += 360;
        }
        let direction = '';
        if (angle >= 345 || angle <= 15) {
            direction = 'right';
        }
        else if (angle >= 30 && angle < 60) {
            direction = 'rightdown';
        }
        else if (angle >= 75 && angle < 105) {
            direction = 'down';
        }
        else if (angle >= 120 && angle < 150) {
            direction = 'leftdown';
        }
        else if (angle >= 165 && angle < 195) {
            direction = 'left';
        }
        else if (angle >= 210 && angle < 240) {
            direction = 'leftup';
        }
        else if (angle >= 255 && angle < 285) {
            direction = 'up';
        }
        else if (angle >= 300 && angle < 330) {
            direction = 'rightup';
        }

        return direction;
    }

    open(spell) {

        if (spell == NaN) {
            return;
        }

        this.spell = spell;
        this.exemple = this.spell.exemple;
        this.clearExemple()
        for (let i in this.spell.spelldata) {
            this.spelldata.push({ 'data': this.spell.spelldata[i], 'Done': false })
        }
        let xsize = windowInnerWidth - 310;
        let ysize = windowInnerHeight - 310;
        this.resultDraw.lineStyle(5, 0x000000);
        this.graphics.fillStyle(0x000000, 0.2);
        this.graphics.fillRect(xsize, ysize, 300, 300);
        this.exempleGraph.lineStyle(7, 0x0000ff);
        this.drawGraph.lineStyle(5, 0x0000ff);
        this.ClsdBtn.visible = true;
        this.ClsdBtn.setPosition(xsize + 300 - 10, ysize - 10)
        this.zone.visible = true;
        this.castopen = true;

        for (let i in spells) {
            spells[i].sprite.visible = false;
        }

        this.exemplestep = Date.now();


    }

    close() {
        this.clearExemple()
        this.spell = null;
        this.ClsdBtn.visible = false;
        this.resultDraw.clear();
        this.graphics.clear();
        this.exempleGraph.clear()
        this.drawGraph.clear();
        this.zone.visible = false;
        this.spelldata = [];
        this.castopen = false
        for (let i in spells) {
            spells[i].sprite.visible = true;
        }
        this.exemple = [];
    }
}

class Spell {
    constructor(data, Width, Height) {
        this.id = data.id;
        this.damage = data.damage;
        this.mp = data.mp;
        this.cooldown = data.cooldown;
        this.distance = data.distance;
        this.sprite = scene_SpellsFrames.add.sprite(Width, Height, data.sprite).setInteractive();
        this.spelldata = data.spelldata;
        this.exemple = data.exemple;
        this.lastattack = 0;
        this.mparr = scene_main.sound.add('mparr');
        this.distancearr = scene_main.sound.add('distancearr');
        this.targetarr = scene_main.sound.add('targetarr');
    }

    use() {

        player.mp -= this.mp;
        player.target.hp -= this.damage;
        this.lastattack = Date.now();

        if (player.target.hp <= 0) {
            player.addXp(player.target.xp);
            player.target = null;
        }
        else if (player.target.target == null) {
            player.target.target = player;
        }

    }

    check() {


        if (Date.now() - this.lastattack <= this.cooldown) {
            return false;
        }

        if (player.target == null) {
            this.targetarr.play();
            return;
        }

        if (player.mp < this.mp) {
            this.mparr.play();
            return false;
        }

        let distance = Math.sqrt((player.sprite.x - player.target.sprite.x) ** 2 + (player.sprite.y - player.target.sprite.y) ** 2);

        if (distance > this.distance) {
            this.distancearr.play();
            return false;
        }

        return true;

    }

}

class BagFrame extends Phaser.Scene {

    create() {
        scene_BagFrame = this;

        this.dragobg = null;
        this.bagisopen = false;
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_BagFrame.closebag()
        });

        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            obj.setPosition(dragX, dragY);
            scene_BagFrame.dragobg = obj;
        });

        this.input.on('pointerup', function (pointer, obj) {
            if (obj.length == 0) {
                return;
            }
            let dragobg = scene_BagFrame.dragobg;
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
                    dragitem.sprite.setPosition(dragcell.x, dragcell.y);
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

    openbag() {

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
                        scene_BagFrame.input.setDraggable(item.sprite);
                    }
                    item.sprite.visible = true;
                }
                item.sprite.setPosition(bagcell.x, bagcell.y);

            }

        }

        this.bagisopen = true;

    }

    closebag() {

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

        this.bagisopen = false;

    }

}

class DropFrame extends Phaser.Scene {

    create() {

        scene_DropFrame = this;

        this.drop = null;
        this.dropisopen = false;
        this.graphicsdrop = this.add.graphics();
        this.dropisrendered = false;
        this.ClsdBtndrop = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'ClsdBtn').setInteractive();
        this.ClsdBtndrop.visible = false;
        this.ClsdBtndrop.on('pointerdown', function (pointer, gameObject) {
            scene_DropFrame.closedrop();
        });

        this.input.on('pointerdown', function (pointer, gameObject) {
            if (!gameObject.length || scene_DropFrame.drop == null) {
                return;
            }

            for (let i in scene_DropFrame.drop.loot) {
                let loot = scene_DropFrame.drop.loot[i];
                if (loot.item.sprite == gameObject[0]) {
                    for (let bi in player.bag) {
                        if (player.bag[bi].item == null) {
                            player.bag[bi].item = loot.item;
                            player.bag[bi].quantity = loot.quantity;
                            loot.item.sprite.destroy();
                            loot.item.sprite = null;
                            scene_DropFrame.drop.loot.splice(i, 1);
                            if (!scene_DropFrame.drop.loot.length) {
                                let drop = scene_DropFrame.drop;
                                for (let di in drops) {
                                    if (drop.sprite == drops[di].sprite) {
                                        drops.splice(di, 1);
                                        drop.sprite.destroy();
                                        scene_DropFrame.closedrop();
                                    }
                                }
                            }
                            return;
                        }
                    }
                }
            }
        });

    }


    opendrop() {

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
                item.sprite.setPosition(bagcellx, bagcelly);
            }

        }

        this.dropisopen = true;

    }

    closedrop() {

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
        this.dropisopen = false;

    }

}

class UI extends Phaser.Scene {

    preload() {
        this.load.image('Bag', 'assets/Bag.png')
    }

    create() {


        let bag = this.add.sprite(windowInnerWidth - 150, windowInnerHeight - 70, 'Bag').setInteractive();
        bag.on('pointerdown', function (pointer, gameObject) {

            if (scene_BagFrame.bagisopen) {
                scene_BagFrame.closebag()
            }
            else {
                scene_BagFrame.openbag()
            }

        });

    }

    update(p1, p2) {

    }
}

class NpcDialoge extends Phaser.Scene {

    create() {

        scene_NpcDialoge = this;

        this.frameopen = true;

        this.content = [
            'The sky above the port was the color of television, tuned to a dead channel.',
            '`It\'s not like I\'m using,\' Case heard someone say, as he shouldered his way ',
            'through the crowd around the door of the Chat. `It\'s like my body\'s developed',
            'this massive drug deficiency.\' It was a Sprawl voice and a Sprawl joke.',
            'The Chatsubo was a bar for professional expatriates; you could drink there for',
            'a week and never hear two words in Japanese.',
            '',
            'Ratz was tending bar, his prosthetic arm jerking monotonously as he filled a tray',
            'of glasses with draft Kirin. He saw Case and smiled, his teeth a webwork of',
            'East European steel and brown decay. Case found a place at the bar, between the',
            'unlikely tan on one of Lonny Zone\'s whores and the crisp naval uniform of a tall',
            'African whose cheekbones were ridged with precise rows of tribal scars. `Wage was',
            'in here early, with two joeboys,\' Ratz said, shoving a draft across the bar with',
            'his good hand. `Maybe some business with you, Case?\'',
            '',
            'Case shrugged. The girl to his right giggled and nudged him.',
            'The bartender\'s smile widened. His ugliness was the stuff of legend. In an age of',
            'affordable beauty, there was something heraldic about his lack of it. The antique',
            'arm whined as he reached for another mug.',
            '',
            '',
            'From Neuromancer by William Gibson'
        ];

        this.gf = this.add.graphics();

        this.gf.fillStyle(0x000000)
        this.gf.fillRect(152, 133, 320, 250);

        this.ClsdBtndrop = this.add.sprite(465, 125, 'ClsdBtn').setInteractive();
        this.ClsdBtndrop.on('pointerdown', function (pointer, gameObject) {
            scene_NpcDialoge.closedialoge();
            player.target = null;
        });

        this.graphics = this.make.graphics();
        this.graphics.fillRect(152, 133, 320, 250);

        this.mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);

        this.text = this.add.text(160, 140, this.content, { fontFamily: 'Arial', color: '#00ff00', wordWrap: { width: 310 } }).setOrigin(0);

        this.text.setMask(this.mask);

        //  The rectangle they can 'drag' within
        this.zone = this.add.zone(152, 130, 320, 256).setOrigin(0).setInteractive();

        this.zone.on('pointermove', pointer => {

            if (pointer.isDown) {
                scene_NpcDialoge.text.y += (pointer.velocity.y / 2);

                scene_NpcDialoge.text.y = Phaser.Math.Clamp(this.text.y, -400, 300);
            }

        });

        this.closedialoge()
    }

    opendialoge() {

        this.gf.fillStyle(0x000000)
        this.gf.fillRect(152, 133, 320, 250);
        this.ClsdBtndrop.visible = true;
        this.mask.visible = true;
        this.text.visible = true;
        this.zone.visible = true;
        this.frameopen = true;

    }

    closedialoge() {

        this.gf.clear();
        this.ClsdBtndrop.visible = false;
        this.mask.visible = false;
        this.text.visible = false;
        this.zone.visible = false;
        this.frameopen = false;

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
        this.load.spritesheet('Female1', 'assets/NPC/Female1.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Female2', 'assets/NPC/Female2.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Male1', 'assets/NPC/Male1.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Male2', 'assets/NPC/Male2.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Male3', 'assets/NPC/Male3.png', { frameWidth: 32, frameHeight: 48 });

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

        this.load.image('spell1', 'assets/spell1.png');
        this.load.image('spell2', 'assets/spell2.png');
        this.load.image('spell3', 'assets/spell3.png');
        this.load.image('spell4', 'assets/spell4.png');

        this.load.audio('mparr', 'assets/mp.m4a');
        this.load.audio('distancearr', 'assets/distance.m4a');
        this.load.audio('targetarr', 'assets/targetarr.m4a');


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

        this.anims.create({
            key: 'f1turn',
            frames: [{ key: 'Female1', frame: 15 }],
            frameRate: 1
        });

        this.anims.create({
            key: 'f2turn',
            frames: [{ key: 'Female2', frame: 15 }],
            frameRate: 1
        });

        this.anims.create({
            key: 'm1turn',
            frames: [{ key: 'Male1', frame: 15 }],
            frameRate: 1
        });

        this.anims.create({
            key: 'm2turn',
            frames: [{ key: 'Male2', frame: 15 }],
            frameRate: 1
        });

        this.anims.create({
            key: 'm3turn',
            frames: [{ key: 'Male3', frame: 15 }],
            frameRate: 1
        });


        cursors = this.input.keyboard.createCursorKeys();

        bombs = this.physics.add.group();

        this.input.on('pointerdown', function (pointer, gameObject) {

            if (gameObject.length) {

                for (let i in drops) {
                    let element = drops[i];
                    if (element.sprite == gameObject[0]) {
                        scene_DropFrame.drop = element;
                        if (!scene_DropFrame.dropisopen) {
                            scene_DropFrame.opendrop();
                        }
                        return
                    }
                }

                for (let i in mobs) {
                    let mobelement = mobs[i];
                    if (mobelement.sprite == gameObject[0]) {
                        player.target = mobelement;
                        return
                    }
                }

                for (let i in npcs) {
                    let npcelement = npcs[i];
                    if (npcelement.sprite == gameObject[0]) {
                        if (player.target == npcelement) {
                            if (!scene_NpcDialoge.frameopen) {
                                scene_NpcDialoge.opendialoge()
                            }
                            console.log('он показывал пиструн');
                        }
                        else {
                            player.target = npcelement;
                        }
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
            else {
                player.target = null;
            }

        });

        let playerdata = {
            id: client_id,
            x: 500,
            y: 500
        }
        createplayer(playerdata);

        if (false) {

            // ws = new WebSocket(`ws://192.168.0.10:8000/ws/${client_id}`);
            // ws.onmessage = function (event) {

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
            else if (data.cmd == 'CreateNPC') {
                CreateNPC(data);
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

        for (let i in mobsdata) {
            createMob(mobsdata[i]);

        }

        for (let i in npcsdata) {
            CreateNPC(npcsdata[i]);
        }


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
        if (mob.uid == data.uid) {
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
                let drop = new Drop(scene_main.physics.add.sprite(resplootx, resplooty, 'Chest').setInteractive());
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
            if (mob.uid == data.target) {
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
        if (mob.uid == data.uid) {
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
    player = new Player(scene_main.physics.add.sprite(data.x, data.y, 'dude').setScale(2));
    player.id = client_id;
    player.x = data.x;
    player.y = data.y;

    // for (let i in data.spells) {
    //     let spelldata = data.spells[i];
    //     if (spelldata.cell == 1) {
    //         player.spell1 = new Spell(spelldata);
    //     }
    //     else if (spelldata.cell == 2) {
    //         player.spell2 = new Spell(spelldata);
    //     }
    //     else if (spelldata.cell == 3) {
    //         player.spell3 = new Spell(spelldata);
    //     }
    // }

    player.sprite.anims.play('turn');

    players.push(player)

    // let inf = {
    //     'cmd': 'NewPlayer',
    //     'id': client_id,
    //     'x': player.x,
    //     'y': player.y
    // }
    // ws.send(JSON.stringify(inf))

    for (let i in player.bag) {
        player.bag[i] = new BagCell()
        player.bag[i].index = i;
    }

    scene_main.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
    scene_main.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
    scene_main.cameras.main.startFollow(player.sprite);
    scene_main.scene.add('PlayerFrame', PlayerFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('XPBar', XPBar, true, { x: 400, y: 300 });
    scene_main.scene.add('UI', UI, true, { x: 400, y: 300 });
    scene_main.scene.add('BagFrame', BagFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('Joystick', Joystick, true, { x: 400, y: 300 });
    scene_main.scene.add('DropFrame', DropFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('SpellsFrames', SpellsFrames, true, { x: 400, y: 300 });
    scene_main.scene.add('TargetFrame', TargetFrame, true, { x: 400, y: 300 })
    scene_main.scene.add('NpcDialoge', NpcDialoge, true, { x: 400, y: 300 })
    scene_main.scene.add('CastFrame', CastFrame, true, { x: 400, y: 300 });

    game.input.addPointer(1);

}

function addPlayer(data) {

    let newplayer = new Player(scene_main.physics.add.sprite(data.x, data.y, 'dude').setScale(2));
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

function CreateNPC(data) {
    let npc = new NPC(data)
    npcs.push(npc)
}

function setMobParameters(data) {

    for (let i in mobs) {
        let mobelement = mobs[i];
        if (mobelement.uid == data.uid) {
            mobelement.status = mobStatus[data.status]
            if (data.target == null) {
                mobelement.target = null;
            }
            else {
                for (let i in players) {
                    let playelement = players[i];
                    if (playelement.id == data.target) {
                        mobelement.target = playelement;
                        break
                    }
                }
            }
            return

        }
    }

}

var app = {
    width: 0,
    height: 0
}

let config = {
    type: Phaser.AUTO,
    width: windowInnerWidth,       // Стартовая ширина канваса  
    height: windowInnerHeight,     // Стартовая высота канваса
    virtualWidth: windowInnerWidth,             // Ширина проекта
    virtualHeight: windowInnerHeight,             // Высота проекта   
    orientation: 'landscape',       // Ориентация проекта: landscape или portrait
    backgroundColor: 0xff0000,      // Чистый цвет
    banner: false,                  // Cкрыть банер из консоли
    antialias: true,                // Сглаживание
    // disableContextMenu: true,       // Отключить меню по правому клику
    autoMobilePipeline: true,       // Оптимизация для мобильных устрйств
    resolution: 1,
    pixelArt: true,
    autoRound: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },              // Размеры холста в целых числах
    scene: MainScene                  // Сцена
}

var game = new Phaser.Game(config);

game.onResize = function () {

    // let size;

    // this.scale.resize(window.innerWidth, window.innerHeight);
    // this.scale.refresh();

    // if (config.orientation == "landscape") {
    //     size = config.virtualWidth

    // }else if (config.orientation == "portrait"){
    //     size = config.virtualHeight
    // }

    // if (window.innerWidth > window.innerHeight){
    //     this.renderer.projectionWidth = size * window.innerWidth/window.innerHeight;
    // 	this.renderer.projectionHeight = size;
    // }else{
    //     this.renderer.projectionWidth = size;
    // 	this.renderer.projectionHeight = size * window.innerHeight/window.innerWidth;
    // }

    // // Актуальные внутренние размеры игры
    // app.width = this.renderer.projectionWidth
    // app.height = this.renderer.projectionHeight

    // // Проходимся по всем объектам сцены
    // this.scene.scenes.forEach(function(scene) {
    //     scene.children.list.forEach(function(child) {
    //         if (typeof child.onResize === 'function') {
    //             child.onResize();
    //         }
    //     });
    // });

}

window.addEventListener("resize", game.onResize.bind(game), false)