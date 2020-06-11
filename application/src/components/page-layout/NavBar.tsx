import React, {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'
import styles from 'styles/navbar.module.css'
import {RouteObject, RouteNames, routesMap} from 'configs/routes'

// helper functions to reduce duplicate code of applied css styles
type Props = {
  children?: React.ReactNode
}

// This is called an intersection type, which combines multiple types
// into one. Extending a type with another type is not allowed in Typescript
// and the workaround with introducing an interface seems rather "hacky"
type NavLinkProps = Props & {
  to: string
  exact?: boolean
}

const PageName: FunctionComponent<Props> = ({children}: Props) => (
  <li className={styles.pageName}>{children}</li>
)

const NavElement: FunctionComponent<Props> = ({children}: Props) => (
  <li className={styles.subPages}>{children}</li>
)

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

function NavBar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>{routes}</ul>
    </nav>
  )
}

export default NavBar
