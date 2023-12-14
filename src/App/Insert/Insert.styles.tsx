import { ButtonProps, Button as MuiButton, Typography, TypographyProps } from '@mui/material';
import { PropsWithChildren } from 'react';

export const Title = ({ children, ...props }: PropsWithChildren<TypographyProps>) => (
    <Typography className='font-semibold drop-shadow' variant='h6' color='primary' {...props}>
        {children}
    </Typography>
);

export const Button = ({ children, ...props }: PropsWithChildren<ButtonProps>) => (
    <MuiButton size='small' variant='outlined' {...props}>
        {children}
    </MuiButton>
);
