# Report

Thomas Reus (student number 11150041)

Data source: [Bodemgebruik CBS per provincie](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/37105/table?ts=1543167766064).


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

![time](https://github.com/thomasreus97/project/blob/master/doc/line.jpg)

Here the interactivity is simple, when one of the dropdowns in the top-right corner changes the linegraph will be updated.

### Code

The code for the interactivity discussed above can be discussed in several ways. First an high level overview of the code will be given. Then the details of the code and it's finctions will be discussed.

#### High level overview

The javascript code consists of
