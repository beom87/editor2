import DMObject from './objects/models/object';
import { applyStyle } from './utils/element';
import { pxToNumber } from './utils/helper';

export default class Interaction {
    element;
    sizeContainer;
    rotateContainer;
    removeDrag = () => { };

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
            /** focus border width 만큼 뺌 */
            width: (bcr.width - 6).toFixed(0) + 'px',
            height: (bcr.height - 6).toFixed(0) + 'px'
        });
    }
    private _rotateContainerResize() {
        this.rotateContainer.style.cssText = this.element.style.cssText;
        this.rotateContainer.style.backgroundImage = 'none';
    }
}
