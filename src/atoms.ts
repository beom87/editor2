import { atom } from 'jotai';
import Editor from './editor/core';

export const editorAtom = atom<null | Editor>(null);
