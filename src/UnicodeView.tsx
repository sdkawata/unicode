import React, {useState, useEffect} from 'react'
import {getInfo} from './ucdparser'
import {codepointStr} from './util'

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
  const [isLoading, detail] = useLoading(codePoint, getInfo, {})
  
  return (
    <div>
      {
        codePoint === null ?
        <div/>:
        (
          <div>
            <div>{codepointStr(codePoint)} {String.fromCodePoint(codePoint)}</div>
            {
              (isLoading)?
              <div>loading...</div>:
              (<div>{detail['na']}</div>)
            }
          </div>
        )
      }
    </div>
  )
} 