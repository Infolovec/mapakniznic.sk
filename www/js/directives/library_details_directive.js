mapaKniznicApp.directive('libraryDetails', function($location, $window) {
  return {
    restrict: 'E',
    scope: {
      libraries: '=libraries'
    },
    templateUrl: 'templates/_libraries.html',
    link: function($scope, element, attrs) {
      $scope.visibleLibraryUID = null
      $scope.isDetailVisible = function(library){
        return($scope.visibleLibraryUID == library.uid)
      }

      $scope.$on('showLibraryDetail', function(event, library) {
          $scope.visibleLibraryUID = library.uid
          $location.path('/'+library.nameForURL);
      });

      $scope.$on('hideLibraryDetail', function(event) {
        $scope.hideLibraryDetail()
      });      

      $scope.hideLibraryDetail = function(){
        $scope.visibleLibraryUID = null
        manuallySelectedLibrary = null
        $location.path('/');
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