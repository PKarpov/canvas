class Game {
    constructor () {
        this.artist = new Artist();
    }

    async drawNew() {
        Main.ready = false;
        Main.ctx.clearRect(0, 0, Main.width, Main.height);
        const dd = 200;
        const dy = 70;
        const ww = Main.height - dy * 2;
        let x0 = (Main.width - dd) * 0.5;
        let x1 = (Main.width + dd) * 0.5;
        let y0 = dy;
        let y1 = Main.height - dy;
        await this.artist.drawLine(x0, y0, x0, y1);
        await this.artist.drawLine(x1, y0, x1, y1);
        x0 = (Main.width - ww) * 0.5;
        x1 = (Main.width + ww) * 0.5;
        y0 = (Main.height - dd) * 0.5;
        y1 = (Main.height + dd) * 0.5;
        await this.artist.drawLine(x0, y0, x1, y0);
        await this.artist.drawLine(x0, y1, x1, y1);
        Main.ready = true;

        // this.exitBt.drawNorm();
        // this.playBt.drawActive();
    }
    takeAction(key) {

    }
}
