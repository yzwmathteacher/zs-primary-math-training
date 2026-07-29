/**
 * 1-6年级动态出题引擎
 * grade:1~6
 * level:easy基础 / hard培优
 * type:oral口算 / simple简便计算 / math应用题
 * 支持整数、小数、分数自动计算，输出标准化分数答案用于判题
 */
function gcd(a, b) {
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return Math.abs(a);
}

// 小数转最简分数 {fz,fm}
function decimalToFrac(num) {
    if (Number.isInteger(num)) return {fz: num, fm: 1};
    const str = num.toFixed(6).replace(/\.?0*$/, "");
    const dotIdx = str.indexOf(".");
    if (dotIdx === -1) return {fz: Number(str), fm: 1};
    const intPart = str.slice(0, dotIdx);
    const decPart = str.slice(dotIdx + 1);
    const fz = Number(intPart + decPart);
    const fm = 10 ** decPart.length;
    const g = gcd(fz, fm);
    return {fz: fz / g, fm: fm / g};
}

// 分数加法 a/b + c/d
function fracAdd(aFz, aFm, bFz, bFm) {
    const newFz = aFz * bFm + bFz * aFm;
    const newFm = aFm * bFm;
    const g = gcd(newFz, newFm);
    return {fz: newFz / g, fm: newFm / g};
}

// 分数乘法
function fracMul(aFz, aFm, bFz, bFm) {
    const newFz = aFz * bFz;
    const newFm = aFm * bFm;
    const g = gcd(newFz, newFm);
    return {fz: newFz / g, fm: newFm / g};
}

// 解析用户输入：支持 5、3.5、1/2、3又1/2 格式，统一转为分数对象
function parseInputToFrac(text) {
    text = text.trim();
    // 带分数 3又1/2
    if (text.includes("又")) {
        const [intStr, fracStr] = text.split("又");
        const [fz, fm] = fracStr.split("/").map(Number);
        const intNum = Number(intStr);
        return fracAdd(intNum, 1, fz, fm);
    }
    // 普通分数 a/b
    if (text.includes("/")) {
        const [fz, fm] = text.split("/").map(Number);
        return {fz, fm};
    }
    // 小数/整数
    const num = Number(text);
    return decimalToFrac(num);
}

// 对比两个分数是否相等
function fracEqual(f1, f2) {
    return f1.fz === f2.fz && f1.fm === f2.fm;
}

// 格式化分数为可读字符串
function formatFrac(f) {
    if (f.fm === 1) return String(f.fz);
    if (Math.abs(f.fz) > f.fm) {
        const int = Math.floor(f.fz / f.fm);
        const rem = f.fz % f.fm;
        return `${int}又${rem}/${f.fm}`;
    }
    return `${f.fz}/${f.fm}`;
}

