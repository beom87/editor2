import { applyStyle } from '../../utils/element';
import DMObject from '../object';

export default class DMTextbox extends DMObject {
    static __name = 'dm-textbox';
    __type = 'textbox';

    readonly defaultStyleOptions: ITextboxOptions['style'] = {
        width: '100px',
        height: '32px'
    };

    constructor(options?: ITextboxOptions) {
        super(options?.id);
        const paragraph = document.createElement('p');
        paragraph.innerHTML = options?.text ?? 'TEXT';

        applyStyle(this, { ...this.defaultStyleOptions, ...options?.style });
        applyStyle(paragraph, { wordBreak: 'break-all', whiteSpace: 'pre-wrap' });

        this.addEventListener('dblclick', () => this.__setEditeMode(true));
        paragraph.addEventListener('blur', () => this.__setEditeMode(false));

        this.appendChild(paragraph);

        const toData = this.__toData;
        this.__toData = () => {
            const data = toData.call(this);
            return { ...data, text: paragraph.innerHTML };
        };
    }

    __setEditeMode(editeMode: boolean) {
        const paragraph = this.querySelector('p');
        if (!paragraph) return;

        if (editeMode) {
            paragraph.contentEditable = 'plaintext-only';
            paragraph.focus();
        } else {
            paragraph.contentEditable = 'inherit';
        }
        this.__interaction.active(!editeMode);
    }

    __setTextStyle(cssStyle: { [key in keyof CSSStyleDeclaration]?: string }) {
        const paragraph = this.querySelector('p');
        const selection = document.getSelection();
        if (!paragraph || !selection) return;

        const span = applyStyle(document.createElement('span'), cssStyle);
        const range = selection.getRangeAt(0);

        const selectedContent = range.extractContents();
        if (!selectedContent.textContent) {
            applyStyle(this, cssStyle);
            paragraph.querySelectorAll('span').forEach((s) => applyStyle(s, cssStyle, { value: 'inherit' }));
        } else {
            selectedContent.querySelectorAll('span').forEach((s) => applyStyle(s, cssStyle, { value: 'inherit' }));
            span.appendChild(selectedContent);
            range.insertNode(span);
        }

        /** REMOVE EMPTY ELEMENT */
        paragraph.querySelectorAll('span').forEach((s) => !s.textContent && s.remove());
    }
}
