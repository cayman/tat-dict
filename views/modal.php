<script type="text/ng-template" id="dictModalContent.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек<span ng-if="selectedText"> - {{ selectedText }}</span></h4>
        </div>
        <div class="modal-body" stop-event="touchend">
            <div>
                <input class="widefat" id="dict_word" type="text" ng-model="request.name"
                       ng-mousedown="copyText()"
                       ng-swipe-left="deleteSymbol('#dict_word')" ng-swipe-right="focus('#dict_word')"
                       placeholder="Языгыз" class="dict_search_input"/> <span ng-show="searchProcess">{{ searchProcess }}</span><br/>
                <select ng-if="result.like && result.like.length"  ng-model="result.selected" size="5" style="width: 180px">
                    <option ng-repeat="like in result.like"	value="{{ like.id }}"
                            ng-selected="{{like.id === result.item.id}}"
                            title="{{like.description}}">{{ like.name }}</option>
                </select><br ng-if="result.like && result.like.length"/>
                <select ng-if="history && history.length" ng-model="result.selected" style="width: 180px"
                        placeholder="Истәлек">
                    <option ng-repeat="item in history"	value="{{ item.id }}"
                            ng-selected="{{item.id === result.item.id}}"
                            title="{{item.description}}">{{ item.name }}</span></option>
                </select>

            </div>
            <div ng-show="!result.item.parent_name" class="dict_search_result" ng-swipe-left="close()" ng-swipe-right="close()">
                <div ng-bind-html="result.item.description" dict-watch="{{ currentPost }}"></div>
            </div>

            <div ng-show="result.item.parent_name" class="dict_search_result" ng-swipe-left="close()" ng-swipe-right="close()">
                <textarea ng-readonly="<?= get_current_user_id()!==1 ?>" ng-model="result.item.description" ng-disable></textarea>
                <h4>мөнәсәбәтле сүз</h4>
                <div ng-bind-html="result.item.parent_description" dict-watch="{{ currentPost }}"></div>
            </div>
        </div>
<!--        <pre>{{ request | json }}</pre>-->
<!--        <pre>{{ result.item | json }}</pre>-->
        <div class="modal-footer" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">Ябырга</button>
            <button type="button" ng-if="<?= get_current_user_id()>0 ?> && selectedText" class="btn btn-primary" data-dismiss="modal" ng-click="save()">Сакларга</button>
        </div>
    </div>
</script>