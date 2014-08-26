<script type="text/ng-template" id="dictModalContent.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек<span ng-if="request.text"> - {{ request.text }}</span></h4>
        </div>
        <div class="modal-body" stop-event="touchend">
            <div>
                <input class="widefat" id="dict_word" type="text" ng-model="request.name"
                       ng-mousedown="copyText()"
                       ng-swipe-left="deleteSymbol('#dict_word')" ng-swipe-right="focus('#dict_word')"
                       placeholder="Языгыз" class="dict_search_input"/><span ng-show="request.process">!Эзләү!</span><br/>
                <select ng-if="result.like && result.like.length"  ng-model="result.selected" size="5" style="width: 180px">
                    <option ng-repeat="like in result.like"	value="{{ like.id }}"
                            ng-selected="{{like.id === result.item.id}}"
                            title="{{like.description}}">{{ like.name }}</option>
                </select><br ng-if="result.like && result.like.length"/>
                <select ng-if="history && history.length" ng-model="result.selected" style="width: 180px"
                        placeholder="Истәлек">
                    <option ng-repeat="item in history"	value="{{ item.id }}"
                            title="{{item.description}}">{{ item.name }}</option>
                </select>
            </div>
            <div ng-show="!result.item.parent_name" class="dict_search_result" ng-swipe-left="close()" ng-swipe-right="save()">
                <div ng-bind-html="result.item.description" dict-watch="{{ post }}"></div>
            </div>

            <div ng-show="result.item.parent_name" class="dict_search_result" ng-swipe-left="close()" ng-swipe-right="save()">
                <div ng-bind-html="result.item.parent_description" dict-watch="{{ post }}"></div>
            </div>
        </div>
        <div class="modal-footer" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="save()">Сакларга</button>
        </div>
    </div>
</script>