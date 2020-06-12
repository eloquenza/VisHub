import React, {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'
import styles from 'styles/navbar.module.css'
import {RouteObject, RouteNames, routesMap} from 'configs/routes'
import {ReactTypes} from 'typedecls'
import generateReactKey from 'utils/reactKeyGeneration'

/// ////////////
// helper functions to reduce duplicate code of applied css styles
/// ////////////
// This is called an intersection type, which combines multiple types
// into one. Extending a type with another type is not allowed in Typescript
// and the workaround with introducing an interface seems rather "hacky"
type NavLinkProps = ReactTypes.ChildrenProps & {
  to: string
  exact?: boolean
}

const PageName: FunctionComponent<ReactTypes.ChildrenProps> = ({
  children,
}: ReactTypes.ChildrenProps) => <li className={styles.pageName}>{children}</li>

const NavElement: FunctionComponent<ReactTypes.ChildrenProps> = ({
  children,
}: ReactTypes.ChildrenProps) => <li className={styles.subPages}>{children}</li>

const NavLinkStyled: FunctionComponent<NavLinkProps> = ({
  to,
  exact,
  children,
}: NavLinkProps) => (
  <NavLink exact={exact} to={to} className={styles.navLink}>
    {children}
  </NavLink>
)

// Procedurally create all navigation bar elements from the routesMap
const routes = Object.values<RouteObject>(routesMap).map(
  ({path, visibleName}, index) => {
    switch (visibleName) {
      case RouteNames[RouteNames.Vishub]:
        return (
          <PageName key={generateReactKey('routesMap', index)}>
            <NavLinkStyled exact to={path}>
              {visibleName}
            </NavLinkStyled>
          </PageName>
        )
      default:
        return (
          <NavElement key={generateReactKey('routesMap', index)}>
            <NavLinkStyled to={path}>{visibleName}</NavLinkStyled>
          </NavElement>
        )
    }
  }
)

function NavBar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>{routes}</ul>
    </nav>
  )
}

export default NavBar
