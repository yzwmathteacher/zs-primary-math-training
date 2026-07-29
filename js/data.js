/**
 * 按年级自动生成数学题，适配1-6年级课内知识点
 * grade:1~6
 * level:easy基础 / hard培优
 * type:oral口算 / simple简便计算 / math应用题
 */
function generateQuestion(grade, level, type) {
    let q = "";
    let answer = null;
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 一年级：只加减法
    if (grade == 1) {
        if (type === "oral") {
            if (level === "easy") {
                // 基础：20以内不进退位加减
                let a = rand(1, 10);
                let b = rand(1, 10);
                if (Math.random() > 0.5) {
                    q = `${a}+${b}`;
                    answer = a + b;
                } else {
                    if (a >= b) {
                        q = `${a}-${b}`;
                        answer = a - b;
                    } else {
                        q = `${b}-${a}`;
                        answer = b - a;
                    }
                }
            } else {
                // 培优：50以内进退位
                let a = rand(10, 40);
                let b = rand(10, 40);
                if (Math.random() > 0.5) {
                    q = `${a}+${b}`;
                    answer = a + b;
                } else {
                    q = `${Math.max(a,b)}-${Math.min(a,b)}`;
                    answer = Math.max(a,b) - Math.min(a,b);
                }
            }
        } else if (type === "math") {
            // 一年级应用题
            const sceneAdd = ["苹果", "铅笔", "花朵", "小鸟", "糖果"];
            const sceneSub = ["吃掉", "飞走", "送出去", "拿走"];
            if (Math.random() > 0.5) {
                let num1 = rand(3, 12);
                let num2 = rand(2, 9);
                let thing = sceneAdd[rand(0, sceneAdd.length - 1)];
                q = `桌上有${num1}个${thing}，妈妈又拿来${num2}个，一共有多少个？`;
                answer = num1 + num2;
            } else {
                let total = rand(8, 20);
                let out = rand(2, 7);
                let thing = sceneAdd[rand(0, sceneAdd.length - 1)];
                let act = sceneSub[rand(0, sceneSub.length - 1)];
                q = `一共有${total}个${thing}，${act}${out}个，还剩多少个？`;
                answer = total - out;
            }
        }
    }

    // 二年级：表内乘除、百以内加减
    if (grade == 2) {
        if (type === "oral") {
            if (level === "easy") {
                // 基础 表内乘除1-9
                let a = rand(1, 9);
                let b = rand(1, 9);
                if (Math.random() > 0.5) {
                    q = `${a}×${b}`;
                    answer = a * b;
                } else {
                    q = `${a*b}÷${a}`;
                    answer = b;
                }
            } else {
                // 培优：两位数加减+混合乘除
                if (Math.random() > 0.5) {
                    let a = rand(10, 90);
                    let b = rand(10, 90);
                    q = `${a}+${b}`;
                    answer = a + b;
                } else {
                    let x = rand(2, 9);
                    let y = rand(2, 9);
                    q = `${x}×${y}+${rand(1,10)}`;
                    answer = x * y + rand(1,10);
                }
            }
        } else if (type === "math") {
            // 乘法应用题
            let group = rand(2, 6);
            let per = rand(3, 8);
            q = `每组有${per}支笔，一共有${group}组，总共有多少支笔？`;
            answer = group * per;
        }
    }

    // 三年级：三位数加减、两位数乘除
    if (grade == 3) {
        if (type === "oral") {
            if (level === "easy") {
                let a = rand(100, 300);
                let b = rand(10, 99);
                q = Math.random() > 0.5 ? `${a}+${b}` : `${a}-${b}`;
                answer = q.includes("+") ? a + b : a - b;
            } else {
                let a = rand(10, 30);
                let b = rand(10, 20);
                q = `${a}×${b}`;
                answer = a * b;
            }
        } else if (type === "simple") {
            // 简便加法凑整
            let a = rand(100, 500);
            let b = rand(1, 9) * 10;
            let c = rand(1, 9);
            q = `${a}+${b}+${c}`;
            answer = a + b + c;
        } else if (type === "math") {
            let box = rand(3, 8);
            let num = rand(20, 50);
            q = `一箱有${num}本书，${box}箱一共有多少本书？`;
            answer = box * num;
        }
    }

    // 四年级：乘法分配律、交换律简便运算
    if (grade == 4) {
        if (type === "oral") {
            let a = rand(100, 999);
            let b = rand(2, 12);
            q = `${a}×${b}`;
            answer = a * b;
        } else if (type === "simple") {
            // 乘法分配律 a×(b+c)
            let a = rand(2, 15);
            let b = rand(1, 9);
            let c = rand(1, 9);
            q = `${a}×(${b}+${c})`;
            answer = a * (b + c);
        } else if (type === "math") {
            let len = rand(10, 30);
            let wid = rand(5, 20);
            q = `长方形长${len}米，宽${wid}米，周长是多少？`;
            answer = (len + wid) * 2;
        }
    }

    // 五年级：小数、分数四则
    if (grade == 5) {
        if (type === "oral") {
            if (level === "easy") {
                let a = rand(1, 9) + 0.1 * rand(1, 9);
                let b = rand(1, 9) + 0.1 * rand(1, 9);
                q = `${a}+${b}`;
                answer = Number((a + b).toFixed(2));
            } else {
                // 分数加减法
                let fm1 = rand(2, 6);
                let fm2 = rand(2, 6);
                let fz1 = rand(1, fm1 - 1);
                let fz2 = rand(1, fm2 - 1);
                q = `${fz1}/${fm1}+${fz2}/${fm2}`;
                answer = null;
            }
        } else if (type === "simple") {
            // 小数凑整简便
            let a = rand(2, 9) + 0.5;
            let b = rand(3, 9) + 0.5;
            q = `${a}×4+${b}×4`;
            answer = Number((a * 4 + b * 4).toFixed(2));
        } else if (type === "math") {
            let m = rand(10, 30) + 0.5;
            let price = rand(3, 10) + 0.5;
            q = `苹果每千克${price}元，买${m}千克需要多少钱？`;
            answer = Number((m * price).toFixed(2));
        }
    }

    // 六年级：分数乘除、百分数
    if (grade == 6) {
        if (type === "oral") {
            let fz = rand(1, 5);
            let fm = rand(2, 8);
            let num = rand(2, 10);
            q = `${fz}/${fm}×${num}`;
            answer = null;
        } else if (type === "simple") {
            let per = rand(10, 80);
            q = `120×${per}%`;
            answer = 120 * per / 100;
        } else if (type === "math") {
            let price = rand(80, 200);
            let discount = rand(70, 90);
            q = `商品原价${price}元，打${discount}折，现价多少元？`;
            answer = price * discount / 100;
        }
    }

    return { question: q, stdAnswer: answer };
}

// 自动计算标准答案
function calcStandardAnswer(question) {
    try {
        let str = question
            .replaceAll("×", "*")
            .replaceAll("÷", "/")
            .replace(/(\d+)\/(\d+)/g, "($1/$2)")
            .replace(/(\d+)%/g, "($1/100)");
        let res = eval(str);
        return Number(res.toFixed(4));
    } catch (e) {
        return null;
    }
}

const typeMap = { oral: "口算", simple: "简便计算", math: "应用题" }
const levelMap = { easy: "基础简单", hard: "培优提升" }

export { generateQuestion, calcStandardAnswer, typeMap, levelMap }
