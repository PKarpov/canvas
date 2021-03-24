class Main {
    constructor() {
        Main.canvas = document.getElementById("canvas");
        var rect = Main.canvas.getBoundingClientRect();
        console.log(rect);
        Main.ctx = Main.canvas.getContext("2d");
        Main.width = Main.canvas.width;
        Main.height = Main.canvas.height;
        Button.width = 440;
        Button.height = 110;

        // this.start = new Menu(["PLAY GAME", "GO OUT"], [glob.EVENT_PLAY_ADS, glob.EVENT_EXIT]);
        // this.final = new Menu(["PLAY AGAIN", "GO OUT"], [glob.EVENT_PLAY_ADS, glob.EVENT_EXIT]);
        this.start = new Menu(["PLAY GAME", "GO OUT"], [glob.EVENT_PLAY_GAME, glob.EVENT_EXIT]);
        this.final = new Menu(["PLAY AGAIN", "GO OUT"], [glob.EVENT_PLAY_GAME, glob.EVENT_EXIT]);
        this.game = new Game();

        document.addEventListener("keydown", (e)=>{this.keyDownHandler(e)});
        Main.canvas.addEventListener("pointer", (e)=>{this.keyDownHandler(e)});
        document.addEventListener(glob.EVENT_PLAY_GAME, ()=>{
            this.game.drawNew();
            this.setState('game');

        });
        document.addEventListener(glob.EVENT_END_GAME, (e)=>{
            this.setState('final');
            setTimeout(()=>{this.final.drawNew(0, e.detail)},400);
        });
        document.addEventListener(glob.EVENT_EXIT, ()=>{ this.exitGame()});

        this.setState('start');
        this.start.drawNew(0);
    }

    setState(state) {
        Main.ctx.clearRect(0, 0, Main.width, Main.height);
        Artist.drawHelp();
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

window.onload = ()=>{
    // new Ads();
    new Main();
};

