import { getAllErrorList, clearAllError } from "./storage.js";
import { typeMap, levelMap, calcStandardAnswer } from "./data.js";

export function renderErrorBook(){
    const errList = getAllErrorList();
    const box = document.getElementById("errorBox");
    if(errList.length === 0){
        box.innerHTML = "<p style='text-align:center;font-size:18px;color:#666'>暂无错题，全部答对啦！</p>";
        return;
    }
    let html = "";
    errList.forEach((item,idx)=>{
        html += `
        <div class="record-item">
            <h4>错题${idx+1}</h4>
            <p>题目：${item.q}</p>
            <p>你的答案：${item.user}</p>
            <p class="wrong-text">标准答案：${item.std}</p>
            <p>年级${item.grade} | ${levelMap[item.level]} | ${typeMap[item.type]}</p>
        </div>`
    })
    box.innerHTML = html;
    document.getElementById("clearErrBtn").onclick = ()=>{
        if(confirm("清空全部错题？")){
            clearAllError();renderErrorBook();
        }
    }
}
