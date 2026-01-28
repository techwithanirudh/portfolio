export const getWindowScroll = () => {
    const supportPageOffset = window.pageXOffset !== undefined;
    const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

    const scrollLeft = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
    const scrollTop = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    return {
        scrollLeft,
        scrollTop
    }
}

export function getOffset(element: HTMLElement) {
    if (!element.getClientRects().length) {
        return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView || { pageXOffset: 0, pageYOffset: 0 };
    return (
        {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
        });
}

export function getWidth(el: HTMLElement, type: 'inner' | 'outer' | 'width' | 'full') {
    if (type === 'inner') // .innerWidth()
        return el.clientWidth;
    else if (type === 'outer') // .outerWidth()
        return el.offsetWidth;
    let s = window.getComputedStyle(el, null);
    if (type === 'width') // .width()
        return el.clientWidth - parseInt(s.getPropertyValue('padding-left')) - parseInt(s.getPropertyValue('padding-right'));
    else if (type === 'full') // .outerWidth(includeMargins = true)
        return el.offsetWidth + parseInt(s.getPropertyValue('margin-left')) + parseInt(s.getPropertyValue('margin-right'));
    return null;
}


export function getHeight(el: HTMLElement, type: 'inner' | 'outer' | 'height' | 'full') {
    if (type === 'inner') // .innerHeight()
        return el.clientHeight;
    else if (type === 'outer') // .outerHeight()
        return el.offsetHeight;
    let s = window.getComputedStyle(el, null);
    if (type === 'height') // .height()
        return el.clientHeight - parseInt(s.getPropertyValue('padding-top')) - parseInt(s.getPropertyValue('padding-bottom'));
    else if (type === 'full') // .outerWidth(includeMargins = true)
        return el.offsetHeight + parseInt(s.getPropertyValue('margin-top')) + parseInt(s.getPropertyValue('margin-bottom'));
    return null;
}


// Stub for jQuery.Deferred
export class Deferred {
    public promise!: Promise<void>;
    public resolve!: (value?: any) => void;
    public reject!: (reason?: any) => void;

    constructor () {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
