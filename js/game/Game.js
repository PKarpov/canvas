class Game {
    constructor () {
        this.artist = new Artist();
        this.allLines = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[2, 0], [1, 1], [0, 2]],
        ];
        this.allCells = [
            {sign: -1, row: 0, col: 0, lines: [0,4,6]},
            {sign: -1, row: 0, col: 1, lines: [0,4]},
            {sign: -1, row: 0, col: 2, lines: [0,5,7]},
            {sign: -1, row: 1, col: 0, lines: [1,3]},
            {sign: -1, row: 1, col: 1, lines: [1,4,6,7]},
            {sign: -1, row: 1, col: 2, lines: [1,5]},
            {sign: -1, row: 2, col: 0, lines: [2,3,7]},
            {sign: -1, row: 2, col: 1, lines: [2,4]},
            {sign: -1, row: 2, col: 2, lines: [2,5,6]}
        ];

        this.cellsMatrix = [[], [], []];
        for (let cell of this.allCells) {
            this.cellsMatrix[cell.row][cell.col] = cell;
        }
        this.veryFirst = false;
    }

    drawNew() {
        this.freeCells = new Map();
        for(let cell of this.allCells) {
            cell.sign = -1;
            this.freeCells.set(cell, {cell: cell, forAuto:{}});
        }
        this.row = 1;
        this.col = 1;

        Main.busy = true;
        Main.ctx.beginPath();
        this.artist.drawLines(this.artist.getField())
            .then(()=>{
                this.veryFirst = !this.veryFirst;
                this.youSign = this.veryFirst ? 1 : 0;
                this.aiSign = this.veryFirst ? 0 : 1;
                this.youTurn = this.veryFirst;
                Main.busy = !this.youTurn;
                if (!this.youTurn) {
                    this.autoMove();
                }
                this.artist.redrawCell(this.col, this.row, true);
            });
    }

    takeAction(key) {
        let row = this.row;
        let col = this.col;
        let cell = this.cellsMatrix[row][col];
        if (key === "Enter") {
            if(this.freeCells.has(cell)) {
                this.makeMove(cell, this.youSign)
            }
            return;
        }

        if (key === "ArrowUp") {
            --row;
        } else if (key === "ArrowDown") {
            ++row;
        } else if (key === "ArrowRight") {
            ++col;
        } else if (key === "ArrowLeft") {
            --col
        }
        if (col > -1 && col < 3 && row > -1 && row < 3) {
            this.artist.redrawCell(this.row, this.col, false, this.cellsMatrix[this.row][this.col].sign);
            this.artist.redrawCell(row, col,true, this.cellsMatrix[row][col].sign);
            this.col = col;
            this.row = row;
        }
    }

    makeMove (cell, sign) {
        cell.sign = sign;
        this.freeCells.delete(cell);
        Main.busy = true;
        if (sign === 0) {
            this.artist.startDrawingZero(cell.col, cell.row)
                .then(()=>{
                    this.checkField(cell);
                })
        } else {
            this.artist.drawLines(this.artist.getCross(cell.col, cell.row),30)
                .then(()=>{
                    this.checkField(cell);
                })
        }
    }

    checkField(cell) {
        let lines = cell.lines;
        const sign = cell.sign;
        let ok, line;
        for (line of lines) {
            ok = true;
            for (let rc of this.allLines[line]) {
                if (this.cellsMatrix[rc[0]][rc[1]].sign !== sign) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                break;
            }
        }

        if (!ok) {
            if (this.freeCells.size === 0) {
                document.dispatchEvent(new CustomEvent(glob.EVENT_END_GAME, { 'detail': 'Field full.' }));
            } else {
                this.youTurn = !this.youTurn;
                Main.busy = !this.youTurn;
                if(!this.youTurn) {
                    this.autoMove();
                }
            }
        } else {
            this.artist.redrawCell(cell.row, cell.col, false, cell.sign);
            this.artist.drawWin(...this.allLines[line][0], ...this.allLines[line][2])
                .then(() => {
                    const label = this.youTurn ? 'You WON!!!' : 'You LOSE.';
                    setTimeout(() => {
                        document.dispatchEvent(new CustomEvent(glob.EVENT_END_GAME, {'detail': label}));
                    }, 700);
                })
        }
    }

    autoMove(){
        setTimeout(()=>{
            const cell = this.freeCells.get([...this.freeCells.keys()][Math.floor(Math.random() * this.freeCells.size)]).cell;
            this.makeMove(cell, this.aiSign);
        }, (200 + Math.random() * 500))
    }
}
