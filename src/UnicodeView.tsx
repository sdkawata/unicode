import React, {useState, useEffect} from 'react'
import {getInfo} from './ucdparser'
import {codepointStr} from './util'
import {ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {Link} from 'react-router-dom'
import './main.css'

type props = {codePoint: number | null, move: (cp:number) => void}
type glyphProps = {codePoint: number | null, move: (cp:number) => void}

const GeneralCategories = {
  'Lu': 'Letter, uppercas',
  'Ll': 'Letter, lowercase',
  'Lt': 'Leter, titlecase',
  'Lm': 'Letter, modifier',
  'Lo': 'Letter, other',

  'Mn': 'Mark, nonspacing',
  'Mc': 'Mark, spacing combining',
  'Me': 'Mark, enclosing',

  'Nd': 'Number, decimal digit',
  'Nl': 'Number, letter',
  'No': 'Number, other',

  'Pc': 'Punctuation, connector',
  'Pd': 'Punctuation, dash',
  'Ps': 'Punctuation, open',
  'Pe': 'Punctuation, close',
  'Pi': 'Punctuation, quote',
  'Pf': 'Punctuation, final quote',
  'Po': 'Punctuation, other',

  'Sm': 'Symbol, math',
  'Sc': 'Symbol, currency',
  'Sk': 'Symbol, modifier',
  'So': 'Symbol, other',

  'Zs': 'Separator, space',
  'Zl': 'Separator, line',
  'Zp': 'Separator, paragraph',

  'Cc': 'Other, control',
  'Cf': 'Other, format',
  'Cs': 'Other, surroagete',
  'Co': 'Other, private use',
  'Cn': 'Other, assigned',
}

const EastAsianWidths = {
  'F': 'Fullwidth',
  'H': 'HalfWidth',
  'W': 'Wide',
  'Na': 'Narrow',
  'A': 'Ambiguous',
  'N': 'Neutral',
}

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

const Glyph: React.FC<glyphProps> = ({codePoint, move}) => {
  const text = String.fromCodePoint(codePoint)
  return (<span className="glyph" onClick={() => move(codePoint)}> {`${codepointStr(codePoint)} ${text}`} </span>)
}

export const UnicodeView: React.FC<props> = ({codePoint, move}) => {
  const [isLoading, detail] = useLoading(codePoint, (cp) => (cp === null ? Promise.resolve({}) : getInfo(cp)), {})
  const values: [string, JSX.Element][] = []
  if (detail && detail['cp']) {
    values.push(['AGE', <span>{detail['age']}</span>])
    if (detail['na']) {
      values.push(['Name', <span>{detail['na']}</span>])
    }
    if (detail['na1']) {
      values.push(['Name(version1)', <span>{detail['na1']}</span>])
    }
    if (detail['aliases']) {
      values.push(['Alias', <span>{detail['aliases'].map((alias)=> `${alias['alias']}(${alias['type']})`).join(' ')}</span>])
    }
    values.push(['Block', <span>{`${detail['_blockname']} (${detail['blk']}) ${codepointStr(detail['_block_first_cp'])}-${codepointStr(detail['_block_last_cp'])}`}</span>])
    values.push(['General Category', <span>{`${GeneralCategories[detail['gc']]} (${detail['gc']})`}</span>])
    values.push(['Combining class', <span>{detail['ccc']}</span>])
    values.push(['Bidrectionality Property', <span>{detail['bc']}</span>])
    values.push(['East Asian Width', <span>{EastAsianWidths[detail['ea']]} ({detail['ea']})</span>])
    if (detail['bmg']) {
      values.push(['Mirrored Glyph', <span><Glyph codePoint={parseInt(detail['bmg'], 16)} move={move}/></span>])
    }
    if (detail['dm']) {
      if (detail['dm'] !== '#') {
        values.push([
          'Decomposition Mapping',
          <span>{detail['dm'].split(' ').map((cp, idx) => <Glyph codePoint={parseInt(cp, 16)} move={move} key={`${cp}-${idx}`}/>)}</span>
        ])
      }
    }
    const qcmap = {'Y': 'Yes', 'M': 'Maybe', 'N': 'No'}
    values.push([
      'Normalization Quick Check',
      <span>{`NFD:${qcmap[detail['NFD_QC']]} NFKD:${qcmap[detail['NFKD_QC']]} NFC:${qcmap[detail['NFC_QC']]} NFKC:${qcmap[detail['NFKC_QC']]}`}</span>
    ])
  }
  return (
    <div>
      {
        codePoint === null ?
        <div/>:
        (
          <div>
            <div className="heading">
              {codepointStr(codePoint)}&nbsp;
              {String.fromCodePoint(codePoint)}
              <Link className="around_link" to={`/search?offset=${detail['_index']}`}>
                show codes around this
              </Link>
            </div>
            {
              (isLoading)?
              <div>loading...</div>:
              (
                <div>
                  <div className="description_area">
                    {values.map(([key, elem])=> (<div key={key}>
                      <div className="title">{key}</div>
                      <div className="body">{elem}</div>
                    </div>))}
                  </div>
                  <div className="prev_and_next">
                    <div className="prev">
                      &lt;&lt; {detail['_prevcp'] !== undefined ? (<Glyph codePoint={detail['_prevcp']} move={move}/>) : null}
                    </div>
                    <div className="next">
                      {detail['_nextcp'] !== undefined ? (<Glyph codePoint={detail['_nextcp']} move={move}/>) : null} &gt;&gt;
                    </div>
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
                          Object.keys(detail).filter((key) => 
                            typeof detail[key] === "string" && key[0] !== '_'
                          ).map((key) => (
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