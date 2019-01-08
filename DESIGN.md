# Design document
Name: Thomas Reus

Student Number: 11150041

## Data sources
Download csv file from: [Bodemgebruik CBS per provincie](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/37105/table?ts=1543167766064)

## Overview technical components

### Data
* Python code: [csv file](https://github.com/thomasreus97/project/blob/master/code/data/Bodemgebruik_data.csv) to [json file](https://github.com/thomasreus97/project/blob/master/code/data/Bodemgebruik_data.json)

### Visualisations
* Map of the Netherlands for one occupancy
    - svg from: [source](http://jvectormap.com/maps/countries/netherlands/)
    - occupancy selectable with dropdown
    - colorbar legend
    - hovering over province shows data
    - clicking on province gives information to Piechart
* Piechart all occupancies of one province 
    - selectable with dropdown or clicking on map
    - hovering over piechart shows data
    - clicking on occupancy gives trigger to stacked barchart
* Stacked barchart for all privinces of selectable 
    - hovering shows data
    - select for occupancies (selecting also possible by clicking on piechart)
    - optional: sorting possibilities bars
* Optional: line chart for comparing one occupancy for different provinces over time
    - select for time period
    - select for provinces
    - select for occupancy
    - legend for provinces (or maybe names in graph)
    - hovering shows crosshairs with data

### Other functionalities
* Global color legend for all occupancies
* Year slider for selecting year for map, piechart and stacked barchart

## Plugins functionality
* jquery
* jvectormap
* d3
* [bootstrap](https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css)
* [colorbrewer](https://d3js.org/colorbrewer.v1.min.js)
* [color legend](https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.13.0/d3-legend.js)

