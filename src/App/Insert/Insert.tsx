import { Typography } from '@mui/material';
import Image from './Image';
import Shapes from './Shapes';
import Text from './Text';

export default function Insert() {
    return (
        <div>
            <Typography className='drop-shadow' variant='h5' color='primary'>
                DM-OBJECTS
            </Typography>
            <div className='border-t my-1'></div>
            <Text />
            <div className='border-t my-1'></div>
            <Image />
            <div className='border-t my-1'></div>
            <Shapes />
        </div>
    );
}
