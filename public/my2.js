// please create an account on mapbox.com and create your own token instead of using mine
mapboxgl.accessToken = 'pk.eyJ1Ijoib2tpZWJ1YmJhIiwiYSI6ImNpdHZscGs3ajAwNXYyb284bW4ydWUzbGsifQ.1PoNrSP0F65WolWgqKhV4g';
var map;
var kounter = 0;
var markers = [];
var lonlat = [-97.50732685771766, 35.47461778676444];
var dragAndDropped = false;

$(document).ready(function () {

    map = new mapboxgl.Map({
        container: 'map', // container id
        style: '/tweakedstyle.json',
        center: lonlat, // starting position
        zoom: 11 // starting zoom
    });

    map.on('rotate', function (e) {
        dragAndDropped = true;
    });

    map.on('drag', function (e) {
        dragAndDropped = true;
    });

    map.on('mouseup', function (e) {
        closePopup();
        if (dragAndDropped) {
            dragAndDropped = false;
            console.log('bailing');
            return;
        }

        console.log('clickkkk', e.originalEvent.which);
        if (e.originalEvent.which !== 1) { // not left click
            // createMarker(e.lngLat.lng, e.lngLat.lat);
        } else { // not left click
            console.log('calling makePopupPicker', e.lngLat.lng, e.lngLat.lat);
            makePopupPicker(e);
        }
        // console.log(map.getZoom());
    });

    map.on('load', function () {
            map.addControl(new mapboxgl.NavigationControl());

            map.addControl(new mapboxgl.ScaleControl({
                position: 'bottom-right',
                maxWidth: 80,
                unit: 'imperial'
            }));

            var navigationHtml =
                '<button class="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate" type="button" onclick="flytolocation()" accesskey="h"' +
                ' title="Reset map back to original view. Hot key: <alt> h"><span class="arrow";"></span></button>';
            // adds a navigation button that resets the view back to where it started
            $('.mapboxgl-ctrl-group').append(navigationHtml);
    });
});

function createMarker(lng, lat, sendWS, randomImg) {
    if (!lng || !lat)
        return;

    console.log('createMarker', lat, lng);
    let marker = getGeoJsonForMarker(lng, lat);
    if (!randomImg) {
        randomImg = '/images/a' + Math.floor((Math.random() * 8) + 1) + '.gif';
    }
    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.id = 'markerId_' + kounter;
    el.style.backgroundImage = 'url(' + randomImg + ')';
    el.style.width = '50px';
    el.style.height = '50px';

    // add marker to map
    markers.push(new mapboxgl.Marker(el, {
        offset: [-25, -25]
    })
    .setLngLat([lng, lat])
    .addTo(map));

    $('#markerId_' + kounter).append(
            '<div class="markerLabel" id="markerLabel_' + kounter + '">' + kounter + '</div>');

    $('#markerId_' + kounter).mouseup(function (evt) {
        dragAndDropped = true;

        for (var i = 0; i < markers.length; i++) {
            if (evt.currentTarget.id === markers[i]._element.id) {

                let newMarker = {
                    id: -1,
                    lng: markers[i]._lngLat.lng,
                    lat: markers[i]._lngLat.lat
                };

                // websocket2.send(JSON.stringify(newMarker));
                markers.splice(i, 1);
            }
        }

        this.remove();
        setView();
    });

    closePopup();
    setView();
    kounter++;
}

function getGeoJsonForMarker(lng, lat) {
    var geojson = {
        "type": "FeatureCollection",
        "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                }
            }]
    };
    return geojson;
}

function closePopup() {
    $('#popupmain').remove();
}

function makePopupPicker(e) {
    closePopup();
    console.log(e.point.x, e.point.y, e);
    let lng = e.lngLat.lng;
    let lat = e.lngLat.lat;
    let x = e.point.x;
    if (x > 150)
        x = x - 150;
    let theHtml = '';
    theHtml += "<div id='popupmain' class='popupmain' ";
    theHtml += "style='left: " + x + "px; top: " + e.point.y + "px;'>";

    theHtml += "<button class='buttonx' onclick='sendNewMarkerToServerUsingRest(" + lng + "," + lat + ", true)'>Add Marker</button>"
    theHtml += "<button class='buttonx' onclick='closePopup()'>Close</button>"
    theHtml += "<br></div>";
    $('#popup').append(theHtml);
}

function flytolocation() {
    if (markers && markers.length > 0) {
        setView();
        return;
    }

    map.flyTo({
        center: lonlat,
        pitch: 0,
        bearing: 0,
        zoom: 10.14
    });
}

function setView() {
    console.log('setView', markers);
    if (!markers || markers.length === 0) {
        flytolocation();
        return;
    }

    var neLon = -180;
    var neLat = 0;
    var swLon = 180;
    var swLat = 90;

    $.each(markers, function (index, value) {
        if (value._lngLat.lng > neLon)
            neLon = value._lngLat.lng;
        if (value._lngLat.lng < swLon)
            swLon = value._lngLat.lng;
        if (value._lngLat.lat > neLat)
            neLat = value._lngLat.lat;
        if (value._lngLat.lat < swLat)
            swLat = value._lngLat.lat;
    });

    console.log('setView after each', swLon, swLat, neLon, neLat);

    map.fitBounds([
        [
            swLon, swLat
        ],
        [
            neLon, neLat
        ]
    ], {
        maxZoom: 12,
        linear: true,
        padding: 130,
        pitch: 0
    });
}
