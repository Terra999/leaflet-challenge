console.log("logic2.js loaded successfully!");

// Function to set color based on earthquake depth
function getColor(depth) {
  if (depth > 90) {
    color = "#EB411A";
  }
  else if (depth > 70) {
    color = "#EB631A";
  }
  else if (depth > 50) {
    color = "#EB8F1A";
  }
  else if (depth > 30) {
    color = "#EBA954";
  }
  else if (depth > 10) {
    color = "#EBE554";
  }
  else {
    color = "#88E445";
  }
  return color
}

// Function to increase size of circles
function getSize(magnitude) {
  return magnitude * 5
}

// Function to set style of circles
function style(feature) {
  return {
    fillColor: getColor(feature.geometry.coordinates[2]),
    weight: 2,
    opacity: 1,
    color: 'white',
    radius: getSize(feature.properties.mag),
    fillOpacity: 0.8
  };
};

  // Create the three tile layers that will be the background of my map
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v9",
    accessToken: API_KEY
  });

  var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v10",
    accessToken: API_KEY
  });

  // Create two separate layer groups: one for Tectonic Plates and one for Earthquakes
  var tectonic = L.layerGroup(tectonic);
  var earthquake = L.layerGroup(earthquake);

  // Create base and overlay layers
  var baseMaps = {
    Satellite: satellite,
    Grayscale: grayscale,
    Outdoors: outdoors
  };
  var overlayMaps = {
    "Tectonic Plates": tectonic,
    Earthquakes: earthquake
  };

  // Create my map w/ one baseMap and both overlayMaps
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [satellite, tectonic, earthquake]
  });

  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Create a legend to display depth scale/color
  var legend = L.control({ position: 'bottomright' });
  // When the layer control is added, insert a div with the class of "info legend"
  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 30, 50, 70, 90],
      labels = [];

    // loop through our depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  // Add legend to my map
  legend.addTo(myMap);

  // Store API endpoint inside baseURL
  var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  // Store tectonic bounardaries in tectonicPlates
  var tectonicPlates = "static/data/PB2002_boundaries.json";

  // Grab the earthquake data with d3 
  d3.json(baseURL).then(function (data) {

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    var earthquakes = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        // Add circles to map
        return L.circleMarker(latlng);
      },
      // Call style from function
      style: style,
      // Bind a popup to the circles to show magnitude, depth, and place
      onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
          "</h3><h3>Depth: " + feature.geometry.coordinates[2] + "</h3><hr><h3>Place: " +
          feature.properties.place + "</h3>")
      }
    // Add popups to map
    }).addTo(earthquake);
    earthquake.addTo(myMap);
  });

  // Grab the tectonic boundaries data with d3 
  d3.json(tectonicPlates).then(function (tectonicRes) {

    // Create a GeoJSON layer containing the features array on the tectonicRes object
    var tectonics = L.geoJSON(tectonicRes, {
      pointToLayer: function (feature, latlng) {
        color: red
        // Add lines to the map
        return L.polyline(latlng);
      },
    // Add lines to map
    }).addTo(tectonic);
    tectonic.addTo(myMap);
  });

