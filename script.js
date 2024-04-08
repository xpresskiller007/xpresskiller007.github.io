const windowInnerWidth = window.innerWidth;
const windowInnerHeight = window.innerHeight;


var client_id = Date.now()


const mobStatus = { Chase: 'Chase', Attack: 'Attack', Revert: 'Revert', Expectation: 'Expectation', Dead: 'Dead', Respawn: 'Respawn' }
const targetType = { Player: 'Player', Mob: 'Mob', NPC: 'NPC' }
const playerStatus = { Traveling: 'Traveling', Death: 'Dead', Respawn: 'Respawn', Battle: 'Battle' }
const itemType = { Runestone: 'Runestone', Equipment: 'Equipment', Meal: 'Meal', Drink: 'Drink' };
const questuslovie = { Kill: 'Kill', Sbor: 'Sbor' };
const dialogePage = { Main: 'Main', QuestsList: 'QuestsList', QuestsElementList: 'QuestsElementList' };
const equipType = {};
var player;
var players = [];
var bombs;
var mobs = [];
var npcs = [];
var drops = [];

var mobsdata = [
    { "uid": 1, "id": 2, "skin": "bomb", "name": "Чушпан", "hp": 50, "maxhp": 50, "mp": 30, "maxmp": 30, "x": 100, "y": 100, "respx": 100, "respy": 100, "status": "Expectation", "lvl": 1, xp: 25 },
    { "uid": 2, "id": 2, "skin": "bomb", "name": "Чушпан", "hp": 50, "maxhp": 50, "mp": 30, "maxmp": 30, "x": 200, "y": 100, "respx": 200, "respy": 100, "status": "Expectation", "lvl": 1, xp: 25 },
    { "uid": 3, "id": 3, "skin": "bomb", "name": "Чущпенсел", "hp": 70, "maxhp": 70, "mp": 30, "maxmp": 30, "x": 300, "y": 100, "respx": 300, "respy": 100, "status": "Expectation", "lvl": 2, xp: 50 },
    { "uid": 4, "id": 4, "skin": "bomb", "name": "Чушпанище", "hp": 100, "maxhp": 100, "mp": 30, "maxmp": 30, "x": 400, "y": 100, "respx": 400, "respy": 100, "status": "Expectation", "lvl": 3, xp: 75 }
];

var npcsdata = [
    { "id": 6, "skin": "Female1", "name": "Female1", phrases: ['Ну здравстуй чушпан', 'Ну здравстуй чушпенсел', 'Ну здравстуй чушпанище'], "respx": 900, "respy": 100 },
    { "id": 7, "skin": "Female2", "name": "Female2", phrases: ['Ну здравстуй чушпан', 'Ну здравстуй чушпенсел', 'Ну здравстуй чушпанище'], "respx": 1000, "respy": 100 },
    { "id": 8, "skin": "Male1", "name": "Male1", phrases: ['Ну здравстуй чушпан', 'Ну здравстуй чушпенсел', 'Ну здравстуй чушпанище'], "respx": 1100, "respy": 100 },
    { "id": 9, "skin": "Male2", "name": "Male2", phrases: ['Ну здравстуй чушпан', 'Ну здравстуй чушпенсел', 'Ну здравстуй чушпанище'], "respx": 1200, "respy": 100 },
    { "id": 10, "skin": "Male3", "name": "Male3", phrases: ['Ну здравстуй чушпан', 'Ну здравстуй чушпенсел', 'Ну здравстуй чушпанище'], "respx": 1300, "respy": 100 }
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
var scene_CastFrame;
var scene_XpBar;
var scene_CharFrame;
var scene_RunesTableFrame;
var scene_ItemsSprites;
var scene_MagicBook;
var scene_SpellItemInfo;

var spellsdata = [];
var spells = [];

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
spellsdata.push({ 'id': 1, damage: 20, mp: 5, cooldown: 0, distance: 300, 'image': 'spell1', 'spelldata': [['rightup', 'left', 'rightdown'], ['up']], exemple: exemp })

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
spellsdata.push({ 'id': 2, damage: 40, mp: 10, cooldown: 2000, distance: 300, 'image': 'spell2', 'spelldata': [['leftdown', 'right', 'leftup'], ['up']], exemple: exemp })

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
spellsdata.push({ 'id': 3, damage: 60, mp: 15, cooldown: 3000, distance: 300, 'image': 'spell3', 'spelldata': [['leftdown', 'right', 'leftdown'], ['up']], exemple: exemp })

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
spellsdata.push({ 'id': 4, damage: 100, mp: 25, cooldown: 5000, distance: 300, 'image': 'spell4', 'spelldata': [['leftdown', 'rightdown', 'rightup', 'leftup'], ['up']], exemple: exemp })


var loot = []

loot.push({
    'item': { id: 1, name: 'Apple', description: ['Вроде яблоко', 'Но не уверен', '', , 'Проверка отступа'], image: 'Apple', itemtype: itemType.Meal, equiptype: null, spell: null, stack: true, stacksize: 20 },
    'quantity': 1,
    'chance': 100
})

loot.push({
    'item': { id: 2, name: 'Bread', description: ['Просто хлебушек', 'Жрать низя'], image: 'Bread', itemtype: itemType.Meal, equiptype: null, spell: null, stack: true, stacksize: 20 },
    'quantity': 1,
    'chance': 90
})

loot.push({
    'item': { id: 3, name: 'Cheese', description: ['Сырок'], image: 'Cheese', itemtype: itemType.Meal, equiptype: null, spell: null, stack: true, stacksize: 10 },
    'quantity': 1,
    'chance': 80
})

loot.push({
    'item': { id: 4, name: 'Ham', description: ['Окорок'], image: 'Ham', itemtype: itemType.Meal, equiptype: null, spell: null, stack: true, stacksize: 5 },
    'quantity': 1,
    'chance': 70
})

loot.push({
    'item': { id: 5, name: 'Mushroom', description: ['Гриб'], image: 'Mushroom', itemtype: itemType.Meal, equiptype: null, spell: null, stack: true, stacksize: 3 },
    'quantity': 1,
    'chance': 50
})

loot.push({
    'item': { id: 6, name: 'Wine', description: ['Винишка много не бывает'], image: 'Wine', itemtype: itemType.Drink, equiptype: null, spell: null, stack: false, stacksize: 0 },
    'quantity': 1,
    'chance': 25
})

loot.push({
    'item': { id: 7, name: 'Beer', description: ['Жидкое злато'], image: 'Beer', itemtype: itemType.Drink, equiptype: null, spell: null, stack: false, stacksize: 0 },
    'quantity': 1,
    'chance': 10
})

loot.push({
    'item': { id: 8, name: 'spell2', description: ['Рунный камушек второго скила', 'Вставлять в таблицу камней'], image: 'spell2', itemtype: itemType.Runestone, equiptype: null, spell: 2, stack: false, stacksize: 0 },
    'quantity': 1,
    'chance': 40
})

loot.push({
    'item': { id: 9, name: 'spell3', description: ['Рунный камушек третьего скила', 'Вставлять в таблицу камней'], image: 'spell3', itemtype: itemType.Runestone, equiptype: null, spell: 3, stack: false, stacksize: 0 },
    'quantity': 1,
    'chance': 20
})

loot.push({
    'item': { id: 10, name: 'spell4', description: ['Рунный камушек четвертого скила', 'Вставлять в таблицу камней'], image: 'spell4', itemtype: itemType.Runestone, equiptype: null, spell: 3, stack: false, stacksize: 0 },
    'quantity': 1,
    'chance': 10
})

var questdata = [];

questdata.push({
    id: 0,
    name: 'Гаси чушпанов',
    description: 'Надо убить 5 чушпанов',
    condition: [{ condition: questuslovie.Kill, target: 2, quantity: 2 }],
    outstanding: 6,
    recipient: 7,
    chain: null,
    done: false
});

var lvldata = { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600, 7: 700, 8: 800, 9: 900, 10: 0 };

class Quest {

    constructor(data) {

        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.condition = [];
        this.outstanding = data.outstanding;
        this.recipient = data.recipient;
        this.done = data.done;

        this.addCondition(data.condition)

    }

    addCondition(conditiondata) {
        for (let i in conditiondata) {
            this.condition.push(new Condition(conditiondata[i]));
        }
    }

}

class Condition {

    constructor(data) {
        this.condition = data.condition;
        this.target = data.target;
        this.quantity = data.quantity;
    }

}

class Player {

    constructor(sprite) {
        this.id = 0;
        this.status = playerStatus.Traveling;
        this.sprite = sprite;
        this.thisplayer = true;
        this.type = targetType.Player
        this.name = String(client_id);
        this.lvl = 1;
        this.xp = 0;
        this.performancepoints = 10;
        this.stamina = 0;
        this.intellect = 0;
        this.fortitude = 0;
        this.skill = 0;
        this.luck = 0;
        this.hp = 50;
        this.maxhp = 50;
        this.mp = 50;
        this.maxmp = 50;
        this.magicpower = 0;
        this.lastrecovery = 0;
        this.healthrecovery = 0;
        this.manarecovery = 0;
        this.speed = 150;
        this.target = null;
        this.x = this.sprite.x;
        this.y = this.sprite.y;
        this.respx = 800;
        this.respy = 800;
        this.quests = [];
        this.runestones = [null, null, null, null];
        this.panel = [null, null, null, null,
            null, null, null, null,
            null, null, null, null,
            null, null, null, null];
        this.bag = [null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null];
        this.lastsetstatus = 0;
        this.deathtime = 0;
        this.respawntime = 5000;
        this.recalculateParameters();
    }

    recalculateParameters() {

        this.maxhp = 50 + this.stamina * 10;
        this.maxmp = 50 + this.intellect * 10;
        this.magicpower = this.intellect * 2;

        this.healthrecovery = this.fortitude;
        this.manarecovery = this.fortitude;



    }

    hpmpcovery() {

        if (Date.now() - this.lastrecovery > 1000) {
            this.lastrecovery = Date.now();
            if (this.hp < this.maxhp && this.status == playerStatus.Traveling) {
                this.hp += this.fortitude;
                if (this.hp > this.maxhp) {
                    this.hp = this.maxhp;
                }
            }
            if (this.mp < this.maxmp) {
                let manarecovery = this.fortitude;
                if (this.status == playerStatus.Battle) {
                    manarecovery = Math.floor(manarecovery / 2);
                }
                this.mp += manarecovery;
                if (this.mp > this.maxmp) {
                    this.mp = this.maxmp;
                }
            }
        }


    }

    update() {

        this.moving();
        this.setStatus();
        this.hpmpcovery();
        this.respawn();
    }

    setStatus() {

        if (this.hp <= 0 && this.status != playerStatus.Death && this.status != playerStatus.Respawn) {
            this.status = playerStatus.Death;
            this.deathtime = Date.now();
            this.sprite.visible = false;
            scene_BagFrame.closebag();
            scene_CastFrame.close()
            return;
        }

        if (this.status == playerStatus.Death && Date.now() - this.deathtime > this.respawntime && this.status != playerStatus.Respawn) {
            this.status = playerStatus.Respawn;
        }

        if (this.status == playerStatus.Death
            || this.status == playerStatus.Respawn) {
            return;
        }

        if (Date.now() - this.lastsetstatus > 5000) {

            let statusattack = false;

            for (let i in mobs) {
                let mob = mobs[i];
                if (mob.target == this) {
                    statusattack = true;
                    break;
                }
            }

            if (statusattack) {
                this.status = playerStatus.Battle;
            }
            else {
                this.status = playerStatus.Traveling;
            }

            this.lastsetstatus = Date.now();

        }

    }

    moving() {

        if (this.status == playerStatus.Death) {
            return;
        }

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
        if (this.status == playerStatus.Respawn) {
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
            this.sprite.setPosition(this.respx, this.respy);
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            this.hp = this.maxhp;
            this.mp = this.maxmp;
            this.sprite.visible = true;
            this.status = playerStatus.Traveling
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
                this.performancepoints += 10;
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
        this.timeattack = 3000;//мсек
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
            player.hp -= this.damage;
            player.status = playerStatus.Battle;
            this.lastattack = Date.now();
            if (player.target == null) {
                player.target = this;
            }
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
                        'item': new Item(item),
                        'quantity': element.quantity
                    }
                )
            }

        }

        if (drop.length) {
            let Chest = new Drop(scene_main.physics.add.sprite(resplootx, resplooty, 'Chest').setInteractive());
            Chest.loot = drop;
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

        this.phrases = data.phrases;

        this.quests = [];
    }

}

