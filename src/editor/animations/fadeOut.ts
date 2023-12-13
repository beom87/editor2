import DMAnimation from './animation';

export default class FadeOut extends DMAnimation {
    type = 'fadeOut';
    targetId;
    constructor(config: { id?: string; targetId: string }) {
        super(config);
        this.targetId ||= config?.targetId ?? '';
        this.keyframes = [{ opacity: '1' }, { opacity: '0' }];
    }
}
