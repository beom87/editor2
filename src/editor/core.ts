import { EventEmitter } from './events';
import DMObject from './objects/models/object';

import * as models from './objects';
import { createId } from './utils/helper';
import { applyStyle } from './utils/element';

import './styles';

export default class Editor {
    id;
    canvas: HTMLDivElement | null = null;
    EE;
    activeObjects: DMObject[] = [];

    constructor(element?: HTMLDivElement, options?: { id?: string }) {
        this.id = options?.id || createId();
        if (element) this.injectCanvas(element);

        this.EE = new EventEmitter<TEventNames>();
        this._loadModels();

        this.EE.on<DMObject[]>('object:active', (objects) => {
            if (!objects) return;
            this.discardActive();
            objects?.forEach((object) => (object.__focus = true));
            this.activeObjects = objects;
        });
    }

    injectCanvas = (element: HTMLDivElement) => {
        this.canvas = element;
        this.canvas.classList.add('dm-canvas');
        this.canvas.tabIndex = 0;
        this.canvas.id = this.id;
        applyStyle(this.canvas, { position: 'relative', overflow: 'hidden' });

        this.canvas.addEventListener('pointerdown', (e) => {
            if (e.target !== this.canvas) return;
            console.log(e);
            this.EE.emit('object:active', []);
        });
    };
    setSize = (width?: number, height?: number) => {
        if (!this.canvas) return;
        this.canvas.style.width = (width || 0) + 'px';
        this.canvas.style.height = (height || 0) + 'px';
    };

    add = (object: DMObject) => {
        object.__editor = this;
        this.canvas?.appendChild(object);
        this.EE.emit('object:add');
    };

    on = (name: TEventNames, fn: (data?: unknown) => void) => this.EE.on(name, fn);
    off = (name: TEventNames, fn: (data?: unknown) => void) => this.EE.off(name, fn);
    getObjects = () => Array.from(this.canvas?.children ?? []) as DMObject[];
    getEffects = () => {
        const children = this.getObjects();
        const effects = children.map((child) => child.__effect);
        return effects;
    };
    discardActive = () => {
        this.activeObjects.forEach((object) => (object.__focus = false));
        this.activeObjects = [];
    };

    private _loadModels = () => {
        for (const key in models) {
            if (Object.prototype.hasOwnProperty.call(models, key)) {
                const CustomElement = models[key as keyof typeof models];
                const name = CustomElement.__name;
                if (!customElements.get(name)) customElements.define(name, CustomElement);
            }
        }
    };
}
