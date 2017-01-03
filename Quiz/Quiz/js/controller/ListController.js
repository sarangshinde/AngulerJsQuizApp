'use strict';
(function(){
var app=angular.module('QuizApp');

//app.controller('ListCtrl',listController);
app.controller('ListCtrl', ['$scope','QuizMatrics','DataService', listController]);

function listController($scope,QuizMatrics,DataService)
{
	var listControllerData=this;

	listControllerData.data=DataService.turtlesData;
	listControllerData.activeTurtle={};
	listControllerData.changeActiveTurtle = changeActiveTurtle;
	listControllerData.search="";
    listControllerData.quizActive=false;
	listControllerData.quizMatrics=QuizMatrics;

	listControllerData.activateQuiz=activateQuiz;
	function changeActiveTurtle(index){
		listControllerData.activeTurtle=index;
	}

	function activateQuiz(){

		//var quizMatricsObj=quizMatrics();
		listControllerData.quizMatrics.activateQuiz("quiz", true);
		//return quizMatricsObj;
	}

};


})();