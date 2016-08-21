function Library(removeDiacritics) {
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
    this.name = rawLibraryData.tags.name
    this.nameForURL = removeDiacritics.replace(this.name.toLowerCase()).replace(/[^a-z0-9]/gi,'-').replace(/(-)+/g,'-');

    this.website = rawLibraryData.tags.website
    if(this.website && this.website.indexOf('http') < 0)
      this.website = '//'+this.website
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
    this.address = rawLibraryData.tags['addr:street'] + ' ' + rawLibraryData.tags['addr:streetnumber']

    this._setOpeningHoursStatus()

    if(this._openingHoursStatus == 'open'){
      this.openingHoursForHumans = 'Knižnica je otvorená<br />'
      this.openingHoursForHumans += this._openingHoursInSVK()
    } else if(this._openingHoursStatus == 'closed'){
      this.openingHoursForHumans = 'Knižnica je zatvorená<br />'
      this.openingHoursForHumans += this._openingHoursInSVK()
    } else {
      this.openingHoursForHumans = 'Otváracie hodiny nie sú známe'
    }
  }

  this.iconURL = function(){
    var url = 'img/student-in-the-library-'+this._openingHoursStatus+'.png'
    return(url)
  }

  this.hasWebContact = function(){
    return(this.website || this.facebook || this.twitter || this.googlePlus )
  }

  this._openingHoursInSVK = function(){
    return(this.openingHours.replace("Mo", "Po").replace("Tu", "Ut").replace("We", "St").replace("Th", "Št").replace("Fr", "Pi"))
  }

  this.createMarker = function(){
    var openingHoursColor = this._openingHoursColor()

    this.marker =  new LibraryMarker()
    this.marker.initialize(this.uid, this.lat, this.lon, openingHoursColor, this.name)

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