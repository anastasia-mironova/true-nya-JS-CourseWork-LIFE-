function Game(canvas, cfg) {

    // Свойства
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.matrix = undefined;
    this.round = 0;
    // основная конфигурация поля 
    let defaults = {
        cellSize: 20,
        cellsX: Math.round((document.documentElement.clientWidth - 240) / 20),
        cellsY: Math.round((document.documentElement.clientHeight - 30) / 20),
        rules: "23/3",
        gridColor: "rgb(0, 0, 0)",
        cellColor: "white"
    };
    this.cfg = Object.assign({}, defaults, cfg);

    // инициализация массива.
    this.init();
}
Game.prototype = {
    /**
     * создание каваса и матрицы
     */
    init: function () {
        this.canvas.width = this.cfg.cellsX * this.cfg.cellSize;
        this.canvas.height = this.cfg.cellsY * this.cfg.cellSize;

        this.matrix = new Array(this.cfg.cellsX);
        for (let x = 0; x < this.matrix.length; x++) {
            this.matrix[x] = new Array(this.cfg.cellsY);
            for (let y = 0; y < this.matrix[x].length; y++) {
                this.matrix[x][y] = false;
            }

        }
        this.draw();
    },

    /**
     * рисование на канвасе
     */
    draw: function () {
        // резайз
        let currentWidth = Math.round(document.documentElement.clientWidth - 240);
        this.cfg.cellSize = (currentWidth / this.cfg.cellsX);
        this.canvas.width = this.cfg.cellSize * this.cfg.cellsX;
        this.canvas.height = this.cfg.cellSize * this.cfg.cellsY;
        let x, y;
        // очищение канваса и задание цвета
        this.canvas.width = this.canvas.width;
        this.ctx.strokeStyle = this.cfg.gridColor;
        this.ctx.fillStyle = this.cfg.cellColor;

        // рисование сеттки
        for (x = 0.5; x < this.cfg.cellsX * this.cfg.cellSize; x += this.cfg.cellSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.cfg.cellsY * this.cfg.cellSize);
        }
        for (y = 0.5; y < this.cfg.cellsY * this.cfg.cellSize; y += this.cfg.cellSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.cfg.cellsX * this.cfg.cellSize, y);
        }
        this.ctx.stroke();

        // рисование поля
        for (x = 0; x < this.matrix.length; x++) {
            for (y = 0; y < this.matrix[x].length; y++) {
                if (this.matrix[x][y]) {
                    this.ctx.fillRect(x * this.cfg.cellSize + 1,
                        y * this.cfg.cellSize + 1,
                        this.cfg.cellSize - 1,
                        this.cfg.cellSize - 1);
                }
            }
        }
    },

    /**
     * Вычисление нового состояния, применяя правила.
     */

    step: function () {
        let x, y;
        let isInc = true;
        let buffer = new Array(this.matrix.length);
        for (x = 0; x < buffer.length; x++) {
            buffer[x] = new Array(this.matrix[x].length);
        }
        // вычисление 1 шага
        for (x = 0; x < this.matrix.length; x++) {
            for (y = 0; y < this.matrix[x].length; y++) {
                // количество соседей
                let neighbours = this.countNeighbours(x, y);
                // правила жизни
                if (this.matrix[x][y]) {
                    if (neighbours == 2 || neighbours == 3)
                        buffer[x][y] = true;
                    if (neighbours < 2 || neighbours > 3)
                        buffer[x][y] = false;
                } else {
                    if (neighbours == 3)
                        buffer[x][y] = true;
                }
                if (neighbours == 0 && this.round >= 25 && document.querySelector("#input-check").checked || this.round >= 160) {
                    game.clear();
                    clearInterval(timer);
                    alert(`Поколений сменилось: ${game.round} `)
                    game.round = 0;
                    document.getElementById("count").innerHTML = game.round;
                    game.clearItem();
                    console.log(game.round)
                    isStop = false;
                    isClear = 0;
                    timer = undefined;
                    runButton.innerHTML = "Start"; isInc = false
                    break;
                }
            }
        }

        this.matrix = buffer;
        if (isInc) {
            this.round++;
        }
        this.draw();
    },

    // возвращет количество соседей у одного животного
    countNeighbours: function (cx, cy) {
        let count = 0;
        for (let x = cx - 1; x <= cx + 1; x++) {
            for (let y = cy - 1; y <= cy + 1; y++) {
                if (x == cx && y == cy)
                    continue;
                if (x < 0 || x >= this.matrix.length || y < 0 || y >= this.matrix[x].length)
                    continue;
                if (this.matrix[x][y])
                    count++;
            }
        }
        return count;
    },

    /**
     * очищение поля
     */
    clear: function () {
        for (let x = 0; x < this.matrix.length; x++) {
            for (let y = 0; y < this.matrix[x].length; y++) {
                this.matrix[x][y] = false;
            }
        }
        this.draw();
        this.clearItem();
    },
    //очищение поля ввода
    clearItem: function () {
        for (let i = 1; i <= 16; i++) {
            document.querySelector(".item" + i).style.background = "#d3ceec";
        }
    },
    /**
     * заполнение матрицы животными с шансом 30 процентов
     */
    randomize: function () {
        for (let x = 0; x < this.matrix.length; x++) {
            for (let y = 0; y < this.matrix[x].length; y++) {
                this.matrix[x][y] = Math.random() < 0.3;
            }
        }
        this.draw();
    },
    toggleCell: function (cx, cy) {
        if (cx >= 0 && cx < this.matrix.length && cy >= 0 && cy < this.matrix[0].length) {
            this.matrix[cx][cy] = !this.matrix[cx][cy];
            this.draw();
        }
    }
};

