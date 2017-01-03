
'use strict';
describe('listController behaviour on page load', function () {

	 beforeEach(module('QuizApp'));

	 var listController,$scope,quizMatrics,dataService;
	 
	beforeEach(inject(function($controller,$rootScope,QuizMatrics,DataService){
		$scope = $rootScope.$new();
		//quizMatrics=QuizMatrics;
		listController = $controller('ListCtrl',{
							$scope:$scope,
							quizMatrics:QuizMatrics,
							dataService:DataService
						 });
		
	}));

/*	it('value of quizActive should be false intailly',function(){
		expect(listController.quizActive).toEqual(false);
	});*/

	it('value of activeTurtle should be empty intailly',function(){
		expect(listController.activeTurtle).toEqual({});
	});

it('value of search should be empty intailly',function(){
		expect(listController.search).toEqual("");
	});
	


	
});

describe('listController behaviour on different events',function(){
	beforeEach(module('QuizApp'));

	var listController,$scope,filter,quizMatrics,dataService;
	beforeEach(inject(function($controller,$rootScope,$filter,QuizMatrics,DataService){
		$scope=$rootScope.$new();
		filter=$filter;
		//quizMatrics=QuizMatrics;
		listController=$controller('ListCtrl', {
			$scope:$scope,
				quizMatrics:QuizMatrics,
				dataService:DataService
		});
	}));

	var leatherBackTurtle = {
            type: "Loggerhead Turtle",
            image_url: "http://i.telegraph.co.uk/multimedia/archive/02651/loggerheadTurtle_2651448b.jpg",
            locations: "Tropical and subtropical oceans worldwide",
            size: "90cm, 115kg",
            lifespan: "More than 50 years",
            diet: "Carnivore",
            description: "Loggerhead turtles are the most abundant of all the marine turtle species in U.S. waters. But persistent population declines due to pollution, shrimp trawling, and development in their nesting areas, among other factors, have kept this wide-ranging seagoer on the threatened species list since 1978. Their enormous range encompasses all but the most frigid waters of the world's oceans. They seem to prefer coastal habitats, but often frequent inland water bodies and will travel hundreds of miles out to sea."
        };

it('change activeTurtle to Leatherback Turtle when user clicks on Learn more button of Leatherback Turtle',function(){
		listController.changeActiveTurtle(leatherBackTurtle);
		expect(listController.activeTurtle).toEqual(leatherBackTurtle);
	});
/*
it('activate Quize when user clicks on Start Quiz button',function(){
		listController.activateQuiz();
		expect(listController.quizActive).toEqual(true);
	});*/

it('show Leatherback Turtle when user types name of it in search field',function(){

	var searchTurtle='Leatherback Turtle';
	listController.search=searchTurtle;
   
    var result  = filter('filter')(listController.data,listController.search);
    expect(result[0].type).toEqual(searchTurtle);
    });

});
