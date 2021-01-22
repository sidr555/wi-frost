import { observer } from "mobx-react-lite"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    img: {},
}));

export default observer(({ unit }) => {
    const classes = useStyles();
    return (
    <>
        <img className={classes.img} alt={unit.config.title} src={unit.config.image}/>
    </>
    )
})
