mapaKniznicApp.factory('Library', function(LibraryMarker){
  return function(removeDiacritics) {
    this.uid = 'L'+ parseInt(Math.random() * 100000)

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
      this.osmLink = 'https://www.openstreetmap.org/' + this.type + '/' + this.osmID
      this.name = rawLibraryData.tags.name
      this.short_name = rawLibraryData.tags.short_name
      this.url_id = rawLibraryData.url_id
      this.url_name = rawLibraryData.url_name
      this.libraryType = rawLibraryData.library_type
      this.email = rawLibraryData.tags['contact:email']
      this.phoneNo = rawLibraryData.tags['contact:phone']
      
      this.website = rawLibraryData.tags.website || rawLibraryData.tags['contact:website']
      if(this.website && this.website.indexOf('http') < 0)
        this.website = 'http://'+this.website
      this.facebook = rawLibraryData.tags['contact:facebook']
      if(this.facebook && this.facebook.indexOf('http') < 0)
        this.facebook = '//'+this.facebook    
      this.twitter = rawLibraryData.tags['contact:twitter']
      if(this.twitter && this.twitter.indexOf('http') < 0)
        this.twitter = '//'+this.twitter       
      this.googlePlus = rawLibraryData.tags['contact:google_plus']
      if(this.googlePlus && this.googlePlus.indexOf('http') < 0)
        this.googlePlus = '//'+this.googlePlus    

      this.openingHours = rawLibraryData.tags.opening_hours
      this.address = ''

      if(rawLibraryData.tags['addr:street']){
        this.address += rawLibraryData.tags['addr:street']
        if(rawLibraryData.tags['addr:housenumber'])
          this.address += ' ' + rawLibraryData.tags['addr:housenumber']
        else if(rawLibraryData.tags['addr:streetnumber'])
          this.address += ' ' + rawLibraryData.tags['addr:streetnumber']
          
        if(this.address.length > 0)
          this.address += ', '
        this.address += rawLibraryData.tags['addr:city']

      } else if (rawLibraryData.tags['addr:conscriptionnumber']){
        this.address = rawLibraryData.tags['addr:city'] + ' ' + rawLibraryData.tags['addr:conscriptionnumber']
      } else 
        this.address = rawLibraryData.tags['addr:city']

      this.city = rawLibraryData.tags['addr:city']
      this.note = rawLibraryData.tags['note']

      this._searchName = removeDiacritics.replace((this.name + this.short_name + this.address).toLowerCase())

      this._setOpeningHoursStatus()

      if(this._openingHoursStatus == 'open'){
        this.openingHoursForHumans = 'Knižnica je <img src="img/open-book.svg" class="open"> <span class="status isOpen">otvorená</span><br />'
      } else if(this._openingHoursStatus == 'closed'){
        this.openingHoursForHumans = 'Knižnica je <img src="img/closed-book.svg" class="closed"> <span class="status isClosed">zatvorená</span><br />'    
      }

      if(this.openingHours)
        this.openingHoursInSVK = this.openingHours.replace(/Mo/g, "Po").replace(/Tu/g, "Ut").replace(/We/g, "St").replace(/Th/g, "Št").replace(/Fr/g, "Pi").replace(/Sa/g, "So").replace(/Su/g, "Ne").replace(/off/g, "zatvorené").replace("24/7", "nonstop otvorené").replace(/\-/g, '&ndash;')
      else
        this.openingHoursInSVK = 'nie sú známe'
    }

    this.iconURL = function(){
      var url = 'img/student-in-the-library-'+this._openingHoursStatus+'.png'
      return(url)
    }

    this.isMatchingSearchString = function(q){
      return(this._searchName.indexOf(q) > -1 || q.indexOf(this._searchName) > -1)
    }

    this.createMarker = function(){
      var openingHoursColor = this._openingHoursColor()

      this.marker =  new LibraryMarker()
      this.marker.initialize(this.uid, this.libraryType, this.lat, this.lon, openingHoursColor, this.name)

      return this.marker
    }

    this._setOpeningHoursStatus = function(){
      try {
        var oh = new opening_hours(this.openingHours);
        if (oh.getState(new Date()))
          this._openingHoursStatus = 'open'
        else
          this._openingHoursStatus = 'closed'
      } catch (e) {
        // console.log('failed to parse opening hours: ' + openingHours)
        this._openingHoursStatus = 'unknown'
      }
    }
    this._openingHoursColor = function(){
      if(this._openingHoursStatus == 'open')
        return 'green'
      else if(this._openingHoursStatus == 'closed')
        return 'red'
      else return 'grey'
    }
  }
})