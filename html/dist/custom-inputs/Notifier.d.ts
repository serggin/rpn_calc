/**
 * Provides Support for Event Listeners for custom classes
 */
export declare type Listener = (arg: any) => void;
export declare class Notifier {
    private readonly _listeners;
    /**
     *
     * @param types {string[]}  array of allowed event types
     */
    constructor(types: string[]);
    /**
     * Add event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    addEventListener: (type: string, listener: Listener) => void;
    /**
     * Remove event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    removeEventListener: (type: string, listener: Listener) => void;
    /**
     * Dispatch an Event
     * @param event {CustomEvent}   event object
     */
    dispatch: (event: CustomEvent) => void;
    /**
     * Free resources before destruction
     */
    destroy(): void;
}
