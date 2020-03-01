import React, {useState, useCallback} from 'react'
import {TextField, Grid, Paper} from '@material-ui/core'
import {UnicodeView} from './UnicodeView'
import {UnicodeList} from './UnicodeList'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: '100%',
    }
  }
}));

export const Input: React.FC = () => {
  const classes = useStyles()
  const [text, setText] = useState("")
  const [codePointsText, setCodePointsText] = useState('')
  const [codePoint, setCodePoint] = useState(null)
  const move = useCallback((cp)=> {
    setCodePoint(cp)
  },[])
  const textChanged = (e) => {
    const newText = e.target.value
    setText(newText)
    const codePoints = [...newText]
    setCodePointsText(codePoints.map(s => s.codePointAt(0).toString(16)).join(' '))
  }
  const codePointsTextChanged = (e) => {
    setCodePointsText(e.target.value)
    const newText = e.target.value.split(" ").map((s) =>{
      const point = parseInt(s, 16)
      return isNaN(point) ? '' : String.fromCodePoint(point)
    }).join('')
    setText(newText)
  }
  return (
    <div className={classes.root}>
      <div>
        <TextField label="Text" onChange={textChanged} value={text} id="text_input" size="medium"/>
        <TextField label="CodePoints" onChange={codePointsTextChanged} value={codePointsText} id="code_point_input" size="medium"/>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper>
            <UnicodeList move={move} codePoints={[...text].map((s) => s.codePointAt(0))}/>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <UnicodeView codePoint={codePoint} move={move}/>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}