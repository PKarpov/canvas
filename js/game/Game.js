class Game {
    constructor () {
        this.artist = new Artist();
        this.allLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2],
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
        let line, ok;
        for (line of cell.lines) {
            ok = true;
            for (let index of this.allLines[line]) {
                if (this.allCells[index].sign !== sign) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                break;
            }
        }

        if (ok) {
            this.artist.redrawCell(cell.row, cell.col, false, cell.sign);
            const cell0 = this.allCells[this.allLines[line][0]];
            const cell2 = this.allCells[this.allLines[line][2]];
            this.artist.drawWin(cell0.row, cell0.col, cell2.row, cell2.col)
                .then(() => {
                    const label = this.youTurn ? 'You WON!!!' : 'You LOSE.';
                    setTimeout(() => {
                        document.dispatchEvent(new CustomEvent(glob.EVENT_END_GAME, {'detail': label}));
                    }, 700);
                })
        } else {
            if (this.freeCells.size === 0) {
                document.dispatchEvent(new CustomEvent(glob.EVENT_END_GAME, { 'detail': 'Field full.' }));
            } else {
                this.youTurn = !this.youTurn;
                Main.busy = !this.youTurn;
                if(!this.youTurn) {
                    this.autoMove();
                }
            }
        }
    }

    autoMove(){
        setTimeout(()=>{
            let youCells, aiCells, sign, winLine, cell;
            for (let line of this.allLines) {
                youCells = 0;
                aiCells = 0;
                for(let index of line) {
                    sign = this.allCells[index].sign
                    if (sign === this.youSign) {
                        ++youCells;
                    } else if(sign === this.aiSign) {
                        ++aiCells;
                    }
                }
                if (youCells>1 && aiCells===0) {
                    winLine = line;
                } else if (aiCells>1 && youCells===0) {
                    winLine = line;
                    break;
                }
            }
            if (winLine) {
                for(let index of winLine) {
                    cell = this.allCells[index];
                    if (cell.sign === -1) {
                        break;
                    }
                }
            } else {
                cell = this.freeCells.get([...this.freeCells.keys()][Math.floor(Math.random() * this.freeCells.size)]).cell;
            }

            this.makeMove(cell, this.aiSign);
        }, (300 + Math.random() * 400))
    }
}
