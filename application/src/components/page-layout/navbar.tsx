import React, {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'
import styles from 'styles/navbar.module.css'
import {RouteObject, RouteNames, routesMap} from 'configs/routes'

// helper functions to reduce duplicate code of applied css styles
type NavLinkProps = {
  to: string
  exact?: boolean
  children?: React.ReactNode
}

const PageName: FunctionComponent = props => (
  <li className={styles.pageName}>{props.children}</li>
)

const NavElement: FunctionComponent = props => (
  <li className={styles.subPages}>{props.children}</li>
)

const NavLinkStyled: FunctionComponent<NavLinkProps> = ({
  to,
  exact,
  children,
}) => (
  <NavLink {...exact} to={to} className={styles.navLink}>
    {children}
  </NavLink>
)

// Procedurally create all navigation bar elements from the routesMap
const routes = Object.values<RouteObject>(routesMap).map(
  ({path, visibleName}) => {
    switch (visibleName) {
      case RouteNames[RouteNames.Vishub]:
        return (
          <PageName>
            <NavLinkStyled exact to={path}>
              {visibleName}
            </NavLinkStyled>
          </PageName>
        )
      default:
        return (
          <NavElement>
            <NavLinkStyled to={path}>{visibleName}</NavLinkStyled>
          </NavElement>
        )
    }
  }
)

class NavBar extends React.Component<{}, {}> {
  render() {
    return (
      <nav className={styles.nav}>
        <ul className={styles.ul}>{routes}</ul>
      </nav>
    )
  }
}

export default NavBar
