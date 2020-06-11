import {$enum} from 'ts-enum-util'

export enum RouteNames {
  Vishub,
  Users,
  Repos,
  Events,
  Languages,
}

export type RouteObject = {
  path: string
  visibleName: string
}

export type RoutesMap = {[key in RouteNames]: RouteObject}

function createRoutesMap(): RoutesMap {
  // needed because Typescript by default does not allow implicit 'any'
  // LooseObject accepts properties with any number as a key, any type as value
  interface LooseObject {
    [key: number]: any
  }

  const values = $enum(RouteNames).getValues()
  const routesMap = values.reduce<LooseObject>((accum, route) => {
    accum[route] = {
      path: `/${RouteNames[route].toLowerCase()}`,
      visibleName: RouteNames[route],
    }
    return accum
  }, {})
  // Type cast it back to a RoutesMap, for type safety and to get
  // run-time errors if the variable would not match the abovementioned
  // type
  return routesMap as RoutesMap
}

export const routesMap = createRoutesMap()

// Code above creates a object like the following, so I do not have to
// write down the routes by hand.

// export const routesMap: RoutesMap = {
//     [RouteNames.Vishub]: {
//         path: "/vishub",
//         visibleName: RouteNames[RouteNames.Vishub],
//     },
//     [RouteNames.Users]: {
//         path: "/" + RouteNames[RouteNames.Users].toLowerCase(),
//         visibleName: RouteNames[RouteNames.Users],
//     },
//     [RouteNames.Repos]: {
//         path: "/" + RouteNames[RouteNames.Repos].toLowerCase(),
//         visibleName: RouteNames[RouteNames.Repos],
//     },
//     [RouteNames.Events]: {
//         path: "/" + RouteNames[RouteNames.Events].toLowerCase(),
//         visibleName: RouteNames[RouteNames.Events],
//     },
//     [RouteNames.Languages]: {
//         path: "/" + RouteNames[RouteNames.Languages].toLowerCase(),
//         visibleName: RouteNames[RouteNames.Languages],
//     },
// }
