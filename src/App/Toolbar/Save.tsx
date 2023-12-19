import { useAtomValue } from 'jotai';
import Button from './Toolbar.styles';
import SaveIcon from '@mui/icons-material/Save';
import { editorAtom } from '../../atoms';

export default function Save() {
    const editor = useAtomValue(editorAtom);

    const onSaveClick = () => {
        const data = editor?.toJSON();
        window.localStorage.setItem('DMEditor', data ?? '');
        console.log(data);
    };
    return (
        <Button title="Save" onClick={onSaveClick}>
            <SaveIcon />
        </Button>
    );
}
