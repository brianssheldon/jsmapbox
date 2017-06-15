
var websocket2;

function doWebSocket() {
    console.log("uri " + "ws://" + document.location.host + document.location.pathname + "newmarkerendpoint");

    websocket2 = new WebSocket("ws://" + document.location.host + document.location.pathname + "newmarkerendpoint");

    websocket2.onerror = function (evt) {
        console.log('websocket2 onError', evt.data);
    };

    websocket2.onmessage = function (evt) {
        console.log('websocket2 onMessage', evt.data);
        var json = JSON.parse(evt.data);
        console.log('json', json);

        if (json.id === -1) {
            console.log('delete received ', json);

            for (var i = 0; i < markers.length; i++) {
                if (json.lat === markers[i]._lngLat.lat && json.lng === markers[i]._lngLat.lng) {
                    console.log('found it ', markers[i]);
                    markers[i].remove();
                    markers.splice(i, 1);
                }
            }

            setView();
        } else if (json.lng && json.lat) {
            console.log('lnglattttt', json.lng, json.lat);

            createMarker(json.lng, json.lat, false, json.randomImg);
        } else {
            for (var i = 0; i < json.length; i++) {
                createMarker(json[i].lng, json[i].lat, false, json[i].randomImg);
            }
        }

    };
}