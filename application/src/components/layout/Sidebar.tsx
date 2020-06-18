import React from 'react'
import { NavLink  } from "react-router-dom";

import styles from 'styles/Sidebar.module.css'
import GraphHotkeyInfo from './GraphHotkeyInfo';

function Sidebar() {
  return (
    <div>
      <h4>Navigation</h4>
      <NavLink activeClassName={styles.selected} to="/users">&bull; Users</NavLink >
      <NavLink activeClassName={styles.selected} to="/licenses">&bull; Licenses</NavLink >
      <hr></hr>
      <GraphHotkeyInfo></GraphHotkeyInfo>
    </div>
  )
}

export default Sidebar
