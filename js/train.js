import { saveRecord, saveWrongQuestion } from "./storage.js";
import { generateQuestion, parseInputToFrac, fracEqual } from "./data.js";

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
    let standardFrac = null;
    let standardText = "";

    // 生成新题目
    function getNewQuestion() {
        const res = generateQuestion(grade, level, type);
        currentQ = res.question;
        standardFrac = res.stdFrac;
        standardText = res.stdText;
        qBox.innerText = currentQ;
        ansInput.value = "";
        ansInput.focus();
    }
    getNewQuestion();

    // 提交答案，全自动对比，无弹窗手动批改
    function submitAnswer() {
        const userText = ansInput.value.trim();
        if (!userText) return alert("请输入答案，支持整数、小数、分数（1/2）、带分数（3又1/2）");

        done++;
        doneDom.innerText = done;

        // 解析用户答案为分数
        let userFrac;
        try {
            userFrac = parseInputToFrac(userText);
        } catch (e) {
            err++;
            errDom.innerText = err;
            alert("输入格式错误！正确示例：5、3.6、1/4、2又1/3");
            const wrongObj = {
                q: currentQ, user: userText, std: standardText, grade, level, type
            };
            wrongList.push(wrongObj);
            saveWrongQuestion(wrongObj);
            checkFinish();
            return;
        }

        // 分数对比判分
        if (fracEqual(userFrac, standardFrac)) {
            ok++;
            okDom.innerText = ok;
            alert("回答正确！");
        } else {
            err++;
            errDom.innerText = err;
            const wrongObj = {
                q: currentQ, user: userText, std: standardText, grade, level, type
            };
            wrongList.push(wrongObj);
            saveWrongQuestion(wrongObj);
            alert(`回答错误，正确答案：${standardText}`);
        }
        checkFinish();
    }

    // 判断是否完成训练
    function checkFinish() {
        if (done >= totalNum) {
            finishTrain();
        } else {
            getNewQuestion();
        }
    }

    function finishTrain() {
        clearInterval(timer);
        const record = {
            time: new Date().toLocaleString(),
            grade,
            level,
            type,
            total: done,
            correct: ok,
            wrong: err,
            useTime: second,
            wrongList
        }
        saveRecord(record);
        const rate = done ? Math.round(ok / done * 100) : 0;
        alert(`训练完成！总题${done}道，正确率${rate}%`);
        window.location.href = "report.html";
    }

    submitBtn.onclick = submitAnswer;
    ansInput.onkeydown = (e) => { if (e.key === "Enter") submitAnswer() };
    nextBtn.onclick = getNewQuestion;
    endBtn.onclick = finishTrain;
}
