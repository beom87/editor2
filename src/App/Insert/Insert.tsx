import { Typography } from '@mui/material';
import Image from './Image';
import Shapes from './Shapes';
import Text from './Text';

export default function Insert() {
    return (
        <div>
            <Typography className='drop-shadow' variant='h5' color='primary' align='center'>
                DM-OBJECTS
            </Typography>
            <div className='border-t my-1'></div>          
            <Text />
            <Image />
            <Shapes />
        </div>
    );
}
