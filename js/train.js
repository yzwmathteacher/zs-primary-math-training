import { generateQuestion, parseInputToFrac, fracEqual, formatFrac, typeMap, levelMap } from "./data.js";

// 全局变量（和你原来逻辑一致）
let currentQ = null;
let grade = 5;
let diffLevel = "easy";
let qType = "math";

// 绑定页面原有DOM（不会改动你的页面）
const qTextEl = document.getElementById("question-text");
const ansInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const tipEl = document.getElementById("tip-text");
const gradeSelect = document.getElementById("grade-select");
const levelSelect = document.getElementById("level-select");
const typeSelect = document.getElementById("type-select");

// ====================== 新增：本地记录存储模块（解决无记录问题）======================
const RecordStore = {
  getRecordList() {
    const str = localStorage.getItem("practice_records");
    return str ? JSON.parse(str) : [];
  },
  saveRecord(item) {
    const list = this.getRecordList();
    list.unshift(item);
    if (list.length > 500) list.pop();
    localStorage.setItem("practice_records", JSON.stringify(list));
  },
  getWrongList() {
    const str = localStorage.getItem("wrong_questions");
    return str ? JSON.parse(str) : [];
  },
  saveWrong(item) {
    const list = this.getWrongList();
    const exist = list.some(v => v.question === item.question);
    if (!exist) {
      list.push(item);
      localStorage.setItem("wrong_questions", JSON.stringify(list));
    }
  },
  clearAll() {
    localStorage.removeItem("practice_records");
    localStorage.removeItem("wrong_questions");
    alert("已清空所有做题记录与错题");
  }
};
// =================================================================================

// 渲染题目（原有逻辑不变）
function renderNewQuestion() {
  currentQ = generateQuestion(grade, diffLevel, qType);
  qTextEl.innerText = currentQ.question;
  ansInput.value = "";
  tipEl.innerText = "";
  nextBtn.style.display = "none";
  submitBtn.style.display = "inline-block";
}

// 提交答案（原有判题逻辑 + 新增自动保存记录）
function handleSubmit() {
  const inputVal = ansInput.value.trim();
  if (!inputVal) {
    tipEl.innerText = "请输入答案！";
    tipEl.style.color = "#f00";
    return;
  }

  try {
    const userFrac = parseInputToFrac(inputVal);
    const stdFrac = currentQ.stdFrac;
    const isCorrect = fracEqual(userFrac, stdFrac);

    // ========== 新增：保存答题记录 ==========
    const recordItem = {
      question: currentQ.question,
      stdAnswer: currentQ.stdText,
      userAnswer: inputVal,
      isRight: isCorrect,
      grade: grade,
      level: diffLevel,
      qType: qType,
      createTime: new Date().toLocaleString()
    };
    RecordStore.saveRecord(recordItem);

    // ========== 新增：错题自动存入 ==========
    if (!isCorrect) {
      RecordStore.saveWrong(currentQ);
      tipEl.innerText = `回答错误！正确答案：${currentQ.stdText}`;
      tipEl.style.color = "#e53e3e";
    } else {
      tipEl.innerText = "回答正确！";
      tipEl.style.color = "#38a169";
    }

    submitBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
  } catch (err) {
    tipEl.innerText = "格式错误！支持整数、小数、1/2、3又1/2";
    tipEl.style.color = "#f00";
    console.error(err);
  }
}

// 下一题（原有逻辑不变）
function handleNext() {
  renderNewQuestion();
}

// 切换筛选器（原有逻辑不变）
function bindSelectChange() {
  gradeSelect?.addEventListener("change", e => {
    grade = Number(e.target.value);
    renderNewQuestion();
  });
  levelSelect?.addEventListener("change", e => {
    diffLevel = e.target.value;
    renderNewQuestion();
  });
  typeSelect?.addEventListener("change", e => {
    qType = e.target.value;
    renderNewQuestion();
  });
}

// 绑定按钮、回车快捷键（原有逻辑不变）
function bindButtonClick() {
  submitBtn?.addEventListener("click", handleSubmit);
  nextBtn?.addEventListener("click", handleNext);
  ansInput?.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSubmit();
  });
}

// 页面初始化
window.onload = () => {
  bindSelectChange();
  bindButtonClick();
  renderNewQuestion();
};

// 导出记录工具，给你的错题/记录页面调用
export { RecordStore };
