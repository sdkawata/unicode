import React from 'react'
import {List, ListItem, ListItemText} from '@material-ui/core'
import {codepointStr} from './util'
import {useNames} from './ucdparser'

type props = {
  codePoints: number[],
  move: (cp:number) => void,
}

export const UnicodeList: React.FC<props> = ({codePoints, move}) => {
  const names = useNames()
  return (
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
  )
}