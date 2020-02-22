import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {TextField, Grid, Paper, List, ListItem, ListItemText} from '@material-ui/core'
import {getInfo} from './ucdparser'

const toHex = (i: number) => (
  ('0000' + i.toString(16)).slice(-4)
)

const Index: React.FC = () => {
  const [text, setText] = useState("")
  const [codePoint, setCodePoint] = useState(null)
  const [detailedCodePoint, setDetailedCodePoint] = useState(null)
  const [detail, setDetail] = useState({})
  const textChanged = (e) => {
    setText(e.target.value)
  }
  useEffect(() => {
    let askCodePoint = codePoint
    getInfo(askCodePoint).then((r) => {
      if (askCodePoint !== codePoint) {
        return;
      }
      setDetailedCodePoint(codePoint)
      setDetail(r)
    })
  }, [codePoint])
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
                  const text = `U+${toHex(s.codePointAt(0))} ${s}`
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
            {
              codePoint === null ?
              <div/>:
              (
                <div>
                  <div>U+{toHex(codePoint)} {String.fromCodePoint(codePoint)}</div>
                  {
                    (detailedCodePoint !== codePoint)?
                    <div>loading...</div>:
                    (<div>{detail['na']}</div>)
                  }
                </div>
              )
            }
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
} 

ReactDOM.render(<Index/>, document.getElementById('app'))