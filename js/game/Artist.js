class Artist {
    constructor ( ) {
        this.lineWidth = 12;
        this.color = "#52649f";
        this.radius = 130;
    }
    drawSection (x0, y0, x1, y1) {
        const ctx = Main.ctx;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

    async drawCircle(x0, y0) {

    }

    async showCircle(x0, y0) {

    }

    update() {
        var xx = this.x0 + this.dx;
        var yy = this.y0 + this.dy;
        this.drawSection(this.x0, this.y0, xx, yy);
        if (--this.steps > 0) {
            this.x0 = xx;
            this.y0 = yy;
            requestAnimationFrame(() => this.update());
        } else {
            this.resolve();
        }
    }

    drawLine(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        const dx = (x1 - x0);
        const dy = (y1 - y0);
        this.steps = Math.round(Math.sqrt(dx ** 2 + dy ** 2) / 30);
        this.dx = dx / this.steps;
        this.dy = dy / this.steps;
        Main.ctx.lineWidth = this.lineWidth;
        Main.ctx.strokeStyle = this.color;
        Main.ctx.lineCap = "round";


        requestAnimationFrame(() => this.update());
        return new Promise((resolve)=>{
            this.resolve = resolve;
        });
    }
}
