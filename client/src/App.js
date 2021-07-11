import TextEditor from './components/TextEditor'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Redirect to={`/documents/${uuidV4()}`}></Redirect>
        </Route>

        <Route path='/documents/:id'>
          <TextEditor />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
