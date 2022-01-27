class Game {

    game;
    context;
    board;
    record;

    // preview area
    next;
    previewCanvas;
    previewContext;
    previewBoard;

    gameLoop;
    gameFall;

    constructor() {
        this.setup();
        this.previewSetup();
        this.listenEvent();
    }

    setup() {
        // canvas
        this.game = document.getElementById('game');
        this.context = this.game.getContext('2d');

        // size
        this.game.width = BOARD_WIDTH;
        this.game.height = BOARD_HEIGHT;
        // this.game.style.width = BOARD_WIDTH + 'px';
        // this.game.style.height = BOARD_VISIBLE_HEIGHT + 'px';
        this.game.style.aspectRatio = BOARD_WIDTH + '/' + BOARD_VISIBLE_HEIGHT;

        // record
        this.resetRecord();

        // board
        this.board = new Board(this.context);
        this.board.clear();
    }

    previewSetup() {
        // canvas
        this.previewCanvas = document.getElementById('preview-canvas');
        this.previewContext = this.previewCanvas.getContext('2d');
    }

    start() {
        this.board.resetData();
        this.getNewPiece();
        this.drawNextPiece();
        if (this.record != 0) this.resetRecord();
        this.hideMessage();
        this.showPauseBtn();
        this.loop();
        this.fall();
    }

    isPause() {
        if (!this.gameFall) return true;
        return false;
    }

    pause() {
        if (this.gameFall) this.stopfall();
        this.showMessage('pause');
    }

    continue() {
        if (!this.gameFall) this.fall();
        this.hideMessage();
    }

    loop() {
        if (!this.gameLoop) {
            this.gameLoop = setInterval(() => {
                this.board.clear();
                this.board.draw();
                if (this.piece) this.piece.draw();
            }, 16);
        }
    }

    stopLoop() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = null;
    }

    showRecord() {
        document.querySelector('.record .numb').innerHTML = this.record;
    }

    resetRecord() {
        this.record = 0;
        this.showRecord();
    }

    drawNextPiece() {
        this.next = new Piece();

        // size
        var length = this.next.data.length;
        var size = (DOT_SIZE + SPACE) * length - SPACE;

        // canvas size
        this.previewCanvas.width = size;
        this.previewCanvas.height = size;

        // board
        this.previewBoard = new Board(this.previewContext, length, length, size, size);
        this.previewBoard.clear();

        // draw
        this.next.setup(0, 0, this.previewContext, this.previewBoard);
        this.next.draw();
    }

    fall() {
        if (!this.gameFall) {
            this.gameFall = setInterval(() => {
                this.piece.fall();
                this.hitBottom();
            }, FALL_SPEED);
        }
    }

    stopfall() {
        clearInterval(this.gameFall);
        this.gameFall = null;
    }

    hitBottom() {
        if (!this.piece.canFall()) {
            this.board.appendToBoard(this.piece);
            this.checkFullRow();
            this.checkGameOver();
        }
    }

    checkFullRow() {
        this.board.data.forEach((row, index) => {
            var rowIsFull = !row.includes(EMPTY);
            if (rowIsFull) {
                this.board.removeRow(index);
                this.record++;
                this.showRecord();
            }
        })
    }

    checkGameOver() {
        if (!this.isGameOver()) {
            this.getNewPiece();
            this.drawNextPiece();
        } else {
            this.gameOver();
        }
    }

    getNewPiece() {
        this.piece = this.next ? this.next : new Piece();
        this.piece.setup(0, START_COL, this.context, this.board);
        this.piece.makeAppear();
    }

    isGameOver() {
        if (this.board.hasNoEmptyRow()) return true;
        return false;
    }

    gameOver() {
        this.stopLoop();
        this.stopfall();
        this.piece = null;
        this.next = null;
        this.previewBoard.clear();
        this.showMessage('game over');
        this.showStartBtn();
    }

    showMessage(text) {
        document.querySelector('.game-message').style.display = 'block';
        document.querySelector('.game-message .message').innerHTML = text;
    }

    hideMessage() {
        document.querySelector('.game-message').style.display = 'none';
        document.querySelector('.game-message .message').innerHTML = '';
    }

    showStartBtn() {
        document.querySelector('.game-start').style.display = 'block';
        document.querySelector('.game-pause').style.display = 'none';
        document.querySelector('.game-continue').style.display = 'none';
    }

    showPauseBtn() {
        document.querySelector('.game-start').style.display = 'none';
        document.querySelector('.game-pause').style.display = 'block';
        document.querySelector('.game-continue').style.display = 'none';
    }

    showContinueBtn() {
        document.querySelector('.game-start').style.display = 'none';
        document.querySelector('.game-pause').style.display = 'none';
        document.querySelector('.game-continue').style.display = 'block';
    }

    listenEvent() {
        // keyboard
        document.body.addEventListener('keydown', (event) => {
            if (!this.isGameOver() && !this.isPause()) {
                this.keyboardEvent(event);
            }
        });

        // btn
        window.addEventListener('DOMContentLoaded', () => { this.btnEvent() });
    }

    keyboardEvent(event) {
        switch (event.code) {
            case 'ArrowDown': this.piece.goBottom();
                break;
            case 'ArrowRight': this.piece.goRight();
                break;
            case 'ArrowLeft': this.piece.goLeft();
                break;
            case 'ArrowUp': this.piece.rotate();
                break;
            case 'Space': this.piece.goBottom();
                break;
        }
    }

    btnEvent() {
        var startBtn = document.querySelector('.game-start');
        var pauseBtn = document.querySelector('.game-pause');
        var continueBtn = document.querySelector('.game-continue');

        // start
        startBtn.addEventListener('click', () => {
            game.start();
            this.showPauseBtn();
        });

        // pause
        pauseBtn.addEventListener('click', () => {
            game.pause();
            this.showContinueBtn();
        });

        // continue
        continueBtn.addEventListener('click', () => {
            game.continue();
            this.showPauseBtn();
        });
    }

}

var game = new Game();