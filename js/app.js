const tileWidth = 101;
const tileHeight = 83;
const screenWith = 505;
const offSet = 10;

function rand(min, max) {
    // A helper function for handle random number generating
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createMany(number, constructor) {
    // Use a batch create function to generate
    // arbitruary number of enemies
    return Array(number).fill(null).map(() => new constructor())
}

function collided(a, b) {
    // A helper function to determine if two object collided
    return Math.abs(a.x - b.x) < 50 && Math.abs(a.y - b.y) < 50;
}

function winEffect() {
    // Render win effect
    ctx.drawImage(Resources.get('images/win.png'), 100, 100);
}

function loseEffect() {
    // render lose effect
    ctx.drawImage(Resources.get('images/lose.png'), 100, 100);
}

// Enemy class
class Enemy {
    constructor() {
        this.sprite = 'images/enemy-bug.png';
        // convert random row/collumn number to x/y
        this.x = this.randomCollumn() * tileWidth;
        this.y = this.randomRow() * tileHeight - offSet;
    }

    randomSpeed() {
        // generate a random speed 50 ~ 499
        return rand(50, 500);
    }

    randomCollumn() {
        // generate a random new collumn number 
        // to spawn enemy -20 ~ -1
        // pratically the farther left new enemy can spawn, the more evenly distributed enemy army is
        return rand(-20, 0)

    }

    randomRow() {
        // generate a random row number 1~3
        return rand(1, 4)
    }

    update(dt) {
        // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
        // 都是以同样的速度运行的
        this.x = this.x + dt * this.randomSpeed();
        // convert random row/collumn number to x/y
        var xStartPoint = this.randomCollumn();
        var yStartPoint = this.randomRow()
        if (this.isoffscreen()) {
            // handle how respawn enemy
            this.x = xStartPoint * tileWidth - screenWith;
            this.y = yStartPoint * tileHeight - offSet;
        }
    }
    isoffscreen() {
        // decide if the enemy is offscreen to the right
        if (this.x > screenWith) {
            return true;
        }
        return false;
    }
    // 此为游戏必须的函数，用来在屏幕上画出敌人，
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}



// Key class
class Key {
    constructor(x) {
        // the x position is an parameter. 
        // at instanciation time this number is also random
        this.sprite = 'images/Key.png';
        this.x = x * tileWidth;
        this.y = 0 * tileHeight - offSet;
    }
    update(dt) {}

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Rock class
class Rock {
    constructor(x) {
        // the x position is an parameter. 
        // at instanciation time this number is also random
        this.sprite = 'images/Rock.png';
        this.x = x * tileWidth;
        this.y = 0 * tileHeight - offSet;
    }

    update(dt) {}
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


// Player class
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 2 * tileWidth;
        this.y = 5 * tileHeight - offSet;
    }
    update(dt) {
        // locally copy execution context of Player class, i.e. player object at runtime
        var player = this;
        // detect if collide with any enemy
        allEnemies.forEach(function (enemy) {
            if (collided(player, enemy)) {
                player.x = 2 * tileWidth;
                player.y = 5 * tileHeight - offSet;
            }
        });
        // detect if collide with key
        if (collided(player, key)) {
            window.won = true;
            window.pause = true;
        }

    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(direction) {
        // store the next position in an object
        // move to next position if not blocked
        let nextPosition = {};
        nextPosition.x = this.x;
        nextPosition.y = this.y;
        switch (direction) {
            case "left":
                if (this.x == 0) {
                    return;
                }
                nextPosition.x = this.x - tileWidth;
                break;
            case "up":
                if (this.y == 0 - offSet) {
                    return;
                }
                nextPosition.y = this.y - tileHeight;
                break;
            case "right":
                if (this.x == 4 * tileWidth) {
                    return;
                }
                nextPosition.x = this.x + tileWidth;
                break;
            case "down":
                if (this.y == 5 * tileHeight - offSet) {
                    return;
                }
                nextPosition.y = this.y + tileHeight;
                break;
            default:
                break;
        }
        if (collided(nextPosition, rock)) {
            return;
        }
        this.x = nextPosition.x;
        this.y = nextPosition.y;
    }
}

// Generate 15 enemies using our createMany function
let allEnemies = createMany(15, Enemy);

// Make sure key and rock don't spawn at the same coorditate
let keyX = rand(0, 5);
let rockX = rand(0, 5);
while (keyX == rockX) {
    rockX = rand(0, 5);
}
let key = new Key(keyX);
let rock = new Rock(rockX);
let player = new Player();

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});