_dictApp.controller('dictHandlerCtrl', function ($log, $scope, dictService, dictHistory) {
    $log.info('DictHandlerCtrl:' + $scope.postId);
    $scope.dictConfig = dictService.getConfig();
    $scope.dictionary = null;

    $scope.$watch('postId', function (postId) {
        $log.info('postId:' + $scope.postId);
        $scope.dictionary = dictHistory.get(postId);
    });

    $scope.dictOpen = function (text) {
        if ($scope.dictConfig.enabled) {
            dictService.openModal($scope.postId, text || dictService.getSelectedText());
        }
    }

});


_dictApp.controller('dictCtrl', function ($log, $scope, $timeout, dictHistory, dictRest, dictService, $modalInstance, data) {
    $log.info('DictCtrl');

    $scope.currentPost = data.post;
    $scope.selectedText = null;
    $scope.searchClass = 'dpfx_empty';
    $scope.searching = false;
    $scope.history = dictHistory.get($scope.currentPost);

    $scope.request = {};
    $scope.result = {};

    if (data.text) {
        $scope.request.name = $scope.selectedText = data.text;
        search();
    }


    $scope.deleteSymbol = function () {
        if ($scope.request.name && $scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
    };


    $scope.copyText = function () {
        var subSearchText = dictService.getSelectedText();
        if (subSearchText) {
            $scope.request.name = subSearchText;
        }
    };

    var searchWord = null;
    //searching
    $scope.$watch('request.name', function (newWord, oldWord) {
        if (newWord && newWord != oldWord) {
            searchWord = newWord;
            $timeout(function () {
                if (searchWord === newWord) {
                    search();
                }
            }, 900);
        }
    });

    function search() {
        if ($scope.request.name) {
            $scope.result.item = dictService.inArray($scope.history, { name: $scope.request.name });

            if (!$scope.result.item) {
                $scope.searching = true;
                $scope.searchClass = 'dpfx_process';
                $log.debug('new search:', $scope.request);
                $scope.result = dictRest.search($scope.request,
                    objectsFound,
                    objectsNotFound);
            } else {
                $scope.searchClass = 'dpfx_history';
                $log.debug('selected:', $scope.result.item.id, $scope.result.item.name);
                $scope.result.selected = $scope.result.item.id;

            }
        } else {
            $scope.result.item = null;
        }
    }

    //Error ajax loaded
    function objectsNotFound(result) {
        $scope.searching = false;
        $scope.searchClass = 'dpfx_error';
        $log.debug('not found:', result);
    }

    //Success ajax loaded
    function objectsFound(value) {
        $scope.searching = false;
        var hasLike = (value.like && value.like.length);
        if (value.item || hasLike) {
            $log.debug('found:', $scope.result);
            $scope.result = value;
            $scope.searchClass = $scope.result.item ? 'dpfx_success' : 'dpfx_like';

            if ($scope.result.item && hasLike) {
                $scope.result.selected = $scope.result.item.id;
            }

        } else {
            objectsNotFound(value);
        }
    }

    //change selectbox

    function decodeDescription(value){
        return value;
//        atob(CryptoJS.AES.decrypt($scope.result.raw, 'zarur',{
//              mode: mode,
//                padding: padding
//            }
    }

    $scope.$watch('result.selected', function (newId, oldId) {
        if (newId && newId != oldId) {
            $scope.result.item = dictService.inArray($scope.result.like, { id: newId })
                || dictService.inArray($scope.history, { id: newId });

//            if($scope.result.item) {
//                if (!$scope.result.item._description && $scope.result.item.description ) {
//                    $scope.result.item._description = decodeDescription($scope.result.item.description);
//                }
//                if (!$scope.result.item._parent_description && $scope.result.item._parent_description ) {
//                    $scope.result.item._parent_description = decodeDescription($scope.result.item._parent_description);
//                }
//            }
        }
    });




    //closing

    $scope.close = function (result) {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        if ($scope.selectedText) {
            dictHistory.add($scope.currentPost, $scope.selectedText, $scope.result.item);
        }
        $modalInstance.close($scope.selectedText);
    };

});