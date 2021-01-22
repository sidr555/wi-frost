import React from 'react';
import { observer } from "mobx-react-lite";
import { Typography } from "@material-ui/core";

export default observer(({ config }) => {
  return (
  <>
    <Typography
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
    >{unit.config.title}</Typography>
    <Typography
        variant="h4"
        align="center"
        color="textPrimary"
        gutterBottom
    >{unit.config.brand} {unit.config.model}</Typography>

  </>
})
