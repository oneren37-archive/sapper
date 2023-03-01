import AbstractViewComponent from "../abstract/AbstractViewComponent";
import CounterView from './counter/CounterView'
import SmileView from './smile/SmileView'
import TimeView from './time/TimeView'

import './Header.scss'

export default class HeaderView extends AbstractViewComponent {
    constructor(root, eventEmitter) {
        super(root, eventEmitter)
        this.render()
    }

    render() {
        const counterRoot = document.createElement('div')
        const smileRoot = document.createElement('div')
        const timeRoot = document.createElement('div')

        new CounterView(counterRoot, this._eventEmitter)
        new SmileView(smileRoot, this._eventEmitter)
        new TimeView(timeRoot, this._eventEmitter)

        this._root.appendChild(counterRoot)
        this._root.appendChild(smileRoot)
        this._root.appendChild(timeRoot)
    }
}