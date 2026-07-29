import { generateQuestion, parseInputToFrac, fracEqual, formatFrac, typeMap, levelMap } from "./data.js";

// 全局配置
let currentQ = null;
let grade = 5;
let diffLevel = "easy";
let qType = "math";

// DOM节点
const qTextEl = document.getElementById("question-text");
const ansInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const tipEl = document.getElementById("tip-text");
const gradeSelect = document.getElementById("grade-select");
const levelSelect = document.getElementById("level-select");
const typeSelect = document.getElementById("type-select");

// 本地记录、错题持久化工具
const RecordStore = {
  getRecordList() {
    const str = localStorage.getItem("practice_records");
    return str ? JSON.parse(str) : [];
  },
  saveRecord(item) {
    const list = this.getRecordList();
    list.unshift(item);
    // 最多保存500条，防止缓存溢出
    if (list.length > 500) list.pop();
    localStorage.setItem("practice_records", JSON.stringify(list));
  },
  getWrongList() {
    const str = localStorage.getItem("wrong_questions");
    return str ? JSON.parse(str) : [];
  },
  saveWrong(item) {
    const list = this.getWrongList();
    // 重复题目不重复存入错题本
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

// 生成并渲染新题目
function renderNewQuestion() {
  currentQ = generateQuestion(grade, diffLevel, qType);
  qTextEl.innerText = currentQ.question;
  ansInput.value = "";
  tipEl.innerText = "";
  nextBtn.style.display = "none";
  submitBtn.style.display = "inline-block";
}

// 提交答案核心逻辑（自动保存记录+错题）
function handleSubmit() {
  const inputVal = ansInput.value.trim();
  if (!inputVal) {
    tipEl.innerText = "请输入答案！";
    tipEl.style.color = "#f00000";
    return;
  }

  try {
    const userFrac = parseInputToFrac(inputVal);
    const stdFrac = currentQ.stdFrac;
    const isCorrect = fracEqual(userFrac, stdFrac);

    // 保存本条答题记录
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

    // 答错存入错题库
    if (!isCorrect) {
      RecordStore.saveWrong(currentQ);
      tipEl.innerText = `回答错误！正确答案：${currentQ.stdText}`;
      tipEl.style.color = "#e53e3e";
    } else {
      tipEl.innerText = "回答正确！";
      tipEl.style.color = "#38a169";
    }

    // 切换按钮状态
    submitBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
  } catch (err) {
    tipEl.innerText = "格式错误！支持整数、小数、分数1/2、带分数3又1/2";
    tipEl.style.color = "#f00000";
    console.error("解析答案异常：", err);
  }
}

// 下一题
function handleNext() {
  renderNewQuestion();
}

// 切换年级/难度/题型绑定
function bindSelectChange() {
  gradeSelect.addEventListener("change", e => {
    grade = Number(e.target.value);
    renderNewQuestion();
  });
  levelSelect.addEventListener("change", e => {
    diffLevel = e.target.value;
    renderNewQuestion();
  });
  typeSelect.addEventListener("change", e => {
    qType = e.target.value;
    renderNewQuestion();
  });
}

// 按钮、回车快捷键绑定
function bindButtonClick() {
  submitBtn.addEventListener("click", handleSubmit);
  nextBtn.addEventListener("click", handleNext);
  // 回车快速提交
  ansInput.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSubmit();
  });
}

// 页面加载初始化
window.onload = () => {
  bindSelectChange();
  bindButtonClick();
  renderNewQuestion();
};

// 导出记录工具，记录/错题页面可读取数据
export { RecordStore };
