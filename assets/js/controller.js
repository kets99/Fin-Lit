$(document).ready(function () {
	
	var questionNumber=0;
	var questionBank=new Array;
	var firstQuestionBank=new Array;
	// var secondQuestionBank = new Array;
	var stage="#game1";
	var stage2=new Object;
	var questionLock=false;
	var numberOfQuestions;
	var result=new Array();
	var resultNumber=0;
	var current_level;
	var cl = 0;
	var questionNosSecond = [];

	var obj = {
		table: []
	};

	var user_category= 'beginner';

	var flag_1 = 0; // 0 for the initiation quiz, 1 for the second one


	//question bank[i][5] will store the id of the correct answer 
	var score=0;

	generate_firstquiz = function(length) {
		document.getElementById('topbar').innerHTML = "Initiation Quiz";
		var arr = [];
		var n;
		for(var i=0; i<3; i++)
		{
			do
				n = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		for(var i=3; i<6; i++)
		{
			do
				n = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		for(var i=6; i<9; i++)
		{
			do
				n = Math.floor(Math.random() * (26 - 19 + 1)) + 19;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		return arr;
	}

	/* generate_beginner = function(length) {
		var arr = [];
		var n;
		for(var i=0; i<4; i++)
		{
			do
				n = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		for(var i=4; i<7; i++)
		{
			do
				n = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		for(var i=7; i<9; i++)
		{
			do
				n = Math.floor(Math.random() * (26 - 19 + 1)) + 19;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		return arr;
	}

	generate_intermediate = function(length) {
		var arr = [];
		var n;

		for(var i=0; i<6; i++)
		{
			do
				n = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		for(var i=6; i<9; i++)
		{
			do
				n = Math.floor(Math.random() * (26 - 19 + 1)) + 19;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		return arr;
	}

	generate_expert = function(length) {
		var arr = [];
		var n;
		for(var i=0; i<1; i++)
		{
			do
				n = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		for(var i=2; i<9; i++)
		{
			do
				n = Math.floor(Math.random() * (26 - 19 + 1)) + 19;
			while(arr.indexOf(n) !== -1)
		arr[i] = n;
		}
		return arr;
	} */

	$.getJSON('activity.json', function(data) {
		var arr = generate_firstquiz(3);
		var q_number;
		var num = 0;
		for(i=0;i<data.quizlist.length;i++){ 
			console.log(arr)
			q_number = Number(data.quizlist[i].q_id);
			console.log("okay1")
			console.log(q_number)
			if(arr.indexOf(q_number)>=0)
			{
				console.log("okay2")
				questionBank[num]=new Array;
				questionBank[num][0]=data.quizlist[i].question;
				questionBank[num][1]=data.quizlist[i].option1;
				questionBank[num][2]=data.quizlist[i].option2;
				questionBank[num][3]=data.quizlist[i].option3;
				questionBank[num][4]=data.quizlist[i].option4;
				questionBank[num][5]=data.quizlist[i].correct; 
				num++;
			}
		}
		console.log(questionBank)
		numberOfQuestions=questionBank.length; 
		
		displayQuestion();
	})//gtjson
	
	
	function displayQuestion() {

		console.log(questionNumber);
		console.log(questionBank[questionNumber]);

		q1=questionBank[questionNumber][1];
		q2=questionBank[questionNumber][2];
		q3=questionBank[questionNumber][3];
		q4=questionBank[questionNumber][4];

		$(stage).append('<div class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="option">'+q1+'</div><div id="2" class="option">'+q2+'</div><div id="3" class="option">'+q3+'</div><div id="4" class="option">'+q4+'</div>');

		$('.option').click(function() {
			if(questionLock==false) {
				questionLock=true;	

				//correct answer
				if(this.id==questionBank[questionNumber][5]) {
					$(stage).append('<div class="feedback1">CORRECT</div>');
					result[resultNumber] = 1;
					resultNumber++;
					score++;
				}

				//wrong answer	
				if(this.id!=questionBank[questionNumber][5]) {
					$(stage).append('<div class="feedback2">WRONG</div>');
					result[resultNumber] = 0;
					resultNumber++;
				}
				setTimeout(function(){changeQuestion()},1000);
			}
		})

	}//display question

		
	function changeQuestion() {

		questionNumber++;
		console.log(questionNumber);

		if(stage=="#game1"){stage2="#game1";stage="#game2";}
			else{stage2="#game2";stage="#game1";}

		if(flag_1 == 0) {
			if(questionNumber<numberOfQuestions){displayQuestion();}else{displayFinalSlide();}
		}
		else {
			if(questionNumber>=4) {
				if(current_level == 'expert') {
					cl = 2;
				}
				if(current_level == 'intermediate') {
					cl = 1;
				}
				if(current_level == 'beginner') {
					cl = 0;
				}
				var xhttp3 = new XMLHttpRequest();
				xhttp3.open("GET", "/fuzzy?score="+score+"&cl="+cl, true);
				xhttp3.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						// console.log(this.responseText);
						if(this.responseText == 0)
						{
							current_level = 'beginner';
						}
						if(this.responseText == 1)
						{
							current_level = 'intermediate';
						}
						if(this.responseText == 2)
						{
							current_level = 'expert';
						}
						$(stage).append('<div class="questionText">Your next question will be of level: '+current_level+'</div>');
						$(stage).append('<a href="javascript:getNextQuestion();" class="btn btn-light btn-custom-2 mt-4"> Show next question </a>');
						console.log(result);
					}
				}
				xhttp3.send();
				console.log("Running fuzzy script"); 
			}
			else { 	displayQuestion();	}
		}

		$(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
		$(stage).animate({"right": "0px"},"slow", function() {$(stage).css('right','0px');questionLock=false;});

	}//change question

	function displayFinalSlide() {

		var xhttp = new XMLHttpRequest();
		var xhttp2 = new XMLHttpRequest();

		function reqListener (data) {
			user_category = this.responseText;
			console.log(user_category);
			current_level = user_category.trim();
			if(current_level == 'e') {
				current_level = 'expert';
			}
			if(current_level == 'i') {
				current_level = 'intermediate';
			}
			if(current_level == 'b') {
				current_level = 'beginner';
			}
			// document.getElementById("user_value").innerHTML = current_level;
		}

		xhttp.addEventListener("load", reqListener);
		xhttp.open("GET", "/ip?q1="+result[0]+'&q2='+result[1]+'&q3='+result[2]+'&q4='+result[3]+'&q5='+result[4]+'&q6='+result[5]+'&q7='+result[6]+'&q8='+result[7]+'&q9='+result[8], true);
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log("works");
				if(this.responseText == 'e')
				{
					user_category = 'expert';
				}
				if(this.responseText == 'i')
				{
					user_category = 'intermediate';
				}
				if(this.responseText == 'b')
				{
					user_category = 'beginner';
				}

				new Promise(resolve => { 
					setTimeout(function() { 
						if(this.responseText == 'e')
						{
							user_category = 'expert';
						}
						if(this.responseText == 'i')
						{
							user_category = 'intermediate';
						}
						if(this.responseText == 'b')
						{
							user_category = 'beginner';
						}
						$(stage).append('<div class="questionText">You have finished the quiz!<br><br>Total questions: '+numberOfQuestions+'<br>Correct answers: '+score+'<br>Your current level is '+current_level+'</div><br><br>');
						$(stage).append('<a href="javascript:generate_secondquiz();" class="btn btn-light btn-custom-2 mt-4"> Take the second quiz </a>');
					}, 2000); 
				}); 
				var d = new Date();
 				d.setTime(d.getTime() + (20*24*60*60*1000));
                var expires = "expires="+ d.toUTCString();
                console.log(expires) ; 
				document.cookie = "user_category="+user_category +expires  ; 			
				console.log("user_category is : "+user_category);
				xhttp2.open("GET", "http://localhost:3000/updateusercat?uc="+user_category, true);
				xhttp2.send();
			}
		};
		xhttp.send();

	}//display final slide

	generate_secondquiz = function(length) {
		var nbeg = 0, nint = 0 , nexp = 0;
		var n;
		// var secondQuestionBank = new Array();
		document.getElementById('topbar').innerHTML = "Second Quiz";
		firstQuestionBank = questionBank;
		questionBank = new Array;		// Empyting questionBank, storing it in firstQuestionBank
		$(stage).children("div").remove();	// Remove Final Slide stuff before moving to the second quiz
		$(stage).children("a").remove();
		
		if(current_level == 'beginner') {
			nbeg = 2;	nint = 2;
			for(i=0; i<2; i++) {
				do
					n = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
			for(i=2; i<4; i++) {
				do
					n = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}
		else if(current_level == 'intermediate') {
			nint = 2, nexp = 2;
			for(i=0; i<2; i++) {
				do
					n = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
			for(i=2; i<4; i++) {
				do
					n = Math.floor(Math.random() * (26 - 19 + 1)) + 19;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}
		else if(current_level == 'expert') {
			nint = 1; nexp = 3;
			do
				n = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[0] = n;
			for(i=1; i<4; i++) {
				do
					n = Math.floor(Math.random() * (26 - 19 + 1)) + 19;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}

		console.log(questionNosSecond);

		$.getJSON('activity.json', function(data) {

			for(i=0; i<4; i++) {
				questionBank[i]=new Array;
				questionBank[i][0]=data.quizlist[questionNosSecond[i]-1].question;
				questionBank[i][1]=data.quizlist[questionNosSecond[i]-1].option1;
				questionBank[i][2]=data.quizlist[questionNosSecond[i]-1].option2;
				questionBank[i][3]=data.quizlist[questionNosSecond[i]-1].option3;
				questionBank[i][4]=data.quizlist[questionNosSecond[i]-1].option4;
				questionBank[i][5]=data.quizlist[questionNosSecond[i]-1].correct; 
				console.log(questionBank[i]);
			}

		})//gtjson

		flag_1 = 1;		// for the second quiz
		questionNumber = 0;
		score = 0;
		result = new Array();
		resultNumber = 0;
		setTimeout(displayQuestion, 1500);
	}

	getNextQuestion = function(length) {
		var n;
		console.log("Number of questions displayed until now: "+questionNumber);
		$(stage).children("div").remove();
		$(stage).children("a").remove();

		if(current_level == 'beginner') {
			do
				n = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}
		else if(current_level == 'intermediate') {
			do
				n = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}
		else if(current_level == 'expert') {
			do
				n = Math.floor(Math.random() * (26 - 19 + 1)) + 19;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}

		console.log(n);

		$.getJSON('activity.json', function(data) {
			questionBank[questionNumber]=new Array;
			questionBank[questionNumber][0]=data.quizlist[questionNosSecond[questionNumber]-1].question;
			questionBank[questionNumber][1]=data.quizlist[questionNosSecond[questionNumber]-1].option1;
			questionBank[questionNumber][2]=data.quizlist[questionNosSecond[questionNumber]-1].option2;
			questionBank[questionNumber][3]=data.quizlist[questionNosSecond[questionNumber]-1].option3;
			questionBank[questionNumber][4]=data.quizlist[questionNosSecond[questionNumber]-1].option4;
			questionBank[questionNumber][5]=data.quizlist[questionNosSecond[questionNumber]-1].correct; 
			console.log(questionBank[questionNumber]);
		
		})//gtjson

		// set scores before proceeding to display question
		if(result[resultNumber-4]==1) {
			score = score-1;
		}
		setTimeout(displayQuestion, 1500);
	}

});//doc ready