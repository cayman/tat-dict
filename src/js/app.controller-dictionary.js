_tatApp.controller('DictionaryCtrl', function ($log, $scope, $timeout, tatGlossary, tatRest, tatApp, $uibModalInstance, data) {
    $log.log('DictionaryCtrl');

    var postId = data.post;

    $scope.request = {};
    $scope.translation = {};
    $scope.selected = {};
    
    $scope.glossary = tatGlossary.get(postId);
    $scope.history = tatApp.getHistory();

    $scope.searchIcon = 'fa-search';

    $scope.deleteSymbol = function () {
        if ($scope.request.name && $scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
    };

    $scope.restore = function () {
        var name = $scope.request.name;
        if($scope.history.length>0){
            $scope.request.name = $scope.history.pop();
            if($scope.request.name === name){
                $scope.request.name = $scope.history.pop();
            }
        }else{
            $scope.request.name = null;
        }
    };



    $scope.copyText = function () {
        var subSearchText = tatApp.getSelectedText();
        if (subSearchText) {
            $scope.request.name = subSearchText;
        }
    };

    $scope.goto = function (name) {
        $scope.request.name = name;
    };


    $scope.search = function() {
        if ($scope.glossary && $scope.glossary[$scope.request.name]) {
            //found in glossary
            $log.debug('found in glossary:', $scope.request.name);

            //set values from glossary
            $scope.translation.term = $scope.glossary[$scope.request.name];
            $scope.selected.glossary = $scope.translation.term.name;
            //clear like
            $scope.translation.like = null;
            $scope.selected.like = null;

            $scope.searchIcon = 'fa-search';

            
        } else {
            //search in dictionary
            $log.debug('new search:', $scope.request);
            $scope.searchIcon = 'fa-refresh fa-spin';

            $scope.translation = tatRest.search($scope.request,
                function objectsFound(translation) {

                    if (translation.term) {
                        $log.debug('found term:', translation.term);
                        $scope.searchIcon = 'fa-search-plus';

                        if (translation.like) {
                            $scope.selected.like = translation.term.name;
                            $scope.selected.glossary = null;
                        }

                    } if (translation.like) {
                        $log.debug('found like:', translation.like);
                        $scope.searchIcon = 'fa-search';

                        $scope.selected.like = translation.like[0].name;
                    }

                }, function objectsNotFound(result) {
                    $log.debug('not found:', result);
                    $scope.searchIcon = 'fa-search-minus';

                });
        }

        if($scope.history.length === 0 || $scope.history[$scope.history.length - 1]!==$scope.request.name) {
            $scope.history.push($scope.request.name);
        }

    };


    $scope.hasGlossary = function(){
        return tatApp.size($scope.glossary)>0;
    };

    $scope.inGlossary = function(){
        return $scope.glossary && $scope.translation.term && $scope.translation.term === $scope.glossary[$scope.translation.term.name];
    };

    $scope.deleteGlossary = function () {
        tatGlossary.delete(postId, $scope.translation.term);
    };

    $scope.copyGlossary = function () {
        if($scope.selected.glossary) {
            $scope.request.name = $scope.selected.glossary;
        }else if($scope.glossary && $scope.glossary[$scope.request.name]){
            $scope.selected.glossary = $scope.request.name;
        }
    };

    $scope.saveGlossary = function () {
        if($scope.translation.term){
            tatGlossary.save(postId, $scope.text, $scope.translation.term, function() {
                $log.debug('selected in glossary:', $scope.translation.term.name);
                $scope.selected.glossary = $scope.translation.term.name;
            });
        }

    };


    var searchWord = null;
    //searching
    $scope.$watch('request.name', function (text, oldText) {
        if (text && text !== oldText) {
            searchWord = text;
            $timeout(function () {
                if (searchWord === $scope.request.name) {
                    $scope.search();
                }
            }, 1200);
        }
    });

    //change selectbox

    $scope.selectLike = function (name) {
        $scope.translation.term = tatApp.inArray($scope.translation.like, name );
        $scope.selected.glossary = $scope.glossary[name] || null;
    };

    $scope.selectGlossary = function (name) {
        $scope.translation.term = $scope.glossary[name];
        $scope.translation.like = null;
        $scope.selected.like = null;
    };

    //closing

    $scope.close = function (result) {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        tatGlossary.save(postId, $scope.text, $scope.translation.term);
        $uibModalInstance.close($scope.text);
    };


    if (data.text) {
        $scope.request.name = $scope.text = data.text;
        $scope.search();
    }

});