mapaKniznicApp.directive('sideMenu', function($rootScope, $window) {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'templates/_side_menu.html',
    link: function($scope, element, attrs) {
      $scope.showSideMenu = false
      
      $scope.openExternalLink = function(url){
        $window.open(url, '_blank');
      }

      $scope.$on('changeSideMenuVisibility', function(broadcastEvent, clickEvent) {
        if((clickEvent.target.id == 'menuButton'))
          $scope.showSideMenu = !$scope.showSideMenu
        else 
          $scope.showSideMenu = false

        $rootScope.$broadcast('changeSideMenuButtonAppearance', $scope.showSideMenu)
      });   

      $scope.showListOfAllLibraries = function(){
        $scope.showSideMenu = false
        $rootScope.$broadcast('showListOfAllLibraries')
      }     
    }    
  };
});