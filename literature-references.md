# Literature and references

## 5 Design Sheets methodology

[Example of the five design sheets from one student in a master's level Information Visualization module](https://www.semanticscholar.org/paper/The-Five-Design-Sheet-(FdS)-approach-for-Sketching-Roberts/51c4e858894534dde3836a3020b0bfa62f1e1bae/figure/6)

[Presentation "Sketching designs using the Five Design-Sheet Methodology" - IEEE VIS2015](http://fds.design/wp-content/uploads/2015/10/fds-presentation-final-ieeevis2015.pdf)

[More FDS Examples](https://www.cs.odu.edu/~mweigle/courses/cs725-s17/FdS-overview.pdf)

## GitHub

[GitHub REST API v3](https://developer.github.com/v3/)
Newer versions seem to be based on GraphQL:
[GitHub GraphQL API v4](https://developer.github.com/v4/)

[GitHub API - Event types](https://developer.github.com/v3/activity/event_types/)
[GitHub API - Users API](https://developer.github.com/v3/users/)

## Dataset

[GHArchive](https://www.gharchive.org/)
[Data saved by the GHArchive](https://data.gharchive.org/)
[Possible preprocessed dataset for the graph visualization](http://snap.stanford.edu/data/github-social.html)

## React

[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
[React documentation](https://reactjs.org/)
[React Router documentation](https://reacttraining.com/react-router/web/guides/quick-start)

### Style guide

[Google's Typescript style guide](https://github.com/google/gts)
[Airbnb's React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react#naming)

## Ideas

### Data science on GitHub

[Blog - Coderstats: GitHub data science](https://blog.coderstats.net/github/)

### Ideas on possible GitHub visualizations

[Devtrends](https://www.baresquare.com/github-devtrends/)
[Devtrends data source](https://dev-source.herokuapp.com/)

[User-Language Visualization](https://danielvdende.com/projects/gdc2014/about.html)

[GitHut](https://githut.info/)
[GitHut sources](https://github.com/littleark/githut/)

### Ideas on differing visualization options

[Metabase allows for choosing different visualizations for the same dataset](https://www.metabase.com/docs/latest/users-guide/05-visualizing-results.html)

### D3

#### Ideas of visualizations in general built in d3

[Interactive notebooks of visualizations](https://observablehq.com/@d3)

#### Search possibilities in a graph

[Search functionality in a d3.js graph](https://stackoverflow.com/questions/41456008/search-functionality-in-a-d3-js-graph)

#### D3, Typescript and React

[Using D3 and React Together to Make Visualizations in TypeScript](https://spin.atomicobject.com/2017/07/20/d3-react-typescript/)
This one is pretty outdated but a good starter.
I adapted this one as a base for this project, and had to fix many errors that occured due to the use of older versions of TypeScript, React and D3.

#### D3 and React - Consideration about interoperability

[D3 within React the right way](https://oli.me.uk/d3-within-react-the-right-way/):
Essentially uses a (second) virtual DOM, seems fine, but limit's us to React's animations - which I am not too familiar with.

[Bringing Together React, D3, And Their Ecosystem](https://www.smashingmagazine.com/2018/02/react-d3-ecosystem/)
Discusses a lot of possibilities, esp. their advantages and disadvantages, and interoperability between their ecosystems.
The simplest method, the one I am using currently, i.e. in commit 7eadba35943b54dffc3374998e43f5cf132f3cf2, let's D3 handle all DOM-related operations, but results in a poor experience considering React. Also this does not render server-side, which should be of no concern to me currently, but is, if I somehow, want to release this on my website (for fun or any other reason)
The "best" approach he discusses makes it so that React has full control over the DOM, which also means that all shapes and animations have to be implemented in React and not D3, which seems like a huge amount of work that I would only deem necessary in a professional production environment.
The third approach is something that already seems like mine, the discussion of that follows in the following literature reference

[Integrating D3.js visualizations in a React app](https://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/)
I like the approach, because it moves the DOM manipulation strictly to D3 which makes it so that 2 libraries do not manipulate the same DOM at the same time.
