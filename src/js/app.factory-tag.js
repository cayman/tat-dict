_tatApp.factory('tatTag', function ($log) {
    $log.debug('tatTag');

    function numAttr(name, value) {
        return value && value > 1 ? ' ' + name + '="' + value + '"' : '';
    }

    function attr(name, value) {
        return value ? ' ' + name + '="' + value + '"' : '';
    }

    function attributes(params) {
        return attr('id', params.id) + attr('name', params.name) + attr('class', params.class) +
            numAttr('colspan', params.colspan) + numAttr('rowspan', params.rowspan) +
            attr('ng-click', params.ngClick);
    }

    function tag(name, value, attrs) {
//        $log.debug('tag',name,value,attrs );
        return '<' + name + (attrs ? attributes(attrs) : '') + '>' + (value ? value : '') + '</' + name + '>';
    }

    return {
        tag: tag,
        th: function (value, attrs) {
            return tag('th', value, attrs);
        },
        td: function (value, attrs) {

            return tag('td', value, attrs);
        }
    };

});
