import AbstractViewComponent from "../../abstract/AbstractViewComponent";
import DisplayView from "../display/DisplayView";

export default class CounterView extends AbstractViewComponent {
    constructor(root, eventEmitter, config) {
        super(root, eventEmitter)
        this.display = new DisplayView(this._root)
        this.minesCount = config.minesCount
        this.render(this.minesCount)
    }

    /**
     * @param {number} cnt 
     */
    render(cnt) {
        this.display.render(cnt)
    }

    bindEvents() {
        this._eventEmitter.on('flagsCountChanged', (cnt) => {
            this.render(cnt)
        })
        this._eventEmitter.on('restart', () => this.render(this.minesCount))
    }
}