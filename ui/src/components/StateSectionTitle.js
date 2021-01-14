import React from 'react';
import {Grid, Typography} from "@material-ui/core";

const StateSectionTitle = ({title}) => {
    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        align="center"
                        color="textPrimary"
                        gutterBottom
                    >{title}</Typography>
                </Grid>
            </Grid>
        </>
    )
}

export default StateSectionTitle;
