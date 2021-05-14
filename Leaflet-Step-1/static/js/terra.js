console.log("terra.js loaded successfully!");

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5
});

lightmap.addTo(myMap);

// Store API endpoint inside baseURL
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(baseURL).then(function (data) {
  console.log(data);

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: style,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
      "</h3><h3>Depth: " + feature.geometry.coordinates[2] + "</h3><hr><h3>Place: " +
      feature.properties.place + "</h3>")
    }
  }).addTo(myMap); 

});

var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [-10, 10, 30, 50, 70, 90],
    labels = []
  var colors = ["#89a832", "#32a834", "#32a87d", "#3244a8", "#8532a8", "#a83240"];

  // loop through our depth intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      grades[i] + (grades[i] ? '&ndash;' + grades[i] + '<br>' : '+');
  }
  return div;
};

legend.addTo(myMap);

function getColor(depth) {
  // var color = "";
  if (depth > 90) {
    color = "#a83240";
  }
  else if (depth > 70) {
    color = "#8532a8";
  }
  else if (depth > 50) {
    color = "#3244a8";
  }
  else if (depth > 30) {
    color = "#32a87d";
  }
  else if (depth > 10) {
    color = "#32a834";
  }
  else {
    color = "#89a832";
  }
  return color
}

function getSize(magnitude) {
  return magnitude * 5
}

function style(feature) {
  return {
      fillColor: getColor(feature.geometry.coordinates[2]),
      weight: 2,
      opacity: 1,
      color: 'white',
      radius: getSize(feature.properties.mag),
      fillOpacity: 0.7
  };
};
