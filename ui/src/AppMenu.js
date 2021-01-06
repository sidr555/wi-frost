import React from 'react';
import {
    IconButton,
    Menu,
    MenuItem, Toolbar
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
   a: {
       color: theme.text
   }
}));

function AppMenu({instruction}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const showInstruction = () => {
        window.location = instruction;
    };

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
                <MenuItem onClick={showInstruction}>
                    Инструкция по применению
                </MenuItem>
            </Menu>
        </div>
    );
}
export default AppMenu;
