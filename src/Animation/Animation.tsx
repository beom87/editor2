import { useAtomValue } from 'jotai';
import { editorAtom } from '../atoms';
import FadeIn from '../editor/animations/fadeIn';

export default function Animation() {
    const editor = useAtomValue(editorAtom);
    const addFadInClick = () => {
        const activeObject = editor?.activeObjects?.[0];

        if (!activeObject) return;
        const fadeInAnimation = new FadeIn();
        activeObject.__effect.add(fadeInAnimation);
    };
    return (
        <>
            <div>
                <button className='border rounded'>Play</button>
            </div>
            <div>
                <button className='border rounded' onClick={addFadInClick}>
                    Fade In
                </button>
            </div>
        </>
    );
}
