/**
 * Provides Support for Event Listeners for custom classes
 */
export class Notifier {
    /**
     *
     * @param types {string[]}  array of allowed event types
     */
    constructor(types) {
        this._listeners = {};
        types.forEach(key => this._listeners[key] = []);
    }
    /**
     * Add event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    addEventListener(type, listener) {
        if (type in this._listeners) {
            this._listeners[type].push(listener);
        }
    }
    /**
     * Remove event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    removeEventListener(type, listener) {
        if (type in this._listeners) {
            const index = this._listeners[type].indexOf(listener);
            if (index > -1) {
                this._listeners[type].splice(index, 1);
            }
        }
    }
    /**
     * Dispatch an Event
     * @param event {CustomEvent}   event object
     */
    dispatch(event) {
        const type = event.type;
        if (type in this._listeners) {
            this._listeners[type].forEach(listener => {
                if (listener)
                    listener(event.detail);
            });
        }
    }
    /**
     * Free resources before destruction
     */
    destroy() {
        let i;
        for (let type in this._listeners) {
            let arr = this._listeners[type];
            for (i = 0; i < arr.length; i += 1) {
                arr[i] = null;
            }
        }
    }
}
