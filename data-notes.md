# Notes w.r.t. data acquistion, cleaning and pre-processing

## Data acquistion

[GHArchive's dataset][1] is available in hourly slices, i.e. you download the all events that happened during a specific hour of a specific day.

Using the example given on [GHArchive's page][1] to download their entire data for January 2015, I calculated the amount of space needed to download their entire data set.

January 2015 needed around 4,9 GB of data, let's round that up to 5 GB for the ease of calculation.
[GHArchive][1] has saved all possible, public-facing data since December 2011.
If we would take all months that have been fully completed until this project started, which has been May 2020, we could say there are around 101 months of data available.
Downloading all that data would take around 505 GB (5 GB * 101 months) which already is a absurd amount of information considering this is all in raw "events" form, i.e. I would need a ridiculous amount of pre-processing. 
But this calculation did not consider that GitHub considerable grew over the last years, which means that 5GB could be a very low estimate.

The hourly data slice for January 2015 were around 5 MB per file, that is compressed as json.gz.
The hourly data slices for January 2020 are already around 40M per file, which is an increase of 700%.
That means that the previously calculcated 505 GB are a immensely low watermark and napkin math suggests that it is rather around 3535 GB (or 3,5 TB). I could store that amount of data for preprocessing on 2 of my HDDs, but that approach is rather infeasible.

Therefore I have decided to take a snapshot of 2020, and will try to get all other data I need from sources that already have pre-processed them.

### BigQuery

[GHArchive][1] also provides all their data on Google BigQuery, which allows the data source to be queried with a SQL-like language.
That would have been my preferred approach if there would not be the following issue: The free tier includes "only" 1 TB of data traffic.
You would think that this is plenty, but it is not the amount of data transferred that is used for said cap but rather amount of data used in queries, i.e. selection in queries counts too.

Certainly for some information (i.e. graph forming the relationship of authors by their repositories) this method could be good enough.

### GitHub's API (REST/GraphQL)

While I would like to avoid real-time data querying as this is just to fragile in a development process and rather for this project in general as the goal is not to provide a service that can be used by the people but rather to showcase my ideas, I still could use either the REST or the GraphQL end point to querying some information I need and persist these.

## Actual data used

For the graph, I used the [SNAP Stanford's GitHub Social Network data set](http://snap.stanford.edu/data/github-social.html)

This data set includes 3 files, of which I will use 2 as can be read from the following subchapter titles.

#### musae_git_target.csv

* Transform into json, save in musae_git_target.ts
* Prepend the array with "vertices:"

Transform the JSON via Regex into correct format by removing the ml_target attribute and format them better in the JSON, ECMAScript format:

1: /\{\n.*("id": .*,)\n.*("name": .*),\n.*"ml_target": .*\n.*\},/{$1 $2},/gc

#### musae_git_edges.csv

* Transform into json, save in musae_git_target.ts
* Prepend with "export default { edges:"
* Append with "}

Transform the JSON via Regex into correct format by renaming the attributes into source and target and format them better in the JSON, ECMAScript format:

1: /\{\n.*"(id_1)": (.*),\n.*"(id_2)": (.*)\n.*\}/{source: $2, target: $4},/gc

Afterwards, combined both files.
Inserted this into the project instead of the small test data I had. Saw, that I am crashing NodeJS via JS heap out of memory. Decided to cut down on the dataset.

My first idea was to just cut every element with an ID above 9999 and look at the resulting graph which was a big cluster of a large amount of single vertices with no edge to other vertices.
This idea was scrapped quickly.

On investigating this issue and how to avoid/work around it, I decided to write a small Python script (using [Networkx][3]) (see src/data/createRandomSelectionOfMusaeData.py) to randomly select a subset of vertices and their edges and use the resulting graph in my visualizations.

For the lessons learned during that data preparation.
The SNAP dataset has no smaller subgraph. each vertex can be reached given any start vertex.
This made selecting a smaller subgraph impossible.
After that, I explored a few ideas:

* Finding communities - with these I would atleast guarantee that the vertices are highly inter-connected.
* Using cliques - good idea, but the highest clique group is 28 vertices large - way too small, selecting multiple cliques felt random too - how can I mathematically/programmatically decide if the chosen cliques are actually connected and interesting?
* Producing a max-cut - this seems currently not possible with networkx, but even if - this is a NP-hard operation. I am not sure if this would have been tractable considering I have a deadline to hit.

Considering the alternatives, using a random amount of the graph seemed good enough.
The script cuts the previous amount of vertices (37699) down to 1299, and then cuts every vertex that is a isolate, i.e. a vertex with no edge to another vertex. The resulting graph thus has below 1000 vertices.
The numbers were rather created through a bit of a play around.
I wanted the graph to be big enough so there is "something to explore", but not too big, because else the user experience is rather sad due to performance issues with SVG transforms/translates/scales on so many elements.

### Why was the BigQuery/Githubarchive idea scrapped

Mostly because of time constraints and quite frankly because of the large amount of data available with no easy way to filter through it.

I do not have enough hard drive space left, therefore loading a large amount of data and preprocessing it in a locally hosted DB was not really possible - I also question if this would have been an successful endeavor because of the amount of CPU time needed to perform large SELECTs/JOINs on a dataset that is way above a TB.
BigQuery's free tier was quickly eaten through with a simple query of asking which repos use which language.

Sadly, this made calculating which user really interacted with another user via commits/issues on the same repository quite hard which is why I switched to the graph data set available on SNAP Stanford.
For all that it is worth - for the purpose of this small visualization as submission, the result, i.e. the presentation the user sees, is pretty much the same but with other features denoted by the edges.

Therefore, I have resorted to use the API only for the account-specific user data. Not much I can do.

### Scraping the GitHub GraphQL API for account-specific user data

Following queries were issued by logging into: https://developer.github.com/v4/explorer/

I have extracted all the names of the nodes from the data/musae_git_data-reduced.ts in a form, where each user is written on a single line.
Afterwards, I applied the following regex to create a GraphQL query, that will provide me the user data I am most interested in:

```
\t$1: user(login: "$1") {\n\t\t...UserFragment\n\t}
```

The layout of the query is then the following:

```
query {
  amiryeg: user(login: "amiryeg") {
    ...UserFragment
  }
  // more users in the same format
}

fragment UserFragment on User {
    login
    name
    company
    bio
    location
    avatarUrl
    repositories(first: 10) {
      nodes {
        name
        primaryLanguage {
          name
        }
      }
    }
    createdAt
    updatedAt
}
```

The fragment declaration helps me to reduce the amount of data I am querying, as I am not interested in whether the account type is either User or Organization nor the URLs to their repos, subscriptions, followers or other things because can be recreated as they all follow the following format:

```
https://api.github.com/users/amiryeg/{orgs,subscription,followers, ...}
```

Some users have a dash (or other special characters) in their name, which is not allowed as a qualifier in the GraphQL query language. These have been manually removed and have been manually readded in the resulting JSON (because these were only 14 entries and creating a program/regex for this would have taken longer). The valid qualifier identifier follow most programming languages conventions (i.e. variable naming in Java for example) and such I will not list these rules here.

[1]: <https://www.gharchive.org/> "GHArchive"
[2]: <https://developers.google.com/bigquery/> "Google BigQuery"
[3]: <https://networkx.github.io> "Networkx"
