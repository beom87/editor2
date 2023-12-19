import { useAtomValue } from 'jotai';
import { editorAtom } from '../../atoms';
import Textbox from '../../editor/objects/models/textbox';

import Save from './Save';
import Load from './Load';

export default function Toolbar() {
    const editor = useAtomValue(editorAtom);

    const onTextStyleClick = () => {
        const activeObject = editor?.activeObjects?.[0];
        if (activeObject instanceof Textbox) {
            activeObject.__setTextStyle({ color: 'red' });
        }
    };

    return (
        <>
            <div className="flex gap-x-1">
                <Save />
                <Load />
            </div>
            <div>
                <button className="border" onClick={onTextStyleClick}>
                    TEXT STYLE
                </button>
            </div>
        </>
    );
}
