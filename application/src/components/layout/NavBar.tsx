import React, {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'
import {RouteObject, routesMap} from 'configs/routes'
import {ChildrenProps} from 'typedecls/ReactPropsAndStates'
import generateReactKey from 'utils/reactKeyGeneration'

import styles from 'styles/NavBar.module.css'

/// ////////////
// helper functions to reduce duplicate code of applied css styles
/// ////////////
// This is called an intersection type, which combines multiple types
// into one. Extending a type with another type is not allowed in Typescript
// and the workaround with introducing an interface seems rather "hacky"
type NavLinkProps = ChildrenProps & {
  to: string
  exact?: boolean
}

const PageName: FunctionComponent<ChildrenProps> = ({
  children,
}: ChildrenProps) => <li className={styles.pageName}>{children}</li>

const NavElement: FunctionComponent<ChildrenProps> = ({
  children,
}: ChildrenProps) => <li className={styles.subPages}>{children}</li>

const NavLinkStyled: FunctionComponent<NavLinkProps> = ({
  to,
  exact,
  children,
}: NavLinkProps) => {
  return (
    <NavLink exact={exact} to={to} className={styles.navLink} activeClassName={styles.navLinkCurrent}>
      {children}
    </NavLink>
  )
}

const pageName = Object.values<RouteObject>(routesMap).slice(0, 1).map(({path, visibleName}, index) => {
  return (
    <PageName key={generateReactKey('routesMap', index)}>
      <NavLinkStyled exact to={path}>
        {visibleName}
      </NavLinkStyled>
    </PageName>
  )
})

// Procedurally create all navigation bar elements from the routesMap
const routes = Object.values<RouteObject>(routesMap).slice(1).map(({path, visibleName}, index) => {
  return (
    <NavElement key={generateReactKey('routesMap', index)}>
      <NavLinkStyled exact to={path}>{visibleName}</NavLinkStyled>
   </NavElement>
  )
})

function NavBar() {
    return (
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          {pageName}
          {routes}
        </ul>
      </nav>
    )
}

export default NavBar
