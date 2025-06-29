document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const choices = document.querySelectorAll('.choice');
    const playerChoiceDisplay = document.getElementById('player-choice-display');
    const computerChoiceDisplay = document.getElementById('computer-choice-display');
    const resultText = document.getElementById('result-text');
    const playerScoreElement = document.getElementById('player-score');
    const computerScoreElement = document.getElementById('computer-score');
    const resetBtn = document.getElementById('reset-btn');
    const soundBtn = document.getElementById('sound-btn');
    
    // Audio elements
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');
    const drawSound = document.getElementById('draw-sound');
    const clickSound = document.getElementById('click-sound');
    
    // Game state
    let playerScore = 0;
    let computerScore = 0;
    let isSoundOn = true;
    
    // Icons for choices
    const choiceIcons = {
        rock: 'fas fa-hand-rock',
        paper: 'fas fa-hand-paper',
        scissors: 'fas fa-hand-scissors'
    };
    
    // Initialize game
    init();
    
    function init() {
        // Event listeners
        choices.forEach(choice => {
            choice.addEventListener('click', () => playRound(choice.dataset.choice));
        });
        
        resetBtn.addEventListener('click', resetGame);
        soundBtn.addEventListener('click', toggleSound);
        
        // Set initial scores
        updateScores();
    }
    
    function playRound(playerChoice) {
        if (isSoundOn) clickSound.play();
        
        // Reset displays
        playerChoiceDisplay.className = 'choice-display';
        computerChoiceDisplay.className = 'choice-display';
        
        // Remove previous animations
        playerChoiceDisplay.classList.remove('winner', 'shake');
        computerChoiceDisplay.classList.remove('winner', 'shake');
        
        // Set player choice
        playerChoiceDisplay.innerHTML = `<i class="${choiceIcons[playerChoice]}"></i>`;
        playerChoiceDisplay.classList.add('shake');
        
        // Computer makes random choice
        const computerChoice = getComputerChoice();
        setTimeout(() => {
            computerChoiceDisplay.innerHTML = `<i class="${choiceIcons[computerChoice]}"></i>`;
            computerChoiceDisplay.classList.add('shake');
            
            // Determine winner after animation
            setTimeout(() => {
                const result = determineWinner(playerChoice, computerChoice);
                displayResult(result, playerChoice, computerChoice);
            }, 500);
        }, 300);
    }
    
    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }
    
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }
        
        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'player';
        } else {
            return 'computer';
        }
    }
    
    function displayResult(result, playerChoice, computerChoice) {
        let message = '';
        
        switch (result) {
            case 'player':
                playerScore++;
                message = `You win! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}`;
                resultText.style.color = 'var(--success)';
                playerChoiceDisplay.classList.add('winner');
                if (isSoundOn) winSound.play();
                break;
            case 'computer':
                computerScore++;
                message = `You lose! ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}`;
                resultText.style.color = 'var(--danger)';
                computerChoiceDisplay.classList.add('winner');
                if (isSoundOn) loseSound.play();
                break;
            case 'draw':
                message = "It's a draw!";
                resultText.style.color = 'var(--warning)';
                if (isSoundOn) drawSound.play();
                break;
        }
        
        resultText.textContent = message;
        updateScores();
    }
    
    function updateScores() {
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;
    }
    
    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        updateScores();
        
        playerChoiceDisplay.innerHTML = '<i class="fas fa-question"></i>';
        computerChoiceDisplay.innerHTML = '<i class="fas fa-question"></i>';
        
        resultText.textContent = 'Choose your weapon!';
        resultText.style.color = 'var(--dark)';
        
        // Remove animations
        playerChoiceDisplay.classList.remove('winner', 'shake');
        computerChoiceDisplay.classList.remove('winner', 'shake');
        
        if (isSoundOn) clickSound.play();
    }
    
    function toggleSound() {
        isSoundOn = !isSoundOn;
        const icon = soundBtn.querySelector('i');
        icon.className = isSoundOn ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        
        if (isSoundOn) clickSound.play();
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});