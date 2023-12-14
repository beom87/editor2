import { Collapse, Divider, IconButton } from "@mui/material";
import { Title } from "../Insert.styles";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PropsWithChildren, useState } from "react";

export default function ListItem({ children, title }: PropsWithChildren<{ title: string }>) {
    const [open, setOpen] = useState(false);

    const onOpenClick = () => {
        setOpen(!open);
    };
    return <>
        <Title className='flex items-center'>
            <IconButton color='primary' onClick={onOpenClick}>
                {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
            <div className='pb-0.5'>{title}</div>
        </Title>
        <Divider style={{ marginBlock: '4px' }} />
        <Collapse in={open}>
            {children}
        </Collapse>
    </>
}