console.log("Hello");
function createAreaTooltip(layer) {
    if(layer.areaTooltip) {
        return;
    }

    layer.areaTooltip = L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'area-tooltip'
    });

    layer.on('remove', function(event) {
        layer.areaTooltip.remove();
    });

    layer.on('add', function(event) {
        updateAreaTooltip(layer);
        layer.areaTooltip.addTo(map);
    });

    if(map.hasLayer(layer)) {
        updateAreaTooltip(layer);
        layer.areaTooltip.addTo(map);
    }
}

function updateAreaTooltip(layer) {
    var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    var readableArea = L.GeometryUtil.readableArea(area, true);
    var latLngs = layer.getLatLngs();
    //console.log(latLngs);
    var temp = "";
    latLngs[0].forEach( 
        function( elm) {
             temp += elm.lat + ", " + elm.lng + "<br/>";
            } 
    );
    console.log(temp);
    var latlng = layer.getCenter();

    layer.areaTooltip
        //.setContent(readableArea)
        .setContent(temp)
        .setLatLng(latlng);
}



//const marker = L.marker([45.4215, -75.69]).addTo(map)
//	.bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

/*
const circle = L.circle([45.4215, -75.69], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map).bindPopup('I am a circle.');

const polygon = L.polygon([
    [45.429, -75.6472],
    [45.423, -75.6672],
    [45.41, -75.6572]
]).addTo(map); 

createAreaTooltip(polygon);


const popup = L.popup()
    .setLatLng([45.4215, -75.6972])
    .setContent('I am a standalone popup.')
    .openOn(map);
    

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(`You clicked the map at ${e.latlng.toString()}`)
        .openOn(map);
} 

map.on('click', onMapClick); */


// add draw control
var drawnItems = L.featureGroup().addTo(map);

map.addControl(new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        marker: false,
        circle: false,
        circlemarker: false,
        rectangle: false,
        polyline: false,
        polygon: {
            allowIntersection: false,
            showArea: true
        }
    }
}));

map.on(L.Draw.Event.CREATED, function(event) {
    var layer = event.layer;

    if(layer instanceof L.Polygon) {
        createAreaTooltip(layer);
    }

    drawnItems.addLayer(layer);
});

map.on(L.Draw.Event.EDITED, function(event) {
    event.layers.getLayers().forEach(function(layer) {
        if(layer instanceof L.Polygon) {
            updateAreaTooltip(layer);
        }
    })
});

