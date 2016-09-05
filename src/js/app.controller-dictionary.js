_tatApp.controller('DictionaryCtrl', function ($log, $scope, $timeout, tatGlossary, tatRest, tatApp, $uibModalInstance, data) {
    $log.log('DictionaryCtrl');

    var postId = data.post;

    $scope.request = {};
    $scope.translation = {};
    $scope.selected = {};
    
    $scope.glossary = tatGlossary.get(postId);
    $scope.history = tatApp.getHistory();

    $scope.status = 4;


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

    $scope.copyLike = function () {
        if($scope.selected.like) {
            $scope.request.name = $scope.selected.like;
        }
    };

    $scope.goto = function (name) {
        $scope.request.name = name;
    };

    //change selectbox

    $scope.selectLike = function (name) {
        $scope.translation.term = $scope.translation.like ? $scope.translation.like.find(function(term) { return term.name === name }) : null;
        $scope.selected.glossary = $scope.glossary[name] || null;
    };

    $scope.selectGlossary = function (name) {
        $scope.translation.term = $scope.glossary[name];
        $scope.translation.like = null;
        $scope.selected.like = null;
    };


    $scope.search = function() {
        if ($scope.glossary && $scope.glossary[$scope.request.name]) {
            //found in glossary
            $log.debug('found in glossary:', $scope.request.name);
            $scope.status = 1;
            //set values from glossary
            $scope.selected.glossary = $scope.request.name;
            $scope.selectGlossary($scope.selected.glossary);

        } else {
            //search in dictionary
            $log.debug('new search:', $scope.request);

            $scope.translation = tatRest.search($scope.request,
                function objectsFound(translation) {

                    if (translation.term) {
                        $log.debug('found term:', translation.term);
                        if (translation.like && translation.like.length>1) {
                            $scope.status = 5;
                            $scope.selected.like = translation.term.name;
                            $scope.selected.glossary = null;
                        }else{
                            $scope.status = 4;
                            //clear term copy from like
                            translation.like = null;
                            $scope.selected.like = null;
                        }

                    } else if (translation.like && translation.like.length>0) {
                        $scope.status = 3;
                        $log.debug('found like:', translation.like);

                        $scope.selected.like = translation.like[0].name;
                        $scope.selectLike($scope.selected.like);
                    } else {
                        $scope.status = 2;
                    }

                }, function objectsNotFound(result) {
                    $scope.status = 0;
                    $log.debug('not found:', result);

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