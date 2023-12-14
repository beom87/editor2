import { applyAttributeNS, applyStyle, createSVGElement } from '../../utils/element';
import { getPathOf } from '../../utils/helper';
import DMObject from '../object';

export default class DMParallelogram extends DMObject {
    static __name = 'dm-parallelogram';
    __type = 'parallelogram';
    __shape;

    readonly defaultStyleOptions: IParallelogramOptions['style'] = {
        width: '300px',
        height: '150px',
        stroke: '#000000',
        fill: 'none',
        strokeWidth: '1px',
        overflow: 'visible'
    };

    constructor(options?: IParallelogramOptions) {
        super(options?.id);

        const svg = createSVGElement('svg');
        this.__shape = createSVGElement('path');

        applyStyle(this, { ...this.defaultStyleOptions, ...options?.style });
        applyAttributeNS(svg, { width: '100%', height: '100%', overflow: 'visible' });

        new ResizeObserver(this.___resizeObserverCallback.bind(this)).observe(this);

        svg.appendChild(this.__shape);

        this.appendChild(svg);

        this.__interaction.addMeditation({
            name: 'meditation',
            placement: 'top',
            defaultMeditation: options?.meditation ?? 150,
            onChange: ({ meditation }) => {
                const width = Math.max(parseInt(this.style.width ?? 0) - 4, 0);
                const height = Math.max(parseInt(this.style.height ?? 0) - 4, 0);
                this.__shape.setAttributeNS(null, 'd', getPathOf.parallelogram({ width, height, meditation }));
            }
        });
    }

    /** 사이즈 조절에 따른 path data 업데이트 */
    private ___resizeObserverCallback(entries: ResizeObserverEntry[]) {
        entries.forEach((entry) => {
            const { width, height } = entry.contentRect;
            const meditation = this.__getData('meditation');
            this.__shape.setAttributeNS(null, 'd', getPathOf.parallelogram({ width, height, meditation }));
        });
    }
}