class Item {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.image = data.image;
        this.sprite = null;
        this.itemtype = data.itemtype;
        this.equiptype = data.equiptype;
        this.spell = data.spell;
        this.stack = data.stack;
        this.stacksize = data.stacksize;

        if (this.spell) {
            for (let i in spells) {
                if (spells[i].id == this.spell) {
                    this.spell = spells[i];
                    break;
                }
            }
        }
    }
}

class Drop {
    constructor(sprite) {
        this.sprite = sprite;
        this.loot = [];
    }
}

class itemCell {
    constructor(itemtype, equiptype) {
        this.index = 0;
        this.x = 0;
        this.y = 0;
        this.item = null;
        this.itemtype = itemtype;
        this.equiptype = equiptype;
        this.quantity = 0;
        this.quantitytext = null;
    }
}

class XPBar extends Phaser.Scene {

    create() {
        scene_XpBar = this;
        this.xpbar = this.add.graphics();
        this.updatexpbar();
    }

    updatexpbar() {
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

class ItemsSprites extends Phaser.Scene {

    create() {
        scene_ItemsSprites = this;

        this.dragobg = null;

        this.input.on('drag', (pointer, obj, dragX, dragY) => {

            if (!scene_MagicBook.isopen && !scene_BagFrame.isopen && !scene_RunesTableFrame.isopen) {
                scene_ItemsSprites.dragobg = null;
                return;
            }

            if (scene_MagicBook.isopen) {
                if (scene_ItemsSprites.dragobg == null) {

                    scene_ItemsSprites.dragobg = obj;
                    for (let i in player.runestones) {
                        let item = player.runestones[i].item;
                        if (item == null) {
                            continue;
                        }
                        if (item.sprite == obj) {
                            if (item.spell.sprite == null) {
                                item.spell.sprite = scene_ItemsSprites.add.sprite(obj.x, obj.y, item.spell.image).setInteractive();
                                scene_ItemsSprites.input.setDraggable(item.spell.sprite);
                            }
                            else {
                                if (scene_SpellItemInfo.isopen) {
                                    scene_SpellItemInfo.close();
                                }
                                scene_SpellItemInfo.open(item);
                                obj.setPosition(player.runestones[i].x, player.runestones[i].y);
                                scene_ItemsSprites.dragobg = null;
                                return;
                            }
                            break;
                        }
                    }
                }
                obj.setPosition(dragX, dragY);
            }
            else {

                scene_ItemsSprites.dragobg = obj;
                obj.setPosition(dragX, dragY);
            }
        });

        this.input.on('pointerup', function (pointer, obj) {

            if (obj.length == 0 || scene_ItemsSprites.dragobg == null) {
                return;
            }

            let dragobg = scene_ItemsSprites.dragobg;
            scene_ItemsSprites.dragobg = null;

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
                scene_ItemsSprites.bagitem(dragcell, dragitem);
                return;
            }

            for (let i in player.runestones) {
                if (player.runestones[i].item != null) {
                    if (player.runestones[i].item.sprite == dragobg) {
                        dragcell = player.runestones[i];
                        dragitem = dragcell.item;
                        break
                    }
                }
            }

            if (dragitem != null) {
                if (scene_MagicBook.isopen) {
                    scene_ItemsSprites.mbspell(dragitem);
                }
                else {
                    scene_ItemsSprites.runeitem(dragcell, dragitem);
                }
                return;
            }

            for (let i in player.panel) {

                if (player.panel[i].item == null) {
                    continue;
                }

                if (player.panel[i].item.spell == null) {
                    continue;
                }

                if (player.panel[i].item.spell.sprite == dragobg) {
                    dragcell = player.panel[i];
                    dragitem = dragcell.item;
                    break
                }

            }

            if (dragitem != null) {
                scene_ItemsSprites.dragobg = null;
                scene_ItemsSprites.spallpanel(dragcell, dragitem);
                return;
            }

            if (scene_BagFrame.isopen) {
                for (let i in player.bag) {
                    if (player.bag[i].item != null) {
                        if (player.bag[i].item.sprite == obj[0]) {
                            if (scene_SpellItemInfo.isopen) {
                                scene_SpellItemInfo.close();
                            }
                            scene_SpellItemInfo.open(player.bag[i]);
                            return
                        }
                    }
                }

            }


        });

        this.input.on('pointerdown', function (pointer, obj) {

            if (obj.length == 0 || scene_MagicBook.isopen) {
                return;
            }

            for (let i in player.panel) {

                let item = player.panel[i].item;
                if (item == null) {
                    continue;
                }

                if (item.spell.sprite == obj[0]) {

                    if (!item.spell.check()) {
                        return
                    }
                    if (scene_CastFrame.castopen) {
                        scene_CastFrame.close();
                    }
                    scene_CastFrame.open(item.spell);

                }
            }

        });
    }

    bagitem(dragcell, dragitem) {

        scene_ItemsSprites.dragobg = null;

        let distance = Math.sqrt((dragitem.sprite.x - dragcell.x) ** 2 + (dragitem.sprite.y - dragcell.y) ** 2);

        if (distance <= 3) {
            if (scene_SpellItemInfo.isopen) {
                scene_SpellItemInfo.close();
            }
            scene_SpellItemInfo.open(dragitem);
        }

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
            if (scene_RunesTableFrame.isopen) {
                for (let i in player.runestones) {
                    let replaceelement = player.runestones[i];
                    let replacedistance = Math.sqrt((dragitem.sprite.x - replaceelement.x) ** 2 + (dragitem.sprite.y - replaceelement.y) ** 2);
                    if (replacedistance <= 25) {
                        replacecell = replaceelement;
                        break;
                    }
                }
            }
            if (replacecell == null) {

                let centralpanelelement = player.bag[Math.floor(player.bag.length / 2)];

                distance = Math.sqrt((dragitem.sprite.x - centralpanelelement.x) ** 2 + (dragitem.sprite.y - centralpanelelement.y) ** 2);

                if (distance > 200) {
                    dragitem.sprite.destroy();
                    dragitem.sprite = null;
                    dragcell.item = null;
                    dragcell.quantity = 0;
                    if (dragcell.quantitytext != null) {
                        dragcell.quantitytext.destroy();
                        dragcell.quantitytext = null;
                    }
                }
                else {
                    dragitem.sprite.setPosition(dragcell.x, dragcell.y);
                }
            }
            else {
                if (dragitem.itemtype == itemType.Runestone) {
                    let replaceitem = replacecell.item;
                    replaceitem = replacecell.item;
                    replacecell.item = dragitem;
                    dragitem.sprite.setPosition(replacecell.x, replacecell.y);
                    dragcell.item = replaceitem;
                    if (replaceitem != null) {
                        replaceitem.sprite.setPosition(dragcell.x, dragcell.y);
                    }
                }
                else {
                    dragitem.sprite.setPosition(dragcell.x, dragcell.y);
                }
            }
        }
        else {

            let dragquantity = dragcell.quantity;
            let replacequantity = replacecell.quantity;

            let replaceitem = replacecell.item;
            replaceitem = replacecell.item;
            replacecell.item = dragitem;
            replacecell.quantity = dragquantity;
            dragitem.sprite.setPosition(replacecell.x, replacecell.y);
            dragcell.item = replaceitem;
            dragcell.quantity = replacequantity;
            if (replaceitem != null) {
                replaceitem.sprite.setPosition(dragcell.x, dragcell.y);
            }

            if (dragcell.quantity > 1) {
                if (dragcell.quantitytext != null) {
                    dragcell.quantitytext.destroy();
                }
                dragcell.quantitytext = scene_ItemsSprites.add.text(dragcell.x - 5, dragcell.y, dragcell.quantity, { fontSize: 'bold Arial', fontSize: 15, fill: 'white' });
                dragcell.quantitytext.setStroke('black', 5);

            }
            else {
                if (dragcell.quantitytext != null) {
                    dragcell.quantitytext.destroy();
                    dragcell.quantitytext = null;
                }
            }

            if (dragcell.quantity > 1) {
                if (dragcell.quantitytext != null) {
                    dragcell.quantitytext.destroy();
                }
                dragcell.quantitytext = scene_ItemsSprites.add.text(dragcell.x - 5, dragcell.y, dragcell.quantity, { fontSize: 'bold Arial', fontSize: 15, fill: 'white' });
                dragcell.quantitytext.setStroke('black', 5);

            }
            else {
                if (dragcell.quantitytext != null) {
                    dragcell.quantitytext.destroy();
                    dragcell.quantitytext = null;
                }
            }

            if (replacecell.quantity > 1) {
                if (replacecell.quantitytext != null) {
                    replacecell.quantitytext.destroy();
                }
                replacecell.quantitytext = scene_ItemsSprites.add.text(replacecell.x - 5, replacecell.y, replacecell.quantity, { fontSize: 'bold Arial', fontSize: 15, fill: 'white' });
                replacecell.quantitytext.setStroke('black', 5);

            }
            else {
                if (replacecell.quantitytext != null) {
                    replacecell.quantitytext.destroy();
                    replacecell.quantitytext = null;
                }
            }

        }

        scene_ItemsSprites.dragobg = null;

    }

