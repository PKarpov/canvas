class Button {
    constructor(label, y0){
        this.label = label;
        this.x0 = (Main.width - Button.width) * 0.5;
        this.y0 = y0;
        this.hitArea = [this.x0, y0, this.x0 + Button.width, y0 + Button.height];

    }

    drawNorm () {
        const ctx = Main.ctx;
        ctx.fillStyle = "#dee3f5";
        ctx.fillRect(this.x0, this.y0, Button.width, Button.height);
        ctx.fillStyle = "#ffc448";
        ctx.font = "70px system-ui";
        ctx.textAlign  = "center";
        ctx.fillText(this.label, Main.width * 0.5, this.y0 + 80);
    }

    drawActive () {
        const ctx = Main.ctx;
        ctx.fillStyle = "#7d87ee";
        ctx.fillRect(this.x0, this.y0, Button.width, Button.height);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#627dc3";
        ctx.strokeRect(this.x0 + 3, this.y0 + 3, Button.width - 6, Button.height - 6);
        ctx.fillStyle = "#ffc448";
        ctx.font = "70px system-ui";
        ctx.textAlign  = "center";
        ctx.fillText(this.label, Main.width * 0.5, this.y0 + 80);
    }
}
