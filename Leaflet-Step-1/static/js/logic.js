console.log("logic.js loaded!");
// Create our map, giving it the lightmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  // layers: [lightmap, earthquakes]
});

// Define streetmap and darkmap layers
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);


// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(baseURL).then(function (data) {

  console.log(data);

  // createFeatures(data.features);




// function createFeatures(earthquakeData) {

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
//     "</h3><hr><h3>Depth: " + feature.geometry.coordinates[2] + "</h3>");
//   }
 
//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  }).addTo(myMap);

//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }

// function createMap(earthquakes) {

//   // Define streetmap and darkmap layers
//   var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/light-v10",
//     accessToken: API_KEY
//   });


//   // Define a baseMaps object to hold our base layers
//   var baseMap = {
//     "Light Map": lightmap,
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

  // Create our map, giving it the lightmap and earthquakes layers to display on load
  // var myMap = L.map("map", {
  //   center: [
  //     37.09, -95.71
  //   ],
  //   zoom: 5,
  //   layers: [lightmap, earthquakes]
  // });

//   // Create a layer control
//   // Pass in our baseMap and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMap, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);

  var features = []
  // Loop through the earthquake array and create one marker for each earthquake object
  for (var i = 0; i < features.length; i++) {

    // Conditionals for earthquake depth
    var color = "";
    if (features[i].coordinates[2] > 90) {
      color = "red";
    }
    else if (features[i].coordinates[2] > 70) {
      color = "pink";
    }
    else if (features[i].coordinates[2] > 50) {
      color = "orange";
    }
    else if (features[i].coordinates[2] > 30) {
      color = "light orange";
    }
    else if (features[i].coordinates[2] > 10) {
      color = "yellow";
    }
    else {
      color = "green";
    }

    // Add circles to map
    L.circle(features[i].coordinates[2], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      // Adjust radius
      radius: features[i].coordinates[2] * 1500
    }).bindPopup("<h1>Depth: " + features[i].feature.geometry.coordinates[2] + "</h1> <hr> <h3>Magnitude: " + features[i].feature.geometry.coordinates[2] + "</h3>").addTo(myMap);
  }
});
