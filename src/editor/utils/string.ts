import { customAlphabet } from 'nanoid';

/** Create Random Character [a-zA-Z]{16} */
export const generateCharacter = () => customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)();
