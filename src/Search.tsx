import React, {useState, useCallback, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {UnicodeView} from './UnicodeView'
import {UnicodeList} from './UnicodeList'
import {Grid, Paper} from '@material-ui/core'
import {getSearch} from './ucdparser'
import {parse} from 'query-string'

export const Search: React.FC = () => {
  const location = useLocation()
  const [codePoints, setCodePoints] = useState([])
  const [codePoint, setCodePoint] = useState(null)
  const move = useCallback((cp)=> {
    setCodePoint(cp)
  },[])
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getSearch(parse(location.search))
      if (!cancelled) {
        setCodePoints(result)
      }
    })();
    return () => {cancelled = true;}
  }, [location.search])
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Paper>
          <UnicodeList move={move} codePoints={codePoints}/>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <UnicodeView codePoint={codePoint} move={move}/>
        </Paper>
      </Grid>
    </Grid>
  )
}