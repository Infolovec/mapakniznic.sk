mapaKniznicApp.factory("maputils", function() {
  var service = {}

  var radiusForCurrentZoomLevel = function() {
    //return (map.getZoom() - 5)
    return(10)
  }

  

  service.markers = []
  
  service.createMarker = function(map, kniznica, lat, lon) {
    var kniznicaProperties = kniznica.properties

    var openingHoursColor = '#FFA500'
    try {
      var oh = new opening_hours(kniznicaProperties.opening_hours);
      if (oh.getState(new Date()))
        openingHoursColor = 'green'
      else
        openingHoursColor = 'grey'
    } catch (e) {
      console.log('failed to parse opening hours: ' + kniznicaProperties.opening_hours)
    }


    var marker = L.circleMarker([lat, lon], {
      fillColor: openingHoursColor,
      color: openingHoursColor,
      radius: radiusForCurrentZoomLevel(),
      fillOpacity: 0.8
    })

    var uniqueLabelClass = kniznica.id.split('/').join('_')
    marker.bindLabel((kniznicaProperties.name || 'N/A'), {
      noHide: true,
      className: 'markerLabel ' + uniqueLabelClass,
      opacity: 1.0,
      clickable: true
    })

    marker.kniznicaName = kniznicaProperties.name || 'N/A'
    marker.kniznicaWebsite = kniznicaProperties.website || 'N/A'
    marker.kniznicaOpeningHours = kniznicaProperties.opening_hours || 'N/A'

    marker.addTo(map)
    service.markers.push(marker)

    // marker.on('click', onMarkerClick);
    // $('.' + uniqueLabelClass).click({
    //   marker: marker
    // }, onMarkerClick);
  }

  return service
})