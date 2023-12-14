import Editor from '../core';
import Effect from '../effect';
import Interaction from '../interaction';
import { createId } from '../utils/helper';

export default class DMObject extends HTMLElement {
    static __name = 'dm-object';
    __type = 'object';

    __effect;
    __interaction;
    /** core에서 object를 등록할 때 함께 등록한다. */
    __editor?: Editor;

    private ___data: { [key: string]: any } = {};

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
    __setData(data: { [key: string]: any }) {
        this.___data = { ...this.___data, ...data };
    }
    __getData = (key?: string) => (key ? this.___data[key] : this.___data);

    __toData = () => ({
        type: this.__type,
        id: this.id,
        style: { cssText: this.style.cssText },
        animations: this.__effect.getAnimations()
    });
}
