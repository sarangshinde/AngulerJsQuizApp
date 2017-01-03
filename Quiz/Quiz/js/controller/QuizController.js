'use strict';

(function(){
var app =angular.module('QuizApp');

app.controller('QuizCtrl',['$scope','DataService','QuizMatrics',quizController]);

function quizController($scope,DataService,QuizMatrics){
	var quizControllerData=this;
	quizControllerData.quizMatrics=QuizMatrics;
	quizControllerData.dataService=DataService;
	quizControllerData.activeQuestion=0;
	quizControllerData.setActiveQuestion=setActiveQuestion;
	quizControllerData.questionAnswered=questionAnswered;
	quizControllerData.selectAnswer=selectAnswer;
	quizControllerData.selectAnswer=finaliseAnswers;
	var numQuestionsAnswered = 0;
	 quizControllerData.error = false; 
	 quizControllerData.finalise = false;


function setActiveQuestion(index)
{

	if(index===undefined){
		var breakOut = false;	
		 var quizLength = DataService.quizQuestions.length-1;
		  while(!breakOut)
 		{
 			quizControllerData.activeQuestion = quizControllerData.activeQuestion < quizLength?
 										++quizControllerData.activeQuestion:0;	

				if(quizControllerData.activeQuestion === 0){
                        quizControllerData.error = true;
                    }

 			if(DataService.quizQuestions[quizControllerData.activeQuestion].selected === null){
        	breakOut = true;
   		 	}
 		}
	}
	else{
        quizControllerData.activeQuestion = index;
    }

}
 
function questionAnswered(){   
    if(DataService.quizQuestions[quizControllerData.activeQuestion].selected !== null){
        numQuestionsAnswered++;
     quizControllerData.setActiveQuestion();
var quizLength = DataService.quizQuestions.length-1;
     if(numQuestionsAnswered >= quizLength){
                    
    for(var i = 0; i < quizLength; i++){
 
        if(DataService.quizQuestions[i].selected === null){
            quizControllerData.setActiveQuestion(i);
            return;
        }
    }
 
     quizControllerData.error = false;
     quizControllerData.finalise = true;
     return;
  
}
    }
}

function selectAnswer(index){

	if(index === undefined){
        var breakOut = false;
 
        var quizLength = DataService.quizQuestions.length - 1;
 
        while(!breakOut){
 
            if(DataService.quizQuestions[quizControllerData.activeQuestion].selected === null){
                breakOut = true;
            }
 
        }
    }else{
        quizControllerData.activeQuestion = index;
    }
   
}

function finaliseAnswers(){
 
    quizControllerData.finalise = false;
    numQuestionsAnswered = 0;
    quizControllerData.activeQuestion = 0;
    quizMetrics.markQuiz();
    quizMetrics.activateQuiz("quiz", false);
    quizMetrics.activateQuiz("results", true);
    
}

} //end of controller function




})();