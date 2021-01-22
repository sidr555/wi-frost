import React from 'react';
import {Container, Grid, Typography} from "@material-ui/core";
import {observer} from "mobx-react-lite"

const StateItem = observer(({title, unit, port, defaultValue }) => {

//    console.log("update stateitem", title, unit, port)

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography gutterBottom variant="body1" color="textSecondary" align="right">
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1" color="textPrimary">
                        {unit && unit.store.values[port] /*|| defaultValue*/}
                    </Typography>
                </Grid>
            </Grid>

        </Container>
    )
})

export default StateItem;

