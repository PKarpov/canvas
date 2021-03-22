class Game {
    constructor () {
        this.artist = new Artist();
        this.allLines = [
            [[0,0],[0,1],[0,2]],
            [[1,0],[1,1],[1,2]],
            [[2,0],[2,1],[2,2]],
            [[0,0],[1,0],[2,0]],
            [[0,1],[1,1],[2,1]],
            [[0,2],[1,2],[2,2]],
            [[0,0],[1,1],[2,2]],
            [[2,0],[1,1],[0,2]],
        ]
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
        this.youTurn = false;
    }

    drawNew(youTurn) {
        for (let cell of this.allCells) {
            cell.sign = -1;
        }
        this.freeCells = new Map();
        for(let cell of this.allCells) {
            cell.sign = -1;
            this.freeCells.set(cell, -1);
        }
        this.row = 1;
        this.col = 1;

        Main.busy = true;
        this.artist.drawingField(this.col, this.row)
            .then(()=>{
                this.youTurn = !this.youTurn;
                this.putСross = true;
                Main.busy = !this.youTurn;
                if (!this.youFirst) {
                    this.autoMove();
                }
            });
    }

    takeAction(key) {
        let row = this.row;
        let col = this.col;
        let cell = this.cellsMatrix[row][col];
        if (key === "Enter") {
            if(this.freeCells.has(cell)) {
                this.makeMove(cell, true)
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
            this.artist.drawCell(this.row, this.col, false, this.cellsMatrix[this.row][this.col].sign);
            this.artist.drawCell(row, col,true, this.cellsMatrix[row][col].sign);
            this.col = col;
            this.row = row;
        }
    }

    makeMove (cell) {
        this.freeCells.delete(cell);
        Main.busy = true;
        if (this.putСross) {
            this.artist.startDrawingCross(cell.col, cell.row)
                .then(()=>{
                    cell.sign = 1;
                    this.checkField(cell);
                })
        } else {
            this.artist.startDrawingZero(cell.col, cell.row)
                .then(()=>{
                    cell.sign = 0;
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
            if (this.freeCells.length === 0) {
                document.dispatchEvent(new CustomEvent(glob.EVENT_END_GAME, { 'detail': 'Field full.' }));
            } else {
                this.freeCells
                Main.busy = false;

            }
        } else {
            this.artist.drawCell(cell.row, cell.col, false, cell.sign);
            console.log(...this.allLines[line][0], ...this.allLines[line][2]);
            this.artist.startDrawingWin(...this.allLines[line][0], ...this.allLines[line][2])
                .then(() => {
                    const labet = this.youTurn ? 'You WON!!!' : 'You LOSE.';
                    document.dispatchEvent(new CustomEvent(glob.EVENT_END_GAME, { 'detail': labet }));

                    console.log("you win!!!")
                })

            // this.artist.startDrawingWin(...this.allLines[line][0], ...this.allLines[line][2])
            //     .then(()=>{console.log("you win!!!")})
        }
        this.youTurn = !this.youTurn;
        this.putСross = !this.putСross;

    }

    autoMove(){
        setTimeout(()=>{
            const cell = this.freeCells.get([...this.freeCells.keys()][Math.floor(Math.random() * this.freeCells.size)]);
            this.makeMove(cell);
        }, (200 + Math.random() * 500))
    }

        // let line;
        // Main.busy = false;
        // while (lines.length) {
        //     let line = lines.shift();
        //
        //     if (this.cellsMatrix[this.l[0]][line[1]].sign === this.cellsMatrix[line[2]][line[3]].sign === this.cellsMatrix[line[4]][line[5]].sign){
        //         Main.busy = true;
        //         this.artist.drawCell(cell.col, cell.row, false, cell.sign)
                // console.dir(this.cellsMatrix[line[0]][line[1]]);
                // console.dir(this.cellsMatrix[line[2]][line[3]]);
                // console.dir(cell);
                // console.dir(line);
            //     const win = [].concat(line);
            //     win.push(cell.row, cell.col);
            // console.log(win);
            //     const r0 = Math.min(win[0], win[2], win[4]);
            //     const r1 = Math.max(win[0], win[2], win[4]);
            //     const c0 = Math.min(win[1], win[3], win[5]);
            //     const c1 = Math.max(win[1], win[3], win[5]);
            // console.log(c0, r0, c1, r1);
            //     this.artist.startDrawingWin(c0, r0, c1, r1)
            //         .then(()=>{console.log("you win!!!")})
            //     console.log(lines);

            // }
        // }
    // }


}
