<?php $userId = get_current_user_id(); ?>
<script type="text/ng-template" id="tat_dictionary_modal.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек<span ng-if="text"> - {{ text }}</span></h4>
        </div>
        <div class="modal-body" stop-event="touchend">

            <div>
                <img ng-if="icon" ng-src="{{ images }}previous.png" ng-click="restore()"/>
                <input type="text" ng-model="request.name"
                       class="tat-search-input" ng-mousedown="copyText()"
                       ng-swipe-left="deleteSymbol()" ng-swipe-right="restore()"
                       placeholder="Языгыз"/>
                <img ng-if="icon" ng-src="{{ images }}{{ icon }}" ng-click="search()"/>
            </div>

            <div ng-if="out.like && out.like.length>0">
                <img ng-src="{{ images }}likes.png"/>
                <select ng-model="out.selected" size="5" style="width: 180px">
                    <option ng-repeat="term in out.like" value="{{ term.name }}"
                            ng-selected="{{term.id === out.term.id}}" ng-bind="term.name"/>
                </select>
            </div>

            <div ng-if="hasGlossary()">
                <img ng-src="{{ images }}glossary.png"/>
                <select ng-model="out.selected" style="width: 180px"
                        placeholder="Истәлек">
                    <option ng-repeat="(name, term) in glossary" value="{{ name }}"
                            ng-selected="{{term.id === out.term.id}}" ng-bind="name"/>
                </select>
            </div>

            <div ng-show="!out.term.parent_name" class="tat-search-result" ng-swipe-left="close()"
                 ng-swipe-right="close()">
                <p class="tat-search-description" ng-bind-html="out.term.description | tatDescription"></p>
            </div>

            <div ng-show="out.term.parent_name" class="tat-search-result" ng-swipe-left="close()" ng-swipe-right="close()">
                <textarea ng-model="out.term.description"<?php echo ($userId !== 1) ? ' readonly' : '' ?>></textarea>
                <h4>мөнәсәбәтле сүз</h4>
                <p class="tat-search-description" ng-bind-html="out.term.parent_description | tatDescription"></p>
            </div>

        </div>
<!--        <pre>{{ request | json }}</pre>-->
<!--        <pre>{{ out.term | json }}</pre>-->
        <div class="modal-footer" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">Ябырга</button>
            <?php if ($userId > 0): ?>
                <button type="button" ng-if="text" class="btn btn-default" data-dismiss="modal" ng-click="save()">Сакларга</button>
                <button type="button" ng-if="inGlossary()" class="btn btn-default" data-dismiss="modal" ng-click="delete()">Ташларга</button>
            <?php endif; ?>

        </div>
    </div>
</script>