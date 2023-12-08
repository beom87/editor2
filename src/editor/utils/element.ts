export const createSVGElement = <K extends keyof SVGElementTagNameMap>(type: K) =>
    document.createElementNS('http://www.w3.org/2000/svg', type) as SVGElementTagNameMap[K];

export const applyStyle = (
    element: HTMLElement | SVGSVGElement,
    cssStyle: { [key in keyof CSSStyleDeclaration]?: string },
    options?: { value?: string }
) => {
    for (const key in cssStyle) {
        if (Object.prototype.hasOwnProperty.call(cssStyle, key)) {
            element.style[key] = options?.value ?? cssStyle[key] ?? element.style[key];
        }
    }
    return element;
};
export const applyAttributeNS = (element: SVGElement, attribues: { [key: string]: string }) => {
    for (const key in attribues) {
        if (Object.prototype.hasOwnProperty.call(attribues, key)) {
            element.setAttributeNS(null, key, attribues[key]);
        }
    }
    return element;
};
export const applyAttribute = (element: Element, attribues: { [key: string]: string }) => {
    for (const key in attribues) {
        if (Object.prototype.hasOwnProperty.call(attribues, key)) {
            element.setAttributeNS(null, key, attribues[key]);
        }
    }
    return element;
};
