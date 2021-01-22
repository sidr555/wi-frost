import React from 'react';
import { observer } from 'mobx-react-lite'
import {
    IconButton,
    Menu,
    MenuItem, //Toolbar
} from "@material-ui/core";
//import AccountCircle from "@material-ui/icons/AccountCircle";

import MenuIcon from "@material-ui/icons/Menu";


export default observer(({ menu }) => {
//    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const closeMenu = () => {
        setAnchorEl(null);
    };

//    const showInstruction = () => {
//        window.location = instruction;
//    };

//console.log("ITEMS MENU", menu.items, menu);
    return (
        <div>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={openMenu}
            >
                <MenuIcon/>
            </IconButton>


            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={closeMenu}
            >
                <MenuItem onClick={ () => {
                    alert(0)
                } }>Первое</MenuItem>


                { menu.items.map( (item) => {
                    return (
                        <MenuItem key={ 'app-menu-' + item.key } onClick={ () => {
                            if (item.click) {
                                item.click()
                            }
                        } }>{ item.title }</MenuItem>
                    )
                })}
            </Menu>
        </div>
    );
})
