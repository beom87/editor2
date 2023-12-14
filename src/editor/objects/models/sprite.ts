import { applyStyle } from '../../utils/element';
import DMObject from './object';

export default class DMSprite extends DMObject {
    static __name = 'dm-sprite';
    __type = 'sprite';

    __originWidth;
    __originHeight;
    __frameCount;

    constructor(options: ISpriteOptions) {
        super(options?.id);

        applyStyle(this, { ...options.style });

        this.__originWidth = Number(options?.originWidth || 0);
        this.__originHeight = Number(options?.originHeight || 0);
        this.__frameCount = Number(options?.frameCount || 1);

        this.style.backgroundImage = `url('${options.src}')`;

        if (!this.style.width) {
            this.style.width = (this.__originWidth / this.__frameCount).toFixed(0) + 'px';
        }
        if (!this.style.height) {
            this.style.height = this.__originHeight.toFixed(0) + 'px';
        }

        new ResizeObserver(this.___resizeObserverCallback.bind(this)).observe(this);
    }

    private ___resizeObserverCallback() {
        const width = Number(this.style.width.replace('px', ''));
        this.style.backgroundSize = (width * this.__frameCount).toFixed(0) + 'px';
    }

}
