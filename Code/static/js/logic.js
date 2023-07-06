//Adding Tile Layers


//DataBase
let URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Getting our GeoJSON data
d3.json(URL).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
  });


  // 2. Import and visualize the data by doing the following:

  function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
};


function createCircleMarker(feature, latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "white",
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.35
       } 
       return L.circleMarker(latlng,options);
    };

    let earthquake = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature, pointToLayer: createCircleMarker
      });
    

      createMap(earthquake);
    }

    function getColor(depth) {
       if (depth >= 90) return "black";
       else if (depth < 90 && depth >= 70) return "red";
       else if( depth < 70 && depth >= 50) return "orange";
        else if ( depth < 50 && depth >= 30) return "yellow";
        else if  ( depth < 30 && depth >= 10) return "lime";
            else return "green";
    }
    

    function createMap(earthquake) {

        // Create the base layers leaflet.
        let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
          
        let topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });


      // Create a baseMaps object.
      let baseMaps = {
        "Street Map": streetmap,
        "Topographic Map": topomap
    };
      
    // Create an overlay object to hold our overlay.
    let overlaysMap = {
        Earthquakes: earthquake
    };
      
        // Create our map to display data 
    let myMap = L.map("map", {
        center: [37.09, -95.71 ],
        zoom: 6,
        layers: [streetmap, earthquake]
    });

    //Layer Control
    L.control.layers(baseMaps, overlaysMap, {
        collapsed: false
      }).addTo(myMap);

 // Setting up the legend
 let legend = L.control({position: 'bottomright'});
 legend.onAdd = () => {
    let  div = L.DomUtil.create('div', 'info legend');
    let depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h1>Latest Earthquakes<br/>" +
    "<h2> Earthquake Depth (m) <h2/>"

  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }

  div.innerHTML += 
    "<br> <br> <b>Data Source </b>: U.S. Geological Survey, All Earthquakes-past week</br>"
  return div;
};
legend.addTo(myMap)
};