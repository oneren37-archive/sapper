export default class AbstractViewComponent {
    /** 
     * @type {EventEmitter} 
     * @protected
     */
    _eventEmitter

    /** 
     * @type {HTMLElement} 
     * @protected
     */
    _root 

    /**
     * @param {HTMLElement} root 
     * @param {EventEmitter} [eventEmitter]
     */
    constructor(root, eventEmitter) {
        this._root = root
        this._eventEmitter = eventEmitter

        this.bindEvents()
    }

    /**
     * Обработка событий
     * @abstract
     * @protected
     * @returns {void}
     */
    bindEvents() {}

    /**
     * @param {Object} [props] 
     */
    render(props) {}
} 