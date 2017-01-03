'use strict';

describe('Quiz Controller behaviour on load',function(){

	beforeEach(module('QuizApp'));
	var dataService,quizMatrics,scope,quizController;
	beforeEach(inject(function($controller,$rootScope,DataService,QuizMatrics){

	scope =$rootScope.$new();
	quizController = $controller('QuizCtrl', {
				$scope:scope,
				quizMatrics:QuizMatrics,
				dataService:DataService
	});
	}));


	it('value of activeQuestion should be 0 intailly',function(){
		expect(quizController.activeQuestion).toEqual(0);;
	});
	
});



describe('Quiz Controller setActiveQuestion behaviour',function(){

	beforeEach(module('QuizApp'));
	var dataService,quizMatrics,scope,quizController;
	beforeEach(inject(function($controller,$rootScope,DataService,QuizMatrics){

	scope =$rootScope.$new();
	quizController = $controller('QuizCtrl', {
				$scope:scope,
				quizMatrics:QuizMatrics,
				dataService:DataService
	});
	}));


	it('value of activeQuestion should be 1 when setActiveQuestion is called first time',function(){
		quizController.setActiveQuestion();
		expect(quizController.activeQuestion).toEqual(1);;
	});

	it('value of activeQuestion should be 0 when previous activeQuestion value is 9 and setActiveQuestion is called ',function(){
		
		quizController.activeQuestion=9;
		quizController.setActiveQuestion();
		expect(quizController.activeQuestion).toEqual(0);;
	});


it('value of activeQuestion should be 2 when questions 0 and 1 allready selected and previous activeQuestion value is 9 and setActiveQuestion is called ',function(){
		quizController.dataService.quizQuestions[0].selected=true;
		quizController.dataService.quizQuestions[1].selected=true;
		quizController.activeQuestion=9;
		quizController.setActiveQuestion();
		expect(quizController.activeQuestion).toEqual(2);
	});
	
});
