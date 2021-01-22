import { observer } from "mobx-react-lite"
import { Typography } from "@material-ui/core"

export default observer(({ unit }) => {
    return (
        <>
            <Typography
                variant="h4"
                align="center"
                color="textPrimary"
                gutterBottom
            >{unit.config.title}</Typography>

            <Typography
                variant="h6"
                align="right"
                color="textSecondary"
                gutterBottom
            >{unit.config.brand} {unit.config.model}</Typography>

        </>
    )
})
