class Menu {
    constructor (buttons, events) {
        this.buttons = [];
        this.events = events;
        this.quantity = buttons.length;
        for (let i = 0; i < this.quantity; i++) {
            this.buttons.push(new Button(buttons[i], 300 + i * 150))
        }
    }

    drawNew(newId, label) {
        const ctx = Main.ctx;
        ctx.clearRect(0, 0, Main.width, Main.height);
        if (label) {
            ctx.fillStyle = "#ffc448";
            ctx.font = "100px system-ui";
            ctx.textAlign  = "center";
            ctx.fillText(label, Main.width * 0.5, 150);
        }
        this.selected = newId;
        for (let i = 0; i < this.quantity; i++) {
            if (i === newId) {
                this.buttons[i].drawActive();
            } else {
                this.buttons[i].drawNorm();
            }
        }
    }

    takeAction(key) {
        let newId = this.selected;
        if (key === "Enter") {
            document.dispatchEvent(new Event(this.events[this.selected]));
            return;
        } else if (key === "ArrowUp") {
            --newId;
        } else if (key === "ArrowDown") {
            ++newId;
        }
        if (newId > -1 && newId < this.quantity) {
            this.buttons[this.selected].drawNorm();
            this.buttons[newId].drawActive();
            this.selected = newId;
        }
    }
}
