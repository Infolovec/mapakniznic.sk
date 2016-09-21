mapaKniznicApp.directive('libraryDetail', function($location, $window, uiState, libraries, Socialshare, clipboard, $ionicPopup) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'templates/_library_detail.html',
    link: function($scope, element, attrs) {
      $scope.library = function(){
        return uiState.currentlyDisplayedLibraryDetail()
      }
      
      $scope.isDetailVisible = function(){
        return ($scope.library())
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
        var url = 'https://mapakniznic.sk/' + library.url_id
        if(provider == 'copyURL'){
          if (!clipboard.supported ) {
            $ionicPopup.show({
              title: 'Zdieľanie odkazu na knižnice',
              subTitle: 'Pre zdieľanie odkazu na knižnicu skopírujte túto URL adresu:',
              template: '<input type="text" value="'+url+'">',
              buttons: [
                { text: 'OK', type: 'button-dark' },
              ]
            });
          } else {
            clipboard.copyText(url);
            $ionicPopup.show({
              title: 'Zdieľanie odkazu na knižnice',
              template: 'URL odkaz na knižnicu bol skopírovaný do schránky (clipboardu).',
              buttons: [
                { text: 'OK', type: 'button-dark' },
              ]
            });
          }
        } else {
          Socialshare.share({
            'provider': provider,
            'attrs': {
              'socialshareUrl': url
            }
          });
        }


      }
    }    
  };
});