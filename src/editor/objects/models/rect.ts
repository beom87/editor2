import { applyAttributeNS, applyStyle, createSVGElement } from '../../utils/element';
import { getPathOf } from '../../utils/helper';
import DMObject from '../object';

export default class DMRect extends DMObject {
    static __name = 'dm-rect';
    __type = 'rect';

    readonly defaultStyleOptions: IRectOptions['style'] = {
        width: '300px',
        height: '150px',
        stroke: '#000000',
        fill: 'none',
        strokeWidth: '1px',
        overflow: 'visible'
    };

    constructor(options?: IRectOptions) {
        super(options?.id);

        const svg = createSVGElement('svg');
        const path = createSVGElement('path');

        applyStyle(this, { ...this.defaultStyleOptions, ...options?.style });
        applyAttributeNS(svg, { width: '100%', height: '100%', overflow: 'visible' });
        new ResizeObserver(this.___resizeObserverCallback.bind(this)).observe(this);

        svg.appendChild(path);

        this.appendChild(svg);
    }

    /** 사이즈 조절에 따른 path data 업데이트 */
    private ___resizeObserverCallback(entries: ResizeObserverEntry[]) {
        entries.forEach((entry) => {
            const { width, height } = entry.contentRect;
            const target = this.querySelector('path');
            target?.setAttributeNS(null, 'd', getPathOf.rect({ width, height }));
        });
    }
}
