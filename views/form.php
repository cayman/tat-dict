<script type="text/ng-template" id="dictModalContent.html">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек<span ng-if="request.title"> - {{ request.title }}</span></h4>
        </div>
        <div class="modal-body">
            <form>
                <table>
                    <tr>
                        <td colspan="2">
                            <input class="widefat" id="tatdict_widget_word" type="text" ng-model="request.name" ng-mousedown="copyText()"
                                   placeholder="Языгыз" style="width: 180px"/><br/>
                            <select ng-model="result.name" size="5" style="width: 180px">
                                <option ng-repeat="likeItem in result.like"	value="{{ likeItem.name }}"
                                        ng-selected="{{likeItem.id == result.id}}"
                                        title="{{likeItem.description}}">{{ likeItem.name }}</option>
                            </select>
                        </td>
<!--                        <td>-->
<!--                            <div>Сорау</div>-->
<!--                            <select size="5" style="width: 180px">-->
<!--                                <option ng-repeat="historyItem in history"	value="{{ historyItem.title }}"-->
<!--                                        ng-selected="{{historyItem.name == result.name}}">-->
<!--                                    {{ historyItem.title }}<span ng-if="historyItem.name"> ({{ historyItem.name }})</span></option>-->
<!--                            </select>-->
<!--                        </td>-->
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div ng-show="meaning.description" ng-bind-html="meaning.description"  style="font-size: smaller; overflow:auto; max-height: 400px;">
                            </div>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="save()">Сакларга</button>
            <button type="button" class="btn btn-warning" data-dismiss="modal" ng-click="close()">Ябырга</button>

        </div>
    </div>
</script>

<div ng-controller="DictHandlerCtrl">

    <input type="checkbox" ng-model="dictConfig.enabled"/> Кабызган<br/>

    <div ng-show="dictConfig.enabled" ng-style="dictConfig.blockStyle" ng-click="dictOpen()" ng-tape="dictOpen()">
        <div ng-style="dictConfig.textStyle" >Cүзлек</div>
    </div>
</div>
