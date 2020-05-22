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
   * Possible aspects: suitability for task, novelty, clarity, scalability, extensibility, cost of im-
plementation.

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

[1]: <https://www.gharchive.org/> "GHArchive"
