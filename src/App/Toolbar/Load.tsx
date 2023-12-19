import { useAtomValue } from 'jotai';
import Button from './Toolbar.styles';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { editorAtom } from '../../atoms';

export default function Load() {
    const editor = useAtomValue(editorAtom);

    const onLoadClick = () => {
        const data = window.localStorage.getItem('DMEditor') ?? '{}';
        console.log(JSON.parse(data));
        editor?.loadFromData(JSON.parse(data));
    };
    return (
        <Button title="Load" onClick={onLoadClick}>
            <SystemUpdateAltIcon />
        </Button>
    );
}
