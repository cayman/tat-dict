<?php $userId = get_current_user_id(); ?>
<script type="text/ng-template" id="tat_dictionary_modal.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек<span ng-if="text"> - {{ text }}</span></h4>
        </div>
        <div class="modal-body form form-horizontal" stop-event="touchend">

            <div class="form-group">
                <div class="input-group col-sm-12">
                    <span class="input-group-addon">
                        <i class="tat-icon fa fa-arrow-left" aria-hidden="true" ng-click="restore()"></i>
                    </span>
                     <input type="text" name="word" ng-model="request.name"
                           class="form-control tat-search-input" ng-mousedown="copyText()"
                           ng-swipe-left="deleteSymbol()" ng-swipe-right="restore()"
                           placeholder="Языгыз"/>
                    <span class="input-group-addon">
<!--                       <img ng-if="icon" ng-src="{{ images }}{{ icon }}" ng-click="search()" />-->
                       <i class="tat-icon fa {{ icon }}" aria-hidden="true" ng-click="search()"></i>
                    </span>
                </div>
            </div>

            <div class="form-group" ng-if="out.like && out.like.length>0">
                <div class="input-group col-sm-12">
                    <span class="input-group-addon">
                        <i class="tat-icon fa fa-hand-o-right " aria-hidden="true"></i>
                    </span>
                    <select class="form-control" ng-model="out.selected" style="width: 100%"

                            data-ng-attr-size="{{ out.like.length > 5 ? 5 : (out.like.length < 2 ? 2 : out.like.length) }}">
                        <option ng-repeat="term in out.like" value="{{ term.name }}"
                                ng-selected="{{term.id === out.term.id}}" ng-bind="term.name"></option>
                    </select>
                </div>
            </div>

            <div class="form-group" ng-show="out.term.parent_name" ng-cloak>
                <?php if ($userId == 1): ?>
                    <textarea  class="form-control" ng-model="out.term.description" rows="2" placeholder="Тәрҗемә"></textarea>
                <?php else: ?>
                    <textarea  class="form-control" ng-show="out.term.description && out.term.description.length>0"
                               ng-model="out.term.description" readonly></textarea>
                <?php endif; ?>
            </div>

            <div class="form-group" ng-show="out.term.parent_name">
                <h6 class="tat-search-linked">Мөнәсәбәтле сүз</h6>
                <div class="tat-search-description"
                     tat-description="out.term.parent_description" ng-swipe-right="close()"></div>
            </div>

            <div class="form-group" ng-hide="out.term.parent_name">
                <h6 class="tat-search-linked" ng-show="out.term.description && out.term.description.length>0">Тәрҗемә</h6>
                <div class="tat-search-description"
                     tat-description="out.term.description" ng-swipe-right="close()"></div>
            </div>
        </div>
<!--        <pre>{{ request | json }}</pre>-->
<!--        <pre>{{ out.term | json }}</pre>-->
        <div class="modal-footer" ng-swipe-left="close()" ng-swipe-right="close()">

            <div class="row">
                <div class="col-md-5 col-sm-5" style="float:left; width:40%">
                    <div class="input-group" ng-if="hasGlossary()">
                        <span class="input-group-addon">
                            <i class="tat-icon fa fa-book" aria-hidden="true"></i>
                        </span>
                        <select class="form-control" ng-model="out.selected"
                                placeholder="Истәлек">
                            <option ng-repeat="(name, term) in glossary" value="{{ name }}"
                                    ng-selected="{{term.id === out.term.id}}" ng-bind="name"/>
                        </select>
                    </div>
                </div>
                <div class="col-md-7  col-sm7-5">
                    <?php if ($userId > 0): ?>
                        <button type="button" ng-if="text" class="btn btn-default" data-dismiss="modal" ng-click="save()">Сакларга</button>
                        <button type="button" ng-if="inGlossary()" class="btn btn-default" data-dismiss="modal" ng-click="delete()">Ташларга</button>
                    <?php endif; ?>
                    <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">Ябырга</button>
                </div>
            </div>

        </div>
    </div>
</script>