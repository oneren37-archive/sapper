export default class AbstractViewComponent {
    /** @type {EventEmitter} */
    #eventEmitter
    
    /**
     * @param {HTMLElement} root 
     */
    constructor(root) {
        this.findElements()
        this.bindEvents()
        this.render()
    }

    /**
     * Обработка событий
     * @abstract
     * @protected
     * @returns {void}
     */
    bindEvents() {}

    /**
     * Поиск DOM элементов
     * @abstract
     * @protected
     * @returns {void}
     */
    findElements() {}

    /**
     * @param {Object} [props] 
     */
    render(props) {}
} 