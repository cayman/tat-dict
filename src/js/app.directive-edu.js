_tatApp.directive('tatEdu', function ($filter, $log, $compile, tatApp) {
    $log.debug('tat-edu');

    function colspan(fieldValue) {
        return fieldValue && (( fieldValue.colspan || fieldValue.cols ) > 1)
            ? ' colspan="' + ( fieldValue.colspan || fieldValue.cols ) +'"' : '';
    }

    function rowspan(fieldValue) {
        return fieldValue && (( fieldValue.rowspan || fieldValue.rows ) > 1 )
            ? ' rowspan="' + ( fieldValue.rowspan || fieldValue.rows) +'"' : '';
    }

    function cell(tag, fieldValue, fieldClass, ngClick) {
        var value = fieldValue ? ( fieldValue.text || fieldValue.name || fieldValue ) : null;

        html = '<' + tag;
        if (fieldClass) html += ' class="' + fieldClass + '"';
        html += colspan(fieldValue);
        html += rowspan(fieldValue);
        html += ngClick ? ' ng-click ="' + ngClick + '"' : "";
        html += '>';
        html += value ? value : '-';
        html += '</' + tag + '>';
        return html;
    }

    function th(fieldValue, fieldClass, ngClick) {
        return cell('th', fieldValue, fieldClass, ngClick);
    }

    function td(fieldValue, fieldClass, ngClick) {
        return cell('td', fieldValue, fieldClass, ngClick);
    }

    return {
        restrict: 'E',
        link: function (scope, element, attr) {

            function getDoc() {
                var raw = element.html().trim()
                    .replace(new RegExp('<br>[\\n]', 'ig'), '\n');
                try {
                    return jsyaml.load(raw);

                } catch (except) {
                    $log.debug(except);
                    return null;
                }
            }

            var doc = getDoc();
            var html = '';

            if (doc) {

                var cols = attr.cols ? attr.cols.split(",") : ['name', 'value'];
                var detail = attr.detail ? attr.detail : 'detail';

                $log.debug(cols);

                html += '<table class="tat-rule-grammar">';

                if (doc.caption) {
                    html += '<caption>' + doc.caption + '</caption>';
                }

                tatApp.forEach(doc, function (headName, headData) {

                    html += '<thead>';

                    tatApp.forEach(headData, function (rowName, rowValue, rowPosition) {
                        html += '<tr>';
                        tatApp.forEach(rowValue, function (fieldName, fieldValue, fieldPosition) {
                            html += th(fieldValue);
                        });
                        html += '</tr>';
                    });

                    html += '</thead>';

                }, 'head');

                tatApp.forEach(doc, function (blockName, blockData) {

                    html += '<tbody>';

                    tatApp.forEach(blockData, function (rowName, rowValue, rowPosition) {
                        var link = null;
                        html += '<tr>';
                        if (angular.isObject(rowValue)) {
                            //several cells in row
                            cols.forEach(function (col) {
                                var cell = rowValue[col];
                                if (!link && rowValue[detail]) {
                                    link = blockName + '_' + rowName;
                                    scope[link] = false;
                                    $log.debug(link);
                                    html += td(cell, 'link', link + ' = !' + link);
                                } else {
                                    html += td(cell);
                                }
                            });

                            if (rowValue[detail]) {
                                html += '</tr>';
                                html += '<tr ng-show="' + link + '">';
                                html += '<td colspan="' + cols.length + '">' + rowValue[detail] + '</td>';
                            }

                        } else {
                            //one sell in row
                            if (rowPosition === 1) {
                                html += '<th colspan="' + cols.length + '">' + rowValue + '</th>';
                            }
                            else {
                                html += '<td colspan="' + cols.length + '">' + rowValue + '</td>';
                            }

                        }

                        html += '</tr>';

                    });

                    html += '</tbody>';

                }, 'body');

                html += '</table>';

                element.html(html);
                $compile(element.contents())(scope);

            }
        }
    };
});