import React from 'react'
import {List, ListItem, ListItemText} from '@material-ui/core'
import {codepointStr} from './util'
import {useNames} from './ucdparser'
import { makeStyles } from "@material-ui/core/styles";

type props = {
  codePoints: number[],
  move: (cp:number) => void,
}

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiListItem-root": {
      paddingTop: 0,
      paddingBottom: 0,
    }
  }
}));

export const UnicodeList: React.FC<props> = ({codePoints, move}) => {
  const classes = useStyles()
  const names = useNames()
  return (
    <div className={classes.root}>
      <List>
        {
          codePoints.map((cp, i) => {
            const text = (<span>
              <span className="additional">{codepointStr(cp)}</span>&nbsp;
              {String.fromCodePoint(cp)}&nbsp;
              <span className="additional">{names[cp] || ''}</span>
            </span>)
            return (<ListItem key={i} onClick={() => move(cp)}>
              <ListItemText primary={text}/>
            </ListItem>)
          })
        }
      </List>
    </div>
  )
}