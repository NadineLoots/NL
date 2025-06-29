document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const quizContainer = document.getElementById('quiz');
    const questionElement = document.getElementById('question');
    const answerButtons = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const resultButton = document.getElementById('result-btn');
    const questionCounter = document.getElementById('question-counter');
    const progressBar = document.getElementById('progress-bar');
    const scoreElement = document.getElementById('score');
    const questionImageContainer = document.getElementById('question-image-container');
    const questionImage = document.getElementById('question-image');
    
    const resultContainer = document.getElementById('result-container');
    const finalScoreElement = document.getElementById('final-score');
    const totalQuestionsElement = document.getElementById('total-questions');
    const resultMessageElement = document.getElementById('result-message');
    const circleFill = document.getElementById('circle-fill');
    const circleText = document.getElementById('circle-text');
    const restartButton = document.getElementById('restart-btn');
    
    // Quiz variables
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    
    // Sample questions - in a real app, you might fetch these from an API
    const sampleQuestions = [
        {
            question: "Which language runs in a web browser?",
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            answers: [
                { text: "Java", correct: false },
                { text: "C", correct: false },
                { text: "Python", correct: false },
                { text: "JavaScript", correct: true }
            ]
        },
        {
            question: "What does CSS stand for?",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            answers: [
                { text: "Central Style Sheets", correct: false },
                { text: "Cascading Style Sheets", correct: true },
                { text: "Cascading Simple Sheets", correct: false },
                { text: "Cars SUVs Sailboats", correct: false }
            ]
        },
        {
            question: "What does HTML stand for?",
            image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            answers: [
                { text: "Hypertext Markup Language", correct: true },
                { text: "Hypertext Markdown Language", correct: false },
                { text: "Hyperloop Machine Language", correct: false },
                { text: "Helicopters Terminals Motorboats Lamborginis", correct: false }
            ]
        },
        {
            question: "What year was JavaScript launched?",
            image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            answers: [
                { text: "1996", correct: false },
                { text: "1995", correct: true },
                { text: "1994", correct: false },
                { text: "none of the above", correct: false }
            ]
        }
    ];
    
    // Initialize the quiz
    function initQuiz() {
        // In a real app, you might fetch questions from an API here
        questions = [...sampleQuestions];
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = score;
        showQuestion();
        
        // Hide result container if it's visible
        resultContainer.classList.remove('show');
        
        // Reset quiz container
        quizContainer.classList.remove('hide');
    }
    
    // Display the current question
    function showQuestion() {
        resetState();
        
        const currentQuestion = questions[currentQuestionIndex];
        const questionNo = currentQuestionIndex + 1;
        const totalQuestions = questions.length;
        
        questionElement.textContent = currentQuestion.question;
        questionCounter.textContent = `Question ${questionNo} of ${totalQuestions}`;
        
        // Update progress bar
        const progressPercent = (questionNo / totalQuestions) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Set question image if available
        if (currentQuestion.image) {
            questionImage.src = currentQuestion.image;
            questionImageContainer.style.display = 'block';
        } else {
            questionImageContainer.style.display = 'none';
        }
        
        // Create answer buttons
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtons.appendChild(button);
        });
        
        // Hide/show next button based on question index
        if (currentQuestionIndex < questions.length - 1) {
            nextButton.style.display = 'flex';
            resultButton.style.display = 'none';
        } else {
            nextButton.style.display = 'none';
            resultButton.style.display = 'flex';
        }
    }
    
    // Reset the quiz state for the next question
    function resetState() {
        // Clear answer buttons
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
        
        // Reset button states
        nextButton.disabled = true;
    }
    
    // Handle answer selection
    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';
        
        if (isCorrect) {
            selectedButton.classList.add('correct');
            score += 10;
            scoreElement.textContent = score;
        } else {
            selectedButton.classList.add('wrong');
            // Highlight the correct answer
            Array.from(answerButtons.children).forEach(button => {
                if (button.dataset.correct === 'true') {
                    button.classList.add('correct');
                }
            });
        }
        
        // Disable all buttons after selection
        Array.from(answerButtons.children).forEach(button => {
            button.disabled = true;
        });
        
        // Enable next button
        nextButton.disabled = false;
    }
    
    // Show the next question
    function showNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        }
    }
    
    // Show the final results
    function showResults() {
        quizContainer.classList.add('hide');
        
        setTimeout(() => {
            resultContainer.classList.add('show');
            
            const totalQuestions = questions.length;
            const percentage = Math.round((score / (totalQuestions * 10)) * 100);
            
            finalScoreElement.textContent = score;
            totalQuestionsElement.textContent = totalQuestions * 10;
            
            // Set result message based on score
            if (percentage >= 80) {
                resultMessageElement.textContent = "Excellent! You have a great understanding of this topic.";
            } else if (percentage >= 60) {
                resultMessageElement.textContent = "Good job! You have a decent understanding, but there's room for improvement.";
            } else if (percentage >= 40) {
                resultMessageElement.textContent = "Not bad! You know some basics, but you might want to study more.";
            } else {
                resultMessageElement.textContent = "Keep practicing! You'll get better with more study and practice.";
            }
            
            // Animate the circle progress
            const offset = 100 - percentage;
            circleFill.style.strokeDashoffset = offset;
            circleText.textContent = `${percentage}%`;
        }, 300);
    }
    
    // Event listeners
    nextButton.addEventListener('click', showNextQuestion);
    resultButton.addEventListener('click', showResults);
    restartButton.addEventListener('click', initQuiz);
    
    // Start the quiz
    initQuiz();
});