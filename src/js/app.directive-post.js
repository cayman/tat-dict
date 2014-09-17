_tatApp.directive('tatPost', function ($log, $modal, tatService, tatGlossary, tatHighlight, $compile) {
    $log.debug('tat-post');

    return function (scope, elem, attrs) {
        var postId = attrs.tatPost;
        var config = tatService.getConfig();
        scope.glossary = tatGlossary.get(postId);

        elem.on('mouseup', function () {
            if (config.enabled && config.auto) {
                var text = tatService.getSelectedText();
                if (text && text.length < 100) {
                    tatService.openDictionary(postId, text);
                }
            }
        });

        scope.search = function (text) {
            $log.info('open dialog', text);
            if (config.enabled && text) {
                tatService.openDictionary(postId, text);
            }
        };


        scope.$watch('glossary', function (list, oldList) {
            if (list.length !== oldList.length) {
                $log.info('highlight terms', scope.glossary.length);
                scope.glossary.forEach(function (term) {
                    tatHighlight.highlight(elem, term, 'search');
                });
                $compile(elem.contents())(scope);
            }
        }, true);

    };
});
