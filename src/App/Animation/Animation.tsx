import { useAtomValue } from 'jotai';
import { editorAtom } from '../../atoms';
import { FadeIn, Sprite } from '../../editor/animations';
import { useState } from 'react';

export default function Animation() {
    const editor = useAtomValue(editorAtom);
    const [animationState, setAnimationState] = useState<'pending' | 'fullfilled' | 'running'>('pending');

    const onCreateAnimationClick = async () => {
        const effects = editor?.getEffects();
        await Promise.all(effects?.map((effect) => effect.createAnimation()) ?? []);
        setAnimationState('fullfilled');
    };

    const onPlayClick = () => {
        const effects = editor?.getEffects();
        effects?.forEach((effect) => effect.play());
        setAnimationState('running');
    };

    const onStopClick = () => {
        const effects = editor?.getEffects();
        effects?.forEach((effect) => {
            effect.stop();
            effect.removeAll();
        });
        setAnimationState('pending');
    };

    const addFadInClick = () => {
        const activeObject = editor?.activeObjects?.[0];

        if (!activeObject) return;
        const fadeInAnimation = new FadeIn({ targetId: activeObject.id });
        activeObject.__effect.add(fadeInAnimation);
    };
    const AddSpriteClick = () => {
        const activeObject = editor?.activeObjects?.[0];

        if (!activeObject) return;
        const spriteAnimation = new Sprite({ targetId: activeObject.id });
        activeObject.__effect.add(spriteAnimation);
    };
    return (
        <>
            <div>
                <button className='border rounded' onClick={onCreateAnimationClick}>
                    Create Animation
                </button>
                {animationState === 'fullfilled' && (
                    <button className='border rounded' onClick={onPlayClick}>
                        Play
                    </button>
                )}
                {animationState === 'running' && (
                    <button className='border rounded' onClick={onStopClick}>
                        Stop
                    </button>
                )}
            </div>
            <div>
                <button className='border rounded' onClick={addFadInClick}>
                    Fade In
                </button>
                <button className='border rounded' onClick={AddSpriteClick}>
                    Sprite
                </button>
            </div>
        </>
    );
}
