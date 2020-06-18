import React from 'react'

import styles from 'styles/GraphHotkeyInfo.module.css'

function GraphHotkeyInfo() {
  return (
    <div>
        <div className={styles.howTo}>How-to use</div>
      <hr className={styles.smallerHr}></hr>
        <div className={styles.hotkeyTitle}>Graph hotkeys</div>
      <hr className={styles.smallerHr}></hr>
      <ul>
        <li><b>Panning:</b><br/>left mouse button + drag</li>
        <li><b>Zoom in/out:</b><br/>ctrl + mouse wheel</li>
        <li><b>Highlight vertex:</b><br/>mouseover</li>
        <li><b>Switch representation:</b><br/>dropdown menu</li>

      </ul>
      <hr className={styles.smallerHr}></hr>
        <div className={styles.hotkeyTitle}>Force-directed</div>
      <hr className={styles.smallerHr}></hr>
      <ul>
        <li><b>Dragging vertex:</b><br/>left mouse button + drag</li>
        <li><b>Reset sticky vertex:</b><br/>ctrl + left mouse button</li>
      </ul>
      <hr className={styles.smallerHr}></hr>
        <div className={styles.hotkeyTitle}>3D Force-directed</div>
      <hr className={styles.smallerHr}></hr>
      <ul>
        <li><b>Rotate graph:</b><br/><b>left</b> mouse button + drag</li>
        <li><b>Panning:</b><br/><b>right</b> mouse button + drag</li>
        <li><b>Dragging vertex:</b><br/>left mouse button + drag</li>
        <li><b>Reset sticky vertex:</b><br/>not implemented</li>
      </ul>
      <hr className={styles.smallerHr}></hr>
        <div className={styles.hotkeyTitle}>Radial-edge bundling</div>
      <hr className={styles.smallerHr}></hr>
      <ul>
        <li><b>Dragging vertex:</b><br/>not supported</li>
      </ul>
    </div>
  )
}

export default GraphHotkeyInfo
