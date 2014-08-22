<script type="text/ng-template" id="dictModalContent.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="save()">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек<span ng-if="request.title"> - {{ request.title }}</span></h4>
        </div>
        <div class="modal-body" stop-event="touchend">
                <div>
                    <input class="widefat" id="dict_word" type="text" ng-model="request.name"
                           ng-mousedown="copyText()"
                           ng-swipe-left="deleteSymbol('#dict_word')" ng-swipe-right="focus('#dict_word')"
                           placeholder="Языгыз" style="width: 180px"/><br/>
                    <select ng-model="result.selected" size="5" style="width: 180px">
                        <option ng-repeat="like in result.like"	value="{{ like.id }}"
                                ng-selected="{{like.id === result.item.id}}"
                                title="{{like.description}}">{{ like.name }}</option>
                    </select><br/>
                    <select ng-model="result.selected" style="width: 180px">
                        <option ng-repeat="item in history"	value="{{ item.id }}"
                                title="{{item.description}}">{{ item.name }}</option>
                    </select>
                </div>
                <div ng-show="result.item.description" ng-bind-html="result.item.description"
                     ng-swipe-left="close()" ng-swipe-right="save()"
                     style="font-size: smaller; overflow:auto; max-height: 300px;" dict-watch>
                </div>
         </div>
        <div class="modal-footer" ng-swipe-left="close()" ng-swipe-right="save()">
            <button type="button" class="btn btn-warning" data-dismiss="modal" ng-click="close()">Ябырга</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="save()">Сакларга</button>
        </div>
    </div>
</script>

<div ng-controller="DictHandlerCtrl">

    <input type="checkbox" ng-model="dictConfig.enabled"/> Кабызган<br/>

    <div ng-show="dictConfig.enabled" ng-style="dictConfig.blockStyle" ng-click="dictOpen()" ng-swipe-right="dictOpen()">
        <div ng-style="dictConfig.textStyle" >Cүзлек</div>
    </div>
</div>