let timer;
window.addEventListener("resize", () => { game.draw() });
// инициализация игры
let game = new Game(document.getElementById("game"));
// ввод фигуры пользователем
let startInputX = Math.round((game.cfg.cellsX - 4) / 2);
let startInputY = Math.round((game.cfg.cellsY - 4) / 2);
let item1 = document.querySelector('.item1');
item1.onclick = function () {
    item1.style.backgroundColor = "#000000";
    game.matrix[startInputX][startInputY] = true;
    game.draw();
    isClear++;
}
let item2 = document.querySelector('.item2');
item2.onclick = function () {
    item2.style.backgroundColor = "#000000";
    game.matrix[startInputX + 1][startInputY] = true;
    game.draw();
    isClear++;
}
let item3 = document.querySelector('.item3');
item3.onclick = function () {
    item3.style.backgroundColor = "#000000";
    game.matrix[startInputX + 2][startInputY] = true;
    game.draw();
    isClear++;
}
let item4 = document.querySelector('.item4');
item4.onclick = function () {
    item4.style.backgroundColor = "#000000";
    game.matrix[startInputX + 3][startInputY] = true;
    game.draw();
    isClear++;
}
let item5 = document.querySelector('.item5');
item5.onclick = function () {
    item5.style.backgroundColor = "#000000";
    game.matrix[startInputX][startInputY + 1] = true;
    game.draw();
    isClear++;
}
let item6 = document.querySelector('.item6');
item6.onclick = function () {
    item6.style.backgroundColor = "#000000";
    game.matrix[startInputX + 1][startInputY + 1] = true;
    game.draw();
    isClear++;
}
let item7 = document.querySelector('.item7');
item7.onclick = function () {
    item7.style.backgroundColor = "#000000";
    game.matrix[startInputX + 2][startInputY + 1] = true;
    game.draw();
    isClear++;
}
let item8 = document.querySelector('.item8');
item8.onclick = function () {
    item8.style.backgroundColor = "#000000";
    game.matrix[startInputX + 3][startInputY + 1] = true;
    game.draw();
    isClear++;
}
let item9 = document.querySelector('.item9');
item9.onclick = function () {
    item9.style.backgroundColor = "#000000";
    game.matrix[startInputX][startInputY + 2] = true;
    game.draw();
    isClear++;
}
let item10 = document.querySelector('.item10');
item10.onclick = function () {
    item10.style.backgroundColor = "#000000";
    game.matrix[startInputX + 1][startInputY + 2] = true;
    game.draw();
    isClear++;
}
let item11 = document.querySelector('.item11');
item11.onclick = function () {
    item11.style.backgroundColor = "#000000";
    game.matrix[startInputX + 2][startInputY + 2] = true;
    game.draw();
    isClear++;
}
let item12 = document.querySelector('.item12');
item12.onclick = function () {
    item12.style.backgroundColor = "#000000";
    game.matrix[startInputX + 3][startInputY + 2] = true;
    game.draw();
    isClear++;
}
let item13 = document.querySelector('.item13');
item13.onclick = function () {
    item13.style.backgroundColor = "#000000";
    game.matrix[startInputX][startInputY + 3] = true;
    game.draw();
    isClear++;
}
let item14 = document.querySelector('.item14');
item14.onclick = function () {
    item14.style.backgroundColor = "#000000";
    game.matrix[startInputX + 1][startInputY + 3] = true;
    game.draw();
    isClear++;
}
let item15 = document.querySelector('.item15');
item15.onclick = function () {
    item15.style.backgroundColor = "#000000";
    game.matrix[startInputX + 2][startInputY + 3] = true;
    game.draw();
    isClear++;
}
let item16 = document.querySelector('.item16');
item16.onclick = function () {
    item16.style.backgroundColor = "#000000";
    game.matrix[startInputX + 3][startInputY + 3] = true;
    game.draw();
    isClear++;
}
let isStop = false;
//запуск или остановка игры 
let runButton = document.getElementById("run");
runButton.onclick = function () {
    let isRun = false;
    if (!isClear && !document.querySelector("#input-check").checked) {
        game.randomize();
        isRun = true;
    }
    if (!isClear && document.querySelector("#input-check").checked) {
        let agreement = confirm("OK - продолжить в автоматическом рeжиме, cancel- продолжить ввод фигуры");
        if (agreement) {
            game.randomize();
            isRun = true;
        }
        else {
            isRun = false;
        }

    };
    if (isClear && document.querySelector("#input-check").checked) {
        isRun = true;
    }
    if (isRun || runButton.innerText === "Stop" || isStop) {
        isStop = true;
        if (timer === undefined) {
            timer = setInterval(run, 40);
            runButton.innerHTML = "Stop";
        } else {
            clearInterval(timer);
            timer = undefined;
            runButton.innerHTML = "Start";
            alert(`Поколений сменилось: ${game.round}`)
        }
    }

};
let isClear = 0;
// реализация по шагам
let stepButton = document.getElementById("step");
stepButton.onclick = function () {
    if (timer === undefined) {
        game.step();
        document.getElementById("count").innerHTML = game.round;
    }
};

