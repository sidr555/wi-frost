import React from 'react';
import {Container, Grid, Typography} from "@material-ui/core";

const StateItem = ({title, value}) => {
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
                        {value}
                    </Typography>
                </Grid>
            </Grid>

        </Container>
    )
}

export default StateItem;
