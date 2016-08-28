mapaKniznicApp.directive('sideMenu', function($window, uiState) {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'templates/_side_menu.html',
    link: function($scope, element, attrs) {
      $scope.isVisible = function(){
        return(uiState.sideMenuIsVisible())
      }
      
      $scope.openExternalLink = function(url){
        $window.open(url, '_blank');
      } 

      $scope.showListOfAllLibraries = function(){
        uiState.showListOfAllLibraries()
      }     
    }    
  };
});