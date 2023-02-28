export default class EventEmitter {
    /**
     * @type {Object<function>}
     */
    #events = {}

    /**
     * Подписаться на событие
     * @param {string} eventName 
     * @param {function} fn 
     */
    on(eventName, fn) {}

    /**
     * Отписаться от события
     * @param {string} eventName 
     * @param {function} fn 
     */
    unsubscribe(eventName, fn) {}

    /**
     * Вызвать событие
     * @param {string} eventName 
     * @param {any} data 
     */
    emit(eventName, data) {}
}