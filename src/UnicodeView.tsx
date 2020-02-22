import React, {useState, useEffect} from 'react'
import {getInfo} from './ucdparser'
import {codepointStr} from './util'
import {ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import './main.css'

type props = {codePoint: number | null}

function useLoading<T,V>(current: T, loadFunc: (t:T) => Promise<V>, initialValue:V): [boolean, V] {
  const [loaded, setLoaded] = useState<T>(current)
  const [value, setValue] = useState<V>(initialValue)
  useEffect(() => {
    let asking = current
    let cancelled = false;
    loadFunc(asking).then((v) => {
      if (cancelled) {
        return;
      }
      setLoaded(asking)
      setValue(v)
    })
    return () => {cancelled = true;}
  }, [current])
  return [loaded !== current, value]
}

export const UnicodeView: React.FC<props> = ({codePoint}) => {
  const [isLoading, detail] = useLoading(codePoint, (cp) => (cp === null ? Promise.resolve({}) : getInfo(cp)), {})
  
  return (
    <div>
      {
        codePoint === null ?
        <div/>:
        (
          <div>
            <div className="heading">{codepointStr(codePoint)} {String.fromCodePoint(codePoint)}</div>
            {
              (isLoading)?
              <div>loading...</div>:
              (
                <div>
                  <div className="description_area">
                    <div className="title">NAME</div>
                    <div className="body">{detail['na']}</div>
                  </div>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon/>}
                    >
                      raw data
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div>
                        {
                          Object.keys(detail).map((key) => (
                            <div key={key}>{key}:{detail[key]}</div>
                          ))
                        }
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
} 