    runeitem(dragcell, dragitem) {

        scene_ItemsSprites.dragobg = null;

        let distance = Math.sqrt((dragitem.sprite.x - dragcell.x) ** 2 + (dragitem.sprite.y - dragcell.y) ** 2);

        if (distance <= 3) {
            if (scene_SpellItemInfo.isopen) {
                scene_SpellItemInfo.close();
            }
            scene_SpellItemInfo.open(dragitem);
        }

        if (distance <= 25) {
            dragitem.sprite.setPosition(dragcell.x, dragcell.y);
            return
        }

        let replacecell = null;

        for (let i in player.runestones) {
            if (dragcell.index == i) {
                continue;
            }
            let replaceelement = player.runestones[i];
            let replacedistance = Math.sqrt((dragitem.sprite.x - replaceelement.x) ** 2 + (dragitem.sprite.y - replaceelement.y) ** 2);
            if (replacedistance <= 25) {
                replacecell = replaceelement;
                break;
            }
        }

        if (replacecell == null) {
            if (scene_BagFrame.isopen) {
                for (let i in player.bag) {
                    let replaceelement = player.bag[i];
                    let replacedistance = Math.sqrt((dragitem.sprite.x - replaceelement.x) ** 2 + (dragitem.sprite.y - replaceelement.y) ** 2);
                    if (replacedistance <= 25) {
                        replacecell = replaceelement;
                        break;
                    }
                }
            }
            if (replacecell == null) {
                dragitem.sprite.setPosition(dragcell.x, dragcell.y);
            }
            else {
                let replaceitem = replacecell.item;
                if (replaceitem != null) {
                    if (replaceitem.itemtype != itemType.Runestone) {
                        dragitem.sprite.setPosition(dragcell.x, dragcell.y);
                        return;
                    }
                }
                replaceitem = replacecell.item;
                replacecell.item = dragitem;
                dragitem.sprite.setPosition(replacecell.x, replacecell.y);
                dragcell.item = replaceitem;
                if (replaceitem != null) {
                    replaceitem.sprite.setPosition(dragcell.x, dragcell.y);
                }

            }
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

    mbspell(dragitem) {

        scene_ItemsSprites.dragobg = null;

        let distance = Math.sqrt((dragitem.sprite.x - 16 - dragitem.spell.sprite.x) ** 2 + (dragitem.sprite.y - 16 - dragitem.spell.sprite.y) ** 2);


        if (distance <= 25) {
            if (scene_SpellItemInfo.isopen) {
                scene_SpellItemInfo.close();
            }
            scene_SpellItemInfo.open(dragitem);
            dragitem.sprite.setPosition(dragitem.spell.sprite.x, dragitem.spell.sprite.y);
            dragitem.spell.sprite.destroy();
            dragitem.spell.sprite = null;
            return;
        }

        let replacecell = null;

        for (let i in player.panel) {
            let replaceelement = player.panel[i];
            let replacedistance = Math.sqrt((dragitem.sprite.x - 16 - replaceelement.x) ** 2 + (dragitem.sprite.y - 16 - replaceelement.y) ** 2);
            if (dragitem.index == i) {
                if (replacedistance <= 3) {
                    if (scene_SpellItemInfo.isopen) {
                        scene_SpellItemInfo.close();
                    }
                    scene_SpellItemInfo.open(dragitem);
                }
            }
            if (replacedistance <= 25) {
                replacecell = replaceelement;
                break;
            }
        }

        if (replacecell == null) {
            dragitem.sprite.setPosition(dragitem.spell.sprite.x, dragitem.spell.sprite.y);
            dragitem.spell.sprite.destroy();
            dragitem.spell.sprite = null;
        }
        else {

            dragitem.sprite.setPosition(dragitem.spell.sprite.x, dragitem.spell.sprite.y);
            dragitem.spell.sprite.setPosition(replacecell.x + 17, replacecell.y + 17);

            replacecell.item = dragitem;

        }

    }

    spallpanel(dragcell, dragitem) {

        scene_ItemsSprites.dragobg = null;

        let distance = Math.sqrt((dragitem.spell.sprite.x - 16 - dragcell.x) ** 2 + (dragitem.spell.sprite.y - 16 - dragcell.y) ** 2);

        if (distance <= 3) {
            if (scene_SpellItemInfo.isopen) {
                scene_SpellItemInfo.close();
            }
            scene_SpellItemInfo.open(dragitem);
        }

        if (distance <= 25) {
            dragitem.spell.sprite.setPosition(dragcell.x + 17, dragcell.y + 17);
            return
        }

        let replacecell = null;

        for (let i in player.panel) {
            if (dragcell.index == i) {
                continue;
            }
            let replaceelement = player.panel[i];
            let replacedistance = Math.sqrt((dragitem.spell.sprite.x - 16 - replaceelement.x) ** 2 + (dragitem.spell.sprite.y - 16 - replaceelement.y) ** 2);
            if (replacedistance <= 25) {
                replacecell = replaceelement;
                break;
            }
        }

        if (replacecell == null) {

            let centralpanelelement = player.panel[8];

            distance = Math.sqrt((dragitem.spell.sprite.x - 16 - centralpanelelement.x) ** 2 + (dragitem.spell.sprite.y - 16 - centralpanelelement.y) ** 2);

            if (distance > 100) {
                dragitem.spell.sprite.destroy();
                dragitem.spell.sprite = null;
                dragcell.item = null;
            }
            else {
                dragitem.spell.sprite.setPosition(dragcell.x + 17, dragcell.y + 17);
            }

        }
        else {

            let replaceitem = replacecell.item;
            replaceitem = replacecell.item;
            replacecell.item = dragitem;
            dragitem.spell.sprite.setPosition(replacecell.x + 17, replacecell.y + 17);
            dragcell.item = replaceitem;
            if (replaceitem != null) {
                replaceitem.spell.sprite.setPosition(dragcell.x + 17, dragcell.y + 17);
            }

        }

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
        try {

            if (player.target != null) {
                if (Math.sqrt((player.sprite.x - player.target.sprite.x) ** 2 + (player.sprite.y - player.target.sprite.y) ** 2) > 700) {
                    player.target = null;
                }
                if (player.target.type == targetType.NPC) {
                    if (Math.sqrt((player.sprite.x - player.target.sprite.x) ** 2 + (player.sprite.y - player.target.sprite.y) ** 2) > 200) {
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
        catch (err) {

        }


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

        if (player.status == playerStatus.Death
            || player.status == playerStatus.Respawn) {
            return;
        }

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

        for (let i in player.panel) {
            if (player.panel[i].item == null) {
                continue;
            }
            player.panel[i].item.spell.sprite.visible = false;
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
        for (let i in player.panel) {
            if (player.panel[i].item == null) {
                continue;
            }
            player.panel[i].item.spell.sprite.visible = true;
        }
        this.exemple = [];
    }
}

class Spell {
    constructor(data) {
        this.id = data.id;
        this.damage = data.damage;
        this.mp = data.mp;
        this.cooldown = data.cooldown;
        this.distance = data.distance;
        this.image = data.image;
        this.sprite = null;
        this.spelldata = data.spelldata;
        this.exemple = data.exemple;
        this.lastattack = 0;
        this.mparr = scene_main.sound.add('mparr');
        this.distancearr = scene_main.sound.add('distancearr');
        this.targetarr = scene_main.sound.add('targetarr');
    }

    use() {

        player.status = playerStatus.Battle;
        player.mp -= this.mp;
        player.target.hp -= this.damage + player.magicpower;
        this.lastattack = Date.now();

        if (player.target.hp <= 0) {
            player.addXp(player.target.xp);
            player.target = null;
            scene_XpBar.updatexpbar();
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

class CharFrame extends Phaser.Scene {

    create() {
        scene_CharFrame = this;

        this.dragobg = null;
        this.isopen = false;
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_CharFrame.close()
        });


        this.textperformancepoints = this.add.text(20, 140, 'Свободные очки', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.textperformancepoints.visible = false;

        this.textstamina = this.add.text(20, 170, 'Выносливость', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.textstamina.visible = false;

        this.textintellect = this.add.text(20, 200, 'Интелект', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.textintellect.visible = false;

        this.textfortitude = this.add.text(20, 230, 'Сила духа', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.textfortitude.visible = false;

        this.textskill = this.add.text(20, 260, 'Мастерство', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.textskill.visible = false;

        this.textluck = this.add.text(20, 290, 'Удача', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.textluck.visible = false;

        this.staminaplus = this.add.text(250, 170, '+', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.staminaplus.setInteractive();
        this.staminaplus.visible = false;
        this.staminaplus.on('pointerdown', function (pointer, gameObject) {
            if (player.performancepoints) {
                player.performancepoints -= 1;
                player.stamina += 1;
                player.recalculateParameters();
                scene_CharFrame.plusvisible(player.performancepoints > 0);
                scene_CharFrame.textperformancepoints.setText('Свободные очки: ' + player.performancepoints);
                scene_CharFrame.textstamina.setText('Выносливость: ' + player.stamina);
            }
        });

        this.intellectplus = this.add.text(250, 200, '+', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.intellectplus.setInteractive();
        this.intellectplus.visible = false;
        this.intellectplus.on('pointerdown', function (pointer, gameObject) {
            if (player.performancepoints) {
                player.performancepoints -= 1;
                player.intellect += 1;
                player.recalculateParameters();
                scene_CharFrame.plusvisible(player.performancepoints > 0);
                scene_CharFrame.textperformancepoints.setText('Свободные очки: ' + player.performancepoints);
                scene_CharFrame.textintellect.setText('Интелект: ' + player.intellect);
            }
        });

        this.fortitudeplus = this.add.text(250, 230, '+', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.fortitudeplus.setInteractive();
        this.fortitudeplus.visible = false;
        this.fortitudeplus.on('pointerdown', function (pointer, gameObject) {
            if (player.performancepoints) {
                player.performancepoints -= 1;
                player.fortitude += 1;
                player.recalculateParameters();
                scene_CharFrame.plusvisible(player.performancepoints > 0);
                scene_CharFrame.textperformancepoints.setText('Свободные очки: ' + player.performancepoints)
                scene_CharFrame.textfortitude.setText('Сила духа: ' + player.fortitude);
            }
        });

        this.skillplus = this.add.text(250, 260, '+', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.skillplus.setInteractive();
        this.skillplus.visible = false;
        this.skillplus.on('pointerdown', function (pointer, gameObject) {
            if (player.performancepoints) {
                player.performancepoints -= 1;
                player.skill += 1;
                player.recalculateParameters();
                scene_CharFrame.plusvisible(player.performancepoints > 0);
                scene_CharFrame.textperformancepoints.setText('Свободные очки: ' + player.performancepoints);
                scene_CharFrame.textskill.setText('Мастерство: ' + player.skill);
            }
        });

        this.luckplus = this.add.text(250, 290, '+', { fontFamily: 'Arial', fontSize: '25px', color: 'white' }).setOrigin(0);
        this.luckplus.setInteractive();
        this.luckplus.visible = false;
        this.luckplus.on('pointerdown', function (pointer, gameObject) {
            if (player.performancepoints) {
                player.performancepoints -= 1;
                player.luck += 1;
                player.recalculateParameters();
                scene_CharFrame.plusvisible(player.performancepoints > 0);
                scene_CharFrame.textperformancepoints.setText('Свободные очки: ' + player.performancepoints);
                scene_CharFrame.textluck.setText('Удача: ' + player.luck);
            }
        });

        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            // obj.setPosition(dragX, dragY);
            // scene_BagFrame.dragobg = obj;
        });

        this.input.on('pointerup', function (pointer, obj) {
            // if (obj.length == 0) {
            //     return;
            // }
            // let dragobg = scene_BagFrame.dragobg;
            // let dragcell = null;
            // let dragitem = null;
            // for (let i in player.bag) {
            //     if (player.bag[i].item != null) {
            //         if (player.bag[i].item.sprite == dragobg) {
            //             dragcell = player.bag[i];
            //             dragitem = dragcell.item;
            //             break
            //         }
            //     }
            // }

            // if (dragitem != null) {
            //     let distance = Math.sqrt((dragitem.sprite.x - dragcell.x) ** 2 + (dragitem.sprite.y - dragcell.y) ** 2);

            //     if (distance <= 25) {
            //         dragitem.sprite.setPosition(dragcell.x, dragcell.y);
            //         return
            //     }

            //     let replacecell = null;

            //     for (let i in player.bag) {
            //         if (dragcell.index == i) {
            //             continue;
            //         }
            //         let replaceelement = player.bag[i];
            //         let replacedistance = Math.sqrt((dragitem.sprite.x - replaceelement.x) ** 2 + (dragitem.sprite.y - replaceelement.y) ** 2);
            //         if (replacedistance <= 25) {
            //             replacecell = replaceelement;
            //             break;
            //         }
            //     }

            //     if (replacecell == null) {
            //         dragitem.sprite.setPosition(dragcell.x, dragcell.y);
            //     }
            //     else {

            //         let replaceitem = replacecell.item;
            //         replaceitem = replacecell.item;
            //         replacecell.item = dragitem;
            //         dragitem.sprite.setPosition(replacecell.x, replacecell.y);
            //         dragcell.item = replaceitem;
            //         if (replaceitem != null) {
            //             replaceitem.sprite.setPosition(dragcell.x, dragcell.y);
            //         }

            //     }
            // }

        });

    }

    open() {


        this.isopen = true;

        this.graphics.fillStyle(0x000000);
        this.graphics.fillRect(10, 20, 300, 300);

        this.ClsdBtn.visible = true;
        this.ClsdBtn.setPosition(300, 10);
        this.ClsdBtn.visible = true;

        this.textperformancepoints.setText('Свободные очки: ' + player.performancepoints)
        this.textperformancepoints.visible = true;

        this.textstamina.setText('Выносливость: ' + player.stamina)
        this.textstamina.visible = true;

        this.textintellect.setText('Интелект: ' + player.intellect)
        this.textintellect.visible = true;

        this.textfortitude.setText('Сила духа: ' + player.fortitude)
        this.textfortitude.visible = true;

        this.textskill.setText('Мастерство: ' + player.skill)
        this.textskill.visible = true;

        this.textluck.setText('Удача: ' + player.luck)
        this.textluck.visible = true;

        if (player.performancepoints) {

            this.staminaplus.visible = true;
            this.intellectplus.visible = true;
            this.fortitudeplus.visible = true;
            this.skillplus.visible = true;
            this.luckplus.visible = true;

        }



        return;

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

        this.isopen = true;

    }

    close() {

        this.isopen = false;

        this.graphics.clear();
        this.ClsdBtn.visible = false;

        this.textperformancepoints.visible = false;
        this.textstamina.visible = false;
        this.textintellect.visible = false;
        this.textfortitude.visible = false;
        this.textskill.visible = false;
        this.textluck.visible = false;

        this.staminaplus.visible = false;
        this.intellectplus.visible = false;
        this.fortitudeplus.visible = false;
        this.skillplus.visible = false;
        this.luckplus.visible = false;

        // for (let i in player.bag) {
        //     let item = player.bag[i].item;
        //     if (item != null) {
        //         if (item.sprite != null) {
        //             item.sprite.visible = false;
        //         }
        //     }
        // }

        // this.isopen = false;

    }

    plusvisible(visible) {

        this.staminaplus.visible = visible;
        this.intellectplus.visible = visible;
        this.fortitudeplus.visible = visible;
        this.skillplus.visible = visible;
        this.luckplus.visible = visible;

    }

}

class BagFrame extends Phaser.Scene {

    create() {
        scene_BagFrame = this;

        this.dragobg = null;
        this.isopen = false;
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_BagFrame.closebag()
        });

    }

    openbag() {

        if (player.status == playerStatus.Death
            || player.status == playerStatus.Respawn) {
            return;
        }

        let xsize = windowInnerWidth / 2 + 40;
        let ysize = 50;

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
                        item.sprite = scene_ItemsSprites.add.sprite(bagcell.x, bagcell.y, item.image).setInteractive();
                        scene_ItemsSprites.input.setDraggable(item.sprite);
                    }
                    item.sprite.visible = true;
                }
                item.sprite.setPosition(bagcell.x, bagcell.y);

                if (bagcell.quantity > 1) {
                    bagcell.quantitytext = scene_ItemsSprites.add.text(bagcell.x - 5, bagcell.y, bagcell.quantity, { fontSize: 'bold Arial', fontSize: 15, fill: 'white' });
                    bagcell.quantitytext.setStroke('black', 5);
                }

            }

        }

        this.isopen = true;

    }

    closebag() {

        this.graphics.clear();
        this.ClsdBtn.visible = false;
        for (let i in player.bag) {
            let bagcell = player.bag[i];
            if (bagcell.quantitytext != null) {
                bagcell.quantitytext.destroy();
                bagcell.quantitytext = null;
            }
            let item = bagcell.item;
            if (item != null) {
                if (item.sprite != null) {
                    item.sprite.visible = false;
                }
            }
        }

        this.isopen = false;

    }

}

class RunesTableFrame extends Phaser.Scene {

    create() {
        scene_RunesTableFrame = this;

        this.dragobg = null;
        this.isopen = false;
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_RunesTableFrame.close()
        });

    }

    open() {

        if (player.status == playerStatus.Death
            || player.status == playerStatus.Respawn) {
            return;
        }


        let xsize = 100;
        let ysize = 100;

        let columns = 2;

        let rows = 2;


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

        for (let i in player.runestones) {

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

            let bagcell = player.runestones[i];
            bagcell.x = cellxsize + 16;
            bagcell.y = cellysize + 16;
            let item = bagcell.item;
            if (item != null) {

                if (item.name != null) {
                    if (item.sprite == null) {
                        item.sprite = scene_ItemsSprites.add.sprite(bagcell.x, bagcell.y, item.image).setInteractive();
                        scene_ItemsSprites.input.setDraggable(item.sprite);
                    }
                    item.sprite.visible = true;
                }
                item.sprite.setPosition(bagcell.x, bagcell.y);

            }

        }

        this.isopen = true;

    }

    close() {

        this.graphics.clear();
        this.ClsdBtn.visible = false;
        for (let i in player.runestones) {
            let item = player.runestones[i].item;
            if (item != null) {
                if (item.sprite != null) {
                    item.sprite.visible = false;
                }
            }
        }

        this.isopen = false;

    }

}

class MagicBook extends Phaser.Scene {

    create() {
        scene_MagicBook = this;

        this.dragobg = null;
        this.isopen = false;
        this.graphics = this.add.graphics();
        this.ClsdBtn = this.add.sprite(windowInnerWidth - 50, windowInnerHeight - 200, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_MagicBook.close()
        });

    }

    open() {

        if (player.status == playerStatus.Death
            || player.status == playerStatus.Respawn) {
            return;
        }

        let xsize = 50;
        let ysize = 50;

        let columns = 5;

        let rows = 5;

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

        let ind = 0;

        let maxind = player.runestones.length - 1;

        let i = 0;

        while (ind <= 24) {

            if (ind == 0) {
                cellxsize = cellxsize + 5;
                cellysize = cellysize + 5;
            }
            else if (ind % columns == 0) {
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

            while (i <= maxind) {
                let bagcell = player.runestones[i];
                let item = bagcell.item;
                if (item != null) {

                    if (item.name != null) {
                        if (item.sprite == null) {
                            item.sprite = scene_ItemsSprites.add.sprite(cellxsize + 16, cellysize + 16, item.image).setInteractive();
                            scene_ItemsSprites.input.setDraggable(item.sprite);
                        }
                        item.sprite.visible = true;
                    }
                    item.sprite.setPosition(bagcell.x, bagcell.y);
                    i += 1;
                    break;

                }

                i += 1;
            }

            ind += 1;

        }

        this.graphics.fillStyle(0x000000, 0.5);
        for (let i in player.panel) {
            let panelcell = player.panel[i];
            this.graphics.fillRect(panelcell.x, panelcell.y, 36, 36);
        }

        scene_MagicBook.isopen = true;

    }

    close() {

        this.graphics.clear();
        this.ClsdBtn.visible = false;
        for (let i in player.runestones) {
            let item = player.runestones[i].item;
            if (item != null) {
                if (item.sprite != null) {
                    item.sprite.visible = false;
                }
            }
        }

        scene_MagicBook.isopen = false;

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
                    let firstEmptyCell = null;
                    for (let bi in player.bag) {

                        if (player.bag[bi].item == null) {
                            if (firstEmptyCell == null) {
                                firstEmptyCell = bi;
                            }
                            if (!loot.item.stack) {
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
                            else {
                                continue
                            }
                        }
                        if (!loot.item.stack) {
                            continue;
                        }
                        if (loot.quantity > 0 && player.bag[bi].item.id == loot.item.id
                            && player.bag[bi].quantity < player.bag[bi].item.stacksize) {
                            player.bag[bi].quantity += loot.quantity;
                            loot.quantity = 0;
                            if (player.bag[bi].quantity > player.bag[bi].item.stacksize) {
                                loot.quantity = player.bag[bi].quantity - player.bag[bi].item.stacksize;
                                player.bag[bi].quantity = player.bag[bi].item.stacksize;
                            }
                            if (loot.quantity == 0) {
                                loot.item.sprite.destroy();
                                loot.item.sprite = null;
                                loot.item = null;
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

                    if (firstEmptyCell != null) {
                        player.bag[firstEmptyCell].item = loot.item;
                        player.bag[firstEmptyCell].quantity = loot.quantity;
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

                if (item.image != null) {
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

class SpellItemInfo extends Phaser.Scene {

    create() {

        scene_SpellItemInfo = this;

        this.item = null;
        this.isopen = false;
        this.graphics = this.add.graphics();
        this.nametext = this.add.text(10, 10, '', { fontSize: '25px', fill: 'white' });
        this.nametext.visible = false;
        this.descriptiontext = this.add.text(10, 10, '', { fontSize: '15px', fill: 'white', wordWrap: { width: 140 } });
        this.descriptiontext.visible = false;
        this.ClsdBtn = this.add.sprite(0, 0, 'ClsdBtn').setInteractive();
        this.ClsdBtn.visible = false;
        this.ClsdBtn.on('pointerdown', function (pointer, gameObject) {
            scene_SpellItemInfo.close();
        });

    }


    open(item) {

        let xsize = windowInnerWidth / 2 - 150;
        let ysize = windowInnerHeight / 2 - 250;


        this.graphics.fillStyle(0x000000, 0.7);
        this.graphics.fillRect(xsize, ysize, 150, 250);

        let cellxsize = xsize;
        let cellysize = ysize + 20;


        this.graphics.fillStyle(0x000000);
        this.graphics.fillRect(xsize, ysize, 150, 20);

        this.ClsdBtn.visible = true;
        this.ClsdBtn.setPosition(xsize + 150 - 10, ysize + 11)


        this.nametext.setText(item.name);
        this.nametext.setPosition(xsize + 5, ysize + 20);
        this.descriptiontext.setText(item.description);
        this.descriptiontext.setPosition(xsize + 5, ysize + 45);

        this.nametext.visible = true;
        this.descriptiontext.visible = true;


        this.isopen = true;

    }

    close() {

        this.graphics.clear();
        this.nametext.visible = false;
        this.descriptiontext.visible = false;
        this.ClsdBtn.visible = false;
        this.isopen = false;

    }

}

class UI extends Phaser.Scene {

    preload() {
        this.load.image('Bag', 'assets/Bag.png')
    }

    create() {

        this.bag = this.add.sprite(windowInnerWidth - 500, windowInnerHeight - 50, 'Bag').setInteractive();
        this.bag.on('pointerdown', function (pointer, gameObject) {

            if (scene_BagFrame.isopen) {
                scene_BagFrame.closebag()
            }
            else {
                scene_BagFrame.openbag()
            }

        });

        this.charframe = this.add.sprite(windowInnerWidth - 550, windowInnerHeight - 50, 'Heart').setInteractive();
        this.charframe.on('pointerdown', function (pointer, gameObject) {

            if (scene_CharFrame.isopen) {
                scene_CharFrame.close()
            }
            else {
                scene_CharFrame.open()
            }

        });

        this.runetable = this.add.sprite(windowInnerWidth - 450, windowInnerHeight - 50, 'Pearl').setInteractive();
        this.runetable.on('pointerdown', function (pointer, gameObject) {

            if (scene_RunesTableFrame.isopen) {
                scene_RunesTableFrame.close()
            }
            else {
                scene_RunesTableFrame.open()
            }

        });

        this.magicbook = this.add.sprite(windowInnerWidth - 400, windowInnerHeight - 50, 'Book').setInteractive();
        this.magicbook.on('pointerdown', function (pointer, gameObject) {

            if (scene_MagicBook.isopen) {
                scene_MagicBook.close()
            }
            else {
                scene_MagicBook.open()
            }

        });

        this.questlist = this.add.sprite(windowInnerWidth - 350, windowInnerHeight - 50, 'QuestList').setInteractive();
        this.questlist.on('pointerdown', function (pointer, gameObject) {

            if (scene_MagicBook.isopen) {
                scene_MagicBook.close()
            }
            else {
                scene_MagicBook.open()
            }

        });

    }

    update(p1, p2) {
    }
}

class NpcDialoge extends Phaser.Scene {

    create() {

        scene_NpcDialoge = this;

        this.page = dialogePage.Main;
        this.frameopen = false;
        this.npc = null;
        this.selectionquest = null;
        this.gf = this.add.graphics();

        this.npcName = this.add.text(155, 115, '', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.npcName.visible = false;

        this.phrase = this.add.text(160, 150, '', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.phrase.visible = false;

        this.command1 = this.add.text(170, 190, 'Задания', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.command1.setInteractive();
        this.command1.on('pointerdown', function () {

            if (scene_NpcDialoge.page == dialogePage.Main) {
                scene_NpcDialoge.openQuestsList();
                return;
            }

            if (scene_NpcDialoge.page == dialogePage.QuestsList){
                scene_NpcDialoge.openQuest(0); 
                return;  
            }

        });

        this.command1.visible = false;

        this.command2 = this.add.text(170, 220, 'Торговать', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.command2.setInteractive();
        this.command2.on('pointerdown', function () {

            if (scene_NpcDialoge.page == dialogePage.QuestsList){
                scene_NpcDialoge.openQuest(1); 
                return;  
            }

        });
        this.command2.visible = false;

        this.command3 = this.add.text(170, 250, 'Торговать', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.command3.setInteractive();
        this.command3.on('pointerdown', function () {

            if (scene_NpcDialoge.page == dialogePage.QuestsList){
                scene_NpcDialoge.openQuest(2); 
                return;  
            }

        });
        this.command3.visible = false;

        this.command4 = this.add.text(170, 280, 'Торговать', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.command4.setInteractive();
        this.command4.on('pointerdown', function () {

            if (scene_NpcDialoge.page == dialogePage.QuestsList){
                scene_NpcDialoge.openQuest(3); 
                return;  
            }

        });
        this.command4.visible = false;

        this.command5 = this.add.text(170, 310, 'Торговать', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.command5.setInteractive();
        this.command5.on('pointerdown', function () {

            if (scene_NpcDialoge.page == dialogePage.QuestsList){
                scene_NpcDialoge.openQuest(4); 
                return;  
            }

        });
        this.command5.visible = false;

        this.command6 = this.add.text(170, 340, 'Торговать', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.command6.setInteractive();
        this.command6.on('pointerdown', function () {

            if (scene_NpcDialoge.page == dialogePage.QuestsList){
                scene_NpcDialoge.openQuest(5); 
                return;  
            }

        });
        this.command6.visible = false;

        this.command7 = this.add.text(170, 370, 'Торговать', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.command7.setInteractive();
        this.command7.on('pointerdown', function () {

            if (scene_NpcDialoge.page == dialogePage.QuestsList){
                scene_NpcDialoge.openQuest(6); 
                return;  
            }

        });
        this.command7.visible = false;

        this.commandback = this.add.text(170, 370, 'Назад', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.commandback.setInteractive();
        this.commandback.on('pointerdown', function () {

            if (scene_NpcDialoge.page == dialogePage.QuestsList){
                scene_NpcDialoge.backPage(); 
                return;  
            }

        });
        this.commandback.visible = false;

        this.acceptquest = this.add.text(300, 370, 'Принять', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);
        this.acceptquest.setInteractive();
        this.acceptquest.on('pointerdown', function () {

            // if (scene_NpcDialoge.page == dialogePage.QuestsList){
            //     scene_NpcDialoge.backPage(); 
            //     return;  
            // }

        });
        this.acceptquest.visible = false;

        this.ClsdBtndrop = this.add.sprite(462, 125, 'ClsdBtn').setInteractive();
        this.ClsdBtndrop.on('pointerdown', function () {
            scene_NpcDialoge.closedialoge();
            player.target = null;
        });
        this.ClsdBtndrop.visible = false;

        this.maskgf = this.make.graphics('black', 1);
        this.maskgf.fillRect(155, 120, 320, 250);

        this.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskgf);

        this.questtext = this.add.text(155, 120, '', { fontFamily: 'Arial', color: 'white', wordWrap: { width: 310 } }).setOrigin(0);

        this.questtext.setMask(this.mask);

        //  The rectangle they can 'drag' within
        this.zone = this.add.zone(152, 130, 320, 256).setOrigin(0).setInteractive();

        this.zone.on('pointermove', pointer => {

            if (pointer.isDown) {
                scene_NpcDialoge.questtext.y += (pointer.velocity.y / 2);

                scene_NpcDialoge.questtext.y = Phaser.Math.Clamp(this.text.y, -400, 300);
            }

        });

        this.mask.visible = false;
        this.questtext.visible = false;
        this.zone.visible = false;
        this.frameopen = false;

    }

    opendialoge(npc) {

        this.npc = npc;

        this.gf.fillStyle(0x0000ff)
        this.gf.fillRect(152, 115, 320, 133);
        this.gf.fillStyle(0x000000)
        this.gf.fillRect(152, 133, 320, 260);

        this.ClsdBtndrop.visible = true;

        this.npcName.setText(npc.name);
        this.npcName.visible = true;

        this.phrase.setText(npc.phrases[getRndInteger(1, npc.phrases.length) - 1]);
        this.phrase.visible = true;

        if (npc.quests.length) {
            this.command1.setText('Задания')
            this.command1.visible = true;
        }
        // this.command2.visible = true;
        // this.command3.visible = true;
        // this.command4.visible = true;
        // this.command5.visible = true;
        // this.command6.visible = true;
        // this.command7.visible = true;

        // this.mask.visible = true;
        // this.text.visible = true;
        // this.zone.visible = true;
        // this.frameopen = true;

    }

    closedialoge() {

        this.page = dialogePage.Main;

        this.npc = null;
        this.selectionquest = null;
        player.target = null;

        this.gf.clear();
        this.ClsdBtndrop.visible = false;
        this.npcName.visible = false;
        this.phrase.visible = false;
        this.command1.visible = false;
        this.command2.visible = false;
        this.command3.visible = false;
        this.command4.visible = false;
        this.command5.visible = false;
        this.command6.visible = false;
        this.command7.visible = false;
        this.commandback.visible = false;
        this.acceptquest.visible = false;
        this.mask.visible = false;
        this.questtext.visible = false;
        this.zone.visible = false;
        this.frameopen = false;

    }

    openQuestsList() {
        this.page = dialogePage.QuestsList;

        this.phrase.setText('Ну давай подумаем чем ты можешь помочь');

        this.command1.visible = false;
        this.command2.visible = false;
        this.command3.visible = false;
        this.command4.visible = false;
        this.command5.visible = false;
        this.command6.visible = false;
        this.command7.visible = false;
        this.commandback.visible = false;
        this.acceptquest.visible = false;

        this.mask.visible = false;
        this.questtext.visible = false;
        this.zone.visible = false;
        this.frameopen = false;

        let counter = 1;
        for (let i in this.npc.quests) {
            let textlink = null;
            if (counter == 1) {
                textlink = this.command1;
            }
            else if (counter == 2) {
                textlink = this.command2;
            }
            else if (counter == 3) {
                textlink = this.command3;
            }
            else if (counter == 4) {
                textlink = this.command4;
            }
            else if (counter == 5) {
                textlink = this.command5;
            }
            else if (counter == 6) {
                textlink = this.command6;
            }
            else if (counter == 7) {
                textlink = this.command7;
            }

            let addquest = true;
            let questtext = '';

            let quest = this.npc.quests[i];

            for (let qi in player.quests) {
                let playerquest = player.quests[qi];
                if (playerquest.id == quest.id) {
                    if (playerquest.done) {
                        addquest = false;
                        break;
                    }
                    questtext = '? '
                }
            }

            if (questtext == '') {
                questtext = '! ';
            }

            questtext = questtext + quest.name;

            if (addquest) {
                textlink.setText(questtext)
                textlink.visible = true;
                counter += 1;
            }
        }

        this.commandback.visible = true;

    }

    openQuest(ind){

        this.page = dialogePage.QuestsElementList;

        this.quest = this.npc.quests[ind].name;

        this.command1.visible = false;
        this.command2.visible = false;
        this.command3.visible = false;
        this.command4.visible = false;
        this.command5.visible = false;
        this.command6.visible = false;
        this.command7.visible = false;
        this.commandback.visible = true;
        this.acceptquest.visible = true;
        this.mask.visible = true;
        this.questtext.visible = true;
        this.zone.visible = true;
        this.frameopen = true;

        this.phrase.setText(this.quest.name);

        this.questtext.setText(this.quest.description)

    }

    backPage(){

        this.commandback.visible = false;
        this.acceptquest.visible = false;

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

        this.load.image('Heart', 'assets/Heart.png')
        this.load.image('Book', 'assets/Book.png');
        this.load.image('Pearl', 'assets/Pearl.png');
        this.load.image('QuestList', 'assets/QuestList.png');

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
                                scene_NpcDialoge.opendialoge(npcelement);
                            }
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

        for (let i in spellsdata) {
            spells.push(new Spell(spellsdata[i]));
        }

        createplayer(playerdata);

        if (false) {

            // ws = new WebSocket(`ws://192.168.0.10:8000/ws/${client_id}`);
            // ws.onmessage = function (event) {

            // let data = JSON.parse(event.data);

            // if (data.cmd == 'CreatePlayer') {
            //     createplayer(data);
            // }

        };

        for (let i in mobsdata) {
            createMob(mobsdata[i]);

        }

        for (let i in npcsdata) {
            CreateNPC(npcsdata[i]);
        }

        for (let i in questdata) {
            let quest = new Quest(questdata[i]);
            for (let ni in npcs) {
                let npc = npcs[ni];
                if (npc.id == quest.outstanding || npc.id == quest.recipient) {
                    npc.quests.push(quest);
                    if (quest.recipient == quest.outstanding) {
                        break;
                    }
                }

            }
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

function createplayer(data) {
    player = new Player(scene_main.physics.add.sprite(data.x, data.y, 'dude').setScale(2));
    player.id = client_id;
    player.x = data.x;
    player.y = data.y;

    player.sprite.anims.play('turn');

    players.push(player)

    // let inf = {
    //     'cmd': 'NewPlayer',
    //     'id': client_id,
    //     'x': player.x,
    //     'y': player.y
    // }
    // ws.send(JSON.stringify(inf))

    let step = windowInnerHeight - 100;
    let counter = 0;
    let x = windowInnerWidth - 50;
    for (let i in player.panel) {
        if (counter % 4 == 0 && counter != 0) {
            step = windowInnerHeight - 100;
            x -= 50;
        }
        player.panel[i] = new itemCell(itemType.Runestone)
        player.panel[i].index = i;
        player.panel[i].x = x;
        player.panel[i].y = step;
        counter += 1;
        step -= 50;

    }

    for (let i in player.bag) {
        player.bag[i] = new itemCell()
        player.bag[i].index = i;
    }

    for (let i in player.runestones) {
        player.runestones[i] = new itemCell(itemType.Runestone)
        player.runestones[i].index = i;
    }

    let item = new Item({ id: 11, name: 'spell1', description: ['Рунный камушек второго скила', 'Вставлять в таблицу камней'], image: 'spell1', itemtype: itemType.Runestone, equiptype: null, spell: 1, stack: false, stacksize: 0 });
    player.bag[0].item = item;
    player.bag[0].quantity = 1;

    scene_main.cameras.main.setSize(windowInnerWidth, windowInnerHeight);
    scene_main.cameras.add(windowInnerWidth, 0, windowInnerWidth, windowInnerHeight);
    scene_main.cameras.main.startFollow(player.sprite);
    scene_main.scene.add('PlayerFrame', PlayerFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('XPBar', XPBar, true, { x: 400, y: 300 });
    scene_main.scene.add('UI', UI, true, { x: 400, y: 300 });
    scene_main.scene.add('BagFrame', BagFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('Joystick', Joystick, true, { x: 400, y: 300 });
    scene_main.scene.add('DropFrame', DropFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('TargetFrame', TargetFrame, true, { x: 400, y: 300 })
    scene_main.scene.add('NpcDialoge', NpcDialoge, true, { x: 400, y: 300 })
    scene_main.scene.add('CastFrame', CastFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('CharFrame', CharFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('RunesTableFrame', RunesTableFrame, true, { x: 400, y: 300 });
    scene_main.scene.add('MagicBook', MagicBook, true, { x: 400, y: 300 });
    scene_main.scene.add('ItemsSprites', ItemsSprites, true, { x: 400, y: 300 });
    scene_main.scene.add('SpellItemInfo', SpellItemInfo, true, { x: 400, y: 300 });

    if (player.performancepoints) {
        scene_CharFrame.open();
    }

    game.input.addPointer(1);

}

function createMob(data) {
    let mob = new Mob(data)
    mobs.push(mob)
}

function CreateNPC(data) {
    let npc = new NPC(data)
    npcs.push(npc)
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
