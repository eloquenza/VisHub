import React from 'react'
import { NavLink  } from "react-router-dom";

import styles from 'styles/Sidebar.module.css'

function Sidebar() {
  return (
    <div>
      <h4>Navigation</h4>
      <NavLink activeClassName={styles.selected} to="/users">&bull; Users</NavLink >
      <NavLink activeClassName={styles.selected} to="/languages">&bull; Languages</NavLink >
    </div>
  )
}

export default Sidebar
