var dzStartX = 20.84; // 0 x
var dzStartY = 20.87; // 0 y
var dzEndX = 234.336; // 152 x
var dzEndY = 234.35; // 152 y
var dzQX = (dzEndX - dzStartX) / 152; // quadrant mesurement by X axis
var dzQY = (dzEndY - dzStartY) / 152; // quadrant measurement by Y axis
var dayzMap;
var mapProjection;

// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;
    // tile range in one direction range is dependent on zoom level
    // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
    var tileRange = 1 << zoom;

    // don't repeat across y-axis (vertically)
    if (y < 0 || y >= tileRange) {
        return null;
    }
    
    // repeat across x-axis
    if (x < 0 || x >= tileRange) {
        return null; //x = (x % tileRange + tileRange) % tileRange;
    }

    return {
        x: x,
        y: y
    };
}

function makePlayer(name, x, y) {
    latLng = getLatLng(x, y);

    if (latLng) {
        var player = new google.maps.Marker({
            position: latLng,
            title: name
        });
        player.setMap(dayzMap);
        return player;
    }
    else {
        console.log('Error: map projection is not initialized yet.');
    }
}

function getLatLng(x, y) {
    if (mapProjection) {
        var point = new google.maps.Point(x, y);
        return mapProjection.fromPointToLatLng(point);
    }
    else {
        return false;
    }
}

$(document).ready(function(){
    var mapTypeOptions = {
        center: new google.maps.LatLng(0, 0),
        maxZoom: 6,
        minZoom: 1,
        zoom: 2,
        radius: 10000,
        tileSize: new google.maps.Size(256, 256),
        name: 'DayZ Chernarus',
        getTileUrl: function(coord, zoom) {
            var normalizedCoord = getNormalizedCoord(coord, zoom);
            
            if (!normalizedCoord) {
                return null;
            }
            
            return '/images/map/' + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.jpg';
        }
    };

    var chernarusMapType = new google.maps.ImageMapType(mapTypeOptions);
    
    var myLatlng = new google.maps.LatLng(0, 0);
    var mapOptions = {
        center: myLatlng,
        zoom: 1,
        streetViewControl: false,
        backgroundColor: '#FFFFFF',
        mapTypeControlOptions: {
            mapTypeIds: ['dayz_chernarus']
        }
    };

    dayzMap = new google.maps.Map(document.getElementById('map'), mapOptions);
    dayzMap.mapTypes.set('dayz_chernarus', chernarusMapType);
    dayzMap.setMapTypeId('dayz_chernarus');
    google.maps.event.addListener(dayzMap, 'projection_changed', function() {
        mapProjection = dayzMap.getProjection();
    });
});


