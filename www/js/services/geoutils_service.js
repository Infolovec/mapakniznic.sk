mapaKniznicApp.factory("geoutils", function() {
  var service = {}

  service.avgLatLon = function(array) {
    var totalLon = 0;
    var totalLat = 0;
    for (var i = 0; i < array.length; i++) {
      totalLon += array[i][0];
      totalLat += array[i][1];
    }

    var avgLon = totalLon / array.length
    var avgLat = totalLat / array.length

    return ([avgLat, avgLon])
  }


  return service
})