// очищение поля
let clearButton = document.getElementById("clear");
clearButton.onclick =
    function () {
        isStop = false;
        isClear = 0;
        clearInterval(timer);
        timer = undefined;
        runButton.innerHTML = "Start";
        game.clear();
        game.round = 0;
        document.getElementById("count").innerHTML = game.round;
    };

// установка случайной кофигурации животных
let randomButton = document.getElementById("rand");
randomButton.onclick = function () {
    game.randomize();
    game.round = 0;
    document.getElementById("count").innerHTML = game.round;
};
game.canvas.addEventListener("click", gameOnClick, false);
function gameOnClick(e) {
    let x;
    let y;

    // determen click position
    if (e.pageX !== undefined && e.pageY !== undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= game.canvas.offsetLeft;
    y -= game.canvas.offsetTop;
    x = Math.floor(x / game.cfg.cellSize);
    y = Math.floor(y / game.cfg.cellSize);

    game.toggleCell(x, y);
}

// запуск цикла анимации
function run() {
    isClear++;
    game.step();
    document.getElementById("count").innerHTML = game.round;
}

// скрывание и появление поля ввода фигуры
let inputs = document.querySelector("#input-check");
let input_item = document.querySelector(".input-figure");
inputs.onchange = () => {
    if (inputs.checked) {
        game.clear();
        input_item.style.display = "flex";
    }
    if (!inputs.checked) {
        input_item.style.display = "none";
    }
}
game.randomize();
//переход на страницу справки
let helpButton = document.querySelector("#help");
let mainHelpButton = document.querySelector(".main-help");
mainHelpButton.onclick = () => {
    window.open("./help.html");
}
helpButton.onclick = () => {
    window.open("./help.html");
}
//preview
let playButton = document.querySelector(".play");
playButton.addEventListener("click", () => {
    document.querySelector(".play").style.display = "none";
    document.querySelector(".container").style.display = "block";
})