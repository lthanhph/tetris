class Piece {
    
    topLeftCornerRow;
    topLeftCornerCol;
    context;
    board;
    data;
    color;
    isReady;

    constructor() {
        this.getData();
        this.isReady = false;
    }

    getData() {
        var data = [
            [
                [_, _, _, _],
                [_, _, _, _],
                [x, x, x, x],
                [_, _, _, _]
            ],
            [
                [_, _, _, _],
                [_, x, x, _],
                [_, x, x, _],
                [_, _, _, _]
            ],
            [
                [_, _, _],
                [x, x, x],
                [_, x, _],
            ],
            [
                [_, x, _],
                [_, x, _],
                [x, x, _],
            ],
            [
                [_, x, _],
                [_, x, _],
                [_, x, x],
            ],
            [
                [_, _, _],
                [x, x, _],
                [_, x, x],
            ],
            [
                [_, _, _],
                [_, x, x],
                [x, x, _],
            ],
        ];

        var color = [RED, ORANGE, YELLOW, GREEN, CYAN, BLUE, PURPLE];

        var random = Math.floor(Math.random() * data.length);

        // set data and color
        this.data =  data[random];
        this.color = color[random];
    }

    createDot() {
        var newData = this.data;
        for (var row = 0; row < this.data.length; row++) {
            for (var col = 0; col < this.data[0].length; col++) {
                if (this.data[row][col] != EMPTY) {
                    var c = this.topLeftCornerCol + col;
                    var r = this.topLeftCornerRow + row;
                    newData[row][col] = new Dot(r, c, this.color, this.context, this.board);
                }
            }
        }
        this.data = newData;
    }

    setup(row, col, context, board) {
        this.topLeftCornerRow = row;
        this.topLeftCornerCol = col;
        this.context = context;
        this.board = board;
        this.createDot();

        this.isReady = true;
    }

    makeAppear() {
        do {
            this.fall();
        } while (this.notAppear());
    }

    notAppear() {
        var notAppear = true;
        this.loop((row, col) => {
            var dot = this.data[row][col];
            if (dot.row == START_VISIBLE) notAppear = false;
        });
        return notAppear;
    }


    canFall() {
        var canFall = true;
        if (!this.isReady) canFall = false;
        this.loop((row, col) => { if (!this.data[row][col].canFall()) canFall = false; return; });
        return canFall;
    }

    fall() {
        if (this.canFall()) {
            this.loop((row, col) => { this.data[row][col].fall(); });
            this.topLeftCornerRow++;
        }
    }

    goBottom() {
        while (this.canFall()) {
            this.loop((row, col) => { this.data[row][col].fall(); });
            this.topLeftCornerRow++; 
        }
    }

    canGoRight() {
        var canGoRight = true;
        this.loop((row, col) => { if (!this.data[row][col].canGoRight()) canGoRight = false; });
        return canGoRight;
    }

    goRight() {
        if (this.canGoRight()) {
            this.loop((row, col) => { this.data[row][col].goRight(); });
            this.topLeftCornerCol++; 
        }
    }

    canGoLeft() {
        var canGoLeft = true;
        this.loop((row, col) => { if (!this.data[row][col].canGoLeft()) canGoLeft = false; });
        return canGoLeft;
    }

    goLeft() {
        if (this.canGoLeft()) {
            this.loop((row, col) => { this.data[row][col].goLeft(); });
            this.topLeftCornerCol--;
        }
    }

    freeAreaIsReady() {
        var r; var c; var ready = true;
        for (var row = 0; row < this.data.length; row++) {
            for (var col = 0; col < this.data[0].length; col++) {
                if (this.data[row][col] == EMPTY) {
                    r = this.topLeftCornerRow + row;
                    c = this.topLeftCornerCol + col;
                    if (this.board.data[r][c] != EMPTY) ready = false;
                }
            }
        }
        return ready;
    }

    canRotate() {
        if (this.freeAreaIsReady()) return true;
    }

    rotate() {
        if (this.canRotate()) {
            var rotated = [];
            for (var col = 0; col < this.data[0].length; col++) {   
                var cell; var newRow = [];
                for (var row = this.data.length - 1; row >= 0; row--) {
                    newRow.push(this.data[row][col]);
                }
                rotated.push(newRow);
            }
            this.data = rotated;
            this.updateCoordinates();
        }
    }

    updateCoordinates() {
        var r; var c;
        this.loop((row, col) => {
            r = this.topLeftCornerRow + row;
            c = this.topLeftCornerCol + col;
            this.data[row][col] = new Dot(r, c, this.color, this.context, this.board);
        });
    }

    draw() {
        this.loop((row, col) => { this.data[row][col].draw(); });
    }

    loop(action) {
        for (var row = 0; row < this.data.length; row++) {
            for (var col = 0; col < this.data[0].length; col++) {
                if (typeof this.data[row][col] == 'object') {
                    action(row, col);
                }
            }
        }
    }
}