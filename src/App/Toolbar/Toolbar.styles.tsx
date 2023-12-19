import { IconButton, IconButtonProps, Tooltip, TooltipProps } from '@mui/material';
import { PropsWithChildren } from 'react';

export default function Button({
    title,
    placement,
    children,
    ...props
}: PropsWithChildren<IconButtonProps & { title: string } & { placement?: TooltipProps['placement'] }>) {
    return (
        <Tooltip title={title} placement={placement}>
            <IconButton size="small" {...props}>
                {children}
            </IconButton>
        </Tooltip>
    );
}
