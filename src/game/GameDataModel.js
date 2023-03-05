import { EVT } from "./EventEmitter"

export default class GameDataModel {
    /** @type {State} */
    #state

    /** @type {Congig} */
    #config

    constructor(eventEmitter, config) {
        this._eventEmitter = eventEmitter
        this.#config = config
        this.setInitialState()
        this.bindEvents()
    }

    setInitialState() {
        this.#state = {
            ...this.#config,
            mines:  null,
            flags:  new Array(this.#config.fieldY).fill(0).map(
                () => new Array(this.#config.fieldX).fill(0)
            ),
            opened: new Array(this.#config.fieldY).fill(0).map(
                () => new Array(this.#config.fieldX).fill(false)
            ),
            flagsCount: 0
        }
    }

    bindEvents() {
        this._eventEmitter.on(EVT.pick, this.handlePick.bind(this))
        this._eventEmitter.on(EVT.r_pick, this.handleRightClick.bind(this))
        this._eventEmitter.on(EVT.restart, () => {
            this.setInitialState()
            this._eventEmitter.emit(EVT.boardUpdated, this.#state)
        })
    }

    /**@param {Positon} pos */
    handlePick(pos) {
        if (!this.#state.mines) {
            this.spawnMines(pos)
        }

        if (this.#state.mines[pos[0]][pos[1]] === 9) {
            for (let i = 0; i < this.#state.fieldY; i++) {
                for (let j = 0; j < this.#state.fieldX; j++) {
                    if (this.#state.mines[i][j] === 9) {
                        if (this.#state.flags[i][j] === 2) {
                            this.#state.flags[i][j] = 0
                        }
                        this.#state.opened[i][j] = true
                    }
                    else if (this.#state.flags[i][j] === 1) {
                        this.#state.flags[i][j] = 0
                        this.#state.opened[i][j] = true
                        this.#state.mines[i][j] = 11
                    }
                }
            }   
            this.#state.mines[pos[0]][pos[1]] = 10
            this._eventEmitter.emit(EVT.lose)
        }
        else {
            this._eventEmitter.emit(EVT.smileUpdated, 'normal')
            this.openField(pos)
        }

        this._eventEmitter.emit(EVT.boardUpdated, this.#state)
    }

    /**@param {Position} pos */
    handleRightClick(pos) {
        const [i, j] = pos

        if (this.#state.opened && this.#state.opened[i][j]) return 
        if (this.#state.flagsCount === this.#state.minesCount && this.#state.flags[i][j] === 0) return

        this.#state.flags[i][j] = (this.#state.flags[i][j]+1)%3

        switch (this.#state.flags[i][j]) {
            case 1: this.#state.flagsCount += 1; break;
            case 2: this.#state.flagsCount -= 1; break;
        }

        this._eventEmitter.emit(EVT.flagsCountChanged, this.#state.minesCount-this.#state.flagsCount)

        if (this.#state.flagsCount === this.#state.minesCount) {
            this.checkWin()
        }

        this._eventEmitter.emit(EVT.boardUpdated, this.#state)
    }

    checkWin() {
        const mines = this.#state.mines
        const flags = this.#state.flags

        if (!mines) return

        for (let i = 0; i < mines.length; i++) {
            for (let j = 0; j < mines[0].length; j++) {
                if (mines[i][j] === 9 && flags[i][j] !== 1) return  
            }
        }
        this._eventEmitter.emit(EVT.win)
    }

    /**
     * Возвращает массив индексов соседей для данной ячейки
     * @param {Position} pos
     * @returns {Position[]} 
     */
    getNeighbors(pos) {
        const neighbors = []
        for (let i = Math.max(pos[0]-1, 0); i <= Math.min(pos[0]+1, this.#state.fieldY-1); i++) {
            for (let j = Math.max(pos[1]-1, 0); j <= Math.min(pos[1]+1, this.#state.fieldX-1); j++) {
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
    spawnMines(initalPick) {
        const X = this.#state.fieldX
        const Y = this.#state.fieldY

        this.#state.mines = new Array(this.#state.fieldY).fill(Y).map(
            () => new Array(this.#state.fieldX).fill(X)
        )
        const mines = this.#state.mines

        //случайно генерим n позиций для мин
        new Array(X*Y).fill(0)
            .map((el, i) => i)
            .filter(el => el !== initalPick[0]*X+initalPick[1])
            .sort(() => Math.random()-0.5)
            .slice(0, this.#state.minesCount)
            .map(el => {mines[Math.floor(el/X)][Math.floor(el%X)] = 9})
        
        for (let i = 0; i < Y; i++) {
            for (let j = 0; j < X; j++) {
                if (mines[i][j] !== 9) {
                    mines[i][j] = this.getNeighbors([i, j])
                        .map(([i, j]) => mines[i][j])
                        .filter(e => e === 9).length
                }
            }
        }

    }
}

/**
 * Состояние приложения
 * @typedef State
 * @type {object}
 * @property {number} fieldX
 * @property {number} fieldY
 * @property {number} minesCount
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