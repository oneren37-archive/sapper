import AbstractViewComponent from "./abstract/AbstractViewComponent"
import BoardView from "./board/BoardView"
import HeaderView from "./header/HeaderView"

export default class GameView extends AbstractViewComponent {
    constructor (root, eventEmitter, config) {
        super(root, eventEmitter)
        this.render(config)
    }

    /**
     * 
     * @param {object} config 
     * @param {number} config.fieldX
     * @param {number} config.fieldY
     * @param {number} config.minesCount
     */
    render(config) {
        const headerRoot = document.createElement('header')
        headerRoot.classList.add('header')
        this._root.appendChild(headerRoot)

        this.header = new HeaderView(
            headerRoot,
            this._eventEmitter,
            {minesCount: config.minesCount}
        )

        const boardRoot = document.createElement('div')
        this.board = new BoardView(boardRoot, this._eventEmitter, config)
        this._root.appendChild(boardRoot)
    }
}