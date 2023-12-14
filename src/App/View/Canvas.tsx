import { useEffect, useRef } from 'react';
import Editor from '../../editor/core';
import { useSetAtom } from 'jotai';
import { editorAtom } from '../../atoms';

const width = 800;
const height = (width * 3) / 4;

export default function Canvas() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const setEditor = useSetAtom(editorAtom);

    useEffect(() => {
        if (!canvasRef.current) return;
        const editor = new Editor();
        editor.injectCanvas(canvasRef.current);
        editor.setSize(width, height);
        setEditor(editor);
    }, [setEditor]);

    return <div className='border shadow' ref={canvasRef}></div>;
}
