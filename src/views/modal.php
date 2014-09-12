<script type="text/ng-template" id="dictModalContent.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек<span ng-if="selectedText"> - {{ selectedText }}</span></h4>
        </div>
        <div class="modal-body" stop-event="touchend">
            <div>
                <input id="dict_word" type="text" ng-model="request.name"
                       class="widefat dict_search_input" ng-mousedown="copyText()"
                       ng-swipe-left="deleteSymbol('#dict_word')" ng-swipe-right="focus('#dict_word')"
                       placeholder="Языгыз"/><span ng-class="searchClass">&nbsp;</span><br/>

                <select ng-if="result.like && result.like.length"  ng-model="result.selected" size="5" style="width: 180px">
                    <option ng-repeat="like in result.like"	value="{{ like.id }}"
                            ng-selected="{{like.id === result.item.id}}" ng-bind="like.name"/>
                </select><span  ng-if="result.like && result.like.length" class="dpfx_like">&nbsp;</span>
                <br ng-if="result.like && result.like.length"/>

                <select ng-if="history && history.length" ng-model="result.selected" style="width: 180px"
                        placeholder="Истәлек">
                    <option ng-repeat="item in history"	value="{{ item.id }}"
                            ng-selected="{{item.id === result.item.id}}" ng-bind="item.name"/>
                </select><span ng-if="history && history.length" class="dpfx_history">&nbsp;</span>

            </div>
            <div ng-show="!result.item.parent_name" class="dict_search_result" ng-swipe-left="close()" ng-swipe-right="close()">
                <div class="dict_word_description" ng-bind-html="result.item.description"></div>
            </div>
            <?php $userId = get_current_user_id(); ?>
            <div ng-show="result.item.parent_name" class="dict_search_result" ng-swipe-left="close()" ng-swipe-right="close()">
                <textarea ng-model="result.item.description"<?php echo ($userId !== 1) ? ' readonly': '' ?>></textarea>
                <h4>мөнәсәбәтле сүз</h4>
                <div class="dict_word_description" ng-bind-html="result.item.parent_description"></div>
            </div>
        </div>
<!--        <pre>{{ request | json }}</pre>-->
<!--        <pre>{{ result.item | json }}</pre>-->
        <div class="modal-footer" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">Ябырга</button>
            <?php if($userId>0){ ?>
            <button type="button" ng-if="selectedText" class="btn btn-primary" data-dismiss="modal" ng-click="save()">Сакларга</button>
            <?php } ?>
        </div>
    </div>
</script>