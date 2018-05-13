(function () {
    // var questions = ('./questions.json');
    // var questions = $.getJSON("./questions.json")
    var questions = [];
    // $.getJSON('./questions1.json', function (data) {
    //     questions = data
    // });

    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object

    // Display initial question
    displayNext();

    // Click handler for the 'next' button
    $('#next').on('click', function (e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quiz.is(':animated')) {
            return false;
        }
        choose();

        // If no user selection, progress is stopped
        if (isNaN(selections[questionCounter])) {
            alert('Please make a selection!');
        } else {
            questionCounter++;
            displayNext();
        }
    });

    // Click handler for the 'prev' button
    $('#prev').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter--;
        displayNext();
    });

    // Click handler for the 'Start Over' button
    $('#start').on('click', function (e) {

        $(".radios").hide();
        var selValue = $('input[name=module]:checked').val();

        if (selValue == 'module1') {
            $.getJSON('./questions1.json', function (data) {
                questions = data;
                document.querySelector('.number').innerHTML = questions.length.toString();
            });
        }
        else if (selValue == 'module2') {
            $.getJSON('./questions2.json', function (data) {
                questions = data;
                document.querySelector('.number').innerHTML = questions.length.toString();
            });
        } else if (selValue == 'module3') {
            $.getJSON('./questions3.json', function (data) {
                questions = data;
                document.querySelector('.number').innerHTML = questions.length.toString();
            });
        }

        setTimeout(updateTimer, 1000);

        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        // document.querySelector('.number').innerHTML = questions.length.toString();

        questionCounter = 0;
        selections = [];
        displayNext();
        $('#start').hide();
    });

    // Animates buttons on hover
    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    // Creates and returns the div that contains the questions and 
    // the answer selections
    function createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<h2>Question ' + (index + 1) + ':</h2>');
        qElement.append(header);

        var question = $('<p>').append(questions[index].question);
        qElement.append(question);

        var radioButtons = createRadios(index);
        qElement.append(radioButtons);

        var answer = Answer(index);
        qElement.append(answer);


        return qElement;
    }

    function Answer(index) {

        var aElement = $('<div>', {
            id: 'answer',
            class: 'hidden'
        });
        var answerIndex = questions[index].correctAnswer;
        var ansText = questions[index].choices[answerIndex];
        var ans = $('<p>').append(ansText);
        aElement.append(ans);

        var explanation = questions[index].explain;

        var explain = $('<p>').append(explanation);

        aElement.append(explain);

        return aElement


    }




    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
        var radioList = $('<ul>');
        var item;
        var input = '';
        for (var i = 0; i < questions[index].choices.length; i++) {
            item = $('<li>');
            input = '<input type="radio" name="answer" value=' + i + ' />';
            input += questions[index].choices[i];
            item.append(input);
            radioList.append(item);
        }
        return radioList;
    }

    // Reads the user selection and pushes the value to an array
    function choose() {
        selections[questionCounter] = +$('input[name="answer"]:checked').val();
    }

    // Displays next requested element
    function displayNext() {
        quiz.fadeOut(function () {
            $('#question').remove();

            if (questionCounter < questions.length) {

                var nextQuestion = createQuestionElement(questionCounter);
                quiz.append(nextQuestion).fadeIn();

                var currentScore = displayCurrentScore(questionCounter);
                quiz.append(currentScore).fadeIn();

                if (!(isNaN(selections[questionCounter]))) {
                    $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
                }

                // Controls display of 'prev' button
                if (questionCounter === 1) {
                    $('#prev').show();
                } else if (questionCounter === 0) {

                    $('#prev').hide();
                    $('#next').show();
                }
            } else {
                var scoreElem = displayScore();
                quiz.append(scoreElem).fadeIn();
                $('#next').hide();
                $('#prev').hide();
                $('#start').show();
            }
        });
    }

    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
        var score = $('<p>', { id: 'question' });

        var numCorrect = 0;
        for (var i = 0; i < selections.length; i++) {
            if (selections[i] === questions[i].correctAnswer) {
                numCorrect++;
            }
        }

        score.append('You got ' + numCorrect + ' questions out of ' +
            questions.length + ' right!!!');
        return score;
    }

    function displayCurrentScore(questionsAnswered) {
        $('#currentScore').remove();
        var score = $('<p>', { id: 'currentScore' });

        var numCorrect = 0;
        for (var i = 0; i < selections.length; i++) {
            if (selections[i] === questions[i].correctAnswer) {
                numCorrect++;
            }
        }
        var percentage = Math.round((numCorrect/questionsAnswered)*100) || 0;
        var timer = $("#worked");
        score.append('<br />You got ' + numCorrect + ' questions out of ' +
            questionsAnswered + ' right!!!<br /> Percentage: ' +  
            percentage + '%. <br />Questions Remaining: ' + (questions.length - questionsAnswered) + 
            'Average Time Per Question: ');
        return score;
    }
    

    function updateTimer() {
        var $worked = $("#worked");
        var myTime = $worked.html();
        var ss = myTime.split(":");
        var dt = new Date();
        dt.setHours(0);
        dt.setMinutes(ss[0]);
        dt.setSeconds(ss[1]);
        
        var dt2 = new Date(dt.valueOf() + 1000);
        var temp = dt2.toTimeString().split(" ");
        // console.log(temp)
        var ts = temp[0].split(":");
        
        $worked.html(ts[1]+":"+ts[2]);
        setTimeout(updateTimer, 1000);
    }
})();