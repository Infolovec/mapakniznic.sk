mapaKniznicApp.directive('libraryDetails', function($location, $window, uiState) {
  return {
    restrict: 'E',
    scope: {
      libraries: '=libraries'
    },
    templateUrl: 'templates/_libraries.html',
    link: function($scope, element, attrs) {
      $scope.isDetailVisible = function(library){
        return uiState.isLibraryDetailVisible(library)
      }   

      $scope.hideLibraryDetail = function(){
        uiState.hideLibraryDetail()
        // TODO updateLibraryMarkersAppearance()
      }         

      $scope.openExternalLink = function(url){
        $window.open(url, '_blank');
      }  

      $scope.explanationFor = function(libraryType){
          return 'TODO doplnit vysvetlenie typov kniznic'
      }
    }    
  };
});