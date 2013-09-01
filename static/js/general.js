var dayzMap;

$(document).ready(function(){
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

    var mapTypeOptions = {
        center: new google.maps.LatLng(0, 0),
        maxZoom: 6,
        minZoom: 2,
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
    alert(2);
        
    function makePlayer(name, latLng) {
        var player = new google.maps.Marker({
            position: latLng,
            title: name
        });
        player.setMap(dayzMap);
    }
    
    function px2deg(px) {
        var rad = Math.atan(px / Math.sqrt(152000 - px^2))
        return rad * 180/ Math.PI;
    }
    
    function genDayZCoords(a, b) {
        a -= 4000;
        b *= -1 / 5.8
        b += 4000;
        return [a, b];
    }
    
    var xD = 0;
    var yD = 0;
    var y = 0;
    var latLng = 0;
    
    for (var x = 0; x < 1000; x += 1)
    {
        y = x;
        dayZCoords = genDayZCoords(x, y);
        xD = dayZCoords[0];
        yD = dayZCoords[1];
        xDeg = px2deg(xD);
        yDeg = px2deg(yD);
        latLng = new google.maps.LatLng(yDeg, xDeg);
        makePlayer('Player [' + x + ' x ' + y + ']', latLng);
    }
});


