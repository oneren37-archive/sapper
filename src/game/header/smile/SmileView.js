import AbstractViewComponent from "../../abstract/AbstractViewComponent";

import './Smile.scss'

export default class SmileView extends AbstractViewComponent {
    constructor(root, eventEmitter) {
        super(root, eventEmitter)
        this.render('normal')
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
            this.render('pressed')
        })
        this._root.addEventListener('mouseup', () => {
            this.render('normal')
            this._eventEmitter.emit('restart')
        })
        this._eventEmitter.on('win', () => this.render('win'))
        this._eventEmitter.on('lose', () => this.render('lose'))
        this._eventEmitter.on('waiting', () => this.render('waiting'))
        this._eventEmitter.on('game_continue', () => this.render('normal'))
    }
}