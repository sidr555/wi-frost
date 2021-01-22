import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { Grid } from '@material-ui/core'

import StateItem from './StateItem'
import StateSectionTitle from './StateSectionTitle'
import UnitTitle from './UnitTitle'
import UnitImage from './UnitImage'
import UnitJobs from './UnitJobs'


import Unit from '../iot/Unit'


//import { niceTimeDiff } from '../helper'



const unit = new Unit('wi-frost', 's-home')


const Freezer = observer(({ auth, mqtt, menu, classes }) => {
      unit.useMqtt(mqtt)
    useEffect(() => {

      unit.useMenu(menu)
   })
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

            {

            unit.tempSensors.map((dev) => {
                //console.log("ITEM", dev.name, unit.devTitles[dev.name]);
                return (
                    <StateItem key={'temp_' + dev.name} title={ unit.devTitles[dev.name] } unit={ unit } port={ dev.name } defaultValue='-' />
                )
            })}

            {auth &&
                <Grid container>
                    {/*<StateSectionTitle title='Изменить режим работы'/>*/}
                    <UnitJobs unit={ unit } classes={ classes } />
                </Grid>
            }
        </Grid>
    </Grid>
  </div>)
})

export default Freezer
