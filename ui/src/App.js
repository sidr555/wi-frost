import React, {useEffect} from 'react';
import './App.css';
import {
    AppBar, //BottomNavigation, BottomNavigationAction,
    // Box,
//    Button,
    // Card, CardActions,
    // CardContent,
    // CardMedia,
    Container,
    // Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
//    Grid,
    IconButton,
    // Menu, MenuItem,
    // Paper, TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
// import MenuIcon from '@material-ui/icons/Menu';
// import LayerIcon from '@material-ui/icons/Layers';
import {makeStyles} from "@material-ui/core/styles";
//import AccountCircle from "@material-ui/icons/AccountCircle";
// import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
// import FolderIcon from '@material-ui/icons/Folder';
// import RestoreIcon from '@material-ui/icons/Restore';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import LocationOnIcon from '@material-ui/icons/LocationOn';
// import {Image} from "@material-ui/icons";
import LinkOff from "@material-ui/icons/LinkOff";
import LinkOn from "@material-ui/icons/Link";


import AuthMenu from "./components/AuthMenu";

import AppMenu from "./components/AppMenu";




import Freezer from "./devices/Freezer";



import globalConfig from './config';
import Dispatcher from './dispatcher.mqtt'




const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        margingRight: theme.spacing(1)
    },
    title: {
        flexGrow: 1
    },
    mainContent: {
        marginTop: theme.spacing(10)
    },
    mainFeaturesPost: {
        position: "relative",
        color: theme.palette.common.white,
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(4),
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
    },
    mainFeaturesPostContent: {
        position: "relative",
        padding: theme.spacing(6),
        marginTop: theme.spacing(8)
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundOverlay: "rgba(0,0,0,.5)"
    },
    mainButtons: {},
    cardGrid: {
        marginTop: theme.spacing(4)
    },
    card: {},
    cardMedia: {
        paddingTop: "56.25%"
    },
    cardContent: {
        flexGrow: 1
    },
}));










function App() {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    let mqtt = Dispatcher.create('mqtt', {
                    host: globalConfig.mqtt.host,
                    options: globalConfig.mqtt.options
                });

    const [client, setClient] = React.useState({});
    useEffect(() => {
        mqtt.connect((mqttClient) => {
            console.log("Mqtt connected", mqttClient)
            setClient(mqttClient);
        })
    }, []);





    return (
        <div>
            <AppBar position="fixed">
                <Container fixed>
                    <Toolbar>
                        <AppMenu instruction={'aaa' /*config.instruction*/}/>

                        <Typography variant="h5" align="center" className={classes.title}>Wi-Frost</Typography>

                        <IconButton aria-label="MQTT link" color="inherit">
                            {client.connected && <LinkOn />}
                            {client.connected || <LinkOff />}
                        </IconButton>


                        <AuthMenu auth={auth} onAuthorized={() => setAuth(true)} onLogout={() => setAuth(false)}/>
                    </Toolbar>
                </Container>
            </AppBar>

            <main>
                <div className={classes.mainContent}>
                    <Container maxWidth="md">

                        <Freezer classes={classes} auth={auth} mqtt={mqtt}/>



                    </Container>
                </div>
            </main>
        </div>
    );
}

export default App;
