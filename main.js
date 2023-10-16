const generalMidMulti = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple'
const generalMidTF = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=boolean'

const apiLink = generalMidMulti
const homeLink = document.getElementById('home-link');
const questionsLink = document.getElementById('questions-link');
const resultLink = document.getElementById('result-link');
const home = document.getElementById('home');
const questions = document.getElementById('questions');
const result = document.getElementById('result');

const sections = document.querySelectorAll('.section')
const links = document.querySelectorAll('.link')

axios.get(apiLink)
    .then((res) => {
        console.log(res);
        let data = res.data
        let results = data.results
        console.log(results[0].question)
        console.log(results[0].correct_answer)
        console.log(...results[0].incorrect_answers)
    })
    .catch(err => console.log(err))

console.log(sections)

const showPage = (e) => {
    sections.forEach(section =>
        section.getAttribute("name") !== e.currentTarget.id ? section.classList.remove('show') : section.classList.add('show')
    )
}

function startGame() { }
function showQuestion(question) { }
function setNextQuestion() { }
function setStatusClass(element) { }
function selectAnswer() { }
function resetState() { }


// startButton.addEventListener("click", startGame);
// nextButton.addEventListener("click", () => {
//     currentQuestionIndex++;
//     setNextQuestion();
// });
links.forEach(link => link.addEventListener('click', e => showPage(e)))
