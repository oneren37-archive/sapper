import AbstractViewComponent from "../abstract/AbstractViewComponent";
import { EVT } from "../EventEmitter";

import './Board.scss'

export default class BoardView extends AbstractViewComponent {
    constructor(root, eventEmitter, config) {
        super(root, eventEmitter)
        this.render(config)
    }

    bindEvents() {
        this._eventEmitter.on(EVT.boardUpdated, this.render.bind(this))
        this._eventEmitter.on(EVT.win, this.preventClicks.bind(this))
        this._eventEmitter.on(EVT.lose, this.preventClicks.bind(this))
        this._eventEmitter.on(EVT.restart, this.allowClicks.bind(this))
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
    handleMouseDown(e, flagState, openedState) {
        switch(e.button) {
            case 0: 
                if (flagState === 0 && !openedState) {
                    this._eventEmitter.emit(EVT.smileUpdated, 'waiting')
                } 
                break;
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
            case 0: this._eventEmitter.emit(EVT.pick, [i, j]); break;
            case 2: this._eventEmitter.emit(EVT.r_pick, [i, j]); break;
            default: break;
        }
    }

    /**
     * @param {object} props
     * @param {number[][]} props.mines
     * @param {boolean[][]} props.opened
     * @param {number[][]} props.flags
     * @param {number} props.fieldX
     * @param {number} props.fieldY
     */
    render(props) {
        const ROWS = props.fieldY
        const COLS = props.fieldX

        this._root.innerHTML = ''
        const board = document.createElement('div')
        board.classList.add('board')
        
        for (let i = 0; i < ROWS; i++) {
            const row = document.createElement('div')
            row.classList.add('board-row')

            for (let j = 0; j < COLS; j++) {
                const cell = document.createElement('div')

                cell.addEventListener('contextmenu', (e) => e.preventDefault())
                cell.addEventListener('mousedown', (e) => {
                    this.handleMouseDown(e, 
                        props.flags ? props.flags[i][j] : 0,
                        props.opened ? props.opened[i][j] : false,
                    )
                })
                cell.addEventListener('mouseup', (e) => this.handleMouseUp(e, [i, j]))
                cell.classList.add('board-row__cell')

                
                if (props.opened && props.opened[i][j]) {
                    cell.classList.add(`board-row__cell_${props.mines[i][j]}`)
                }

                if (props.flags) {
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