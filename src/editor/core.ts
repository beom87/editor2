import * as dmObjects from './objects';
import * as dmAnimations from './animations';

import { EventEmitter } from './events';
import DMObject from './objects/object';
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
        this._loadObjectModels();

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
    getObjects = () =>
        Array.from(this.canvas?.children ?? []).filter((element) => element instanceof DMObject) as DMObject[];
    getEffects = () => {
        const children = this.getObjects();
        const effects = children.map((child) => child.__effect);
        return effects;
    };
    discardActive = () => {
        this.activeObjects.forEach((object) => (object.__focus = false));
        this.activeObjects = [];
    };

    toData = () => {
        const objects = this.getObjects().map((object) => object?.__toData?.());
        return { objects };
    };
    toJSON = () => JSON.stringify(this.toData());

    loadFromJSON(json: string) {
        const parseData = JSON.stringify(json);
        this.loadFromData(parseData);
    }
    loadFromData(data: any) {
        data.objects?.forEach((options: any) => {
            const object = this._loadObject(options);

            options.animations?.forEach((animation: any) => {
                const anim = this._loadAnimations(animation);
                if (object && anim) object.__effect.add(anim);
            });
        });
    }

    private _loadObject = (options: any) => {
        const type = options.type;
        let obj: DMObject | null = null;
        switch (type) {
            case 'rect':
                obj = new dmObjects.Rect(options);
                break;
            case 'textbox':
                obj = new dmObjects.Textbox(options);
                break;
            case 'image':
                obj = new dmObjects.Image(options);
                break;
            case 'sprite':
                obj = new dmObjects.Sprite(options);
                break;
            default:
                break;
        }
        if (!obj) return;
        this.add(obj);
        return obj;
    };

    private _loadAnimations = (animation: any) => {
        const type = animation.type;
        let anim;
        switch (type) {
            case 'fadeIn':
                anim = new dmAnimations.FadeIn(animation);
                break;
            case 'fadeOut':
                anim = new dmAnimations.FadeOut(animation);
                break;
            case 'sprite':
                anim = new dmAnimations.Sprite(animation);
                break;
            default:
                break;
        }
        if (!anim) return;
        anim.updateKeyframes(animation.keyframes);
        anim.updateOptions(animation.options);

        return anim;
    };

    private _loadObjectModels = () => {
        for (const key in dmObjects) {
            if (Object.prototype.hasOwnProperty.call(dmObjects, key)) {
                const CustomElement = dmObjects[key as keyof typeof dmObjects];
                const name = CustomElement.__name;
                if (!customElements.get(name)) customElements.define(name, CustomElement);
            }
        }
    };
}
