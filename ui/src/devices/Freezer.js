import React, {useEffect} from 'react';

import {
    Button,
    Grid,
    Typography
} from "@material-ui/core";

import StateItem from "../components/StateItem";
import StateSectionTitle from "../components/StateSectionTitle";

//import API from "../Api";
import { niceTimeDiff } from '../helper';

export default function Freezer({ auth, classes }) {

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
            // moroz: -16.3,
            // body: -6.7,
            // unit: 27.3,
            // room: 22.8,
            // compressor: 56.8
        },
    });
    const [config, setConfig] = React.useState({
        brand: "Daewoo",
        model: "FR-530",
        image: "",
        scheme: "",
        instruction: "",
        temp_sensors: {}
    });



    const jobs = {
        none: "Недоступен",
        sleep: "Сон",
        freeze: "Охлаждение",
        heat: "Разморозка",
        danger: "Авария"
    };
    const temp_sensors = {
        moroz: "Морозильная камера",
        body: "Холодильная камера",
        compressor: "Компрессор",
        unit: "Блок управления",
        room: "Помещение"
    };

    const changeJob = (job) => {
//        API.get("/setjob/" + job, () => {
//            setState(prevState => {
//                prevState.jobtime = 0;
//                prevState.job = job;
//                return prevState;
//            });
//            // state.jobtime = 0;
//            // state.job = job;
//            // setState(state);
//            console.log("changejob", job, state);
//        });
    }

    const getFanState = () => {
        if (state.job === "none") {
            return "-";
        } else if (state.job === "heat" && state.job_time > 0) {
            return "Отключен";
        }
        return "Работает";
    }

    useEffect(() => {
//        API.get("/config")
//            .then(response => response.json())
//            .then(config => {
//                setConfig(config)
//                console.log("Config loaded", config);
//            });

        // setInterval(() => {
        //     API.get("/state")
        //         .then(response => response.json())
        //         .then(state => {
        //             setState(state)
        //             console.log("State loaded", state);
        //         });
        // }, 3000);
    }, []);


  return (
  <div>
    <Typography
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
    >{config.brand} {config.model}</Typography>

    <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4} lg={4} align="right">
            <img className={classes.img} alt={config.brand + '' + config.model} src={config.image}/>
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={8} container alignContent="space-between">
            <StateSectionTitle title="Состояние" />
            <StateItem key="uptime" title="Общее время работы" value={niceTimeDiff(state.start_time)} />

            <StateItem key="job" title="Текущее состояние" value={jobs[state.job]} />

            <StateItem key="time" title="В течение" value={niceTimeDiff(state.job_time)} />
            <StateItem key="fan" title="Вентилятор" value={getFanState()} />

            <StateSectionTitle title="Датчики"/>
                {Object.keys(config.temp_sensors).map((key, index) => {
                    let temp = " ̊ C";
                    if (state.temperature[key]) {
                        temp = state.temperature[key] + temp;
                        if (state.temperature[key] > 0) {
                            temp = "+" + temp;
                        }
                    } else {
                        temp = "-";
                    }
                    return <StateItem key={"temp_" + key} title={temp_sensors[key]} value={temp}/>
                })}

                {auth && state.job !== "none" &&
                <Grid container>
                    <StateSectionTitle title="Изменить режим работы"/>

                    <Grid item xs={12}>
                        <div className={classes.mainButtons}>
                            <Grid container spacing={5} justify="center">
                                {state.job === "freeze" ||
                                state.compressor_sleeptime < config.compressor_sleeptime ||
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            changeJob("freeze")
                                        }}
                                    >Охлаждение</Button>
                                </Grid>
                                }
                                {state.job === "heat" ||
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            changeJob("heat")
                                        }}
                                    >Разморозка</Button>
                                </Grid>
                                }
                                {state.job === "sleep" ||
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            changeJob("sleep")
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
}
