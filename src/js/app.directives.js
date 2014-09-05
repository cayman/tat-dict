_dictApp.directive('dictWatch', function ($log, $modal, dictService, dictHistory, $compile) {
    $log.info('DictShowCtrl');
    return function (scope, elem, attrs) {
        var postId = attrs.dictWatch;
        var config = dictService.getConfig();
        scope.history = dictHistory.get(postId);

        elem.on('mouseup', function () {
            if (config.enabled && config.auto) {
                var text = dictService.getSelectedText();
                if (text && text.length < 100) {
                    dictService.openModal(postId, text);
                }
            }
        });

        scope.highlightOpen = function (id) {
            $log.info('highlightOpen', id);
            if (config.enabled) {
                scope.history.forEach(function (item) {
                    if (item.id == id) {
                        dictService.openModal(postId, item.name);
                    }
                });
            }
        };

        function highlight(item) {
            if (item && item.name) {
                var tag = '<a name="dic' + item.id + '" class="dict_word" ng-click="highlightOpen(' + item.id + ')">' + item.name + '</a>';
                var replaced = (item.name.length > 3) ?
                    elem.html().replace(new RegExp('\\s' + item.name, 'ig'), ' ' + tag) :
                    elem.html().replace(new RegExp('\\s' + item.name + '\\s', 'ig'), ' ' + tag + ' ');

                elem.html(replaced);
            }
        }

        scope.$watch('history', function (list, oldList) {
            if (list.length !== oldList.length) {
                $log.info('highlight items', scope.history.length);
                scope.history.forEach(highlight);
                $compile(elem.contents())(scope);
            }
        }, true);

    }
});

_dictApp.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on(attr.stopEvent, function (e) {
                e.stopPropagation();
            });
        }
    };
});
