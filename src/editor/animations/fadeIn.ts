import DMAnimation from './animation';

export default class FadeIn extends DMAnimation {
    type = 'fadeIn';
    targetId;
    constructor(config?: { id?: string; targetId?: string }) {
        super({ id: config?.id });
        this.targetId = config?.targetId ?? '';
        this.keyframes = [{ opacity: '1' }];
    }
}
