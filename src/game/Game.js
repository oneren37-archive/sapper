import EventEmitter from "./EventEmitter"
import GameDataModel from "./GameDataModel"
import GameView from "./GameView"

import './Game.scss'

export default class Game {
    constructor() {
        this.eventEmitter = new EventEmitter()
        this.dataModel = new GameDataModel(this.eventEmitter)
        this.view = new GameView(
            document.querySelector('.root'), 
            this.eventEmitter
        )
    }
}