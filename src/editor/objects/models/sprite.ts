import DMObject from './object';

export default class DMSprite extends DMObject {
    static __name = 'dm-sprite';
    __type = 'sprite';

    private ___originWidth;
    private ___originHeight;
    private ___frameCount;

    constructor(options: ISpriteOptions) {
        super();
        this.___originWidth = Number(options?.originWidth || 0);
        this.___originHeight = Number(options?.originHeight || 0);
        this.___frameCount = Number(options?.frameCount || 1);

        this.style.backgroundImage = `url('${options.src}')`;

        if (!this.style.width) {
            this.style.width = (this.___originWidth / this.___frameCount).toFixed(0) + 'px';
        }
        if (!this.style.height) {
            this.style.height = this.___originHeight.toFixed(0) + 'px';
        }

        new ResizeObserver(this.___resizeObserverCallback.bind(this)).observe(this);
    }

    private ___resizeObserverCallback() {
        const width = Number(this.style.width.replace('px', ''));
        this.style.backgroundSize = (width * this.___frameCount).toFixed(0) + 'px';
    }
}
