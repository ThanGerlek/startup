const DEFAULT_BOARD_DIMENSIONS = [1, 3, 5, 7];

function markElementTaken(element) {
    // TODO. css: Replace opacity with a bootstrap mask
    element.style.opacity = "0.5";
}

function markElementNotTaken(element) {
    element.style.opacity = "1.0";
}

function constructGamepieceElement(onclickListener) {
    const gamepieceElement = document.createElement('input');
    gamepieceElement.type = "image";
    gamepieceElement.alt = "matchstick";
    gamepieceElement.height = 50;
    gamepieceElement.src = "img/150-750-matchstick.png";
    gamepieceElement.className = "px-2";

    gamepieceElement.addEventListener('click', onclickListener);

    return gamepieceElement;
}

function constructRowContainerElement() {
    const rowContainerElement = document.createElement('div');
    rowContainerElement.className = "container py-2 d-flex justify-content-around";
    return rowContainerElement;
}

class Gamepiece {
    #taken = false;
    #gamepieceElement;

    constructor(gamepieceElement) {
        if (gamepieceElement) {
            this.#gamepieceElement = gamepieceElement;
            markElementNotTaken(gamepieceElement);
            gamepieceElement.addEventListener('click', () => this.toggleIsTaken());
        } else {
            this.#gamepieceElement = null;
        }
    }

    isTaken() {
        return this.#taken;
    }

    toggleIsTaken() {
        this.setIsTaken(!this.isTaken());
    }

    setIsTaken(taken) {
        this.#taken = taken;
        this.updateElement();

    }

    updateElement() {
        if (this.#gamepieceElement) {
            if (this.isTaken()) {
                markElementTaken(this.#gamepieceElement);
            } else {
                markElementNotTaken(this.#gamepieceElement);
            }
        }
    }
}

class Row {
    #pieces;
    #size;
    #rowContainerElement;

    constructor(size, rowContainerElement) {
        this.#pieces = [];
        this.#size = size;
        this.#rowContainerElement = rowContainerElement;

        for (let i = 0; i < size; i++) {
            this.addNewGamepiece();
        }
    }

    size() {
        return this.#size;
    }

    isTaken(pieceIndex) {
        return this.#pieces[pieceIndex].isTaken();
    }

    markTaken(pieceIndex) {
        let piece = this.#pieces[pieceIndex];
        if (!piece.isTaken()) {
            piece.setIsTaken(true);
        }
    }

    numPiecesLeft() {
        let numLeft = 0;
        for (let i = 0; i < this.#size; i++) {
            if (!this.isTaken(i)) {
                numLeft++;
            }
        }
        return numLeft;
    }

    addNewGamepiece() {
        let gamepieceElement = null;
        if (this.#rowContainerElement) {
            gamepieceElement = constructGamepieceElement();
            this.#rowContainerElement.appendChild(gamepieceElement);
        }
        this.#pieces.push(new Gamepiece(gamepieceElement));
    }

    copyStateFrom(otherRow) {
        this.fromArray(otherRow.toArray());
    }

    fromArray(pieces) {
        if (this.size() !== pieces.length) {
            throw new Error("Mismatched row sizes when calling row.fromArray()");
        }
        for (let i = 0; i < this.size(); i++) {
            this.#pieces[i].setIsTaken(pieces[i]);
        }
    }

    toArray() {
        const arr = [];
        this.#pieces.forEach(piece => arr.push(piece.isTaken()));
        return arr;
    }
}

class Board {
    #rows;
    #boardContainerElement;

    constructor(boardDimensions, boardContainerElement) {
        this.#rows = [];
        this.#boardContainerElement = boardContainerElement;

        let numRows = boardDimensions.length;
        for (let i = 0; i < numRows; i++) {
            let rowSize = boardDimensions[i];
            this.addNewRow(rowSize);
        }
    }

    numPiecesLeft() {
        let numLeft = 0;
        for (let i = 0; i < this.#rows.length; i++) {
            numLeft += this.#rows[i].numPiecesLeft();
        }
        return numLeft;
    }

    isTaken(rowIndex, pieceIndex) {
        return this.#rows[rowIndex].isTaken(pieceIndex);
    }

    markTaken(rowIndex, pieceIndex) {
        this.#rows[rowIndex].markTaken(pieceIndex);
    }

    addNewRow(rowSize) {
        let rowContainerElement = null;
        if (this.#boardContainerElement) {
            rowContainerElement = constructRowContainerElement();
            this.#boardContainerElement.appendChild(rowContainerElement);
        }
        this.#rows.push(new Row(rowSize, rowContainerElement));
    }

    copyStateFrom(otherBoard) {
        this.fromArray(otherBoard.toArray());
    }

    compareRows(otherBoard) {
        let rowDiffs = [];
        for (let i = 0; i < this.#rows.length; i++) {
            let rowDiff = this.#rows[i].numPiecesLeft() - otherBoard.#rows[i].numPiecesLeft();
            rowDiffs.push(rowDiff);
        }
        return rowDiffs;
    }

    fromArray(rows) {
        if (this.#rows.length !== rows.length) {
            throw new Error("Mismatched numbers of rows when calling board.fromArray()");
        }
        rows.forEach
        for (let i = 0; i < this.#rows.length; i++) {
            this.#rows[i].fromArray(rows[i]);
        }
    }

    toArray() {
        const arr = [];
        this.#rows.forEach(row => arr.push(row.toArray()));
        return arr;
    }
}

export {Board, DEFAULT_BOARD_DIMENSIONS};