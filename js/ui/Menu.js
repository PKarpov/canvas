class Menu {
    constructor (buttons, events) {
        this.buttons = [];
        this.events = events;
        this.hitAreas = [];
        let button;
        for (let i = 0; i < buttons.length; i++) {
            button = new Button(buttons[i], 300 + i * 150);
            this.buttons.push({button, area: button.hitArea});
        }
    }

    drawNew(select, label) {
        const ctx = Main.ctx;
        // Main.ctx.clearRect(0, 0, Main.width, Main.height);
        if (label) {
            ctx.fillStyle = "#ffc448";
            ctx.font = "100px system-ui";
            ctx.textAlign  = "center";
            ctx.fillText(label, Main.width * 0.5, 150);
        }
        this.selected = select;
        for (let i = 0; i < this.buttons.length; i++) {
            if (i === select) {
                this.buttons[i].button.drawActive();
            } else {
                this.buttons[i].button.drawNorm();
            }
        }
        Main.busy = false;
    }

    takeAction(key) {
        let select = this.selected;
        if (key === "Enter") {
            if (this.selected !== -1) {
                Main.busy = true;
                document.dispatchEvent(new Event(this.events[this.selected]));
            }
            return;
        }

        if (key === "ArrowUp") {
            --select;
        } else if (key === "ArrowDown") {
            ++select;
        }
        if (this.selected === -1) {
            select = 0;
        }
        if (select > -1 && select < this.buttons.length) {
            if(this.selected !== -1)this.buttons[this.selected].button.drawNorm();
            this.buttons[select].button.drawActive();
            this.selected = select;
        }
    }

    mouseMove(x, y) {
        let area;
        let hit = -1;
        for (let i = 0; i < this.buttons.length; i++) {
            let [x0, y0, x1, y1] = this.buttons[i].area;
            if (x > x0 && x < x1) {
                if (y > y0 && y < y1) {
                    hit = i;
                    break;
                }
            }
        }
        if (hit !== this.selected) {
            if (this.selected !== -1) this.buttons[this.selected].button.drawNorm();
            if (hit !== -1) this.buttons[hit].button.drawActive();
            this.selected = hit;
        }
        if (hit === -1 && document.body.style.cursor != "default") {
            document.body.style.cursor = "default";
        } else if (hit > -1 && document.body.style.cursor != "pointer"){
            document.body.style.cursor = "pointer";
        }
    }
}
