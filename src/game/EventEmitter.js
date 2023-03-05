export default class EventEmitter {
    /**
     * @type {Object<Set<function>>}
     */
    #events = {}

    /**
     * Подписаться на событие
     * @param {string} eventName 
     * @param {function} fn 
     */
    on(eventName, fn) {
        this.#events[eventName] = this.#events[eventName] || new Set()
        this.#events[eventName].add(fn)
    }

    /**
     * Отписаться от события
     * @param {string} eventName 
     * @param {function} fn 
     */
    unsubscribe(eventName, fn) {
        if (!this.#events[eventName]) return 
        this.#events[eventName].delete(fn)
    }

    /**
     * Вызвать событие
     * @param {string} eventName 
     * @param {any} data 
     */
    emit(eventName, data) {
        if (!this.#events[eventName]) return 
        this.#events[eventName].forEach(fn => fn(data))
    }
}

// описание всех событий
export const EVT = {
    // действия пользователя
    pick: 'pick',
    r_pick: 'r_pick',
    restart: 'restart',
    mousedown: 'mousedown',
    // апдейт вьюшек при изменившемся состоянии
    boardUpdated: 'boardUpdated',
    flagsCountChanged: 'flagsCountChanged',
    waiting: 'waiting',
    //состояния игры
    win: 'win',
    lose: 'lose',
    game_continue: 'game_continue',
}