# Application architecture, design and more

## Folder structure

As I am using react as a frontend, all frontend related operations and declarations will be handled by React components, which can be found in [Components](./src/components/)
This folder is further structured into:

- ./layout, which holds components that help structuring the web page
- ./subpages, which holds all the elements that should be shown when visiting a specific subpage,
- ./visualizations which holds all reusable components handling the interaction with the d3 middleware code that is hiding in [visualizationHelpers](./src/visualizationHelpers/)

All visualization related code, i.e. how are certain visualizations created, is located in [visualizationHelpers](./src/visualizationHelpers/). This is essentially a d3 middleware library to help me organize my d3-related code and facilitate reusability.

[Utils](./src/utils/) contain code that could easily be reused in several domains or does not strictly belong to one domain

[Typedecls](./src/typedecls/) contains type declarations that were created to simpilify development in TypeScript in a type-safe way or to otherwise help the compiler understand what the code was trying to do.

[Data](./src/data/) contains the reduced data that is actually being used for the visualizations

[Configs](./src/configs/) contains configuration data, i.e which subpages are available

[AppConstants](./src/constants/) contains constants or other static data that is reused in several contents

[Styles](./src/styles/) contain the CSS declarations and modules used by the application

## Some basics

React and d3 are both libraries that choose to modify the DOM directly.
To ensure we have no interoperability problems, we let React handle all parent DOM elements.
D3 is only allowed to modify DOM elements that are not directly handled by React, for example the GraphComponent.tsx handles a parent SVG element, but D3 is allowed to handle all children modifications.
This introduces lifecycle and state problems that have to be handled.

React components have a lifecycle of create, update and destroy - or in their terms: mount, update and unmount.

To match this lifecycle, there is [D3VisLifeCycle.ts](./src/visualizationHelpers/D3VisLifeCycle.ts) which models the same for the visualizations created by d3. All visualizations have to implement that interface and the associated methods.

If a parent component is created/updated/destroyed, the parent component will ask the visualization itself to do the same.
This ensures that there will be no cross-framework cutting problems.
