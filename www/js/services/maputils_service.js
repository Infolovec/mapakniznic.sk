mapaKniznicApp.factory("maputils", function() {
  var service = {}

  var radiusForCurrentZoomLevel = function() {
    //return (map.getZoom() - 5)
    return(10)
  }

  var getLibraryStatus = function(openingHours){
    try {
      var oh = new opening_hours(openingHours);
      if (oh.getState(new Date()))
        return 'open'
      else
        return 'closed'
    } catch (e) {
      // console.log('failed to parse opening hours: ' + openingHours)
      return 'unknown'
    }
  }

  service.markers = []
  
  service.createMarker = function(map, library, lat, lon) {
    var libraryStatus = getLibraryStatus(library.tags.opening_hours)
    var openingHoursColor = 'grey'
    if(libraryStatus == 'open')
      openingHoursColor = 'green'
    else if(libraryStatus == 'closed')
      openingHoursColor = 'red'

    var marker = L.circleMarker([lat, lon], {
      fillColor: openingHoursColor,
      color: openingHoursColor,
      radius: radiusForCurrentZoomLevel(),
      fillOpacity: 0.8
    })

    var uniqueLabelClass = library.type + '_' + library.id
    marker.bindLabel((library.tags.name || 'N/A'), {
      noHide: true,
      className: 'markerLabel ' + uniqueLabelClass,
      opacity: 1.0,
      clickable: true
    })

    marker.kniznicaName = library.tags.name || 'N/A'
    marker.kniznicaWebsite = library.tags.website || 'N/A'
    marker.kniznicaOpeningHours = library.tags.opening_hours || 'N/A'

    marker.addTo(map)
    service.markers.push(marker)

    // marker.on('click', onMarkerClick);
    // $('.' + uniqueLabelClass).click({
    //   marker: marker
    // }, onMarkerClick);
  }

  return service
})