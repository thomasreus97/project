# Proposal: Land occupancy in the Netherlands
Name: Thomas Reus
Student Number: 11150041

## Problem statement
The Netherlands is a small country, for this reason efficient usage of land is an important factor. But how well is the land occupancy in the Netherlands distributed, and how did this change over the years? 

Target audience: people interested in the land occupancy of the netherlands (probably ducth people themselves)

## Solution
Single line: Give the land occupancy for the Netherlands per province with clearly visualized and filterable information.

![Visual sketch:](https://github.com/thomasreus97/project/blob/master/layout_proposal.png)

### Main features
1. Interactive map of the netherlands, shows data when hovering over for one occupancy (choose with **5**). Clicking on one province updates info in **3** and **4**, choose year in **7**..
2. Bar chart for all provinces (shows data for one occupancy **5**) sortable with **6**.
3. Pie chart for Netherlands/one province (sort clicking in **1** or choosing in **8**).
4. Area graph of all occupancies for Netherlands or one province over the years (select province by clicking in **1** or choosing in **8**).

MVP: **1**, **2** and **3** for visual. **5**, **7** and **8** for selecting. **4** and **6** are nice to have.

## Prerequisites
### data sources 
[Bodemgebruik CBS per provincie](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/37105/table?ts=1543167766064)
### external components 
Some of these (?):
- D3
- D3 Tip Library
- jQuery
- Bootstrap
- TopoJSON
- DataMaps

### review of related visualizations
Three examples:
[1.](https://fietsboekstoel.github.io/Project/)
[2.](https://dboekhout.github.io/CSRIB/)
[3.](https://jaspernaberman.github.io/Programming-Project/Scripts/HTML/index.html)

All use maps of europe or the world. Hovering over the different parts shows some data and highlights the related parts in all the data representations (in some examples).

### hardest part
Almost no experience with D3. Solution: read a lot on the internet.


