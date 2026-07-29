import { saveRecord, saveWrongQuestion } from "./storage.js";
import { generateQuestion, calcStandardAnswer } from "./data.js";

export function startTrain(config) {
    const { grade, level, type, totalNum } = config;
    let done = 0, ok = 0, err = 0;
    let wrongList = [];
    let second = 0;
    let timer = setInterval(() => {
        second++;
        const m = Math.floor(second / 60).toString().padStart(2, "0");
        const s = (second % 60).toString().padStart(2, "0");
        document.getElementById("time").innerText = `${m}:${s}`;
    }, 1000)

    const qBox = document.getElementById("qBox");
    const ansInput = document.getElementById("ansInput");
    const doneDom = document.getElementById("done");
    const okDom = document.getElementById("ok");
    const errDom = document.getElementById("err");
    const submitBtn = document.getElementById("submitBtn");
    const nextBtn = document.getElementById("nextBtn");
    const endBtn = document.getElementById("endBtn");

    let currentQ = "";
    let standardAns = "";

    // 动态生成新题目
    function getNewQuestion() {
        const res = generateQuestion(grade, level, type);
        currentQ = res.question;
        standardAns = res.stdAnswer;
        qBox.innerText = currentQ;
        ansInput.value = "";
        ansInput.focus();
    }
    getNewQuestion();

    function submitAnswer() {
        const userAns = ansInput.value.trim();
        if (!userAns) return alert("请输入答案");
        done++;
        doneDom.innerText = done;
        if (standardAns !== null) {
            // 纯数字计算题自动判分
            const userNum = Number(userAns);
            if (Math.abs(userNum - standardAns) < 0.001) {
                ok++;
                okDom.innerText = ok;
                alert("回答正确！");
            } else {
                err++;
                errDom.innerText = err;
                const wrongObj = { q: currentQ, user: userAns, std: standardAns, grade, level, type };
                wrongList.push(wrongObj);
                saveWrongQuestion(wrongObj);
                alert(`错误，正确答案：${standardAns}`);
            }
        } else {
            // 分数/应用题手动批改
            if (confirm("本题为分数/应用题，是否回答正确？")) {
                ok++; okDom.innerText = ok;
            } else {
                err++; errDom.innerText = err;
                const wrongObj = { q: currentQ, user: userAns, std: "手动核对", grade, level, type };
                wrongList.push(wrongObj);
                saveWrongQuestion(wrongObj);
            }
        }
        if (done >= totalNum) {
            finishTrain();
        } else {
            getNewQuestion();
        }
    }

    function finishTrain() {
        clearInterval(timer);
        const record = {
            time: new Date().toLocaleString(), grade, level, type,
            total: done, correct: ok, wrong: err, useTime: second, wrongList
        }
        saveRecord(record);
        const rate = done ? Math.round(ok / done * 100) : 0;
        alert(`训练完成！总题${done}，正确率${rate}%`);
        window.location.href = "report.html";
    }

    submitBtn.onclick = submitAnswer;
    ansInput.onkeydown = (e) => { if (e.key === "Enter") submitAnswer() };
    nextBtn.onclick = getNewQuestion;
    endBtn.onclick = finishTrain;
}
