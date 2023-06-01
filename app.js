let score = document.querySelector(".score span");
let quiz = document.getElementById("quiz");
let progressLine = document.querySelector("#quiz .progress");
const qustTile = document.querySelector(".questions");
let options = document.querySelector(".answers");
let submitBtn = document.querySelector(".next");

let currentindex = 0;
let rightAnswer = 0;
let questCount;
let countDown;

function getJsonFile() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let quiz = JSON.parse(this.responseText);
            let questions = quiz.questions;
            questCount = questions.length;
            //get questions cont ..
            questionCount(currentindex, questCount);
            //display data on browser
            showData(questions[currentindex], questCount);
            startTimer(questCount);
            // click submit button unction
            submitBtn.addEventListener("click", (e) => {
                e.preventDefault;
                // check correct answer
                let correctAnswer = questions[currentindex].correctAnswer;
                currentindex++;
                checkAnswer(correctAnswer, questCount);
                //remove previous q
                qustTile.innerHTML = "";
                options.innerHTML = "";
                //display data on browser
                showData(questions[currentindex], questCount);
                progressline(questCount);
                questionCount(currentindex, questCount);
                clearInterval(countDown);
                startTimer(questCount);
                showResult(questCount);
            });
        }
    };
    myRequest.open("GET", "quiz.json", true);
    myRequest.send();
}
getJsonFile();

// progressline
function progressline() {
    var currentWidth = parseFloat(progressLine.style.width) || 10;
    for (var j = 0; j < questCount; j++) {
        let w = currentWidth + 10;
        progressLine.style.width = w + "%";
    }
}

// questions count
function questionCount(i, num) {
    score.innerHTML = `Quesion ${i + 1} of ${num}`;
}

//set timer
function startTimer(count) {
    let timer = document.getElementById("timespent");
    if (currentindex < count) {
        var seconds = 20;
        countDown = setInterval(() => {
            if (seconds < 0) {
                clearInterval(countDown);
                submitBtn.click();
            } else {
                if (seconds <= 15) {
                    timer.style.color = "red";
                }
                if (seconds < 10) {
                    timer.value = `00:0${seconds}`;
                } else {
                    timer.value = `00:${seconds}`;
                    timer.style.color = "#fff200";
                }
            }
            seconds--;
        }, 1000);
    }
}

function showData(obj, count) {
    if (currentindex < count) {
        let qtitle = document.createElement("div");
        qtitle.classList.add("question");
        qtitle.id = "q1";
        qtitle.innerText = obj.question;
        qustTile.appendChild(qtitle);
        for (var i = 0; i <= 3; i++) {
            let ansContainer = document.createElement("div");
            ansContainer.classList.add("answer");
            ansContainer.style.display = "flex";
            let inptRadio = document.createElement("input");
            inptRadio.type = "radio";
            inptRadio.name = "quest";
            inptRadio.dataset.answer = obj.choices[i];
            inptRadio.id = `${i}`;
            options.appendChild(inptRadio);
            let ans = document.createElement("label");
            ans.classList.add(`lab${i + 1}`);
            ans.htmlFor = `${i}`;
            ans.innerText = obj.choices[i];
            ans.style.cursor = "pointer";
            ans.style.width = "100%";
            ansContainer.appendChild(inptRadio);
            ansContainer.appendChild(ans);
            options.appendChild(ansContainer);
        }
    }
}

function checkAnswer(right, cnt) {
    let answers = document.getElementsByName("quest");
    let selectedAnswer;
    for (var i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            selectedAnswer = answers[i].id;
            if (right == selectedAnswer) {
                rightAnswer++;
                console.log("correct!");
            } else {
                console.log("wrong!");
            }
        }
    }
}

function showResult(count) {
    let result;
    if (currentindex == count) {
        qustTile.remove();
        options.remove();
        submitBtn.remove();
        score.parentElement.remove();
        let finalRate;
        if (rightAnswer > count / 2 && rightAnswer <= 8) {
            finalRate = `<span style="color: yellow; font-size: 2.25rem">Good Job!</span>`;
        } else if (rightAnswer == count) {
            finalRate = `<span style="color: #00c853; font-size: 2.25rem">Excellant!</span>`;
        } else {
            finalRate = `<span style="color: red; font-size: 2.25rem ">Bad</span>`;
        }
        let resultDiv = document.createElement("div");
        resultDiv.classList.add("result");
        let resultScore = document.createElement("span");
        let final = document.createElement("span");
        final.innerHTML = finalRate;
        resultScore.innerText = `Your Score: ${rightAnswer} / ${count}`;
        quiz.appendChild(resultDiv);
        resultDiv.appendChild(final);
        resultDiv.appendChild(resultScore);
    }
}
