import AbstractViewComponent from "../abstract/AbstractViewComponent";

import './Board.scss'

export default class BoardView extends AbstractViewComponent {
    constructor(root, eventEmitter) {
        super(root, eventEmitter)
        this.render()
    }

    bindEvents() {
        this._eventEmitter.on('boardUpdated', this.render.bind(this))
        this._eventEmitter.on('win', this.preventClicks.bind(this))
        this._eventEmitter.on('lose', this.preventClicks.bind(this))
        this._eventEmitter.on('restart', this.allowClicks.bind(this))
    }

    stopCLickPropogation(e) {e.stopPropagation()}

    preventClicks() {
        this._root.addEventListener('mouseup', this.stopCLickPropogation, true)
        this._root.addEventListener('mousedown', this.stopCLickPropogation, true)
    }

    allowClicks() {
        this._root.removeEventListener('mouseup', this.stopCLickPropogation, true)
        this._root.removeEventListener('mousedown', this.stopCLickPropogation, true)
    }

    /** 
     * @param {MouseEvent} e
     * @param {0|1|2} flagState
     */
    handleMouseDown(e, flagState) {
        switch(e.button) {
            case 0: this._eventEmitter.emit('mousedown'); break;
            case 2: 
                if (flagState !== 0) {
                    e.target.classList.add('board-row__cell_question-pressed')
                }
                break;
        }
    }

    /**
     * @param {MouseEvent} e 
     * @param {Position}
     */
    handleMouseUp(e, pos) {
        const [i, j] = pos
        switch (e.button) {
            case 0: this._eventEmitter.emit('pick', [i, j]); break;
            case 2: this._eventEmitter.emit('r_pick', [i, j]); break;
            default: break;
        }
    }

    /**
     * @param {object} props
     * @param {number[][]} props.mines
     * @param {boolean[][]} props.opened
     * @param {number[][]} props.flags
     */
    render(props) {
        const ROWS = 16
        const COLS = 16

        this._root.innerHTML = ''
        const board = document.createElement('div')
        board.classList.add('board')
        
        for (let i = 0; i < ROWS; i++) {
            const row = document.createElement('div')
            row.classList.add('board-row')

            for (let j = 0; j < COLS; j++) {
                const cell = document.createElement('div')

                cell.addEventListener('contextmenu', (e) => e.preventDefault())
                cell.addEventListener('mousedown', (e) => this.handleMouseDown(e, props.flags[i][j]))
                cell.addEventListener('mouseup', (e) => this.handleMouseUp(e, [i, j]))
                cell.classList.add('board-row__cell')

                if (props) {
                    if (props.opened && props.opened[i][j]) {
                        cell.classList.add(`board-row__cell_${props.mines[i][j]}`)
                    }

                    switch(props.flags[i][j]) {
                        case 1: cell.classList.add('board-row__cell_flag'); break;
                        case 2: cell.classList.add('board-row__cell_question'); break;
                    }
                }

                row.appendChild(cell)
            }
            
            board.appendChild(row)
        }

        this._root.appendChild(board)
    }
}