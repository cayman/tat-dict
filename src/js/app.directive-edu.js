_tatApp.directive('tatEdu', function ($filter, $log, $compile, tatApp, tatTag) {
    $log.debug('tat-edu');

    function getDoc(html) {
        var raw = html.trim().replace(new RegExp('<br>[\\n]', 'ig'), '\n');
        try {
            return jsyaml.load(raw);

        } catch (except) {
            $log.debug(except);
            return null;
        }
    }

    return {
        restrict: 'E',
        link: function (scope, element, attr) {

            var doc = getDoc(element.html());
            var html = '';

            if (doc) {

                var cols = [];// = attr.cols ? attr.cols.split(',') : ['name', 'value'];
                var detail = attr.detail ? attr.detail : 'detail';

                html += '<table class="tat-rule-grammar">';

                if (doc.caption) {
                    html += '<caption>' + doc.caption + '</caption>';
                }

                tatApp.forEach(doc, function (headName, headData) {

                    html += '<thead>';

                    tatApp.forEach(headData, function (rowName, rowValue, rowPosition) {
                        html += '<tr>';
                        if (angular.isObject(rowValue)) {

                            tatApp.forEach(rowValue, function (fieldName, fieldValue, fieldPosition) {
                                if(rowPosition ===1){
                                    $log.debug('field',fieldName,fieldValue);
                                    cols = cols.concat(fieldName.split(','));
                                }
                                html += !angular.isObject(fieldValue) ?
                                    tatTag.th(fieldValue) :
                                    tatTag.th(fieldValue.text || fieldValue.name,
                                        {colspan: fieldValue.cols, rowspan: fieldValue.rows});

                            });

                        } else {

                            html += tatTag.th(rowValue, {colspan: cols.length});
                        }
                        html += '</tr>';
                    });


                    html += '</thead>';

                }, 'head');

                $log.debug('fields',cols);

                html += '<tbody>';

                tatApp.forEach(doc, function (blockName, blockData) {


                    tatApp.forEach(blockData, function (rowName, rowValue, rowPosition) {
                        var link = null;
                        html += '<tr>';
                        if (angular.isObject(rowValue)) {
                            //several cells in row
                            cols.forEach(function (col) {
                                var cell = rowValue[col];
                                var isString = !angular.isObject(cell);

                                if (!link && rowValue[detail]) {
                                    link = blockName + '_' + rowName;
                                    scope[link] = false;
                                    $log.debug(link);
                                    html += isString ?
                                        tatTag.td(cell, { class: 'link', ngClick: link + ' = !' + link }) :
                                        tatTag.td(cell.text || cell.name,
                                            { class: 'link', ngClick: link + ' = !' + link,
                                                colspan: cell.cols, cell: cell.rows });

                                } else {
                                    html += isString ?
                                        tatTag.td(cell) :
                                        tatTag.td(cell.text || cell.name, {colspan: cell.cols, cell: cell.rows});
                                }


                            });

                            if (rowValue[detail]) {
                                html += '</tr>';
                                html += '<tr ng-show="' + link + '">';
                                html += tatTag.td(rowValue[detail], { colspan: cols.length });
                            }

                        } else {
                            //one sell in row
                            html += tatTag.tag(rowPosition === 1 ? 'th' : 'td', rowValue,
                                {colspan: cols.length, class: rowPosition === 1 ? 'sub-title' : null });

                        }

                        html += '</tr>';

                    });


                }, 'body');

                html += '</tbody>';

                html += '</table>';

                element.html(html);
                $compile(element.contents())(scope);

            }
        }
    };
});