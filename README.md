# VisHub - visualizing GitHub events and more.

A information visualization project that tries to visualize some aspects of GitHub, its users and their usage of GitHub.

Jump to how to start/use below, if you are interesting in running the application instead of a lot of talk around the project.

![](screenshots/webpage.jpg)

## Project organization

This project consists of two parts:

1. Design sheets 1 and 5 (Ideation and Realization) created through the use of the [Five Design Sheet methodology][1] 
   * Look inside [./design-sheets](./design-sheets) for more, or...
   * ... directly open [Design sheet 1](./design-sheets/submissions/VisHub-design-sheet1.pdf)
   * ... directly open [Design sheet 5](./design-sheets/submissions/VisHub-design-sheet5.pdf)
2. Implementing the chosen design from sheet 5 in an application
   * The application can be found under [./application](./application)

In this project, students (read: here just me) are getting familiar with the Five Design Sheet methodology in order to learn a more formal design process.
The professor acts as the client for our application.
By creating the design sheets, students (again, just me) are forced to externalize their internal thoughts which makes it easier to discuss the design ideas with their professor.

## Folder organization

* [./application](./application): contains the application itself
* [./decisions](./decisions): contains documents of "important" decisions taken
* [./design-sheets](./design-sheets): contains the design-sheets that were submitted
* [./data](./data): contains the preprocessed data and scripts/information used to reduce said data, see ./application/src/data for reduced data that is being used for the visualizations

## How to start

You can start this project via `yarn start` while inside [./application](./application).
This command starts a development server that allows you to play around in the sources and opens a tab in your broswer to "http://localhost:3000" where you view the created web page.

If you are not really interested in running a development server for hot reloading and playing around, you can use `yarn build` to create an optimized production bundle.

After building, you can `cd` into the [./application/build](./application/build) folder and serve the site via your favorite HTTP server.
If you do not know how to do that, here are a few examples:

* Python3: `python3 -m http.server`
* Python2: `python -m SimpleHTTPServer`
* Node/JS: `yarn global add serve && serve -s build`

As there is a considerable amount of JavaScript needed, using a HTTP server that serves the web page locally is the preferred (and currently only supported) variant.

Please read the [./application/install.md](./application/install.md) inside [./application](./application) if you are interested in running or developing this application

Please read the [./application/architecture-and-design.md](./application/architecture-and-design.md) document if you are interested in reading about architectural, design or other project-specific choices.

The most interesting files that handle most of the possible interactions and visualizations are, in IMHO best viewing order:

* [index.tsx](./application/src/index.tsx)
* [Users.tsx](./application/src/components/subpages/Users.tsx)
* [AuthorNetwork.tsx](./application/src/components/layout/AuthorNetwork.tsx)
* [GraphComponent.tsx](./application/src/components/visualizations/GraphComponent.tsx)
* [D3Graph.ts](./application/src/visualizationHelpers/D3Graph.ts)
* [D3ForceGraph.ts](./application/src/visualizationHelpers/D3ForceGraph.ts)
* [D3EdgeBundlingGraph.ts](./application/src/visualizationHelpers/D3EdgeBundlingGraph.ts)

## How to use

On visiting the page, you are greeted by an graph network and a sidebar for navigation.

The graph network shows a selected subset of users on GitHub as vertices (the labels are their account name) that have starred atleast 10 repositories, the edges represent mutual follower relationships between them.

A user can interact with the graph as follows. Some operations behave differently based on the selected graph representation, please see below this list for more.

* Panning to navigate the graph by pressing the left mouse button down and moving it around
* Zoom in/out by control + mouse wheel:
  * Control + mouse wheel was chosen to not interfere with native page scrolling
  * Zooming has a maximum and minimum limit to ensure that the user cannot lose the graph in the vast universe of an SVG element - this unfortunately has the problem that on reaching either the maximal or minimal amount of zoom allowed, the browser will then zoom into/out of the webpage. Please be aware of this fact
* Searching by typing in data in the search input field above the graph highlights the vertex
  * During this operation, the user has access to an autocomplete feature to help him discover GitHub accounts
  * Searching allows for multiple selects, i.e. all vertices will be highlighted, that match the term searched for - be more specific, if you want to focus on a specific user
  * Hovering over a vertex while searching effective cancels the search operation without clearing the search input
    * Not fixed due to time constraints
* Switching the graph representation via a dropdown menu by opening the dropdown menu labelled with "Representation types" and selecting one of the 3 given options:
  * Force-directed graph
  * 3D Force-directed graph
    * Please note that this uses WebGL and you need to have this enabled
  * Radial edge-bundling graph
* Switching the graph representation effectively resets graph, i.e. returns all vertices to their original position and clears the search input.
* Hovering with the mouse over a vertex displays a few information about the user (Full name, location, bio, companies, ...)

Depending on the representation type, the some operations have a similar, but not quite the same effect:

* Force-directed graph:
  * Hovering with the mouse over a vertex highlights this vertex, all direct incident edges and lowers the opacity of all other edges such that a user is able to better view the direct relationships
  * Dragging a vertex by pressing down the left mouse button and moving the mouse:
    * This highlights the vertex in a pink shade making it "sticky", i.e. unable to get changed by the forces driving the simulation
      * The stickiness can be handy if you want to move vertices around in order to better see the edges or make slightly overlapping vertices better visible
    * To remove the stickiness, press control + left mouse click on the vertex
* Radial edge-bundling graph:
  * Hovering with the mouse over a vertex highlights the edges incident to the selected vertex in two colors, red and blue.
    * Red denotes vertex is following the connected user
    * Blue denotes vertex is followed by the connected user
  * Dragging vertices around is disabled in this representation
* 3D force-directed graph:
  * Hovering currently only shows the user's account name
  * Dragging works like in force-directed graph but without stickyness
  * Model can be turned around via left mouse button down
  * Panning here works via right mouse button down
  * Searching inside this graph is not implemented/supported (due to time constraints)

## Where does the data come from?

As written above, the graph network shows a selected subset of users on GitHub that have starred atleast 10 repositories, the edges represent mutual follower relationships between them.

Below is a copied excerpt to ensure that the description is available if the case arrives that SNAP Stanford is unavailable:

> A large social network of GitHub developers which was collected from the public API in June 2019. Nodes are developers who have starred at least 10 repositories and edges are mutual follower relationships between them. The vertex features are extracted based on the location, repositories starred, employer and e-mail address. The task related to the graph is binary node classification - one has to predict whether the GitHub user is a web or a machine learning developer. This target feature was derived from the job title of each user. 

See the description on [SNAP: Network datasets: Social circles: GitHub](https://snap.stanford.edu/data/github-social.html) for more.

Due to performance issues, the SNAP dataset had to be reduced. Otherwise navigating the graph on the web page would be horribly slow, crash your browser, crash your development server or even exhaust the complete available RAM and cause a PC freeze (happened to be atleast once on Linux).

For details, please read the [./data-notes.md](./data-notes.md)

[1]: <https://ieeexplore.ieee.org/abstract/document/7192707> "Sketching Designs Using the Five Design-Sheet Methodology"
