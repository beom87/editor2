import { useAtomValue } from 'jotai';
import { editorAtom } from '../atoms';
import { Image, Rect, Sprite } from '../editor/objects';
import Textbox from '../editor/objects/models/textbox';

import imageSrc from '../assets/images/basic/BI001.png?url';
import spriteSrc from '../assets/images/sprite/SI001.png?url';

export default function Toolbar() {
    const editor = useAtomValue(editorAtom);

    const onSaveClick = () => {
        const data = editor?.toJSON();
        window.localStorage.setItem('DMEditor', data ?? '');
        console.log(data);
    };
    const onLoadClick = () => {
        const data = window.localStorage.getItem('DMEditor') ?? '{}';
        console.log(JSON.parse(data));
        editor?.loadFromData(JSON.parse(data));
    };

    const onTextClick = () => {
        const textbox = new Textbox();
        editor?.add(textbox);
    };
    const onImageClick = () => {
        const image = new Image({ src: imageSrc });
        editor?.add(image);
    };
    const onSpriteClick = () => {
        const sprite = new Sprite({ src: spriteSrc, originWidth: '1400', originHeight: '700', frameCount: '2' });
        editor?.add(sprite);
    };

    const onRectClick = () => {
        const rect = new Rect();
        editor?.add(rect);
    };


    const onTextStyleClick = () => {
        const activeObject = editor?.activeObjects?.[0];
        if (activeObject instanceof Textbox) {
            activeObject.__setTextStyle({ color: 'red' });
        }
    };

    return (
        <>
            <div>
                <button className='border' onClick={onSaveClick}>
                    SAVE
                </button>
                <button className='border' onClick={onLoadClick}>
                    LOAD
                </button>
                <button className='border' onClick={onTextClick}>
                    TEXT
                </button>
                <button className='border' onClick={onImageClick}>
                    IMAGE
                </button>
                <button className='border' onClick={onSpriteClick}>
                    SPRITE
                </button>
                <button className='border' onClick={onRectClick}>
                    RECT
                </button>
           
            </div>
            <div>
                <button className='border' onClick={onTextStyleClick}>
                    TEXT STYLE
                </button>
            </div>
        </>
    );
}
