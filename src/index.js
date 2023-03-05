import './style.scss'
import Game from './game/Game'

document.addEventListener('DOMContentLoaded', () => {
    new Game({
        rootNode: document.querySelector('.root'),
        fieldX: 16,
        fieldY: 16,
        minesCount: 40
    })
})