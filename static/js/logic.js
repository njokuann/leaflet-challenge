var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(queryurl);

d3.json(queryurl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    

    

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature, 
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                fillColor: getColor(feature.properties.mag),
                fillOpacity: 0.75,
                radius: feature.properties.mag * 7,
                weight: 1
            });
        }
    });

    createMap(earthquakes);

   

}



function createMap(earthquakes) {
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id:"mapbox.light",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Light Map": lightmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}

function getColor(d) {
    return d > 5 ? '#ff0000':
    d > 4 ? '#ff8c00':
    d > 3 ? '#ee9a00':
    d > 2 ? '#ff7f50':
    d > 1 ? '#7fff00':
    d > 0 ? '#c1ffc1':
    '#ffeda0';
}



var legend = L.control({position: 'bottomright'});

legend.onAdd = function(myMap) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += "<h4>Magnitude</h4>";
    return div;
};
legend.addTo(myMap);
