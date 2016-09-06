mapaKniznicApp.directive('libraryDetails', function($location, $window, uiState, libraries, Socialshare) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'templates/_libraries.html',
    link: function($scope, element, attrs) {
      $scope.libraries = libraries
      
      $scope.isDetailVisible = function(library){
        return uiState.isLibraryDetailVisible(library)
      }   

      $scope.hideLibraryDetail = function(){
        uiState.hideLibraryDetail()
      }         

      $scope.openExternalLink = function(url){
        $window.open(url, '_blank');
      }  

      $scope.explanationFor = function(libraryType){
          return 'TODO doplnit vysvetlenie typov kniznic'
      }

      $scope.socialShare = function(provider, library){
        var url = 'http://mapakniznic.sk/' + library.nameForURL
        Socialshare.share({
          'provider': provider,
          'attrs': {
            'socialshareUrl': url
          }
        });
      }
    }    
  };
});