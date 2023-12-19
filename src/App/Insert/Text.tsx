import { useAtomValue } from 'jotai';
import { Button } from './Insert.styles';
import ListItem from './components/ListItem';
import { editorAtom } from '../../atoms';
import { Textbox } from '../../editor/objects';

export default function Text() {
    const editor = useAtomValue(editorAtom);

    const onTextboxClick = () => {
        const textbox = new Textbox();
        editor?.add(textbox);
    };

    return (
        <ListItem title="TEXT">
            <Button onClick={onTextboxClick}>Textbox</Button>
        </ListItem>
    );
}
