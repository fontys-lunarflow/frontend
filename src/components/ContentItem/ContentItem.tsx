import Paper from '@mui/material/Paper';
import classes from './contentitem.module.css'
import { Avatar, Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import { orange } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import React from 'react';

type ContentItemDetailProps = {
    icon: React.ReactNode,
    name: string,
    text: string | undefined
}

const contentItemDetails: ContentItemDetailProps[] = [{
    icon: <AccountCircleOutlinedIcon />,
    name: "Author",
    text: "Sara Gillian"
},
{
    icon: <PeopleAltOutlinedIcon />,
    name: "Person / Department",
    text: "Diana Kupfer"
},{
    icon: <CheckCircleOutlineOutlinedIcon />,
    name: "Status",
    text: "Published"
},{
    icon: <LinkOutlinedIcon />,
    name: "Link",
    text: "blog.eclipse.org"
}
]

const contentItemDetail = ({icon, name, text} : ContentItemDetailProps) => {
    return (<div className={classes.contentItemDetail}>
        {icon}
        <p className={classes.name}>{name}</p>
        <p className={classes.content}>{text ?? ""}</p>
    </div>)
}

export type ContentItemProps = {
    title: string;
}

export function ContentItem({title} : ContentItemProps) {
    return (<Paper elevation={3} className={classes.contentitem}>
        <div className={classes.top}>
            <Avatar sx={{ bgcolor: orange[500]}}>I</Avatar>
            <Typography variant="subtitle2" className={classes.title}>{title}</Typography>
            <div className={classes.buttons}>
                <IconButton><EditIcon /></IconButton>
                <IconButton><MoreVertIcon /></IconButton>
                <IconButton><ClearIcon /></IconButton>
            </div>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.options}>
        {contentItemDetails.map(detail => contentItemDetail(detail))}
        <Button variant='contained'>More options</Button>
        </div>
        <TextField multiline className={classes.notes} rows={5}></TextField>
    </Paper>)
}