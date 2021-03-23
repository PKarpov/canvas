class Artist {
    constructor ( ) {
        this.lineWidth = 12;
        this.color = "#52649f";
        this.size = 200;
        this.padSize = 184;
        this.crossSize = 50;
        this.zeroSize = 60;
        this.X0 = Main.width * 0.5 - this.size;
        this.Y0 = Main.height * 0.5 - this.size;
    }

    getField(){
        const ctx = Main.ctx;
        ctx.clearRect(0, 0, Main.width, Main.height);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.lineCap = "round";

        const dy = 70;
        const ww = Main.height - dy * 2;
        let x0 = (Main.width - this.size) * 0.5;
        let x1 = (Main.width + this.size) * 0.5;
        let y0 = dy;
        let y1 = Main.height - dy;
        const xy = [[x0, y0, x0, y1],[x1, y0, x1, y1]];

        x0 = (Main.width - ww) * 0.5;
        x1 = (Main.width + ww) * 0.5;
        y0 = (Main.height - this.size) * 0.5;
        y1 = (Main.height + this.size) * 0.5;
        xy.push([x0, y0, x1, y0], [x0, y1, x1, y1]);

        return xy;
    }

    static drawHelp() {
        const ctx = Main.ctx;
        ctx.fillStyle = "#ffc448";
        ctx.font = "24px system-ui";
        ctx.textAlign  = "left";
        ctx.fillText('keyboard control (arrows + Enter + Backspace)', 20, 710);
    }

    async drawLines(lines, speed = 70) {
        for (let line of lines) {
            await this.startDrawingLine(...line, speed);
        }
    }

    startDrawingLine(x0, y0, x1, y1, speed = 70, win) {
        this.x0 = x0;
        this.y0 = y0;
        const dx = (x1 - x0);
        const dy = (y1 - y0);
        this.steps = Math.round(Math.sqrt(dx ** 2 + dy ** 2) / speed);
        this.dx = dx / this.steps;
        this.dy = dy / this.steps;
        if (win) {
            this.x0 -= this.dx * 2;
            this.y0 -= this.dy * 2;
            this.steps += 4;
        }
        requestAnimationFrame(() => this.drawingLine());
        return new Promise((resolve)=>{
            this.resolve = resolve;
        });
    }

    drawingLine() {
        if (this.steps-- > 0) {
            const xx = this.x0 + this.dx;
            const yy = this.y0 + this.dy;
            this.drawSegment(this.x0, this.y0, xx, yy);
            requestAnimationFrame(() => this.drawingLine());
            this.x0 = xx;
            this.y0 = yy;
        } else if (this.resolve){
            this.resolve();
            this.resolve = null;
        }
    }

    redrawCell(row, col, pad, sign) {
        const ctx = Main.ctx;
        const x0 = this.X0 + col * this.size;
        const y0 = this.Y0 + row * this.size;
        const xx = x0 - this.padSize * 0.5;
        const yy = y0 - this.padSize * 0.5;
        ctx.clearRect(xx, yy, this.padSize, this.padSize);
        ctx.fillStyle = "#fbffd1";
        if (pad) {
            ctx.fillRect(xx, yy, this.padSize, this.padSize);
        }
        if (sign === 0) {
            ctx.beginPath();
            ctx.arc(x0,y0,this.zeroSize,0,Math.PI*2);
            ctx.stroke();
        } else if (sign === 1){
            const dd = this.crossSize;
            this.drawSegment((x0 - dd), (y0 - dd), (x0 + dd), (y0 + dd));
            this.drawSegment((x0 - dd), (y0 + dd), (x0 + dd), (y0 - dd));
        }
    }

    drawSegment(x0, y0, x1, y1){
        const ctx = Main.ctx;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

    drawingZero () {
        if (this.angle < Math.PI * 2) {
            const angle = this.angle + this.dAngle;
            const ctx = Main.ctx;
            ctx.beginPath();
            ctx.arc(this.x0, this.y0, this.zeroSize, this.angle, angle);
            ctx.stroke();
            this.angle = angle;
            requestAnimationFrame(() => this.drawingZero());
        } else if (this.resolve){
            this.resolve();
            this.resolve = null;
     }
    }

    startDrawingZero (col, row) {
        this.x0 = this.X0 + col * this.size;
        this.y0 = this.Y0 + row * this.size;
        this.angle = 0;
        this.dAngle = 0.4;
        requestAnimationFrame(() => this.drawingZero());
        return new Promise((resolve)=>{
            this.resolve = resolve;
        });
    }

    getCross(col, row) {
        const dd = this.crossSize;
        const x0 = this.X0 + col * this.size;
        const y0 = this.Y0 + row * this.size;
        const xy = [[(x0 - dd), (y0 - dd), (x0 + dd), (y0 + dd)], [(x0 - dd), (y0 + dd), (x0 + dd), (y0 - dd)]];
        return xy;
    }

    drawWin(r0, c0, r1, c1) {
        Main.ctx.beginPath();
        Main.ctx.strokeStyle = "#ff0000";
        const x0 = this.X0 + c0 * this.size;
        const y0 = this.Y0 + r0 * this.size;
        const x1 = this.X0 + c1 * this.size;
        const y1 = this.Y0 + r1 * this.size;
        return this.startDrawingLine(x0, y0, x1, y1, 40, true);
    }
}
