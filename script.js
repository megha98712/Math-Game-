let playerName = "",
      difficulty = "Easy",
      score = 0,
      lives = 3,
      timeLeft = 20,
      correctAnswer = 0,
      timerInterval;

    const SCORE_KEY = "mathExplorerScores";

    const loginFrame = document.getElementById('loginFrame'),
      menuFrame = document.getElementById('menuFrame'),
      gameFrame = document.getElementById('gameFrame'),
      gameOverScreen = document.getElementById('gameOverScreen');

    const nameEntry = document.getElementById('nameEntry'),
      welcomeLabel = document.getElementById('welcomeLabel'),
      questionLabel = document.getElementById('questionLabel'),
      answerEntry = document.getElementById('answerEntry');

    const feedbackLabel = document.getElementById('feedbackLabel'),
      scoreLabel = document.getElementById('scoreLabel'),
      livesLabel = document.getElementById('livesLabel'),
      timerLabel = document.getElementById('timerLabel');

    const bgMusic = document.getElementById('bgMusic'),
      musicControl = document.getElementById('musicControl'),
      finalScore = document.getElementById('finalScore'),
      highScoreText = document.getElementById('highScoreText');

    let isPlaying = true;

    musicControl.addEventListener('click', () => {
      if (isPlaying) {
        bgMusic.pause();
        musicControl.textContent = "🔇";
      } else {
        bgMusic.play();
        musicControl.textContent = "🔊";
      }
      isPlaying = !isPlaying;
    });

    function loadScores() {
      const s = localStorage.getItem(SCORE_KEY);
      return s ? JSON.parse(s) : [];
    }

    function saveScore(n, sc) {
      let s = loadScores();
      s.unshift({
        name: n,
        score: sc,
        date: new Date().toLocaleDateString()
      });
      s = s.slice(0, 10);
      localStorage.setItem(SCORE_KEY, JSON.stringify(s));
    }

    function getHighScore() {
      const s = loadScores();
      return s.length === 0 ? 0 : Math.max(...s.map(x => x.score));
    }

    function openScore() {
      window.open("score.html", "_blank");
    }

    function openAbout() {
      window.open("about.html", "_blank");
    }

    function switchFrame(hide, show) {
      hide.classList.remove('active-frame');
      show.classList.add('active-frame');
    }

    document.getElementById('loginBtn').addEventListener('click', () => {
      const name = nameEntry.value.trim();
      if (!name) alert("Please enter your name!");
      else {
        playerName = name;
        welcomeLabel.textContent = `Welcome, ${playerName}!`;
        switchFrame(loginFrame, menuFrame);
      }
    });

    function startGame(level) {
      difficulty = level;
      score = 0;
      lives = 3;
      timeLeft = 20;
      updateLabels();
      switchFrame(menuFrame, gameFrame);
      newQuestion();
      startTimer();
    }

    function backToMenu() {
      clearInterval(timerInterval);
      switchFrame(gameFrame, menuFrame);
    }

    function backToMenuFromOver() {
      gameOverScreen.classList.remove('active');
      backToMenu();
    }

    function newQuestion() {
      let a, b, op;

      if (difficulty === "Easy") {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        op = ["+", "-", "*"][Math.floor(Math.random() * 3)];
      } else {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 10) + 1;
        op = ["+", "-", "*", "/", "^"][Math.floor(Math.random() * 5)];
      }

      if (op === "+") correctAnswer = a + b;
      else if (op === "-") correctAnswer = a - b;
      else if (op === "*") correctAnswer = a * b;
      else if (op === "/") correctAnswer = Math.floor(a / b);
      else if (op === "^") correctAnswer = Math.pow(a, b);

      questionLabel.textContent = `${a} ${op} ${b} = ?`;
      answerEntry.value = "";
      feedbackLabel.textContent = "";
    }

    function checkAnswer() {
      const ans = parseInt(answerEntry.value);
      if (isNaN(ans)) {
        feedbackLabel.textContent = "⚠ Enter a number!";
        return;
      }

      if (ans === correctAnswer) {
        document.getElementById("correctSound").play();
        score++;
        timeLeft = Math.min(timeLeft + 2, 20);
        feedbackLabel.textContent = ["🌟 You’re amazing!", "💪 Keep it up!", "🔥 Superb job!", "🎯 Right on!", "🌈 Genius!"][Math.floor(Math.random() * 5)];
        updateLabels();
        setTimeout(newQuestion, 1000);
      } else {
        document.getElementById("wrongSound").play();
        lives--;
        feedbackLabel.textContent = `❌ Wrong! (${correctAnswer})`;
        updateLabels();
        if (lives <= 0) showGameOver();
        else setTimeout(newQuestion, 1000);
      }
    }

    function updateLabels() {
      scoreLabel.textContent = `⭐ Score: ${score}`;
      livesLabel.textContent = `❤ Lives: ${lives}`;
      timerLabel.textContent = `⏱ Time: ${timeLeft}s`;
      document.getElementById("progressBar").style.width = (timeLeft / 20 * 100) + "%";
    }

    function startTimer() {
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (timeLeft > 0 && lives > 0) {
          timeLeft--;
          updateLabels();
        } else {
          clearInterval(timerInterval);
          showGameOver();
        }
      }, 1000);
    }

    function showGameOver() {
      clearInterval(timerInterval);
      saveScore(playerName, score);
      finalScore.innerHTML = `⭐ Your Score: <b>${score}</b>`;
      highScoreText.innerHTML = `🏆 High Score: <b>${getHighScore()}</b>`;
      gameOverScreen.classList.add('active');
    }

    function restartGame() {
      gameOverScreen.classList.remove('active');
      startGame(difficulty);
    }

    function handleEnter(e) {
      if (e.key === "Enter") checkAnswer();
    }
 