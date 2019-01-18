# day 1
Updated proposal in [README.md](https://github.com/thomasreus97/project/blob/master/README.md);
* I changed the optional area graph into an optional line graph for comparison, because being able to compare two provinces for one seperate occupancy gives more insight into the data (and more possibilities for the user).
* I also changed the barchart into a stacked barchart with selectable occupancies to also give more insight into the data, because this is essentially a barchart + version.
* Swapped the layout a little to make it more user friendly and logical.

# day 2
* Created [DESIGN.md](https://github.com/thomasreus97/project/blob/master/DESIGN.md)
* Made a python code to convert my data csv file into a json file: [code](https://github.com/thomasreus97/project/blob/master/code/python_code/csv_to_json.py)
* Created a html file and a few js files for the project (no real coding yet)
* Found a source for the Netherlands map: [source](http://jvectormap.com/maps/countries/netherlands/)

# day 3
* Created map of the Netherlands (only the map, nothing added)
* Created Pie chart of Netherlands Total, update function also almost finished
* Fixed the layout for the map and pie chart (next to eachother)

# day 4
* Added province selector
* Added year slider
* Updating piechart with both of the above almost done, few things to fix

# day 5
* added legend + colors to map
* clicking on province updates piechart
* hovering shows the data
* unknown data changes the province to background color
* added dropdown for occupancy select, update of the map still needs to be added

# day 6
* updating map works for both year and occupancy
* error message shows when no data available
* legend works correctly
* clicking on piechart occupancy updates map occupancy
* positioning slider and dropdowns
(basically: map and piechart as as-good-as finished; except title)

# day 7
* Added stacked barchart (only initial)
* Added value update in dropdown(occupancy) when clicking on piechart.

# day 8
* Added feature: clicking on occupancy in barchart also updates map.
* finished functionality of stacked barchart (selecting occupancies still needed)
* changed layout for now (not sure if i will change it again)
* added navbar ( buttons inside of the navbar ) for more clearity

# day 9
* added description dropdown for meaning of occupancies (descriptions still needs to be added)
* added legend
* sorted navbar better, still needs to be centered properly
* stopped re-refreshing when clicking on bar/pie when current occupancy is already the occupancy being clicked

# day 10
* added interactivity between legend, piechart and (stacked)barchart
* added an indicator for selected occupancy map: stroke in bar and pie
* added an indicator for selected occupancies bar: opacity in legend and pie
* this created difficulties with my barchartupdate (TODO)
