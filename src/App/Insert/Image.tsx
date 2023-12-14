import { Button } from './Insert.styles';
import ListItem from './components/ListItem';

export default function Image() {
    return (
        <ListItem title='IMAGE'>
            <div className='flex gap-x-1'>
                <Button>BASIC</Button>
                <Button>SPRITE</Button>
            </div>
        </ListItem>
    );
}
