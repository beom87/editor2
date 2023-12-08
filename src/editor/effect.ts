import DMAnimation from './animations/animation';

export default class Effect {
    id;
    /** DMAnimation List */
    private _animations: DMAnimation[] = [];
    /** window.Animation List */
    private _anims: Animation[] = [];

    constructor(id: string) {
        this.id = id;
    }
    add(animation: DMAnimation) {
        animation.targetId ||= this.id;
        this._animations.push(animation);
    }
    remove(id: string) {
        this._animations = this._animations.filter((animation) => animation.id !== id);
    }

    /** 애니메이션 객체 생성 */
    async createAnimation() {
        this.stop();
        this._anims = this.getAnimations()
            .filter((animation) => !animation.options.disabled)
            .sort((a, b) => (a.options.delay ?? 0) - (b.options.delay ?? 0))
            .map((animation) => {
                const target = document.getElementById(animation.targetId);
                const keyframe = new KeyframeEffect(target, animation.keyframes, animation.options);
                return new Animation(keyframe, document.timeline);
            });

        return Promise.all(this._anims.map((anim) => anim.ready));
    }
    /** 애니메이션 재생 */
    play() {
        this._anims.forEach((anim) => anim.play());
    }
    /**
     * 지정된 시간(time)으로 애니메이션 재생
     * @param time
     */
    updateTime(time: number) {
        this._anims.forEach((anim) => {
            anim.currentTime = time;
            anim.pause();
        });
    }
    /** 애니메이션 일시 정지 */
    pause() {
        this._anims.forEach((anim) => anim.pause());
    }
    /** 애니메이션 멈춤 */
    stop() {
        this._anims.forEach((anim) => anim.cancel());
        this.initAnimation();
    }

    /** DMAnimation list */
    getAnimations() {
        return this._animations;
    }
    /** animation 객체 초기화 */
    initAnimation() {
        this._anims = [];
    }
}
