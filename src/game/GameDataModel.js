export default class DataModel {
    /**
     * @type {State}
     * @private 
    */
    #state

    /**
     * Расставляет случайно мины, с учетом того, что в первой выбранной пользователем клетке не должно быть мин
     * @param {Position} initalPick - первая клетка, выбранная пользователем
     */
    generateInitialState(initalPick) {
        // eventEmitter.emit('minesInited', )
    }
}

/**
 * Состояние приложения
 * @typedef State
 * @type {object}
 * @property {number[][]} mines - карта расположения мин
 * @property {boolean[][]} opened - карта открытых клеток
 * @property {number[][]} flags - карта флажков
 */
