const generalMidMulti = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple'

const apiLink = generalMidMulti
const homeNav = document.getElementById('homeNav');
const scoresNav = document.getElementById('scoresNav');
const game = document.getElementById('gameSection');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const resultBtn = document.getElementById('resultBtn');
const scoresHomeBtn = document.getElementById('scoresHomeBtn');
const scoresRestartBtn = document.getElementById('scoresRestartBtn');
const resultUserInput = document.getElementById('resultUserInput');
const resultSaveBtn = document.getElementById('resultSaveBtn');
const btnContainer = document.getElementById('btnContainer');
const questionElement = document.getElementById('questionElement');
const resultScoreH1 = document.getElementById('resultScoreH1');
const scoresUl = document.getElementById('scoresUl');
const pageIndex = document.getElementById('pageIndex');

const sections = document.querySelectorAll('.section')
const links = document.querySelectorAll('.link')

let questions = [];
let score = 0;
let page = 1

const scoresDB = JSON.parse(localStorage.getItem('scoreDB')) || [
    { user: 'dem', score: 9 },
    { user: 'aaa', score: 2 },
    { user: 'bbb', score: 3 },
    { user: 'bb2', score: 3 },
    { user: 'cc2', score: 2 },
    { user: 'cc3', score: 2 },
    { user: 'cc4', score: 0 },
    { user: 'cc6', score: 0 },
];

const showPage = (page) => {
    sections.forEach(section => {
        section.getAttribute("data-name") !== page ?
            section.classList.remove('show') : section.classList.add('show')
    })
}

const getQuestions = async () => {
    try {
        const res = await axios.get(apiLink)
        let data = res.data;
        let results = data.results;
        questions = []
        results.forEach(e => {
            let question = e.question;
            let answers = [e.correct_answer, ...e.incorrect_answers]
            let correctAnswer = e.correct_answer;
            questions.push({ question, answers, correctAnswer })
        })
    } catch (err) { console.error(err) }
}

const startGame = async () => {
    await getQuestions();
    showPage('game')
    currentQuestionIndex = 0;
    score = 0;
    page = 1;
    setNextQuestion()
    nextBtn.classList.remove('show')
    resultBtn.classList.remove('show')
}

const showQuestion = (question) => {
    questionElement.innerHTML = question.question;
    const shuffledAnswers = shuffleArray([...question.answers]);//
    shuffledAnswers.forEach((answer) => {
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
    pageIndex.innerHTML = `${page}/10`
    page++
    showQuestion(questions[currentQuestionIndex]);
}

const setStatusClass = (element) => {
    if (element.dataset.correct) {
        element.classList.add("correct");
        element.setAttribute('disabled', '')
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
        nextBtn.classList.remove("show");
        resultBtn.classList.add("show");
    }
}

const resetState = () => {
    nextBtn.classList.remove("show");
    resultBtn.classList.remove("show");
    btnContainer.innerHTML = ""
}
const setScores = () => {
    scoresDB.push({ user: resultUserInput.value, score })
    localStorage.setItem('scoreDB', JSON.stringify(scoresDB))
    resultSaveBtn.classList.remove('show')
}

const getScores = () => {
    scoresUl.innerHTML = ''
    let loadedScoresDB = JSON.parse(localStorage.getItem('scoreDB'))
    if (loadedScoresDB == null) {
        loadedScoresDB = scoresDB
    }
    loadedScoresDB.sort((a, b) => b.score - a.score);
    for (let i = 0; i < 7; i++) {
        scoresUl.innerHTML += `<tr><td>${loadedScoresDB[i].user}</td><td>${loadedScoresDB[i].score}</td></tr>`
    }
}

homeNav.addEventListener('click', () => showPage("home"))
scoresNav.addEventListener('click', () => { getScores(); showPage('scores') })
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
    // resultScoreH1.focus()
    resultScoreH1.innerText = score
})

scoresHomeBtn.addEventListener('click', () => showPage("home"))
scoresRestartBtn.addEventListener('click', startGame)
resultSaveBtn.addEventListener('click', () => {
    setScores();
    getScores();
    showPage('scores')
})
