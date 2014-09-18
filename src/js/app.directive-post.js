_tatApp.directive('tatPost', function ($log, $modal, tatService, tatGlossary, $compile) {
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

        scope.open = function (name) {
            $log.info('open dialog', name);
            if (config.enabled && name) {
                tatService.openDictionary(postId, name);
            }
        };


        function highlight(name) {
            $log.debug('highlight:', name);

            var start = '<a id="a' + tatService.hashCode(name) + '" ng-class="glossary[\'' + name + '\'] | highlightClass" ng-click="open(\'' + name + '\')">';
            var end = '</a>';
            var replaced = (name.length > 3) ?
                elem.html().replace(new RegExp('(\\s)(' + name + ')', 'ig'), '$1' + start + '$2' + end) :
                elem.html().replace(new RegExp('(\\s)(' + name + ')([,;!\\?\\.\\s])', 'ig'), '$1' + start + '$2' + end + '$3');

            elem.html(replaced);
        }


        scope.$watch('glossary', function (list, oldList) {
            if (list !== null) {
                for (var name in scope.glossary) {
                    if (scope.glossary.hasOwnProperty(name)) {
                        highlight(name);
                    }
                }
                $compile(elem.contents())(scope);
            }
        },true);

    };
});
