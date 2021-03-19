class Button {
    constructor(label, y0){
        this.label = label;
        this.x0 = Main.width * 0.5;
        this.y0 = y0;
    }

    drawNorm () {
        const ctx = Main.ctx;
        ctx.fillStyle = "#dee3f5";
        ctx.fillRect(this.x0 - 220, this.y0 - 80, 440, 110);
        ctx.fillStyle = "#ffc448";
        ctx.font = "70px system-ui";
        ctx.textAlign  = "center";
        ctx.fillText(this.label, this.x0, this.y0);
    }

    drawActive () {
        const ctx = Main.ctx;
        ctx.fillStyle = "#7d87ee";
        ctx.fillRect(this.x0 - 220, this.y0 - 80, 440, 110);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#627dc3";
        ctx.strokeRect(this.x0 - 217, this.y0 - 77, 434, 104);
        ctx.fillStyle = "#ffc448";
        ctx.font = "70px system-ui";
        ctx.textAlign  = "center";
        ctx.fillText(this.label, this.x0, this.y0);
    }

}
