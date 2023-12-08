import { applyStyle } from '../../utils/element';
import DMObject from './object';

export default class DMImage extends DMObject {
    static __name = 'dm-image';
    __type = 'image';
    
    constructor(options?: IImageOptions) {
        super();
        const image = new window.Image();
        image.src = options?.src ?? '';
        image.draggable = false;
        applyStyle(image, { width: '100%', height: '100%' });
        if (options?.onLoad) image.onload = options.onLoad;

        this.appendChild(image);
    }
}
