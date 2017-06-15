
function sendNewMarkerToServerUsingRest(lng, lat) {
    console.log('sendNewMarkerToServerUsingRest');
    
    var randomImg = 'images/a' + Math.floor((Math.random() * 8) + 1) + '.gif';
    
    var jsonobj = {id: 0, lng: lng, lat: lat, randomImg: randomImg};
    console.log('sendNewMarkerToServerUsingRest', jsonobj);
        
    $.ajax({
        type: "POST",
        url: "/javawebsockets/resources/greeting",
        data: JSON.stringify(jsonobj),
        dataType: "json",
        contentType: "application/json",
        success: function (a, b, c) {
            console.log('successss', a, b, c, 'eennnddd');
        }
    });
}