import DMSprite from '../../objects/models/sprite';
import DMAnimation from '../animation';

export default class Sprite extends DMAnimation {
    type = 'sprite';
    targetId;
    
    constructor(config: { id?: string; targetId: string }) {
        super(config);
        this.targetId ||= config?.targetId ?? '';
        const targetElt = document.getElementById(this.targetId);

        if (targetElt instanceof DMSprite) {
            const frameCount = targetElt.__frameCount;
            this.options = { ...this.options, easing: `steps(${frameCount})`, iterations: 999 };

            new ResizeObserver(() => {
                const backgroundSize = targetElt.style.backgroundSize;
                this.keyframes = [{ backgroundPosition: '0' }, { backgroundPosition: backgroundSize }];
            }).observe(targetElt);
        }
    }
}
