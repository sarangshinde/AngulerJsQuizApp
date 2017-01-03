'use strict';
(function(){
var quizApp = angular.module('QuizApp');

quizApp.factory('QuizMatrics',quizMatrics);


function quizMatrics(){
	
	var quizObj={
		quizActive:false,
		resultsActive: false,
		activateQuiz:activateQuiz

	};

	function activateQuiz(metric,state){
	if(metric === "quiz"){
        quizObj.quizActive = state;
    }else if(metric === "results"){
        quizObj.resultsActive = state;
    }else{
        return false;
    }
	}

	return quizObj;
};

})();