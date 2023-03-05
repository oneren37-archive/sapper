import EventEmitter from "./EventEmitter"
import GameDataModel from "./GameDataModel"
import GameView from "./GameView"

import './Game.scss'

export default class Game {

    /**
     * 
     * @param {object} config 
     * @param {number} config.fieldX
     * @param {number} config.fieldY
     * @param {number} config.minesCount
     * @param {HTMLElement} config.rootNode
     */
    constructor(config) {
        this.eventEmitter = new EventEmitter()
        this.dataModel = new GameDataModel(this.eventEmitter, config)
        this.view = new GameView(config.rootNode,this.eventEmitter, config)
    }
}