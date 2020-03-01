import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route} from 'react-router-dom'
import {initWorker} from './ucdparser'
import {Input} from './Input'
import {Search} from './Search'

const Index: React.FC = () => {
  return (<HashRouter>
    <Route exact path='/'>
      <Input/>
    </Route>
    <Route exact path='/search'>
      <Search/>
    </Route>
  </HashRouter>)
} 

ReactDOM.render(<Index/>, document.getElementById('app'))
initWorker()
navigator.serviceWorker.register('./sw.js')