import { applyStyle } from '../../utils/element';
import DMObject from './object';

export default class DMImage extends DMObject {
    static __name = 'dm-image';
    __type = 'image';

    readonly defaultStyleOptions: IImageOptions['style'] = {
        width: '100%', height: '100%'
    };

    constructor(options?: IImageOptions) {
        super(options?.id);
        const image = new window.Image();
        image.src = options?.src ?? '';
        image.draggable = false;
        applyStyle(image, { ...this.defaultStyleOptions, ...options?.style });

        if (options?.onLoad) image.onload = options.onLoad;
        
        image.onload = () => {
            options?.onLoad?.();
            this.style.width = image.width + 'px';
            this.style.height = image.height + 'px';
        }

        this.appendChild(image);

        const toData = this.__toData;

        this.__toData = () => {
            const data = toData.call(this);

            return { ...data, src: image.src }

        }
    }
}
