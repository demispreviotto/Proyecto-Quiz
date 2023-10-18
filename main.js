const generalMidMulti = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple'

const apiLink = generalMidMulti
const homeNav = document.getElementById('homeNav');
const scoresNav = document.getElementById('scoresNav');
const game = document.getElementById('gameSection');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const resultBtn = document.getElementById('resultBtn');
const resultHomeBtn = document.getElementById('resultHomeBtn');
const resultRestartBtn = document.getElementById('resultRestartBtn');
const resultUserInput = document.getElementById('resultUserInput');
const resultSaveBtn = document.getElementById('resultSaveBtn');
const btnContainer = document.getElementById('btnContainer');
const questionElement = document.getElementById('questionElement');
const resultScoreH1 = document.getElementById('resultScoreH1');
const scoresUl = document.getElementById('scoresUl');

const sections = document.querySelectorAll('.section')
const links = document.querySelectorAll('.link')

const questions = [];
let score = 0;
const scoresDB = JSON.parse(localStorage.getItem('scoreDB')) || [
    { user: 'dem', score: 9 },
    { user: 'aaa', score: 2 },
    { user: 'bbb', score: 3 },
    { user: 'bb2', score: 3 },
    { user: 'cc2', score: 1 },
    { user: 'cc3', score: 2 },
    { user: 'cc4', score: 2 },
    { user: 'cc6', score: 5 },
    { user: 'cc7', score: 5 },
    { user: 'cc8', score: 5 },
];

// console.log(game)

const getQuestions = () => {
    axios.get(apiLink)
        .then((res) => {
            let data = res.data;
            let results = data.results;
            results.forEach(e => {
                let question = e.question;
                let answers = [e.correct_answer, ...e.incorrect_answers]
                let correctAnswer = e.correct_answer;
                questions.push({ question, answers, correctAnswer })
            })
        })
        .catch(err => { console.error(err) })
}
getQuestions();

const showPage = (page) => {
    sections.forEach(section => {
        // section.getAttribute("name") !== e.currentTarget.id ?
        section.getAttribute("name") !== page ?
            section.classList.remove('show') : section.classList.add('show')
    })
}

// links.forEach(link => link.addEventListener('click', e => showPage(e)))

const startGame = () => {
    showPage('game')
    currentQuestionIndex = 0;
    score = 0;
    setNextQuestion()
    nextBtn.classList.remove('show')
    resultBtn.classList.remove('show')
}

const showQuestion = (question) => {
    questionElement.innerHTML = question.question;
    const shuffledAnswers = shuffleArray([...question.answers]);//
    shuffledAnswers.forEach((answer) => {
        // question.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.classList.add('btn', 'btn-primary')
        if (answer === question.correctAnswer) {
            button.dataset.correct = true;
        }
        button.addEventListener("click", (e) => {
            e.target.innerHTML == question.correctAnswer ? score++ : score;
            selectAnswer()
        }
        );
        btnContainer.appendChild(button);
    });
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const setNextQuestion = () => {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

const setStatusClass = (element) => {
    if (element.dataset.correct) {
        element.classList.add("correct");
        element.setAttribute('disabled', '')
        console.log(score)
    } else {
        element.classList.add("wrong");
    }
}

const selectAnswer = () => {
    Array.from(btnContainer.children).forEach((button) => {
        setStatusClass(button);
    });
    if (questions.length > currentQuestionIndex + 1) {
        nextBtn.innerHTML = 'Next';
        nextBtn.classList.add("show");
    } else {
        nextBtn.innerHTML = 'Restart'
        nextBtn.classList.add("show");
        resultBtn.classList.add("show");
    }
}

const resetState = () => {
    nextBtn.classList.remove("show");
    resultBtn.classList.remove("show");
    btnContainer.innerHTML = ""
}

homeNav.addEventListener('click', () => showPage("home"))
scoresNav.addEventListener('click', () => {
    showPage("scores")
    scoresUl.innerHTML = ''
    console.log(scoresDB, scoresUl)
    let loadedScoresDB = JSON.parse(localStorage.getItem('scoreDB'))
    console.log(loadedScoresDB)
    loadedScoresDB.sort((a, b) => b.score - a.score);
    for (let i = 0; i < 10; i++) {
        scoresUl.innerHTML += `<li>${loadedScoresDB[i].user} ------------------ ${loadedScoresDB[i].score}</li>`
    }
})
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", () => {
    if (nextBtn.innerHTML == "Restart") {
        console.log('restart btn')
        startGame()
    }
    currentQuestionIndex++;
    setNextQuestion();
    nextBtn.classList.remove('show')
});
resultBtn.addEventListener('click', () => {
    showPage('result')
    resultSaveBtn.classList.contains('show') ? "" : resultSaveBtn.classList.add('show');
    resultScoreH1.innerText = score
})

resultHomeBtn.addEventListener('click', () => showPage("home"))
resultRestartBtn.addEventListener('click', () => startGame)
resultSaveBtn.addEventListener('click', () => {
    scoresDB.push({ user: resultUserInput.value, score })
    console.log(resultUserInput.value, score)
    console.log(scoresDB)
    localStorage.setItem('scoreDB', JSON.stringify(scoresDB))
    resultSaveBtn.classList.remove('show')
})
