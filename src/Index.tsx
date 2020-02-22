import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import {TextField, Grid, Paper, List, ListItem, ListItemText} from '@material-ui/core'
import {codepointStr} from './util'
import {UnicodeView} from './UnicodeView'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      minWidth: 1000
    }
  }
}));

const Index: React.FC = () => {
  const classes = useStyles()
  const [text, setText] = useState("")
  const [codePointsText, setCodePointsText] = useState('')
  const [codePoint, setCodePoint] = useState(null)
  const textChanged = (e) => {
    const newText = e.target.value
    setText(newText)
    const codePoints = [...newText]
    setCodePointsText(codePoints.map(s => s.codePointAt(0).toString(16)).join(' '))
  }
  const codePointsTextChanged = (e) => {
    setCodePointsText(e.target.value)
    const newText = e.target.value.split(" ").map((s) =>
      String.fromCodePoint(parseInt(s, 16))
    ).join('')
    setText(newText)
  }
  const codePoints = [...text]
  return (
    <div className={classes.root}>
      <div>
        <TextField label="Text" onChange={textChanged} value={text} id="text_input" size="medium"/>
        <TextField label="CodePoints" onChange={codePointsTextChanged} value={codePointsText} id="code_point_input" size="medium"/>
      </div>
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