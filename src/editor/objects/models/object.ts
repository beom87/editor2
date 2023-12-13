import Editor from '../../core';
import Effect from '../../effect';
import Interaction from '../../interaction';
import { createId } from '../../utils/helper';

export default class DMObject extends HTMLElement {
    static __name = 'dm-object';
    __type = 'object';

    __effect;
    __interaction;
    /** DMObject를 상속받은 object가 editor를 등록한다 */
    __editor?: Editor;

    constructor(id?: string) {
        super();
        this.id = id ?? createId();
        this.__effect = new Effect(this.id);
        this.__interaction = new Interaction(this);

        this.classList.add('object');

        this.addEventListener('pointerdown', () => {
            this.__editor?.EE.emit('object:active', [this]);
        });
    }

    /** focus 상태 관리 */
    get __focus() {
        return this.classList.contains('focus');
    }
    set __focus(focus: boolean) {
        const method = focus ? 'add' : 'remove';
        this.classList[method]('focus');
        if (focus) {
            this.__interaction.addRotate();
            this.__interaction.addSize();
        } else {
            this.__interaction.removeRotate();
            this.__interaction.removeSize();
        }
    }

    __toData() {
        return { type: this.__type, id: this.id, style: { cssText: this.style.cssText }, animations: this.__effect.getAnimations() };
    }
}
