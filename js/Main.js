class Main {
    constructor() {
        this.canvas = document.getElementById("canvas");
        Main.ctx = this.canvas.getContext("2d");
        Main.width = this.canvas.width;
        Main.height = this.canvas.height;
        Main.busy = false;

        this.start = new Menu(["PLAY GAME", "GO OUT"], [glob.EVENT_PLAY, glob.EVENT_EXIT]);
        this.finish = new Menu(["PLAY AGAIN", "GO OUT"], [glob.EVENT_PLAY, glob.EVENT_EXIT]);
        this.game = new Game();
        this.keyListener = this.keyDownHandler.bind(this);
        this.changeMain = this.changeState.bind(this);
        this.exit = this.exitGame.bind(this);
        this.changeState();
    }

    changeState() {
        if (this.state === undefined) {
            this.state = glob.START;
            this.start.drawNew(0, null, true);
        } else if (this.state === glob.START || this.state === glob.FINISH) {
            this.state = glob.GAME;
            this.game.drawNew();
        } else if (this.state === glob.GAME) {
            this.state = glob.FINISH;
            this.finish.drawNew(0, 'ALL Ok!!!', true);
        }

        if (this.state === glob.GAME) {
            this.keyboard = "ArrowRight,ArrowLeft,ArrowUp,ArrowDown,Enter".split(',');
        } else {
            this.keyboard = "ArrowUp,ArrowDown,Enter".split(',');
        }
    }

    exitGame() {
        document.removeEventListener("keydown", this.keyListener, false);
        document.removeEventListener(glob.EVENT_PLAY, this.changeMain, false);
        document.removeEventListener(glob.EVENT_EXIT, this.exit, false);
        window.open("http://44.zzz.com.ua/", '_self');
    }

    keyDownHandler(e) {
        if(Main.busy) return;
        // console.dir(e)
        let key = e.key;
        if (key === "Backspace") {
            this.exitGame();
        } else if (this.keyboard.includes(key)) {
            this[this.state].takeAction(key);
        }
    }
    exit = this.exitGame.bind(this);

}
const main = new Main();
document.addEventListener("keydown", main.keyListener, false);
document.addEventListener(glob.EVENT_PLAY, main.changeMain, false);
document.addEventListener(glob.EVENT_EXIT, main.exit, false);

// document.addEventListener(glob.EVENT_EXIT, main.exitGame.bind(main), {once:true});
// document.addEventListener("keyup", keyUpHandler, false);
/*
function draw() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(75,75,50,0,Math.PI*2,true); // Внешняя окружность
        ctx.moveTo(110,75);
        ctx.arc(75,75,35,0,Math.PI,false);  // рот (по часовой стрелке)
        ctx.moveTo(65,65);
        ctx.arc(60,65,5,0,Math.PI*2,true);  // Левый глаз
        ctx.moveTo(95,65);
        ctx.arc(90,65,5,0,Math.PI*2,true);  // Правый глаз
        ctx.stroke();
    }
}
draw()*/
