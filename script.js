// No changes to the quizData variable in questions.js

const quizForm = document.getElementById("quiz-form");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const tryAgainBtn = document.getElementById("tryAgain");
const resultEl = document.getElementById("result");
const careerListEl = document.getElementById("careerList");
const careerLogEl = document.getElementById("log");

let currentQuestion = 0;
const resultCount  = 10;
const careerLists = [];
const showLog = new URLSearchParams(window.location.search).get('log');

function displayQuestion() {
    quizForm.innerHTML = ""; // Clear the previous question

    const questionData = quizData.Questions[currentQuestion];
    const questionContainer = document.createElement("div");
    const questionCaption = document.createElement("h2");

    questionCaption.textContent = questionData.Caption;
    questionContainer.appendChild(questionCaption);

    questionData.Answers.forEach((answer, index) => {
        const answerContainer = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");

        input.type = "radio";
        input.name = `question${currentQuestion}`;
        input.id = `question${currentQuestion}answer${index}`;
        input.value = index;

        label.htmlFor = `question${currentQuestion}answer${index}`;
        label.textContent = answer.Caption;

        input.addEventListener("change", () => {
            nextBtn.disabled = false;
        });

        answerContainer.appendChild(input);
        answerContainer.appendChild(label);
        questionContainer.appendChild(answerContainer);
    });

    quizForm.appendChild(questionContainer);
    nextBtn.disabled = true;
    backBtn.disabled = currentQuestion === 0;
}

function tryAgain() {
    currentQuestion = 0;
    careerLists.length = 0;
    displayQuestion();
    resultEl.classList.add("hidden");
    quizForm.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
    backBtn.classList.remove("hidden");
    careerLogEl.classList.add("hidden");
}

function calculateResults() {
    const formData = new FormData(quizForm);
    const userChoices = Array.from(formData.values());

    userChoices.forEach((choice) => {
        const careers = quizData.Questions[currentQuestion - 1].Answers[choice].Careers;
        careerLists[currentQuestion] = careers;
    });
}

function displayLog() {
    const careerLogListEl = document.getElementById("careerLog");
    careerLogListEl.innerHTML = ""; //clear the previous list
    careerLogEl.classList.remove("hidden");
    careerLists.forEach((list, index) => {
        const listEl = document.createElement("ul");
        list.forEach(career => {
            const listItem = document.createElement("li");
            listItem.textContent = career;
            listEl.appendChild(listItem);
        });
        const label = document.createElement("label");
        label.textContent = "Q:" + (index) + " - " + quizData.Questions[index - 1].Caption;
        careerLogEl.appendChild(label);
        careerLogEl.appendChild(listEl);
    });
}

function displayResult() {
    quizForm.classList.add("hidden"); // Hide the questions
    nextBtn.classList.add("hidden"); // Hide the next button
    backBtn.classList.add("hidden"); // Hide the back button

    const careerCount = {};

    careerLists.forEach((list) => {
        list.forEach(career => {
            careerCount[career] = (careerCount[career] || 0) + 1;
        });
    });

    const recommendedCareers = Object.entries(careerCount).sort((a, b) => b[1] - a[1]).slice(0, resultCount);

    careerListEl.innerHTML = ""; //clear the previous list

    recommendedCareers.forEach(([career], index) => {
        const listItem = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = links[career];
        if (index < 3) {
            listItem.classList.add("highlight");
            career = career + " (Recommended)";
        } 
        anchor.textContent = career;
        listItem.appendChild(anchor);

        careerListEl.appendChild(listItem);
    });

    resultEl.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
    if (quizForm.reportValidity()) {
        currentQuestion++;
        calculateResults();

        if (currentQuestion < quizData.Questions.length) {
            displayQuestion();
        } else {
            displayResult();
            if(showLog) {
                displayLog();
            }
        }
    }
});

backBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
});

tryAgainBtn.addEventListener("click", tryAgain);

displayQuestion();
