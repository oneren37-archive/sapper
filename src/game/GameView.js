import AbstractViewComponent from "./abstract/AbstractViewComponent"
import BoardView from "./board/BoardView"
import HeaderView from "./header/HeaderView"

export default class GameView extends AbstractViewComponent {
    constructor (root, eventEmitter) {
        super(root, eventEmitter)
        this.render()
    }

    render() {
        this.header = new HeaderView(
            document.querySelector('.header'),
            this._eventEmitter
        )

        const boardRoot = document.createElement('div')
        this.board = new BoardView(boardRoot, this._eventEmitter)
        this._root.appendChild(boardRoot)
    }
}