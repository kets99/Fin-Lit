$(document).ready(function () {

	var questionNumber = 0;		//Tracks number of questions displayed
	var questionBank = new Array();		//Will hold all questions as they are fetched from the JSON file
	
	var stage = "#game1";
	var stage2 = new Object;

	var questionLock=false;

	var result = new Array();		//Used to store results of the quiz: 1 for correct, 0 for incorrect
	var resultNumber = 0;
	
	var questionNosSecond = [];		//Stores all question numbers as they are fetched from the JSON file

	var cookie_arr = document.cookie.split("expires=");
	var current_level = (cookie_arr[0].split("="))[1];
	console.log("Cookie retrieved");
	console.log(current_level);

	var cl;		//0 for beginner, 1 for intermediate and 2 for expert: required for fuzzy

	//question bank[i][5] will store the id of the correct answer 
	var score = 0;		//For fuzzy
	
	var overall_score = 0;

	var timer_clock = 30;
		
	//For displaying each question
	function displayQuestion() {

		console.log(questionNumber);
		console.log(questionBank[questionNumber]);

		var flag = 0;	//To check when an option was pressed
		var flag_correct = 0; //To check if the option selected was correct

		q1=questionBank[questionNumber][1];
		q2=questionBank[questionNumber][2];
		q3=questionBank[questionNumber][3];
		q4=questionBank[questionNumber][4];
		explanation=questionBank[questionNumber][6];
		hint=questionBank[questionNumber][7];

		$(stage).append('<div class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="option">'+q1+'</div><div id="2" class="option">'+q2+'</div><div id="3" class="option">'+q3+'</div><div id="4" class="option">'+q4+'</div>');

		if(typeof(hint)==='string') {
			$(stage).append('<br><br><div class="hintButton"> Hint! <span class="hint">'+hint+'</span> </div>');
		}

		function onTimer() {
			timer.innerHTML = "Timer: " + timer_clock + " seconds";
			timer_clock--;
			console.log(timer_clock);
			if (timer_clock < 0) {
				alert('Time\'s up');
				timer_clock = 30;	//Rest but no scores
				return;
			}
			else if(flag == 1) {	//An option was selected hence, stop and rest the timer
				
				if(flag_correct == 1) {		//The correct option was selected
					if(timer_clock>=21 && timer_clock<=30) {	//Answered within the first 10 seconds
						overall_score = overall_score + 15;
					} else if(timer_clock>=11 && timer_clock<=20) {		//Took 10 to 20 seconds
						overall_score = overall_score + 10;
					} else if(timer_clock>=1 && timer_clock<=10) {		//Took 20 to 30 seconds
						overall_score = overall_score + 5;
					} else {
						//Took more than 30 seconds, no score awarded, do nothing
					}
				}

				timer_clock = 30;
				timer.innerHTML = "Timer";
				return;
			}
			else {
			  setTimeout(onTimer, 1000);
			}
		}

		onTimer();	//Start the timer after displaying question

		$('.option').click(function() {
			flag = 1;
			if(questionLock == false) {
				questionLock = true;	

				//correct answer
				if(this.id==questionBank[questionNumber][5]) {
					flag_correct = 1;
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

				document.getElementById("explanation").innerHTML = explanation;

				// Get the modal
				var modal = document.getElementById("myModal");

				// Get the <span> element that closes the modal
				var span = document.getElementsByClassName("close")[0];

				modal.style.display = "block";

				// When the user clicks on <span> (x), close the modal
				span.onclick = function() {
					modal.style.display = "none";
					setTimeout(function(){changeQuestion()}, 1000);
				}

				// When the user clicks anywhere outside of the modal, close it
				window.onclick = function(event) {
					if (event.target == modal) {
						modal.style.display = "none";
						setTimeout(function(){changeQuestion()}, 1000);
					}
				}
			}
		})
	}

	//To get to the next question
	function changeQuestion() {

		questionNumber++;
		console.log(questionNumber);

		if(stage=="#game1") {
			stage2 = "#game1";
			stage = "#game2";
		} else {
			stage2 = "#game2";
			stage = "#game1";
		}

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
			xhttp3.open("GET", "/fuzzy?score=" + score + "&cl=" + cl, true);
			xhttp3.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
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
					$(stage).append('<div class="scoreText">Your score until now: '+overall_score+'</div>');
					$(stage).append('<div class="questionText">Your next question will be of level: '+current_level+'</div>');
					$(stage).append('<a href="javascript:getNextQuestion();" class="btn btn-light btn-custom-2 mt-4"> Show next question </a>');
					console.log(result);
				}
			}
			xhttp3.send();
			console.log("Running fuzzy script"); 
		}
		else {	displayQuestion();	}

		$(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
		$(stage).animate({"right": "0px"},"slow", function() {$(stage).css('right','0px');questionLock=false;});

	}

	//Deciding the first four questions
	generate_bankingquiz = function(length) {
		var nbeg = 0, nint = 0 , nexp = 0;		//Not being actually used, just to set number of questions from each section at first
		var n;

		var topbar = document.getElementById('topbar');
		topbar.innerHTML = "Banking Quiz";
		var timer = document.getElementById('timer');
		timer.innerHTML = "Timer: " + timer_clock + " seconds";
		
		if(current_level == 'beginner') {
			nbeg = 2;	nint = 2;
			for(i=0; i<2; i++) {
				do
					n = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
			for(i=2; i<4; i++) {
				do
					n = Math.floor(Math.random() * (30 - 16 + 1)) + 16;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}
		else if(current_level == 'intermediate') {
			nint = 2, nexp = 2;
			for(i=0; i<2; i++) {
				do
					n = Math.floor(Math.random() * (30 - 16 + 1)) + 16;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
			for(i=2; i<4; i++) {
				do
					n = Math.floor(Math.random() * (45 - 31 + 1)) + 31;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}
		else if(current_level == 'expert') {
			nint = 1; nexp = 3;
			do
				n = Math.floor(Math.random() * (30 - 16 + 1)) + 16;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[0] = n;
			for(i=1; i<4; i++) {
				do
					n = Math.floor(Math.random() * (45 - 31 + 1)) + 31;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}

		console.log(questionNosSecond);		//Will display the question numbers of the first 4 questions selected

		$.getJSON('activity.json', function(data) {

			for(i=0; i<4; i++) {
				questionBank[i]=new Array;
				questionBank[i][0]=data.quizlist[questionNosSecond[i]-1].question;
				questionBank[i][1]=data.quizlist[questionNosSecond[i]-1].option1;
				questionBank[i][2]=data.quizlist[questionNosSecond[i]-1].option2;
				questionBank[i][3]=data.quizlist[questionNosSecond[i]-1].option3;
				questionBank[i][4]=data.quizlist[questionNosSecond[i]-1].option4;
				questionBank[i][5]=data.quizlist[questionNosSecond[i]-1].correct;
				questionBank[i][6]=data.quizlist[questionNosSecond[i]-1].explanation;

				//If the question has a hint, get that as well
				if(typeof(data.quizlist[questionNosSecond[i]-1].hint)==='string') {
					questionBank[i][7]=data.quizlist[questionNosSecond[i]-1].hint;
				}
				console.log(questionBank[i]);
			}

		})//Get the 4 questions and store them in questionBank

		setTimeout(displayQuestion, 1500);
    }
    
    generate_bankingquiz();

	//This will come into picture after the first 4 questions
	getNextQuestion = function(length) {
		var n;
		console.log("Number of questions displayed until now: "+questionNumber);
		$(stage).children("div").remove();
		$(stage).children("a").remove();

		if(current_level == 'beginner') {
			do
				n = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}
		else if(current_level == 'intermediate') {
			do
				n = Math.floor(Math.random() * (30 - 16 + 1)) + 16;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}
		else if(current_level == 'expert') {
			do
				n = Math.floor(Math.random() * (45 - 31 + 1)) + 31;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}

		console.log(n);		//Shows what question number has been selected

		$.getJSON('activity.json', function(data) {
			questionBank[questionNumber]=new Array;
			questionBank[questionNumber][0]=data.quizlist[questionNosSecond[questionNumber]-1].question;
			questionBank[questionNumber][1]=data.quizlist[questionNosSecond[questionNumber]-1].option1;
			questionBank[questionNumber][2]=data.quizlist[questionNosSecond[questionNumber]-1].option2;
			questionBank[questionNumber][3]=data.quizlist[questionNosSecond[questionNumber]-1].option3;
			questionBank[questionNumber][4]=data.quizlist[questionNosSecond[questionNumber]-1].option4;
			questionBank[questionNumber][5]=data.quizlist[questionNosSecond[questionNumber]-1].correct; 
			questionBank[questionNumber][6]=data.quizlist[questionNosSecond[questionNumber]-1].explanation; 

			//If the question has a hint, get that as well
			if(typeof(data.quizlist[questionNosSecond[questionNumber]-1].hint)==='string') {
				questionBank[questionNumber][7]=data.quizlist[questionNosSecond[questionNumber]-1].hint;
			}

			console.log(questionBank[questionNumber]);
		
		})//Get that question from the JSON file

		//Set scores before proceeding to display question
		if(result[resultNumber-4]==1) {
			score = score-1;
		}

		setTimeout(displayQuestion, 1500);
	}	
});