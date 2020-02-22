import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import {TextField, Grid, Paper, List, ListItem, ListItemText} from '@material-ui/core'
import {codepointStr} from './util'
import {UnicodeView} from './UnicodeView'

const Index: React.FC = () => {
  const [text, setText] = useState("")
  const [codePoint, setCodePoint] = useState(null)
  const textChanged = (e) => {
    setText(e.target.value)
  }
  const codePoints = [...text]
  return (
    <div>
      <TextField onChange={textChanged}/>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper>
            <List>
              {
                codePoints.map((s, i) => {
                  const text = `${codepointStr(s.codePointAt(0))} ${s}`
                  return (<ListItem key={i} onClick={() => setCodePoint(s.codePointAt(0))}>
                    <ListItemText primary={text}/>
                  </ListItem>)
                })
              }
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <UnicodeView codePoint={codePoint}/>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
} 

ReactDOM.render(<Index/>, document.getElementById('app'))