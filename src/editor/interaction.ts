import DMObject from './objects/object';
import { applyAttributeNS, applyStyle, createSVGElement } from './utils/element';
import { pxToNumber } from './utils/helper';

type TInteractionPlacement = 'top' | 'left' | 'bottom' | 'right';
type TInteractionMeditation = {
    defaultMeditation: number;
    name?: string;
    placement?: TInteractionPlacement;
    onChange?: ({ meditation, subMeditation }: { meditation: number; subMeditation?: number }) => void;
};

export default class Interaction {
    element;
    sizeContainer;
    rotateContainer;
    removeDrag = () => {};

    disabledDrag = false;
    disableSize = false;
    disabledRotate = false;

    private readonly _sizePlacements = ['bc', 'br', 'rc'];

    constructor(target: DMObject) {
        this.element = target;
        this.sizeContainer = document.createElement('div');
        this.rotateContainer = document.createElement('div');
        this.addDrag();
    }
    /** Drag */
    addDrag() {
        this.removeDrag();
        if (this.disabledDrag) return;

        const client = { x: 0, y: 0 };
        const translate = { x: 0, y: 0 };
        const origin = { x: 0, y: 0 };

        const pointermove = (e: PointerEvent) => {
            this.removeRotate();
            this.removeSize();
            const dx = e.clientX - client.x;
            const dy = e.clientY - client.y;

            translate.x = dx + origin.x;
            translate.y = dy + origin.y;
            this.element.style.left = `${translate.x.toFixed(0)}px`;
            this.element.style.top = `${translate.y.toFixed(0)}px`;

            this.element.__editor?.EE.emit('object:move');
        };

        const pointerup = () => {
            origin.x = translate.x;
            origin.y = translate.y;
            this.element.classList.remove('cursor-move');
            this.addRotate();
            this.addSize();
            document.removeEventListener('pointermove', pointermove);
            document.removeEventListener('pointerup', pointerup);
        };

        const pointerdown = (e: PointerEvent) => {
            e.stopPropagation();

            const [translateX = 0] = pxToNumber(this.element.style.left);
            const [translateY = 0] = pxToNumber(this.element.style.top);

            client.x = e.clientX;
            client.y = e.clientY;
            origin.x = translateX;
            origin.y = translateY;

            this.element.classList.add('cursor-move');
            document.addEventListener('pointermove', pointermove);
            document.addEventListener('pointerup', pointerup);
        };

        this.element.addEventListener('pointerdown', pointerdown);

        this.removeDrag = () => this.element.removeEventListener('pointerdown', pointerdown);
    }

    /** Size */
    addSize() {
        this.removeSize();
        if (this.disableSize) return;

        const origin = { clientX: 0, clientY: 0, width: 0, height: 0 };
        this.sizeContainer = document.createElement('div');
        this.sizeContainer.classList.add('size-container');
        let currentTarget = '';

        const pointermove = (e: PointerEvent) => {
            if (!currentTarget) return;

            const dx = e.clientX - origin.clientX;
            const dy = e.clientY - origin.clientY;
            const dxy =
                dy > dx
                    ? { x: dy * (origin.width / origin.height), y: dy }
                    : { x: dx, y: dx * (origin.height / origin.width) };

            if (currentTarget === 'dm-rc') this.element.style.width = Math.max(0, origin.width + dx).toFixed(0) + 'px';
            else if (currentTarget === 'dm-bc')
                this.element.style.height = Math.max(0, origin.height + dy).toFixed(0) + 'px';
            else {
                this.element.style.width = Math.max(0, origin.width + dxy.x).toFixed(0) + 'px';
                this.element.style.height = Math.max(0, origin.height + dxy.y).toFixed(0) + 'px';
            }
        };

        const pointerup = () => {
            currentTarget = '';
            this._sizeContainerResize();
            this._rotateContainerResize();
            document.removeEventListener('pointermove', pointermove);
            document.removeEventListener('pointerup', pointerup);
        };

        const pointerdown = (e: PointerEvent) => {
            currentTarget = (e.target as HTMLElement).id ?? '';

            origin.clientX = e.clientX;
            origin.clientY = e.clientY;
            origin.width = this.element.offsetWidth;
            origin.height = this.element.offsetHeight;

            document.addEventListener('pointermove', pointermove);
            document.addEventListener('pointerup', pointerup);
        };

        this._sizePlacements.map((name) => {
            const elt = document.createElement('div');
            elt.id = `dm-${name}`;
            elt.classList.add('size', name);
            elt.addEventListener('pointerdown', pointerdown);
            this.sizeContainer.appendChild(elt);

            return elt;
        });

        this._sizeContainerResize();

        this.element.__editor?.canvas?.appendChild(this.sizeContainer);
    }

