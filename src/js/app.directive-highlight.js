_tatApp.directive('highlight', function ($log, tatApp) {
    $log.debug('directive.highlight');
    return function (scope, element, attrs) {

            var progress = false;

            element.attr('id',tatApp.getId(attrs.name));

            scope.$watch('glossary["'+attrs.name+'"]', function (value) {
                if(value) {
                    //$log.debug('changed',attrs.name);
                    progress = value.$resolved === false;
                    element.toggleClass('tat-highlight-process', progress);
                    element.toggleClass('tat-highlight', !progress);
                    element.toggleClass('tat-highlight-dirty', !value.id);
                }
            },true);

            element.on('click', function (ev) {
                scope.open(ev,attrs.name);
            });

            element.on('mouseover', function () {
                if(!progress) {
                    element.addClass('tat-highlight-over');
                }
            });

            element.on('mouseout', function () {
                element.removeClass('tat-highlight-over');
            });

    };
});
