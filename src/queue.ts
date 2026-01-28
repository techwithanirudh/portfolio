export default class Queue {
    private _queue: Function[];
    private _onEmptyCallback: any;
    private _active: any;

    constructor(onEmptyCallback: Function) {
        this._queue = [];
        this._onEmptyCallback = onEmptyCallback;
    }

    /***
     *
     * @param {function(Function)} func
     * @returns {jQuery.Deferred}
     */
    public queue(func: Function) {
        this._queue.push(func);

        if (this._queue.length === 1 && !this._active) {
            this._progressQueue();
        }
    }

    private _progressQueue() {

        // stop if nothing left in queue
        if (!this._queue.length) {
            this._onEmptyCallback();
            return;
        }

        let f = this._queue.shift();
        this._active = true;

        // execute function
        let completeFunction = this.next.bind(this);
        if (f) f(completeFunction);
    }

    public clear() {
        this._queue = [];
    }

    public next() {
        this._active = false;
        this._progressQueue();
    }
}



