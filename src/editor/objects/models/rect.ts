import { applyAttributeNS, applyStyle, createSVGElement } from '../../utils/element';
import { getPathOf } from '../../utils/helper';
import DMObject from './object';

export default class DMRect extends DMObject {
    static __name = 'dm-rect';
    __type = 'rect';

    readonly defaultStyleOptions: IRectOptions['style'] = {
        width: '300px',
        height: '150px',
        stroke: '#000000',
        fill: 'none',
        strokeWidth: '1px'
    };

    constructor(options?: IRectOptions) {
        super();
        const svg = createSVGElement('svg');
        const path = createSVGElement('path');
        new ResizeObserver(this.___resizeObserverCallback.bind(this)).observe(this);

        applyStyle(this, { ...this.defaultStyleOptions, ...options?.style });
        applyAttributeNS(svg, { width: '100%', height: '100%' });
        applyAttributeNS(path, { d: getPathOf.rect({ width: 300, height: 150, padding: 0.5 }) });

        svg.appendChild(path);

        this.prepend(svg);

        const toData = this.__toData;
        this.__toData = () => {
            const data = toData.call(this);
            return { ...data, customAdd: 'data' };
        };
    }

    /** 사이즈 조절에 따른 path data 업데이트 */
    private ___resizeObserverCallback(entries: ResizeObserverEntry[]) {
        entries.forEach((entry) => {
            const { width, height } = entry.contentRect;
            const target = this.querySelector('path');
            target?.setAttributeNS(null, 'd', getPathOf.rect({ width, height, padding: 0.5 }));
        });
    }
}
