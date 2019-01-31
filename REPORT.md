# Report

Thomas Reus (student number 11150041)

Data source: [Bodemgebruik CBS per provincie](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/37105/table?ts=1543167766064).

link: ![Land occupancy in the Netherlands](https://thomasreus97.github.io/project/code/)


## Overview product

My product gives an insight into the land occupancy distribution in the Netherlands. The product cosists of 4 pages: **Home** (introduction message), **Descriptions** (explaination about the different occupancies), **Visualisations** (the main page with all the linked visuals) and **Time** (an extra Visualisation to show one occupancy over time for one location). The main visual page looks like this:

![Visualisations](https://github.com/thomasreus97/project/blob/master/doc/everything.jpg)

- Left side of the navigation bar: all the called pages and **Data source (CBS)** to go to the data source used.
- Right side of the navigation bar: slider and buttons to choose year, occupancy and location manually.
- Help-tips (black dot with ?) with interaction information about each part: map, pie, bar and legend.
- Map: shows one occupancy for one year for all provinces.
- Pie: shows all occupancies for one year for one province.
- bar: shows a (in the legend selected) selection of occupancies for one year for all provinces.
- legend: legend for the occupancies, and can (de)select the occupancies shown in the barchart.

## Technical design

### Overview

The visual overview of the interactivity between the visualisations is shown here:

![overviewdesign](https://github.com/thomasreus97/project/blob/master/doc/onclickarrows.jpg)

Here you can see that the visualisation consists of 5 main parts:

1. Map
2. Piechart
3. (Stacked) barchart
4. legend
5. slider and buttons

These parts interact with eachother by means of on-click functionalities (**1 - 4**) and on-input (**5**).

For the on-click: blue arrows show data-wise updates, red arrows show opacity/stroke-wise updates and a black arrow indicates a data-wise update when a condition is met.

The interactivity (arrows) explained:

1. Click on province:
    - updates **2** for province
    - updates province in **5**
2. Click on occupancy:
    - updates **1** for occupancy
    - gives black stroke to currently selected occupancy in **2** (itself) and **3**
    - if opacity was 0.3:
      - updates **3** with the occupancy
      - changes opacity of occupancy in **4** to 1
      - makes opacity of itself 1
    - updates occupancy in **5**
3. Click on occupancy:
    - updates **1** for occupancy
    - gives stroke to current selected occupancy in **3** (itself) and **2**.
    - updates occupancy in **5**
4. Click on legend box:
    - if selected (opacity 1):
      - change opacity to 0.3 in the clicked box in **4** (itself)
      - change opacity of clicked occupancy to 0.3 in **2**
      - update **3** without the clicked occupancy
    - if deselected (opacity 0.3):
      - change opacity to 1 in the clicked box in **4** (itself)
      - change opacity to 1 in **2** of clicked occupancy
      - update **3** with the clicked occupancy
5. Slider and buttons change:
    - Year slider on-input change:
      - updates **1**, **2** and **3** for year
    - 1st dropdown (provinces) on-input:
      - updates **2**
    - 2nd dropdown (occupancies) on-input:
     - updates **1**
     - add stroke to selected occupancy in **2** and **3**

The **Time** page shows the following image:

![time](https://github.com/thomasreus97/project/blob/master/doc/linefull.jpg)

Here the interactivity is simple, when one of the dropdowns in the top-right corner changes the linegraph will be updated.

All visualisations in this project have tooltips which show data when hovered over.

### Overview of code

The start of the code is as shown below; Four html's are connected with eachother by a navigation bar (clicking on the navbar in one page brings you to the other). **Visualisations** (*visualisations.html*) and **Time** (*line.html*) as shown above use the .json data transformed by a python code. *line.html* then runs a javascript *linechart.js* which creates dropdownbuttons which call the function *linechartMaker()* to create and update the linechart. *visualisations.html* calls 5 different javascripts (which was too much to contain neatly in the diagram) which create the functionalities and visualisations explained in the previous section. More about the code and fuctions of *visualisations.html* will be discussed below.

![smallblocks](https://github.com/thomasreus97/project/blob/master/doc/smallpart.jpg)

#### Visualisations.html

In this part i will only name the external functions of the javascripts (external = functions that get called from other scripts, internal functions are functions like *scaleMaker()* to make scales for an external *updateBar()* function)

*visualisations.html* is the main feature page of this project. It runs these 4 javascripts with external functions:

1. **stackedbar.js**
    - *stackedBarChart()*: Creates the first stacked barchart
    - *updateBar()*: Updates an existing barchart (so no new axes)
2. **legend.js**
    - *makeLegend()*: Creates legend with legendBlocks
3. **map.js**
    - *mapNetherlands()*: Create map for an occupancy
    - *updateMap()*: Deletes current map and recreates with *mapNetherlands()* for an occupancy
    - *yearUpdateMap()*: Updates existing map for another year
4. **piechart.js**
    - *pieUpdate()*: Creates/updates the piechart (boolian tells whenever it's an update or not)

Then the 5th javascript, *project.js* (the main script), is runned and contains a window.onload(). This javascript creates the entire layout, calls some variables, creates the slider and dropdowns and calls: *makeLegend(), stackedBarChart(), mapNetherlands()* and *pieUpdate()* with Nederland, 1950 and Traffic as location, year and occupancy.

The buttons (slider (year), dropdown1 (location), dropdown2 (occupancy)) have the following function calling:

* year: *updateBar(), yearUpdateMap()* and *pieUpdate()*
* location: *pieUpdate()*
* occupancy: *updateBar(), yearUpdateMap()* and *pieUpdate()*

The visualisations call, as discussed in "Overview", the following functions on-click:

* map: *pieUpdate()*, change location dropdowns value
* pie: *updateMap()*, selects legend boxes and changes opacity, *pieUpdate()*, *updateBar()* and change occupancy dropdowns value
* bar: *pieUpdate()*, *updateMap()*, *updateBar()* and change occupancy dropdowns value
* legend: changes own opacity, *updateBar()* and *pieUpdate()*

## Challenges

One problem occured after i transformed my data from csv to json. The data i used was seperated in a lot of different occupancies. If i wanted to continue with the data like this my legend wouldve become huge and i wouldn't have been able to find enough colors to create diversity. For this reason i ordened the sub-occupancies into a few main occupancies.

Because it wasn't completely clear what exactly fell under the main occupancies i decided to give the user extra information about the main occupancies. In because i wanted to keep the visualisation page clean and organised i decided i had to create a second html file for the descriptions. In order to keep everything clean again i decided to add a navigation bar to my project.

The navigation bar itself was something i did not think of in my original design. This navigation bar opened way more possibilities design-wise. Because of this i decided to also create a homepage for a small introduction to, in my opinion, give a better overall experience on the website.

In my original plan i also had two visualisations next to eachother and the third below. Whilst i was making the visiualisations i came to the conclusion that i found myself to be rather unsatisfied with having to scroll in between the different linked views. For this reason i decided to place the three visualisations next to eachother, so all changes could be directly seen and investigated.

This left me with the buttons and slider standing pretty awkward around the visualisations. Because i didn't think it looked nice i decided to place the slider and buttons into the navigation bar. I think this gives a nicer view and doesn't distract from the visualisations itself.

This created another problem, i had no experience with navigation bars and all my components were placed sloppy. After doing some research i decided to get into css and eventually got everything aligned.

Because the three visualisations were standing next to eachother, i decided to also add the onclick: update map with occupancy to the barchart to create a greater link between the visualisations.

Another thing was that i originally decided to have a global legend and a select for the stacked barchart. Because the select and the legend have the same occupancies i decided to combine these two into one and create a "select-legend". This created a, in my opinion, better layout (because i did not have to put an extra element into the page).

This made me think of the next problem: how am i going to indicate whenever something is not selected in the legend, and meanwhile make the legend still function for the piechart. This made me think of the following: i am going to change the opacity of both the unselected legend box and the part of the pie corresponding to that occupancy.

The legend also created another problem: how am i going to check whenever something is selected and unselected in my piechart and barchart functions. I eventually thought of a list currentOccupancies and rotated this list through almost all the functions. These functions then check this list for which occupancies are selected and change + return this list whenever an occupancy is selected again.

Because i was busy with the opacities, i also thought it would be more clear if i would indicate which occupancie was selected in the map and dropdown. For this reason i added a stroke around the bars and piepiece for the selected occupancy. I made i tradeof for this, i could either create a function that only changed the stroke which i could call whenever the occupancy was changed, or i could implement it in the already existing update functions for the pie and barchart. I went for the second (because it was easier). Because of this, i always update the barchart whenever a new occupancy is selected (instead of only changing the occupancy). I thought this was acceptable because it didn't cause any visual problems, the only downside was that the function had to be re-done every time (but it wasnt time-intensive process anyways).

Another problem was with the data; not all provinces had data for all occupancies for all years, even some years there was no data at all. The no data at all is solved by removing these years from the dataset and adding an if statement to the year slider: oninput: if the year has no data do nothing. The inconsistent data on the other years/provinces is solved by checking and adding a text "No data available" on the visualisation when there is no data.

There was also another problem with the inconsistent data: because some data was not available some pie slices, map parts or bars would create errors. For the map this is solved to filter the parts without data out and coloring them the background color. This way you will see in the map that there is no data available (hovering over the location will also show you there is no data).

For the bars and piepieces i decided to give unknown values the value 0, because removing these parts entirely would create color problems by updating (yellow would transform into blue etc.) and those situation were not visually appealing. Changing them to 0 solved the problem and made the transitions nicer. The only tradeof is that because of padding in the piechart a little open space will occur around the "0" values. If i had to be given more time i would look into that to see if i can solve it.

This padding was added to be able to show the stroke around the currently selected occupancy. The strokes would otherwise be hidden underneith the other parts. I tried getting the selected part to the front but this would mess up the order of the pieces and errors would occur during updating. This is also the reason you can't see the entire stroke on some of the bars in the barchart. I wasn't able to succesfully solve this problem, but because it wasn't that big of an issue i decided to let it be and focus on more important things. Given more time this would also be an issue i would look into.

Another problem with updating the barchart occured when occupancies were deselected. Because there are less available bars the merge + transition would make, once again, the colors transform to eachother. Because this wasn't a really nice sight i decided to create a boolian in my *updateBar()* function to indicate whenever it was a year or a legend update: legend update will only merge and year updates will also transform. This took some extra coding but the result is worth it.

A problem that occured during the updating of the map was that i was not able to update my legend (and could't find anything on the internet after hours of searching). I eventually decided to create two map-update functions: one that updates on year, and one that deletes the entire map and creates a new one with a legend for another occupancy. I also made the legend from the min to the max value of all the years so that the colors would match the actual values. The downside is that for early years everything is sometimes almost the same color. the downside of deleting is that you see a flash animation on change (which isn't horrible but also not really pretty).

This flash animation showed me another small problem, whenever i would click an already selected occupancy in the pie or barchart the map would re-update and flash again, to solve this i made an exception that whenever the already selected occupancy (value in dropdown) was clicked, nothing would happen.

This created another problem, deselecting the selected occupancy in the legend and trying to reselect this occupancy in the piechart would not do anything. This is solved by adding another exception on whenever the occupancy is in currentOccupancies and the current occupancy or not.

Because of all the interactions and my legend being interactive i decided to add information help tips to make the website more user friendly. I also added text on the top of the page explaining how the help-tips work and where you can selet the occupancy and the year for this same reason (user-friendlyness).

My tooltip was aligned to the right on my barchart, this would mean that the tooltip would fall of the page. I solved this by checking the width of the page and the location of the mouse and swap the tooltip whenever the boundary was passed.

The linechart was an optional visualisation of mine. I had spare time in my last day so decided to add it. Because i didn't want to ruin the display of my visualisations page and the linechart was a on-its-own element anyways, i decided to add an extra page for the linechart. This meant i had to copy a lot of code from *project.js*. Because i did not have a lot of time (the deadline was that day) i decided to first create a linechart for one occupancy and one location instead of being able to select several occupancies or locations as was intended in the plan. Would i had been given more time i would've implemented the multiple selection feature into this linechart so comparison over time for different occupancies or locations would be made possible.

Another problem that occured with the linechart was that i first plotted the dots with mouseover and then wanted to connect these dots by a line. To do this i took the coordinates from my created dots and made the line. But because javascript doesn't care about running code from top to bottom and waiting for when it's done, the coordinates of the old dots would be taken instead of the updated dots. In order to solve this i implemented a quick fix: setTimeout. If i had more time i would've thought of a different way of creating the line so i wouldn't have to make use of the setTimeout.
