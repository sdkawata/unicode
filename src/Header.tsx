import React from 'react'
import { Toolbar } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiToolbar-root": {
      backgroundColor: '#1979d2',
    },
    "& .link": {
      color: "#fff",
      textDecoration: "none",
    }
  }
}));

export const Header: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Toolbar>
        <Link to="/" className="link">
          Input
        </Link>
      </Toolbar>
    </div>
  )
}