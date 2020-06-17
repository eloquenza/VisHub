import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Users, Repos, Events, Languages } from 'components'
import Sidebar from './components/layout/Sidebar'

import './styles/index.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>

      {/* Navbar */}
      <div className="header">
        <h1>Vishub</h1>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="content">
        <Switch>
          <Route exact path={['/home', '/users', '/']}>
            <Users />
          </Route>
          <Route path="/repos">
            <Repos />
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/languages">
            <Languages />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
