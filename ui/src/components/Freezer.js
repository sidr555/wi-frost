import React from 'react';
//import { observer } from 'mobx-react-lite'
import {observer} from 'mobx-react-lite';

import {
    Button,
    Grid
} from '@material-ui/core';

import StateItem from './StateItem';
import StateSectionTitle from './StateSectionTitle';
import UnitTitle from './UnitTitle';
import UnitImage from './UnitImage';


import Unit from '../iot/Unit';


//import { niceTimeDiff } from '../helper';






const unit = new Unit('wi-frost', 's-home');


const Freezer = observer(({ auth, mqtt, classes }) => {

    unit.useMqtt(mqtt)

    const [state, setState] = React.useState({
        uptime: 159200,
        job: 'none',
        jobtime: 1243,
        compressor_sleeptime: 16000,
        temperature: {
            moroz: null,
            body: null,
            unit: null,
            room: null,
            compressor: null

        },
    });
    const [config, setConfig] = React.useState({
        brand: 'Daewoo',
        model: 'FR-530',
        image: '',
        scheme: '',
        instruction: '',
        temp_sensors: {}
    });




    const changeJob = (job) => {
//        API.get('/setjob/' + job, () => {
//            setState(prevState => {
//                prevState.jobtime = 0;
//                prevState.job = job;
//                return prevState;
//            });
//            // state.jobtime = 0;
//            // state.job = job;
//            // setState(state);
//            console.log('changejob', job, state);
//        });
    }






  return (
  <div>
    <UnitTitle unit={ unit } />
    <hr/>

    <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4} lg={4} align='right'>
            <UnitImage unit={ unit } />
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={8} container alignContent='space-between'>


            <StateSectionTitle title='Состояние' />
            <StateItem key='current_state' title='Текущее состояние' unit={unit} port='state' value={ unit.store.currentState.title } />
            {/*<StateItem key='uptime' title='Общее время работы' value={niceTimeDiff(state.start_time)} />*/}
            {/*<StateItem key='time' title='В течение' value={niceTimeDiff(state.job_time)} />*/}
            {/*<StateItem key='fan' title='Вентилятор' value={getFanState()} />*/}

            <StateSectionTitle title='Датчики'/>
            <StateItem key={'temp_moroz'} title={ unit.devTitles.moroz } unit={ unit } port='moroz' value={ unit.store.values.moroz || '-' }/>
            <StateItem key={'temp_body'} title={ unit.devTitles.body } unit={ unit } port='body'  value={ unit.store.values.body || '-' }/>
            <StateItem key={'temp_compressor'} title={ unit.devTitles.compressor } unit={ unit } value={ unit.store.values.compressor || '-' }/>
            <StateItem key={'temp_room'} title={ unit.devTitles.room } unit={ unit } value={ unit.store.values.room || '-' }/>


            {auth && state.job !== 'none' &&
            <Grid container>
                <StateSectionTitle title='Изменить режим работы'/>

                <Grid item xs={12}>
                    <div className={classes.mainButtons}>
                        <Grid container spacing={5} justify='center'>
                            {state.job === 'freeze' ||
                            state.compressor_sleeptime < config.compressor_sleeptime ||
                            <Grid item>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={() => {
                                        changeJob('freeze')
                                    }}
                                >Охлаждение</Button>
                            </Grid>
                            }
                            {state.job === 'heat' ||
                            <Grid item>
                                <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                        changeJob('heat')
                                    }}
                                >Разморозка</Button>
                            </Grid>
                            }
                            {state.job === 'sleep' ||
                            <Grid item>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    onClick={() => {
                                        changeJob('sleep')
                                    }}
                                >Отдых</Button>
                            </Grid>
                            }
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            }
        </Grid>
    </Grid>
  </div>);
})

export default Freezer
