# Notes for Five Design Sheet (FDS) Methodology

## Preparation

1. Get suitable data.
2. Understand the task.
3. Analyze the components of the data:
    * Independent and dependent variables
    * Data types, data structures, storage format and access
    * Data categories, scales of measurement
    * Is there temporal/streaming data?
    * Range and distribution of data: evenly spread, sparse or dense?
4. Gather resources (paper, colored pens).

## Sheet 1: Ideation

For  the actual sheet, see [here: Sheet 1](./submissions/VisHub-design-sheet1.png).
Written below are ideas I either sketched out before creating this sheet or have written them down because it is easier to reference this file instead of the design sheet.

### Concept/Tasks

1. Ideate: sketch as many ideas (“mini-ideas”) as possible.
2. Filter
   * Remove duplicate or irrelevant ideas (e. g., by crossing out).
   * Try to fix impossible ideas.
3. Categorize
   * Group similar ideas together (e. g., by annotation).
   * Find missing categories.
4. Combine and refine
   * Organize mini-ideas into bigger designs.
   * Look for complementing visualizations (e. g., spatial view plus timeline).
   * Refine the ideas.
5. Question
   * Reflect on ideas and designs: advantages and disadvantages.
   * Select three different designs to expand.

### Notes for sheet 1

Ideate:

* Possible data sources:
  * [GHArchive][1]
  * GitHub API
* Possible visualizations ...
  * ... repos
    * most popular repos via bar chart sorted by stars/forks
    * distribution of fork visualized vis histogram?
  * ... users
    * most popular organization/users via bar chart sorted by stars/forks
    * users with most forks
    * which user uses the most programming languages
    * author graph via following/followers?   
    * most followed/following users
    * show timeline of follower acquisation
  * ... events
    * events (filter events?) per hour/day/month (maybe choose your own timeline)
      * hour of specific day
      * accumalated over the whole year, visualize per hours
    * ratio/amount of event type compared to other event types
    * commits/other event type per weekday and week
  * languages
    * which programming language is the most used one?
    * most stars/forks per language?
    * top polyglot language combinations?
  * meta/misc.
    * number of authors overall, gained per week/month
    * open source contributions by locations
    * visualize growth of github via historical timeline of repos and commits?
* Possible chart types:
  * Bar chart
  * Histogram
  * Timeline / Line chart
  * Graph / Network
  * Scatterplot
  * Radar chart

Filter:

* Choose data set nr. 1 [GHArchive][1]:
  * BigQuery available - allows for big data queries in an SQL-like fashion
  * No REST API - GitHub API only allows for live data
  * Archived & preprocessed
  * For live data, send requests to GitHub's REST API
* Visualizations:
  * Like the possible, diverse visualizations
  * Graph might be hard to realize as the data is available in JSON events
    * Maybe preprocess for a specific user(s)
    * Or limit the graph depths?
  * drop visualization for "users with most stars/forks/repos"
    * maybe change into  "... most contributions" or drop it
    * seems to similar to other visualizations

## Sheet 2-4: Alternative Designs

Not to be created for this project but rather here for brevity.
If I create a sheet 2/3/4 for myself to play around with, it will be linked here though.

### Concept/Tasks

1. Information: title, authors, date, task, sheet number
2. Layout:
   * Sketch of GUI with buttons, menus, visualization.
   * Looking like a screenshot.
3. Operations:
   * Action-result pairs.
   * Linked to layout (e. g., by labels).
4. Focus/parti:
   * Central idea or core concept of visualization (e. g., interface component, interaction method,
data structure).
   * Zoomed drawing of GUI component, flow diagram, or similar.
5. Discussion:
   * Reflect on design: advantages and disadvantages.
   * Possible aspects: suitability for task, novelty, clarity, scalability, extensibility, cost of implementation.

## Sheet 5: Realization

### Concept/Tasks

1. Information: title, authors, date, task, sheet number
2. Layout: as before.
3. Operations: as before.
4. Focus/parti: as before.
5. Detail:
   * Description of main algorithms (with references), design patterns, data structures.
   * Maths for computations, positioning of GUI elements, size proportions, etc.
   * Dependencies on operating system, programming language, libraries
   * Estimates of cost (e. g., time or man-months)
   * Requirements of hardware, software, screen resolution etc.

### Notes for sheet 5

#### Operations

* Layout/application starts in sub-page "users" - see orange underline
* Clicking "VisHub" returns the users back to the main page, i.e. the "users" sub-page.
* Clicking "users"/"repos"/"events"/"languages"/"meta" tabs open a sub-page where visualizations for the specific category can be found
  
* In first view, the author network viewer displays the whole graph
* The author network viewer shows a "global" network of authors with no specific focus on any author.
* Users can interact with the author network viewer by zooming in/out via mousewheel or scrolling via mouse grabbing
* Hovering over a node in the author network viewer results in a tooltip containing more detailed info (e.g. full name, amount of repos/follower/following, ...) and highlighting this author and all incident edges
* Users can search for a specific author via the search bar in the top left-hand corner of the author network viewer, resulting in:
  * highlighting his node and all incident edges
  * focusing on said user, which displays more information and graphs for said user below the author network viewer (see focus bottom left)
  * Graph shown will only include author, all incident edges and a pre-configured depth of more connected authors
  * General info about all users will be hidden
* Clicking on a specific user in the author network viewer is the same operation as searching for his name.
* Clicking on world map above the author network viewer will try to display the graph on a world map, if enough users have stated their location
* Clicking on options will open a small menu which allows setting visualization related options such as the graph layout, planarity, configuring depth

* Hovering over a bar in a bar chart results in displaying a tooltip containing more detailed info (e.g. exact amount) and highlighting the bar

#### Discussion/Detail

Positives:

* highly interactive
* most of the interesting data can be previewed in one view
* being able to switch visualization layouts might make it possible to discover patterns that are not obvious at first.

Negatives:

* difficult to implement due to the amounts of data needed?
* author network viewer seems overly complicated and maybe a view only for specific users is more appropriate
* not all data can be viewed on one page, might be too overwhelming.
* might be confusing that general info on users just "disappears"

Possible aspects:

* author network viewer is novel, but might not be that suitable. scalability seems questionable too, but due to search and limiting depth, this seems fine.
* clarity is given due to ability to search
* cost of implementation: 3-4 weeks?
* Description of main algorithms (with references), design patterns, data structures.
  * Rooted tree layout through d3.tree(): implements C. Buchheim et al, 2002
  * Radial tree layout through d3.tree(): implements Reingold–Tilford “tidy” algorithm
  * Force-directed layout through d3.layout.force(): implements quadtree via Barnes-Hut approximation
  * Edge bundling through d3.layout.bundle(): implements Danny Holten's algorithm
  * Circle layout/NetMaps through d3.layout.chord()
  * Data structure are mostly JSONs given by the GitHub API which have to be preprocessed.
  * BigQuery API allows for quick SQL-like queries - problem is having only 1 TB of "free" traffic.
* Maths for computations, positioning of GUI elements, size proportions, etc.
* Dependencies: a system capable of running a browser (ideally firefox), implementation will be done in JS, further library dependencies will be handled through build system (yarn/npm)
* No specific requirements to hardware currently

[1]: <https://www.gharchive.org/> "GHArchive"
