import { Title, Button } from './Insert.styles';

export default function Image() {
    return (
        <>
            <Title>IMAGE</Title>
            <div className='flex gap-x-1'>
                <Button>BASIC</Button>
                <Button>SPRITE</Button>
            </div>
        </>
    );
}
