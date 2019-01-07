# Proposal: Land occupancy in the Netherlands
Name: Thomas Reus
Student Number: 11150041

## Problem statement
Show the land occupancy of the Netherlands and provide the user to filter the information they are interested in.

Target audience: people interested in the land occupancy of the netherlands (probably ducth people themselves)

## Solution
Single line: Give the land occupancy for the Netherlands per province with clearly visualized and filterable information.

![Visual sketch:](https://github.com/thomasreus97/project/blob/master/layout_proposal_2.png)

### Main features
1. Interactive map of the netherlands, shows data when hovering over for one occupancy (choose with **5**). Clicking on one province updates info in **3**, choose year in **7**..
2. (stacked) Bar chart for all provinces (shows data for multiple occupancy **8**, or clicking in **3**) (maybe sortable, function not added in figure).
3. Pie chart for Netherlands/one province (sort clicking in **1** or choosing in **6**).
4. Line graph to compare an occupancy selected in **11** for several provinces selected in **9** over a time period chosen in **10**.

MVP: **1**, **2** and **3** for visual. **5**, **6**, **7** and **8** for selecting. **4** (with **11**, **9** and **10**) is nice to have.

## Prerequisites
### Data sources 
[Bodemgebruik CBS per provincie](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/37105/table?ts=1543167766064)
### External components 
Some of these (?):
- D3
- D3 Tip Library
- jQuery
- Bootstrap
- TopoJSON
- DataMaps

### Review of related visualizations
Three examples:
[1: map, year slider, area graph](https://fietsboekstoel.github.io/Project/)
[2: map, bar, pie](https://dboekhout.github.io/CSRIB/)
[3: map, bar](https://jaspernaberman.github.io/Programming-Project/Scripts/HTML/index.html)

All use maps of europe or the world. Hovering over the different parts shows some data and highlights the related parts in all the data representations (in example **3**).

Bar: **3** horizontal and sorting, **2** vertical.

**1** does have a year slider, i would like to do that about the same.

### hardest part
Never made a map visualisation (**1** in Main features), solution: Internet.


