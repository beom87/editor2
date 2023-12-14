import { Button, Title } from './Insert.styles';

export default function Shapes() {
    return (
        <>
            <Title>SHAPES</Title>
            <div className='flex gap-x-1'>
                <Button>LINE</Button>
                <Button>RECT</Button>
            </div>
        </>
    );
}
