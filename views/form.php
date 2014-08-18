<script type="text/ng-template" id="dictModalContent.html">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек</h4>
        </div>
        <div class="modal-body">
            <form>
                <input class="widefat" id="tatdict_widget_word" type="text" ng-model="request.name" ng-mousedown="copyText()"
                       placeholder="Языгыз" style="width: 180px"/><br/>
                <select ng-model="result.description" size="5" style="width: 180px">
                    <option ng-repeat="like in result.like"	value="{{ like.description }}"
                            ng-selected="{{like.id == result.id}}"
                            title="{{like.description}}">{{like.name}}</option>
                </select>
                <div ng-show="result.description" ng-bind-html="result.description"  style="overflow:auto; max-height: 400px;"></div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">Закрыть</button>
        </div>
    </div>
</script>

<div>
    <div ng-controller="DictShowCtrl">
        <button ng-click="showDictionary()">Cүзлек</button>
    </div>
</div>