_tatApp.controller('SidebarCtrl', function ($log, $scope, tatService, tatGlossary, tatHighlight, $location, $anchorScroll) {
    $log.log('SidebarCtrl:' + $scope.postId);

    $scope.dictConfig = tatService.getConfig();
    $scope.glossary = null;

    $scope.$watch('postId', function (postId) {
        $log.info('postId:' + $scope.postId);
        $scope.glossary = tatGlossary.get(postId);
    });

    $scope.goToHighlight = function (term) {
        $location.hash(tatHighlight.getTagId(term));
        $anchorScroll();
    };

    $scope.openDictionary = function (text) {
        if ($scope.dictConfig.enabled) {
            tatService.openDictionary($scope.postId, text || tatService.getSelectedText());
        }
    };

});
