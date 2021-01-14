import React from 'react';
import {
    IconButton,
    Menu,
    MenuItem
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LoginForm from "./LoginForm";


function AuthMenu({config, auth, onAuthorized, onLogout}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const closeMenu = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        closeMenu();
        onLogout();
    };

    return (
        <div>
            {auth &&
            <div>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar-auth"
                    aria-haspopup="true"
                    onClick={openMenu}
                    color="inherit"
                >
                    <AccountCircle />
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
                    <MenuItem onClick={() => handleLogout()}>Выйти</MenuItem>
                </Menu>
            </div>
            }

            {auth || <LoginForm onAuthorized={() => onAuthorized()} config={config}/>}
        </div>
    );
}
export default AuthMenu;