// 生成题目 + 标准分数答案
function generateQuestion(grade, level, type) {
    let q = "";
    let stdFrac = null;
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 一年级 整数加减
    if (grade == 1) {
        if (type === "oral") {
            if (level === "easy") {
                let a = rand(1, 10);
                let b = rand(1, 10);
                if (Math.random() > 0.5) {
                    q = `${a}+${b}`;
                    stdFrac = {fz: a + b, fm: 1};
                } else {
                    let x = Math.max(a, b), y = Math.min(a, b);
                    q = `${x}-${y}`;
                    stdFrac = {fz: x - y, fm: 1};
                }
            } else {
                let a = rand(10, 40);
                let b = rand(10, 40);
                if (Math.random() > 0.5) {
                    q = `${a}+${b}`;
                    stdFrac = {fz: a + b, fm: 1};
                } else {
                    let x = Math.max(a, b), y = Math.min(a, b);
                    q = `${x}-${y}`;
                    stdFrac = {fz: x - y, fm: 1};
                }
            }
        } else if (type === "math") {
            const items = ["苹果", "铅笔", "花朵", "小鸟", "糖果"];
            const actsSub = ["吃掉", "飞走", "送出去", "拿走"];
            if (Math.random() > 0.5) {
                let n1 = rand(3, 12), n2 = rand(2, 9);
                let thing = items[rand(0, items.length - 1)];
                q = `桌上有${n1}个${thing}，妈妈又拿来${n2}个，一共有多少个？`;
                stdFrac = {fz: n1 + n2, fm: 1};
            } else {
                let total = rand(8, 20), out = rand(2, 7);
                let thing = items[rand(0, items.length - 1)];
                let act = actsSub[rand(0, actsSub.length - 1)];
                q = `一共有${total}个${thing}，${act}${out}个，还剩多少个？`;
                stdFrac = {fz: total - out, fm: 1};
            }
        }
    }

    // 二年级 乘除、百以内加减
    if (grade == 2) {
        if (type === "oral") {
            if (level === "easy") {
                let a = rand(1, 9), b = rand(1, 9);
                if (Math.random() > 0.5) {
                    q = `${a}×${b}`;
                    stdFrac = {fz: a * b, fm: 1};
                } else {
                    q = `${a*b}÷${a}`;
                    stdFrac = {fz: b, fm: 1};
                }
            } else {
                if (Math.random() > 0.5) {
                    let a = rand(10, 90), b = rand(10, 90);
                    q = `${a}+${b}`;
                    stdFrac = {fz: a + b, fm: 1};
                } else {
                    let x = rand(2, 9), y = rand(2, 9), add = rand(1,10);
                    q = `${x}×${y}+${add}`;
                    stdFrac = {fz: x*y + add, fm: 1};
                }
            }
        } else if (type === "math") {
            let group = rand(2, 6), per = rand(3, 8);
            q = `每组有${per}支笔，一共有${group}组，总共有多少支笔？`;
            stdFrac = {fz: group * per, fm: 1};
        }
    }

    // 三年级 三位数、两位数乘法、凑整简便
    if (grade == 3) {
        if (type === "oral") {
            if (level === "easy") {
                let a = rand(100, 300), b = rand(10, 99);
                if (Math.random() > 0.5) {
                    q = `${a}+${b}`;
                    stdFrac = {fz: a + b, fm: 1};
                } else {
                    q = `${a}-${b}`;
                    stdFrac = {fz: a - b, fm: 1};
                }
            } else {
                let a = rand(10, 30), b = rand(10, 20);
                q = `${a}×${b}`;
                stdFrac = {fz: a * b, fm: 1};
            }
        } else if (type === "simple") {
            let a = rand(100, 500), b = rand(1,9)*10, c = rand(1,9);
            q = `${a}+${b}+${c}`;
            stdFrac = {fz: a + b + c, fm: 1};
        } else if (type === "math") {
            let box = rand(3,8), num = rand(20,50);
            q = `一箱有${num}本书，${box}箱一共有多少本书？`;
            stdFrac = {fz: box * num, fm: 1};
        }
    }

    // 四年级 乘法分配律、多位数乘法
    if (grade == 4) {
        if (type === "oral") {
            let a = rand(100,999), b = rand(2,12);
            q = `${a}×${b}`;
            stdFrac = {fz: a * b, fm: 1};
        } else if (type === "simple") {
            let a = rand(2,15), b = rand(1,9), c = rand(1,9);
            q = `${a}×(${b}+${c})`;
            stdFrac = {fz: a*(b+c), fm:1};
        } else if (type === "math") {
            let len = rand(10,30), wid = rand(5,20);
            q = `长方形长${len}米，宽${wid}米，周长是多少？`;
            stdFrac = {fz: (len + wid)*2, fm:1};
        }
    }

    // 五年级 小数、分数加减
    if (grade == 5) {
        if (type === "oral") {
            if (level === "easy") {
                let a = rand(1,9) + 0.1 * rand(1,9);
                let b = rand(1,9) + 0.1 * rand(1,9);
                q = `${a}+${b}`;
                stdFrac = decimalToFrac(a + b);
            } else {
                let fm1 = rand(2,6), fm2 = rand(2,6);
                let fz1 = rand(1, fm1-1), fz2 = rand(1, fm2-1);
                q = `${fz1}/${fm1}+${fz2}/${fm2}`;
                stdFrac = fracAdd(fz1, fm1, fz2, fm2);
            }
        } else if (type === "simple") {
            let a = rand(2,9)+0.5, b = rand(3,9)+0.5;
            q = `${a}×4+${b}×4`;
            stdFrac = decimalToFrac(a*4 + b*4);
        } else if (type === "math") {
            let m = rand(10,30)+0.5;
            let price = rand(3,10)+0.5;
            q = `苹果每千克${price}元，买${m}千克需要多少钱？`;
            stdFrac = decimalToFrac(m * price);
        }
    }

    // 六年级 分数乘除、百分数
    if (grade == 6) {
        if (type === "oral") {
            let fz = rand(1,5), fm = rand(2,8), num = rand(2,10);
            q = `${fz}/${fm}×${num}`;
            stdFrac = fracMul(fz, fm, num, 1);
        } else if (type === "simple") {
            let per = rand(10,80);
            q = `120×${per}%`;
            stdFrac = decimalToFrac(120 * per / 100);
        } else if (type === "math") {
            let price = rand(80,200), discount = rand(70,90);
            q = `商品原价${price}元，打${discount}折，现价多少元？`;
            stdFrac = decimalToFrac(price * discount / 100);
        }
    }

    return {
        question: q,
        stdFrac: stdFrac,
        stdText: formatFrac(stdFrac)
    };
}

const typeMap = { oral: "口算", simple: "简便计算", math: "应用题" }
const levelMap = { easy: "基础简单", hard: "培优提升" }

export {
    generateQuestion,
    parseInputToFrac,
    fracEqual,
    formatFrac,
    typeMap,
    levelMap
};
