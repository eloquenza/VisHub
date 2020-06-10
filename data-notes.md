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

### Commands used

```bash
mkdir github-data
cd github-data/
# ignore errors on feb/april
wget https://data.gharchive.org/2020-{01..05}-{01..31}-{0..23}.json.gz
```

[1]: <https://www.gharchive.org/> "GHArchive"
[2]: <https://developers.google.com/bigquery/> "Google BigQuery"
