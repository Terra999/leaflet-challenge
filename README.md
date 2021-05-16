# Leaflet Homework - Visualizing Data with Leaflet
# Basic Task
Using the earthquake data from the United States Geological Survey ([USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)), I created a map using Leaflet to plot all the earthquakes from the data based on longitude and latitude.

![2-BasicMap](Images/1-BasicMap.png)

   * I included data markers that reflected the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes appear larger and earthquakes with greater depth appear darker in color.

   * Each circle marker includes a popup that provides information about the earthquake, such as magnitude, depth and location.

   * I also created a legend that provides context for my map data.

- - -

### Advanced Task

![5-Advanced](Images/2-Advanced.png)

For the Advanced Task, I plotted a second data set on my map to illustrate the relationship between tectonic plates and seismic activity. I needed to pull in a second data set and visualize it along side my original set of data. I obtained data on tectonic plates at <https://github.com/fraxen/tectonicplates>.

For this map, I needed to create 3 base maps and then had to separate out two different data sets into overlays that can be turned on and off independently via a control layer.
