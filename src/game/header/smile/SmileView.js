import AbstractViewComponent from "../../abstract/AbstractViewComponent";
import { EVT } from "../../EventEmitter";

import './Smile.scss'

export default class SmileView extends AbstractViewComponent {
    #pressed = false

    constructor(root, eventEmitter) {
        super(root, eventEmitter)
        this.status = 'normal'
        this.render(this.status)
    }

    /**
     * @param {'normal'|'pressed'|'waiting'|'win'|'lose'} state 
     */
    render(state) {
        this._root.innerHTML = ''
        const el = document.createElement('div')
        el.classList.add('smile', `smile_${state}`)
        this._root.appendChild(el)
    }

    bindEvents() {
        this._root.addEventListener('mousedown', () => {
            this.#pressed = true
            this.render('pressed')
        })
        this._root.addEventListener('mouseleave', () => {
            if (this.#pressed) {
                this.#pressed = false
                this.render('normal')
            }
        })
        this._root.addEventListener('mouseup', () => {
            if (this.#pressed) {
                this.#pressed = false
                this.render('normal')
                this._eventEmitter.emit(EVT.restart)
            }  
        })
        this._eventEmitter.on(EVT.win, () => this.render('win'))
        this._eventEmitter.on(EVT.lose, () => this.render('lose'))
        this._eventEmitter.on(EVT.smileUpdated, (status) => {
            if (status === 'no_waiting') {
                if (this.status !== 'waiting') return 
                status = 'normal' 
            }
            this.status = status
            this.render(status)
        })
    }
}