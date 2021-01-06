import React from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from "@material-ui/core";


function LoginForm({onAuthorized}) {
    const [email, setEmail] = React.useState("sidr@sidora.net");
    const [pass, setPass] = React.useState("12345");

    const [open, setOpen] = React.useState(false);

    const openForm = () => {
        setOpen(true);
    }

    const closeForm = () => {
        setOpen(false);
    }

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }
    const onChangePass = (event) => {
        setPass(event.target.value);
    }

    const doLogin = () => {
        // TODO AJAX
        console.log("Login: ", email, pass);
        setOpen(false);
        onAuthorized();
    }


    return (
        <div>
            <Button
                color="secondary"
                variant="contained"
                onClick={openForm}
            >Войти</Button>

            <Dialog
                open={open}
                onClose={closeForm}
                aria-labeledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Вход</DialogTitle>
                <DialogContent>
                    <DialogContentText>Войдите для изменения параметров</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        defaultValue={email}
                        fullWidth
                        required
                        onChange={onChangeEmail}
                    ></TextField>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="pass"
                        label="Пароль"
                        defaultValue={pass}
                        type="password"
                        fullWidth
                        required
                        onChange={onChangePass}
                    ></TextField>
                    <DialogActions>
                        <Button
                            onClick={closeForm}
                            color="primary"
                        >Отмена</Button>
                        <Button
                            onClick={doLogin}
                            color="primary"
                        >Войти</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}
export default LoginForm;
