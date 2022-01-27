class Dot {
    constructor(row, col, color, context, board) {
        this.row = row;
        this.col = col;
        this.context = context;
        this.board = board;
        this.color = color; 
    }

    hitBottom() {
        if (this.row + 1 == BOARD_ROWS) {
            return true;
        }
        return false;
    }

    canFall() {
        var nextRow = this.row + 1;
        if (this.hitBottom()) return false;
        if (this.board.data[nextRow][this.col] != EMPTY) return false;
        return true;
    }

    fall() {
        if (this.canFall()) this.row++;
    }

    goBottom() {
        while (this.canFall()) this.fall();
    }

    hitRight() {
        if (this.col + 1 == BOARD_COLS) return true;
        return false;
    }

    canGoRight() {
        var nextRightCol = this.col + 1;
        if (this.hitRight()) return false;
        if (this.board.data[this.row][nextRightCol] != EMPTY) return false;
        return true;
    }

    goRight() {
        if (this.canGoRight()) this.col++;
    }

    hitLeft() {
        if (this.col == 0) return true;
        return false;
    }

    canGoLeft() {
        var nextLeftCol = this.col - 1;
        if (this.hitLeft()) return false;
        if (this.board.data[this.row][nextLeftCol] != EMPTY) return false;
        return true;
    }

    goLeft() {
        if (this.canGoLeft()) this.col--;
    }

    draw() {
        this.x = this.col * (DOT_SIZE + SPACE);
        this.y = this.row * (DOT_SIZE + SPACE);
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, DOT_SIZE, DOT_SIZE);
    }
}