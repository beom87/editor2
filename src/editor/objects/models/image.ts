import { applyStyle } from '../../utils/element';
import DMObject from '../object';

export default class DMImage extends DMObject {
    static __name = 'dm-image';
    __type = 'image';

    readonly defaultStyleOptions: IImageOptions['style'] = {};

    constructor(options?: IImageOptions) {
        super(options?.id);
        const image = new window.Image();
        image.src = options?.src ?? '';
        image.draggable = false;

        applyStyle(this, { ...this.defaultStyleOptions, ...options?.style });
        applyStyle(image, { width: '100%', height: '100%' });

        if (options?.onLoad) image.onload = options.onLoad;

        image.onload = () => {
            options?.onLoad?.();
            if (!this.style.width) this.style.width = this.offsetWidth + 'px';
            if (!this.style.height) this.style.height = this.offsetHeight + 'px';
        };

        this.appendChild(image);

        const toData = this.__toData;
        this.__toData = () => {
            const data = toData.call(this);
            return { ...data, src: image.src };
        };
    }
}
