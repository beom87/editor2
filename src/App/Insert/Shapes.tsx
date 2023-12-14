import { Button } from './Insert.styles';
import ListItem from './components/ListItem';

export default function Shapes() {
    return (
        <ListItem title='SHAPES'>
            <div className='flex gap-x-1'>
                <Button>RECT</Button>
                <Button>PARALLELOGRAM</Button>
            </div>
        </ListItem>
    );
}
