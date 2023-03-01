import AbstractViewComponent from "../../abstract/AbstractViewComponent";

import './Display.scss'

export default class DisplayView extends AbstractViewComponent {
    render(value = 0) {
        this._root.innerHTML = ''
        this._root.classList.add('display')

        for(let i = 0; i < 3; i++) {
            const digit = (Math.floor(value/Math.pow(10, 2-i)))%10

            const el = document.createElement('div')
            el.classList.add('digit', `digit_${digit}`)

            this._root.appendChild(el)
        }
    }
}