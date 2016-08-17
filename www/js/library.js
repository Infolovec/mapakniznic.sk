function Library() {
  this.load = function(rawLibraryData){
    if (rawLibraryData.type == 'node') {
      this.lat = rawLibraryData.lat
      this.lon = rawLibraryData.lon
    } else {
      this.lat = rawLibraryData.center.lat
      this.lon = rawLibraryData.center.lon      
    }

    this.type = rawLibraryData.type
    this.osmID = rawLibraryData.id
    this.name = rawLibraryData.tags.name || 'N/A'
    this.openingHours = rawLibraryData.tags.opening_hours
  }

  this.createMarker = function(){
    var openingHoursColor = this._openingHoursColor()

    this.marker =  L.circleMarker([this.lat, this.lon], {})

    this.marker.setDefaultStyle = function(){
      this.setStyle({fillColor: openingHoursColor, 
        color: 'grey',
        radius: 7,
        fillOpacity: 0.8
      })
    }
    this.marker.setDefaultStyle()

    this.marker.setHighlightStyle = function(){
      this.setStyle({
        fillColor: 'blue', 
        color: 'blue', 
        fillOpacity: 0.5, 
        radius: 20})
    }

     this.marker.hide = function(){
      this.setStyle({radius: 0})
    }   
      
    var uniqueLabelClass = this.type + '_' + this.osmID
    this.marker.bindLabel(this.name, {
      noHide: true,
      className: 'markerLabel ' + uniqueLabelClass,
      opacity: 1.0,
      clickable: true
    })

    return this.marker
  }

  this._openingHoursColor = function(){
    try {
      var oh = new opening_hours(this.openingHours);
      if (oh.getState(new Date()))
        return 'green'
      else
        return 'red'
    } catch (e) {
      // console.log('failed to parse opening hours: ' + openingHours)
      return 'grey'
    }
  }
}