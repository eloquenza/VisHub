import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Users, Languages, Sidebar } from 'components'

import './styles/index.css'

ReactDOM.render(
  <React.StrictMode>
    {/* BrowserRouter handles which URL path is connected to which components */}
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
        {/* A <Switch> iterates over its children <Route>s and
          renders the first declared one that matches the current URL.
          Meaning, more specific ones should be before less specific ones. This seems counter-intuitive when you know, that IP routing does essentially the same while avoiding having an order of declaration */}
        <Switch>
          {/* exact avoids the aforementioned problem and lets a route only be matched if the current URL matches the declared path directly */}
          <Route exact path={['/home', '/users', '/']}>
            {/* The declared components inside a Route are the ones that will be rendered when said Route is matched */}
            <Users />
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
