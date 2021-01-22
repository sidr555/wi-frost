import { observer } from "mobx-react-lite"
import { Button, Grid } from '@material-ui/core'

export default observer(({ unit, classes }) => {
//    console.log('UnitJobs', unit.jobs)

    return (
        <Grid item xs={12}>
            <div className={classes.mainButtons}>
                <Grid container spacing={5} justify='center'>
                    { unit.jobs.map( (job) => <Grid item key={ unit.name + '-job-button-' + job.name }>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => {
                                    unit.runJob(job)
                                }}
                            >{ job.title }</Button>
                        </Grid>
                    ) }
                </Grid>
            </div>
        </Grid>
    )
})
