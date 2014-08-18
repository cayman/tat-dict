<div>
	<form ng-controller="DictCtrl">
		<input class="widefat" id="tatdict_widget_word" type="text" ng-model="request.name" ng-mousedown="copyText()" 
				placeholder="Cүзлек" style="width: 190px"/><br/>
		<select ng-model="result.description" size="5" style="width: 200px">
			<option ng-repeat="like in result.like"	value="{{ like.description }}" 
				ng-selected="{{like.id == result.id}}"
				title="{{like.description}}">{{like.name}}</option>			
		</select>
		<div ng-show="result.description" ng-bind-html="result.description"
			 style="font-size : smaller; overflow:auto; width: 200px; max-height: 200px; background-color: white;"></div>
	</form>
</div>