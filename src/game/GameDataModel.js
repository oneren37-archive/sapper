export default class GameDataModel {
    /**
     * @type {State}
     * @private 
    */
    #state

    constructor(eventEmitter) {
        this._eventEmitter = eventEmitter
        this.#state = {}
        this.minesCount = 40
        this.bindEvents()
    }

    bindEvents() {
        this._eventEmitter.on('pick', this.handlePick.bind(this))
        this._eventEmitter.on('r_pick', this.handleRightClick.bind(this))
        this._eventEmitter.on('restart', () => {
            this.#state = {}
            this._eventEmitter.emit('boardUpdated')
        })
        this._eventEmitter.on('mousedown', () => {
            this._eventEmitter.emit('waiting')
        })
    }

    /**@param {Positon} pos */
    handlePick(pos) {
        if (!this.#state.mines) {
            this.generateInitialState(pos)
        }

        if (this.#state.mines[pos[0]][pos[1]] === 9) {
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 16; j++) {
                    if (this.#state.mines[i][j] === 9) {
                        this.#state.opened[i][j] = true
                    }
                    else if (this.#state.flags[i][j] === 1) {
                        this.#state.flags[i][j] = 0
                        this.#state.opened[i][j] = true
                        this.#state.mines[i][j] = 11
                        console.log(this.#state.mines)
                    }
                }
            }   
            this.#state.mines[pos[0]][pos[1]] = 10
            this._eventEmitter.emit('lose')
        }
        else {
            this._eventEmitter.emit('game_continue')
            this.openField(pos)
        }

        this._eventEmitter.emit('boardUpdated', this.#state)
    }

    /**@param {Position} pos */
    handleRightClick(pos) {
        this.#state.flags = this.#state.flags || new Array(16).fill(0).map(() => new Array(16).fill(0))
        this.#state.flagsCount = this.#state.flagsCount || 0
        const [i, j] = pos

        if (this.#state.opened && this.#state.opened[i][j]) return 
        if (this.#state.flagsCount === this.minesCount && this.#state.flags[i][j] === 0) return

        this.#state.flags[i][j] = (this.#state.flags[i][j]+1)%3

        switch (this.#state.flags[i][j]) {
            case 1: this.#state.flagsCount += 1; break;
            case 2: this.#state.flagsCount -= 1; break;
        }

        this._eventEmitter.emit('flagsCountChanged', this.minesCount-this.#state.flagsCount)

        if (this.#state.flagsCount === this.minesCount) {
            this.checkWin()
        }

        this._eventEmitter.emit('boardUpdated', this.#state)
    }

    checkWin() {
        const mines = this.#state.mines
        const flags = this.#state.flags

        for (let i = 0; i < mines.length; i++) {
            for (let j = 0; j < mines[0].length; j++) {
                if (mines[i][j] === 9 && flags[i][j] !== 1) return  
            }
        }
        this._eventEmitter.emit('win')
    }

    /**
     * Возвращает массив индексов соседей для данной ячейки
     * @param {Position} pos
     * @returns {Position[]} 
     */
    getNeighbors(pos) {
        const neighbors = []
        for (let i = Math.max(pos[0]-1, 0); i <= Math.min(pos[0]+1, 15); i++) {
            for (let j = Math.max(pos[1]-1, 0); j <= Math.min(pos[1]+1, 15); j++) {
                if (pos[0] !== i || pos[1] !== j) {
                    neighbors.push([i, j])
                }
            }
        }
        return neighbors
    }

    /**
     * Рекурсивно открывает поля без мин поблизости
     * @param {Position} pos 
     */
    openField(pos) {
        const [i, j] = pos
        if (this.#state.opened[i][j] === true || this.#state.flags[i][j] !== 0) return 
        this.#state.opened[i][j] = true
        if (this.#state.mines[i][j] === 0) {
            this.getNeighbors(pos).forEach(cell => this.openField(cell))
        }
    }

    /**
     * Расставляет случайно мины, с учетом того, что в первой выбранной пользователем клетке не должно быть мин
     * @param {Position} initalPick - первая клетка, выбранная пользователем
     */
    generateInitialState(initalPick) {
        this.#state.mines = new Array(16).fill(0).map(() => new Array(16).fill(0))
        const mines = this.#state.mines

        //случайно генерим 40 позиций для мин
        new Array(256).fill(0)
            .map((el, i) => i)
            .filter(el => el !== initalPick[0]*16+initalPick[1])
            .sort(() => Math.random()-0.5)
            .slice(0, this.minesCount)
            .map(el => {mines[Math.floor(el/16)][Math.floor(el%16)] = 9})
        
        for (let i = 0; i < mines.length; i++) {
            for (let j = 0; j < mines[0].length; j++) {
                if (mines[i][j] !== 9) {
                    mines[i][j] = this.getNeighbors([i, j])
                        .map(([i, j]) => mines[i][j])
                        .filter(e => e === 9).length
                }
            }
        }

        this.#state.opened = new Array(16).fill(0).map(() => new Array(16).fill(false))
        this.#state.flags = this.#state.flags || new Array(16).fill(0).map(() => new Array(16).fill(0))
    }
}

/**
 * Состояние приложения
 * @typedef State
 * @type {object}
 * @property {number[][]} mines - карта расположения мин
 * @property {boolean[][]} opened - карта открытых клеток
 * @property {number[][]} flags - карта флажков
 * @property {number} flagsCount - сколько флажков поставил пользователь
 */

/**
 * Координаты ячейки на игровом поле в декартовой системе координат.
 * pos[0] - строка
 * pos[1] - столбец
 * @typedef Position
 * @type {number[]}
 */