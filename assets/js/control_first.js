$(document).ready(function () {
	
	var questionNumber = 0;		//Tracks number of questions displayed
	var questionBank = new Array;		//Stores the 9 questions
	
	var stage = "#game1";
	var stage2 = new Object;

	var questionLock = false;
	var numberOfQuestions;		//Will basically be 9 throughout

	var result = new Array();		//Used to store results of the quiz: 1 for correct, 0 for incorrect
	var resultNumber = 0;

	var user_category;	//Will be a single alphabet response from the classifier script
	var current_level;	//Will actually store the user level

	//questionBank[i][5] will store the id of the correct answer
	var score = 0;


	//Randomly select 3 questions each from the beginner, intermediate and expert sections to curate a list of 9 questions for the Initiation Quiz
	generate_firstquiz = function(length) {
		document.getElementById('topbar').innerHTML = "Initiation Quiz";
		var arr = [];
		var n;
		for(var i=0; i<3; i++) {
			do
				n = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
			while(arr.indexOf(n) !== -1)
			arr[i] = n;
		}
		for(var i=3; i<6; i++) {
			do
				n = Math.floor(Math.random() * (30 - 16 + 1)) + 16;
			while(arr.indexOf(n) !== -1)
			arr[i] = n;
		}
		for(var i=6; i<9; i++) {
			do
				n = Math.floor(Math.random() * (45 - 31 + 1)) + 31;
			while(arr.indexOf(n) !== -1)
			arr[i] = n;
		}
		return arr;
	}


	//Get those 9 questions from the JSON file
	$.getJSON('activity.json', function(data) {
		var arr = generate_firstquiz(3);
		var q_number;
		var num = 0;

		//For every question in the question bank 
		for(i=0; i<data.quizlist.length; i++) {
			q_number = Number(data.quizlist[i].q_id);	
			console.log("Displaying question number next")
			console.log(q_number)
			if(arr.indexOf(q_number)>=0)	//Search q_number in arr
			{
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

		console.log("Displaying all 9 questions and their options next")
		console.log(questionBank)
		numberOfQuestions=questionBank.length;		//This would be 9
		
		displayQuestion();	
	})
	
	
	function displayQuestion() {

		console.log(questionNumber);
		console.log(questionBank[questionNumber]);

		q1=questionBank[questionNumber][1];
		q2=questionBank[questionNumber][2];
		q3=questionBank[questionNumber][3];
		q4=questionBank[questionNumber][4];

		$(stage).append('<div class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="option">'+q1+'</div><div id="2" class="option">'+q2+'</div><div id="3" class="option">'+q3+'</div><div id="4" class="option">'+q4+'</div>');

		$('.option').click(function() {
			if(questionLock == false) {
				questionLock = true;	

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

				setTimeout(function(){changeQuestion()}, 1000);
			}
		})
	}


	function changeQuestion() {

		questionNumber++;
		console.log(questionNumber);

		if(stage=="#game1") { 
			stage2="#game1";stage="#game2";
		}	else { 
			stage2="#game2";stage="#game1";
		}

		if(questionNumber<numberOfQuestions) {	//This condition will be false when all 9 questions have been displayed
			displayQuestion();
		} else {	//When 9 = 9
			displayFinalSlide();
		}
		
		$(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
		$(stage).animate({"right": "0px"},"slow", function() {$(stage).css('right','0px');questionLock=false;});
	}


	function displayFinalSlide() {

		var xhttp = new XMLHttpRequest();

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
		}

		xhttp.addEventListener("load", reqListener);
		xhttp.open("GET", "/ip?q1="+result[0]+'&q2='+result[1]+'&q3='+result[2]+'&q4='+result[3]+'&q5='+result[4]+'&q6='+result[5]+'&q7='+result[6]+'&q8='+result[7]+'&q9='+result[8], true);
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				new Promise(resolve => { 
					setTimeout(function() { 
						$(stage).append('<div class="questionText">You have finished the quiz!<br><br>Total questions: '+numberOfQuestions+'<br>Correct answers: '+score+'<br>Your current level is '+current_level+'</div><br><br>');
						$(stage).append('<a href="/dashboard" class="btn btn-light btn-custom-2 mt-4"> Go to my dashboard </a>');
					}, 2000); 
				}); 
			}
		};

		xhttp.send();

		setTimeout(function() {
			//Setting cookie
			var d = new Date();
			d.setTime(d.getTime() + (20*24*60*60*1000));
			var expires = "expires=" + d.toUTCString();
			console.log(expires); 
			document.cookie = "Current Level = " + current_level + expires; 

			console.log(document.cookie);
			console.log("Current user level is " + current_level);
		}, 2000);
	}
});