    removeSize() {
        this.sizeContainer.remove();
    }

    /** Rotate */
    addRotate() {
        this.removeRotate();
        if (this.disabledRotate) return;
        this.rotateContainer = document.createElement('div');
        const rotate = document.createElement('div');

        this.rotateContainer.classList.add('rotate-container');
        rotate.classList.add('rotate');

        let deg = 0;

        const pointermove = (e: PointerEvent) => {
            const { clientX, clientY } = e;
            const { top, left, width, height } = this.element.getBoundingClientRect();
            const x = left + width / 2 - clientX;
            const y = top + height / 2 - clientY;
            deg = (Math.atan2(y, x) * 180) / Math.PI - 90;
            this.rotateContainer.style.rotate = deg.toFixed(0) + 'deg';
        };

        const pointerup = () => {
            this.element.style.rotate = `${deg.toFixed(0)}deg`;
            this._sizeContainerResize();
            document.removeEventListener('pointermove', pointermove);
            document.removeEventListener('pointerup', pointerup);
        };

        const pointerdown = () => {
            deg = Number(this.element.style.rotate.replace('deg', '') || 0);
            document.addEventListener('pointermove', pointermove);
            document.addEventListener('pointerup', pointerup);
        };

        rotate.addEventListener('pointerdown', pointerdown);
        this._rotateContainerResize();

        this.rotateContainer.appendChild(rotate);

        this.element.__editor?.canvas?.appendChild(this.rotateContainer);
    }

    removeRotate() {
        this.rotateContainer.remove();
    }
    /** Meditation */
    addMeditation({ name = 'meditation', defaultMeditation, placement = 'top', onChange }: TInteractionMeditation) {
        const svg = this.element.querySelector('svg');
        if (!svg) return;

        const circle = createSVGElement('circle');
        const origin = { x: 0, y: 0 };
        const isHorizontal = ['top', 'bottom'].includes(placement);
        const cx = isHorizontal ? defaultMeditation.toString() : placement === 'left' ? '0' : '100%';
        const cy = isHorizontal ? (placement === 'top' ? '0' : '100%') : defaultMeditation.toString();
        const shape = this.element.querySelector('path');

        let meditation = defaultMeditation;

        applyAttributeNS(circle, { cx, cy, r: '5', fill: 'red' });

        const pointermove = (e: PointerEvent) => {
            if (!shape) return;
            const dist = isHorizontal ? e.clientX - origin.x : e.clientY - origin.y;
            const originMeditation = this.element.__getData(name) ?? 0;

            const width = Math.max(parseInt(this.element.style.width ?? 0) - 4, 0);
            const height = Math.max(parseInt(this.element.style.height ?? 0) - 4, 0);
            const meditationMax = isHorizontal ? width : height;

            meditation = Math.min(Math.max(0, Number((originMeditation + dist).toFixed(0))), meditationMax);

            if (isHorizontal) applyAttributeNS(circle, { cx: meditation.toString() });
            else applyAttributeNS(circle, { cy: meditation.toString() });

            onChange?.({ meditation });
        };
        const pointerup = () => {
            init();
            document.removeEventListener('pointermove', pointermove);
            document.removeEventListener('pointerup', pointerup);
        };

        const pointerdown = (e: PointerEvent) => {
            e.stopImmediatePropagation();

            origin.x = e.clientX;
            origin.y = e.clientY;

            document.addEventListener('pointermove', pointermove);
            document.addEventListener('pointerup', pointerup);
        };

        const init = () => {
            this.element.__setData({ [name]: meditation });
            meditation = 0;
        };

        init();

        circle.addEventListener('pointerdown', pointerdown);

        svg.appendChild(circle);
    }

    active(active: boolean) {
        if (active) {
            this.addDrag();
            this.addSize();
        } else {
            this.removeDrag();
            this.removeSize();
        }
    }
    private _sizeContainerResize() {
        const bcr = this.element.getBoundingClientRect();

        applyStyle(this.sizeContainer, {
            top: bcr.top.toFixed(0) + 'px',
            left: bcr.left.toFixed(0) + 'px',
            width: bcr.width.toFixed(0) + 'px',
            height: bcr.height.toFixed(0) + 'px'
        });
    }
    private _rotateContainerResize() {
        this.rotateContainer.style.cssText = this.element.style.cssText;
        this.rotateContainer.style.backgroundImage = 'none';
    }
}
