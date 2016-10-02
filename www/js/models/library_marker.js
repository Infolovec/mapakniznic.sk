mapaKniznicApp.factory('LibraryMarker', function(libraryIcons){
  return function (){
    this.initialize = function(uid, libraryType, lat, lon, defaultColor, labelText){
      
      this._marker =  L.marker([lat, lon], {zIndex: 1, icon: this._icon(defaultColor)})

      this._defaultColor = defaultColor
      this.setStyle('normal')
      this.uid = uid
      this.lat = lat
      this.lon = lon
      this.libraryType = libraryType

      this._marker.bindLabel(labelText, {
        noHide: false,
        className: this.uid + ' markerLabel',
        opacity: 0.9,
        clickable: true,
        offset: [22,-15]
      })   

      this._supportHightlightMarker = L.circleMarker([lat, lon], {
        radius: 0, 
        zIndex: 0,
        weight: 4,
        color: '#feffd5',
        fillColor: '#feffd5'})

      this._onMouseOverMarker = L.circleMarker([lat, lon], {
        radius: 0, 
        zIndex: 0,
        color: '#feffd5',
        weight: 4,
        dashArray: '15, 8',
        lineCap: 'square',
        fillColor: '#feffd5'})
    }

    this._showOnMouseOverMarker = function(){
      this._onMouseOverMarker.setStyle({radius: 30, fillOpacity: 0.3, opacity: 0.9})
    }

    this._hideOnMouseOverMarker = function(){
      this._onMouseOverMarker.setStyle({radius: 0})
    }

    this.addTo = function(map){
      this._supportHightlightMarker.addTo(map)
      this._supportHightlightMarker.on('click',this._markerClicked);
      this._marker.addTo(map)
      this._marker.on('click',this._markerClicked);
      this._onMouseOverMarker.addTo(map)
      var that = this
      this._marker.on('mouseover', this._showOnMouseOverMarker.bind(this));
      this._marker.on('mouseout', this._hideOnMouseOverMarker.bind(this));
    } 

    this.setStyle = function(style){
      this._style = style
    }

    this.updateAppearance = function(mapZoom){
      var iconSize = mapZoom * 2.5 - 11
      if(iconSize < 19)
        iconSize = 19

      if(this._style == 'highlight'){
        this._supportHightlightMarker.setStyle({radius: 30, fillOpacity: 0.6, opacity: 0.9})
        
      } else if(this._style == 'normal'){
        this._supportHightlightMarker.setStyle({radius: 0})
      } else if(this._style == 'hide'){
        iconSize = 0
        this._supportHightlightMarker.setStyle({radius: 0})
      }

      this._marker.setIcon(this._icon(iconSize))  
    }

    this.setClickCallback = function(callback){
      this._markerClicked = callback
    }

    this._icon = function(iconSize){
      return L.icon({
        iconUrl: libraryIcons.getImage(this.libraryType, this._defaultColor),
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize/2, iconSize/2]
      })
    }
  }
})