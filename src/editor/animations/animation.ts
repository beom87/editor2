import { createId } from '../utils/helper';

export default class DMAnimation {
    id;

    options: KeyframeEffectOptions = { duration: 1000, delay: 0, easing: 'linear', fill: 'forwards' };
    keyframes: Keyframe[] = [];
    targetId = '';
    type = '';

    constructor(config: { id?: string; targetId: string }) {
        this.id = config.id ?? createId();
        this.targetId = config.targetId ?? '';
    }
    create() {
        const target = document.getElementById(this.targetId);
        const keyframe = new KeyframeEffect(target, this.keyframes, this.options);
        return new Animation(keyframe, document.timeline);
    }
    disable() {
        this.options = { ...this.options, disabled: true };
    }
    enable() {
        if ('disabled' in this.options) delete this.options.disabled;
    }

    updateOptions(options: Partial<KeyframeEffectOptions>) {
        for (const key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                const value = options[key as keyof typeof options];
                if (typeof value === 'undefined') continue;
                this.options = Object.assign(this.options, { [key]: value });
            }
        }
    }
    updateKeyframes(keyframes: Keyframe[]) {
        this.keyframes = keyframes;
    }
}
