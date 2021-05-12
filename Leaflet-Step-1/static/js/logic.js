console.log("logic.js loaded successfully!");

// Store API endpoint inside baseURL
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(baseURL).then(function (data) {
  console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
      "</h3><hr><h3>Depth: " + feature.geometry.coordinates[2] + "</h3>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  })

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMap = {
    "Light Map": lightmap,
  };

  // Create overlay object to hold our overlay layer
  // var overlayMaps = {
  //   Earthquakes: earthquakes
  // };
  var features = data.features;
  // Loop through the earthquake array and create one marker for each earthquake object
  for (var i = 0; i < features.length; i++) {

    var magnitudes = features[i].properties.mag;
    var coordinates = features[i].geometry.coordinates;

    L.circle(
      [coordinates[1], coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      // Adjust radius
      radius: features[i].coordinates[2] * 1500
    })
      .addTo(myMap);
  }

  // Create our map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, features]
  });

  // Create a layer control
  // Pass in our baseMap and overlayMaps
  // Add the layer control to the map
  // L.control.layers(baseMap, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);



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
}
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//     grades = [0, 10, 20, 50, 100, 200, 500, 1000],
//     labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
// }

// return div;
// };

// legend.addTo(map);

// function getColor(d) {
//   return d > 1000 ? '#800026' :
//          d > 500  ? '#BD0026' :
//          d > 200  ? '#E31A1C' :
//          d > 100  ? '#FC4E2A' :
//          d > 50   ? '#FD8D3C' :
//          d > 20   ? '#FEB24C' :
//          d > 10   ? '#FED976' :
//                     '#FFEDA0';
// }