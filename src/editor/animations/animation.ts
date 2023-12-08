import { createId } from '../utils/helper';

export default class DMAnimation {
    id;

    options: KeyframeEffectOptions = { duration: 1000, delay: 0, easing: 'linear', fill: 'forwards' };
    keyframes: Keyframe[] = [];
    targetId = '';

    constructor(config?: { id?: string }) {
        this.id = config?.id ?? createId();
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
    toData = () => ({ id: this.id, keyframes: this.keyframes, options: this.options });
}
