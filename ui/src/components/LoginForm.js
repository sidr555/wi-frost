import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from "@material-ui/core";


function LoginForm({onAuthorized, config}) {
    const [email, setEmail] = React.useState(config.user.email);
    const [pass, setPass] = React.useState();

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
                aria-labelledby="form-dialog-title"
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
