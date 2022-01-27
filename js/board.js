class Board {
    constructor(context, row = BOARD_ROWS, col = BOARD_COLS, width = BOARD_WIDTH, height = BOARD_HEIGHT) {
        this.context = context;
        this.row = row;
        this.col = col;
        this.width = width;
        this.height = height;
        this.data = this.getEmptyBoard();
    }

    getEmptyBoard() {
        var data = [];
        for (var row = 0; row < this.row; row++) {
            var newRow = [];
            for (var col = 0; col < this.col; col++) {
                newRow[col] = EMPTY;
            }
            data.push(newRow);
        }
        return data;
    }

    isEmptyBoard() {
        return this.data.every((row) => {
            return row.every((cell) => { return cell == EMPTY });
        });
    }

    resetData() {
        if (!this.isEmptyBoard()) this.data = this.getEmptyBoard();
    }

    appendToBoard(piece) {
        piece.loop((row, col) => {
            var dot = piece.data[row][col];
            this.data[dot.row][dot.col] = dot;
        });
    }

    removeRow(index) {
        // remove row
        this.data.splice(index, 1);

        // add new empty row to top board
        this.addNewEmptyRow();

        // update dots coordinates
        this.updateDotsCoordinates();
    }

    addNewEmptyRow() {
        var newRow = [];
        for (var i = 0; i < this.col; i++) {
            newRow.push(EMPTY);
        }
        this.data.unshift(newRow);
    }

    hasNoEmptyRow() {
        var hasNoEmptyRow = true;
        for (var row = this.row - 1; row >= START_VISIBLE; row--) {
            var isEmptyRow = this.data[row].every((cell) => { return cell == EMPTY });
            if (isEmptyRow) hasNoEmptyRow = false;
        }
        return hasNoEmptyRow;
    }

    updateDotsCoordinates() {
        for (var row = 0; row < this.row; row++) {
            for (var col = 0; col < this.col; col++) {
                if (typeof this.data[row][col] == 'object') {
                    var color = this.data[row][col].color;
                    this.data[row][col] = new Dot(row, col, color, this.context, this);
                }
            }
        }
    }

    clear() {
        this.context.fillStyle = BOARD_BG;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    draw() {
        for (var row = 0; row < this.row; row++) {
            for (var col = 0; col < this.col; col++) {
                if (typeof this.data[row][col] == 'object') {
                    this.data[row][col].draw();
                }
            }
        }
    }
}
