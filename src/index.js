import './style.scss'
import Game from './game/Game'

document.addEventListener('DOMContentLoaded', () => {
    new Game({
        rootNode: document.querySelector('.root'),
        fieldX: 20,
        fieldY: 10,
        minesCount: 2
    })
})