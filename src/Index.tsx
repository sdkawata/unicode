import React, {useRef, useState} from 'react'
import ReactDOM from 'react-dom'

const Index: React.FC = () => {
  const [text, setText] = useState("")
  const textInput = useRef()
  const textChanged = () => {
    setText(textInput.current.value)
  }
  const codePoints = [...text]
  return (
    <div>
      <input ref={textInput} onInput={textChanged}/>
      {
        codePoints.map((s, i) => {
          return <div key={i}>{s} U+{s.codePointAt(0).toString(16)}</div>
        })
      }
    </div>
  )
} 

ReactDOM.render(<Index/>, document.getElementById('app'))