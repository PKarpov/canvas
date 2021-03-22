class Main {
    constructor() {
        this.canvas = document.getElementById("canvas");
        Main.ctx = this.canvas.getContext("2d");
        Main.width = this.canvas.width;
        Main.height = this.canvas.height;
        Main.busy = false;

        this.start = new Menu(["PLAY GAME", "GO OUT"], [glob.EVENT_PLAY, glob.EVENT_EXIT]);
        this.final = new Menu(["PLAY AGAIN", "GO OUT"], [glob.EVENT_PLAY, glob.EVENT_EXIT]);
        this.game = new Game();

        document.addEventListener("keydown", (e)=>{this.keyDownHandler(e)});
        document.addEventListener(glob.EVENT_PLAY, ()=>{
            this.setState('game')
            this.game.drawNew();

        });
        document.addEventListener(glob.EVENT_END_GAME, (e)=>{
            this.setState('final')
            this.final.drawNew(0, + e.detail);
        });
        document.addEventListener(glob.EVENT_EXIT, ()=>{ this.exitGame()});

        this.setState('start');
        this.start.drawNew(0);
    }

    setState(state) {
        if (state === 'game') {
            this.keyFiltr = "ArrowRight,ArrowLeft,ArrowUp,ArrowDown,Enter".split(',');
        } else {
            this.keyFiltr = "ArrowUp,ArrowDown,Enter".split(',');
        }
        this.state = state;
    }

    exitGame() {
        window.open("http://44.zzz.com.ua/", '_self');
    }

    keyDownHandler(e) {
        if(Main.busy) return;
        let key = e.key;
        if (key === "Backspace") {
            this.exitGame();
        } else if (this.keyFiltr.includes(key)) {
            this[this.state].takeAction(key);
        }
    }
}
const main = new Main();

// document.addEventListener("keydown", main.keyListener, false);
// document.addEventListener(glob.EVENT_PLAY, main.changeMain, false);
// document.addEventListener(glob.EVENT_EXIT, main.exit, false);

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
