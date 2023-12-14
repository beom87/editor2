type TObjectOptions = {
    id?: string;
    style?: { [key in keyof CSSStyleDeclaration]?: string };
};

interface IRectOptions extends TObjectOptions {}

interface ITextboxOptions extends TObjectOptions {
    text: string;
}
interface IImageOptions extends TObjectOptions {
    src: string;
    onLoad?: () => void;
}
interface ISpriteOptions extends TObjectOptions {
    src?: string;
    frameCount: string;
    originWidth?: string;
    originHeight?: string;
    onLoad?: () => void;
}
