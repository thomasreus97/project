# Design document
Name: Thomas Reus

Student Number: 11150041

## Data sources
Download csv file from: [Bodemgebruik CBS per provincie](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/37105/table?ts=1543167766064)

## Overview technical components

### Diagram
![Diagram](https://github.com/thomasreus97/project/blob/master/doc/layout_proposal_2.png)

### Data
* Python code: [csv file](https://github.com/thomasreus97/project/blob/master/code/data/Bodemgebruik_data.csv) to [json file](https://github.com/thomasreus97/project/blob/master/code/data/Bodemgebruik_data.json)

### Visualisations
* Map of the Netherlands for one occupancy (1)
    - svg from: [source](http://jvectormap.com/maps/countries/netherlands/)
    - occupancy selectable with dropdown (5)
    - colorbar legend (under map)
    - hovering over province shows data
    - clicking on province gives information to Piechart (arrow)
* Piechart all occupancies of one province (3)
    - selectable with dropdown or clicking on map
    - hovering over piechart shows data
    - clicking on occupancy gives trigger to stacked barchart (arrow)
* Stacked barchart for all privinces of selectable (2)
    - hovering shows data
    - select for occupancies (selecting also possible by clicking on piechart) (8)
    - optional: sorting possibilities bars
* Optional: line chart for comparing one occupancy for different provinces over time (4)
    - select for time period (10)
    - select for provinces (9)
    - select for occupancy (11)
    - legend for provinces (or maybe names in graph)
    - hovering shows crosshairs with data

### Other functionalities
* Global color legend for all occupancies (right side of pie chart)
* Year slider for selecting year for map, piechart and stacked barchart (7)

## Plugins functionality
* jquery
* jvectormap
* d3
* [bootstrap](https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css)
* [colorbrewer](https://d3js.org/colorbrewer.v1.min.js)
* [color legend](https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.13.0/d3-legend.js)

