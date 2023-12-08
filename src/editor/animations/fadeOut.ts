import DMAnimation from './animation';

export default class FadeOut extends DMAnimation {
    type = 'fadeOut';
    targetId;
    constructor(config?: { id?: string; targetId?: string }) {
        super({ id: config?.id });
        this.targetId = config?.targetId ?? '';
        this.keyframes = [{ opacity: '0' }];
    }
}
