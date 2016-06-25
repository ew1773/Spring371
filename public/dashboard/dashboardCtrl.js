/* global dashboardCtrl */
(function () {
  angular.module('DashBoard').controller('dashboardCtrl', function ($scope, $mdDialog, $interval, $mdMedia, getPins) {

    //start of dialog ctrl
//     $scope.fork = {
//     background: 'url(fork.jpg)'
// };
    $scope.meals = [];
    $scope.ingredients = [];
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.jsonpTest = function () {
      $scope.result = getPins.query(function (response) {
        console.log(response);
      });
    }

    $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('AHHH! Area out of SCOPE!!')
        .textContent('We plan to add this area later!')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };

    $scope.showPlan = function (ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
        controller: DialogController,
        controllerAs: 'ctrl',
        templateUrl: '/dialogs/plan.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
        .then(function (plan) {
          $scope.meals.push(plan);
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.showAdd = function (ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
        controller: addDialogController,
        controllerAs: 'addCtrl',
        templateUrl: '/dialogs/add.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
        .then(function (newIngredient) {
          $scope.ingredients.push(newIngredient);
          console.log("newIngredient: ", newIngredient)
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    function DialogController($scope, $mdDialog, $timeout, $q, $log) {
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.planMeal = function (meal) {
        $mdDialog.hide(meal);
        console.log("meal: ", meal);
      };
      var cards = [];
      $scope.jsonpTest = function () {
        $scope.result = getPins.query(function (response) {
          console.log(response.data);
          cards.push.apply(cards, response.data);
          console.log("cards: ", cards);
        });
      }

      $scope.mealTimes = ('Breakfast | 2nd Breakfast | Lunch | Dinner').split(' | ').map(function (meal) {
        return { abbrev: meal };
      })
      $scope.cards = cards;
      $scope.plan = {
        date: '',
        numPeople: '',
        mealTime: '',
        selectedTags: [],
        foodSelected: []
      }
      //start of auto complete

      $scope.addFood = function($index)
      {
        $scope.plan.foodSelected.push(cards[$index])
        console.log("plan: ", $scope.plan)
      } 

      var self = this;
      self.readonly = false;
      self.selectedItem = null;
      self.searchText = null;
      self.querySearch = querySearch;
      self.tags = loadTags();
      self.selectedTags = [];
      self.numberChips = [];
      self.numberChips2 = [];
      self.numberBuffer = '';
      self.autocompleteDemoRequireMatch = true;
      self.transformChip = transformChip;
      /**
       * Return the proper object when the append is called.
       */
      function transformChip(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
          return chip;
        }
        // Otherwise, create a new one
        return { name: chip, type: 'new' }
      }
      /**
       * Search for tags.
       */
      function querySearch(query) {
        var results = query ? self.tags.filter(createFilterFor(query)) : [];
        return results;
      }
      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(tag) {
          return (tag._lowername.indexOf(lowercaseQuery) === 0) ||
            (tag._lowertype.indexOf(lowercaseQuery) === 0);
        };
      }
      function loadTags() {
        var tags = [
          {
            'name': 'Mexican',
            'type': 'Dinner'
          },
          {
            'name': 'Pasta',
            'type': 'Dinner'
          },
          {
            'name': 'Sandwiches',
            'type': 'Lunch'
          },
          {
            'name': 'Hot',
            'type': 'Breakfast'
          },
          {
            'name': 'Quick:15 min',
            'type': 'Dinner'
          }
        ];
        return tags.map(function (tag1) {
          tag1._lowername = tag1.name.toLowerCase();
          tag1._lowertype = tag1.type.toLowerCase();
          return tag1;
        });
      }
      // end of autocomplete
    };
    //end of dialog ctrl    


    function addDialogController($scope, $mdDialog) {
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.add = function (newIngredient) {
        $mdDialog.hide(newIngredient);
      };

      $scope.newIngredient = {
        category: '',
        name: ''
      };
      var self = this;
      // list of `state` value/display objects
      self.states = loadAll();
      self.selectedItem = null;
      self.searchText = null;
      self.querySearch = querySearch;
      // ******************************
      // Internal methods
      // ******************************
      /**
       * Search for states... use $timeout to simulate
       * remote dataservice call.
       */
      function querySearch(query) {
        var results = query ? self.states.filter(createFilterFor(query)) : [];
        return results;
      }
      /**
       * Build `states` list of key/value pairs
       */
      function loadAll() {
        var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
        return allStates.split(/, +/g).map(function (state) {
          return {
            value: state.toLowerCase(),
            display: state
          };
        });
      }
      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.value.indexOf(lowercaseQuery) === 0);
        };
      }

    }







  }) // end of 'dashboardCtrl' controller
})()