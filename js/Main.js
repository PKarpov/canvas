class Main {
    constructor() {
        Main.canvas = document.getElementById("canvas");
        Main.ctx = Main.canvas.getContext("2d");
        Main.width = Main.canvas.width;
        Main.height = Main.canvas.height;
        Button.width = 440;
        Button.height = 110;
        const showAds = true;
        if (showAds) {
            new Ads();
            this.start = new Menu(["PLAY GAME", "GO OUT"], [glob.EVENT_PLAY_ADS, glob.EVENT_EXIT]);
            this.final = new Menu(["PLAY AGAIN", "GO OUT"], [glob.EVENT_PLAY_ADS, glob.EVENT_EXIT]);
            Main.info = 'keyboard control(arrows + Enter + Backspace)';
        } else {
            this.start = new Menu(["PLAY GAME", "GO OUT"], [glob.EVENT_PLAY_GAME, glob.EVENT_EXIT]);
            this.final = new Menu(["PLAY AGAIN", "GO OUT"], [glob.EVENT_PLAY_GAME, glob.EVENT_EXIT]);
            Main.canvas.addEventListener("mousedown", (e)=>{this.keyDownHandler({key:'Enter'})});
            Main.canvas.addEventListener("mousemove", (e)=>{this.mouseMove(e)});
            Main.info = 'control mouse or keyboard(arrows + Enter + Backspace)';
        }
        this.game = new Game();
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
        this.start.drawNew(-1);
        document.addEventListener("keydown", (e)=>{this.keyDownHandler(e)});
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
        Main.busy = false;
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

    mouseMove(e) {
        if(Main.busy) return;
        var rect = Main.canvas.getBoundingClientRect();
        this[this.state].mouseMove((e.clientX - rect.left), (e.clientY - rect.top));
    }
}

window.onload = ()=>{
    new Main();
};

