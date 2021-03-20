class Game {
    constructor () {
        this.artist = new Artist();
    }

    drawNew() {
        this.row = 1;
        this.col = 1;
        this.field = [[-1,-1,-1],
            [-1,-1,-1],
            [-1,-1,-1]
        ];
        Main.busy = true;
        this.artist.drawingField(this.col, this.row)
            .then(()=>{
                this.yourTurn = true;
                Main.busy = false;
                console.log("!!!!!");
            });
    }

    takeAction(key) {
        let col = this.col;
        let row = this.row;
        if (key === "Enter") {
            if(this.field[this.row][this.col] > -1) return;
            Main.busy = true;
            if (this.yourTurn) {
                this.artist.startDrawingCross(this.col, this.row)
                    .then(()=>{
                        this.field[this.row][this.col] = 1;
                        this.checkField();
                    })
            } else {
                this.artist.startDrawingZero(this.col, this.row)
                    .then(()=>{
                        this.field[this.row][this.col] = 0;
                        this.checkField();
                })
            }
            this.yourTurn = !this.yourTurn;
            return;
        } else if (key === "ArrowUp") {
            --row;
        } else if (key === "ArrowDown") {
            ++row;
        } else if (key === "ArrowRight") {
            ++col;
        } else if (key === "ArrowLeft") {
            --col
        }

        if (col > -1 && col < 3 && row > -1 && row < 3) {
            this.artist.drawCell(this.col, this.row, false, this.field[this.row][this.col]);
            this.artist.drawCell(col, row, true, this.field[row][col]);
            this.col = col;
            this.row = row;
        }
    }

    checkField(){
        console.log("@@@@@@@@@@");
        Main.busy = false;

    }
}
