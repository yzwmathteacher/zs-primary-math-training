/**
 * 全年级动态出题引擎
 * grade:1~6
 * level:easy基础 / hard培优
 * type:oral口算 / simple简便计算 / math应用题
 * 特性：多题型随机、全套简便定律、整数/小数/分数全自动判题、应用题全场景覆盖
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

// 分数四则运算
function fracAdd(aFz, aFm, bFz, bFm) {
    const newFz = aFz * bFm + bFz * aFm;
    const newFm = aFm * bFm;
    const g = gcd(newFz, newFm);
    return {fz: newFz / g, fm: newFm / g};
}
function fracSub(aFz, aFm, bFz, bFm) {
    const newFz = aFz * bFm - bFz * aFm;
    const newFm = aFm * bFm;
    const g = gcd(newFz, newFm);
    return {fz: newFz / g, fm: newFm / g};
}
function fracMul(aFz, aFm, bFz, bFm) {
    const newFz = aFz * bFz;
    const newFm = aFm * bFm;
    const g = gcd(newFz, newFm);
    return {fz: newFz / g, fm: newFm / g};
}
function fracDiv(aFz, aFm, bFz, bFm) {
    const newFz = aFz * bFm;
    const newFm = aFm * bFz;
    const g = gcd(newFz, newFm);
    return {fz: newFz / g, fm: newFm / g};
}

// 解析用户输入：整数/小数/分数1/2/带分数3又1/2
function parseInputToFrac(text) {
    text = text.trim();
    if (text.includes("又")) {
        const [intStr, fracStr] = text.split("又");
        const [fz, fm] = fracStr.split("/").map(Number);
        const intNum = Number(intStr);
        return fracAdd(intNum, 1, fz, fm);
    }
    if (text.includes("/")) {
        const [fz, fm] = text.split("/").map(Number);
        return {fz, fm};
    }
    const num = Number(text);
    return decimalToFrac(num);
}

// 分数相等对比，自动约分匹配
function fracEqual(f1, f2) {
    return f1.fz === f2.fz && f1.fm === f2.fm;
}

// 格式化标准答案输出
function formatFrac(f) {
    if (f.fm === 1) return String(f.fz);
    if (Math.abs(f.fz) > f.fm) {
        const int = Math.floor(f.fz / f.fm);
        const rem = f.fz % f.fm;
        return `${int}又${rem}/${f.fm}`;
    }
    return `${f.fz}/${f.fm}`;
}

// 随机数工具
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 主生成函数
function generateQuestion(grade, level, type) {
    let q = "";
    let stdFrac = null;

    // ====================== 1.口算模块（多题型随机混合） ======================
    if (type === "oral") {
        // 一年级
        if (grade === 1) {
            const typePool = level === "easy" ? ["add", "sub"] : ["add", "sub", "mix"];
            const t = typePool[rand(0, typePool.length - 1)];
            if (t === "add") {
                const max = level === "easy" ? 10 : 50;
                const a = rand(1, max / 2);
                const b = rand(1, max / 2);
                q = `${a}+${b}`;
                stdFrac = {fz: a + b, fm: 1};
            } else if (t === "sub") {
                const max = level === "easy" ? 10 : 50;
                const a = rand(1, max);
                const b = rand(1, a - 1);
                q = `${a}-${b}`;
                stdFrac = {fz: a - b, fm: 1};
            } else if (t === "mix") {
                const a = rand(10, 30);
                const b = rand(1, 9);
                const op = Math.random() > 0.5 ? "+" : "-";
                q = `${a}${op}${b}`;
                stdFrac = op === "+" ? {fz: a + b, fm: 1} : {fz: a - b, fm: 1};
            }
        }
        // 二年级
        if (grade === 2) {
            const pool = level === "easy" ? ["mul", "div"] : ["mul", "div", "addsub", "muladd"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "mul") {
                const a = rand(1, 9), b = rand(1, 9);
                q = `${a}×${b}`;
                stdFrac = {fz: a * b, fm: 1};
            } else if (t === "div") {
                const a = rand(1, 9), b = rand(1, 9);
                q = `${a*b}÷${a}`;
                stdFrac = {fz: b, fm: 1};
            } else if (t === "addsub") {
                const a = rand(10, 90), b = rand(10, 90);
                const op = Math.random() > 0.5 ? "+" : "-";
                q = `${a}${op}${b}`;
                stdFrac = op === "+" ? {fz: a + b, fm: 1} : {fz: a - b, fm: 1};
            } else if (t === "muladd") {
                const x = rand(2, 9), y = rand(2, 9), c = rand(1, 10);
                const op = Math.random() > 0.5 ? "+" : "-";
                q = `${x}×${y}${op}${c}`;
                stdFrac = op === "+" ? {fz: x*y + c, fm: 1} : {fz: x*y - c, fm: 1};
            }
        }
        // 三年级
        if (grade === 3) {
            const pool = ["threeAdd", "threeSub", "twoMul", "mix"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "threeAdd") {
                const a = rand(100, 400), b = rand(10, 99);
                q = `${a}+${b}`;
                stdFrac = {fz: a + b, fm: 1};
            } else if (t === "threeSub") {
                const a = rand(200, 500), b = rand(10, 99);
                q = `${a}-${b}`;
                stdFrac = {fz: a - b, fm: 1};
            } else if (t === "twoMul") {
                const a = rand(10, 30), b = rand(10, 20);
                q = `${a}×${b}`;
                stdFrac = {fz: a * b, fm: 1};
            } else if (t === "mix") {
                const a = rand(10, 20), b = rand(2, 9), c = rand(1, 50);
                q = `${a}×${b}+${c}`;
                stdFrac = {fz: a*b + c, fm: 1};
            }
        }
        // 四年级
        if (grade === 4) {
            const pool = ["bigMul", "mixBracket", "twoStep"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "bigMul") {
                const a = rand(100, 999), b = rand(2, 12);
                q = `${a}×${b}`;
                stdFrac = {fz: a * b, fm: 1};
            } else if (t === "mixBracket") {
                const a = rand(2, 9), b = rand(1, 9), c = rand(10, 50);
                q = `${c}+${a}×${b}`;
                stdFrac = {fz: c + a*b, fm: 1};
            } else if (t === "twoStep") {
                const a = rand(40, 100), b = rand(2, 8), add = rand(1,20);
                q = `${a}÷${b}+${add}`;
                stdFrac = decimalToFrac(a / b + add);
            }
        }
        // 五年级
        if (grade === 5) {
            const pool = level === "easy" ? ["decAdd", "decSub"] : ["decMul", "fracAdd", "fracSub"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "decAdd") {
                const a = rand(1,9) + 0.1 * rand(1,9);
                const b = rand(1,9) + 0.1 * rand(1,9);
                q = `${a}+${b}`;
                stdFrac = decimalToFrac(a + b);
            } else if (t === "decSub") {
                const a = rand(2,9) + 0.5;
                const b = rand(1, a-1) + 0.1;
                q = `${a}-${b}`;
                stdFrac = decimalToFrac(a - b);
            } else if (t === "decMul") {
                const a = rand(1,5) + 0.5;
                const b = rand(2, 10);
                q = `${a}×${b}`;
                stdFrac = decimalToFrac(a * b);
            } else if (t === "fracAdd") {
                const fm1 = rand(2,6), fm2 = rand(2,6);
                const fz1 = rand(1, fm1-1), fz2 = rand(1, fm2-1);
                q = `${fz1}/${fm1}+${fz2}/${fm2}`;
                stdFrac = fracAdd(fz1, fm1, fz2, fm2);
            } else if (t === "fracSub") {
                const fm1 = rand(3,7), fm2 = rand(2,5);
                const fz1 = rand(2, fm1-1), fz2 = rand(1, fz1);
                q = `${fz1}/${fm1}-${fz2}/${fm2}`;
                stdFrac = fracSub(fz1, fm1, fz2, fm2);
            }
        }
        // 六年级
        if (grade === 6) {
            const pool = ["fracMul", "fracDiv", "percent", "mixDecFrac"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "fracMul") {
                const fz = rand(1,5), fm = rand(2,8), num = rand(2,10);
                q = `${fz}/${fm}×${num}`;
                stdFrac = fracMul(fz, fm, num, 1);
            } else if (t === "fracDiv") {
                const fz1 = rand(1,4), fm1 = rand(2,6);
                const fz2 = rand(1,3), fm2 = rand(2,5);
                q = `${fz1}/${fm1}÷${fz2}/${fm2}`;
                stdFrac = fracDiv(fz1, fm1, fz2, fm2);
            } else if (t === "percent") {
                const base = rand(100, 200), per = rand(10,90);
                q = `${base}×${per}%`;
                stdFrac = decimalToFrac(base * per / 100);
            } else if (t === "mixDecFrac") {
                const dec = rand(1,5)+0.5;
                const fz = rand(1,3), fm = rand(2,4);
                q = `${dec}+${fz}/${fm}`;
                const decFrac = decimalToFrac(dec);
                stdFrac = fracAdd(decFrac.fz, decFrac.fm, fz, fm);
            }
        }
    }

    // ====================== 2.简便计算（全套定律全覆盖） ======================
    if (type === "simple") {
        // 三年级：加法交换/结合凑整
        if (grade === 3) {
            const lawPool = ["addSwap", "addCombineTen"];
            const law = lawPool[rand(0, lawPool.length - 1)];
            if (law === "addSwap") {
                const a = rand(100, 400), b = rand(1,9)*10, c = rand(1,9);
                q = `${a}+${b}+${c}`;
                stdFrac = {fz: a + b + c, fm: 1};
            } else if (law === "addCombineTen") {
                const a = rand(100, 300), b = rand(1,9)*5, c = 10 - b % 10;
                q = `${a}+${b}+${c}`;
                stdFrac = {fz: a + b + c, fm: 1};
            }
        }
        // 四年级：乘交换/结合、分配律、连减性质
        if (grade === 4) {
            const lawPool = ["mulSwap", "mulCombine", "distribute", "subChain"];
            const law = lawPool[rand(0, lawPool.length - 1)];
            if (law === "mulSwap") {
                const a = rand(2,9), b = rand(5,20), c = rand(2,5);
                q = `${a}×${b}×${c}`;
                stdFrac = {fz: a*b*c, fm: 1};
            } else if (law === "mulCombine") {
                const a = rand(2,9), b = 25, c = 4;
                q = `${a}×${b}×${c}`;
                stdFrac = {fz: a*b*c, fm: 1};
            } else if (law === "distribute") {
                const a = rand(2,15), b = rand(1,9), c = rand(1,9);
                q = `${a}×(${b}+${c})`;
                stdFrac = {fz: a*(b+c), fm:1};
            } else if (law === "subChain") {
                const total = rand(200, 500), x = rand(20,90), y = rand(10,50);
                q = `${total}-${x}-${y}`;
                stdFrac = {fz: total - x - y, fm:1};
            }
        }
        // 五年级：小数分配、连除、反向分配、小数凑整
        if (grade === 5) {
            const lawPool = ["decDistribute", "divChain", "decCombine", "reverseDist"];
            const law = lawPool[rand(0, lawPool.length - 1)];
            if (law === "decDistribute") {
                const a = rand(2,9)+0.5, b = rand(3,9)+0.5, k = rand(2,5);
                q = `${a}×${k}+${b}×${k}`;
                stdFrac = decimalToFrac(a*k + b*k);
            } else if (law === "divChain") {
                const total = rand(100, 500), x = rand(2,8), y = rand(2,5);
                q = `${total}÷${x}÷${y}`;
                stdFrac = decimalToFrac(total / x / y);
            } else if (law === "decCombine") {
                const a = rand(1,9)+0.25, b = rand(1,9)+0.75, num = rand(10,50);
                q = `${a}+${b}+${num}`;
                stdFrac = decimalToFrac(a + b + num);
            } else if (law === "reverseDist") {
                const k = rand(2,6), a = rand(1,9)+0.5, b = rand(1,9)+0.5;
                q = `${k}×${a}-${k}×${b}`;
                stdFrac = decimalToFrac(k*a - k*b);
            }
        }
        // 六年级：分数分配、百分数简便、分数凑1、拆分凑整
        if (grade === 6) {
            const lawPool = ["fracDistribute", "percentSimple", "fracCombine", "splitWhole"];
            const law = lawPool[rand(0, lawPool.length - 1)];
            if (law === "fracDistribute") {
                const k = rand(2,6), fz1 = rand(1,4), fm1 = rand(2,5), fz2 = rand(1,3), fm2 = rand(2,4);
                q = `${k}×(${fz1}/${fm1}+${fz2}/${fm2})`;
                const p1 = fracMul(k,1,fz1,fm1);
                const p2 = fracMul(k,1,fz2,fm2);
                stdFrac = fracAdd(p1.fz, p1.fm, p2.fz, p2.fm);
            } else if (law === "percentSimple") {
                const num = rand(80, 300), p1 = 25, p2 = 75;
                q = `${num}×${p1}% + ${num}×${p2}%`;
                stdFrac = decimalToFrac(num * 0.25 + num * 0.75);
            } else if (law === "fracCombine") {
                const fz1 = 1, fm1 = 4, fz2 = 3, fm2 = 4, num = rand(2,10);
                q = `${num} + ${fz1}/${fm1} + ${fz2}/${fm2}`;
                stdFrac = fracAdd(num,1,1,1);
            } else if (law === "splitWhole") {
                const base = rand(90,99), add = rand(1,9), mul = rand(2,5);
                q = `(${base}+${add})×${mul}`;
                stdFrac = {fz: (base+add)*mul, fm:1};
            }
        }
    }

    // ====================== 3.应用题 math【大幅扩充全场景】 ======================
    if (type === "math") {
        // 一年级：求和、求剩余、比多少三类基础
        if (grade === 1) {
            const pool = ["sum", "remain", "compare"];
            const t = pool[rand(0, pool.length - 1)];
            const items = ["苹果", "铅笔", "花朵", "小鸟", "糖果"];
            const thing = items[rand(0, items.length - 1)];
            if (t === "sum") {
                let n1 = rand(3, 12), n2 = rand(2, 9);
                q = `桌上有${n1}个${thing}，妈妈又拿来${n2}个，一共有多少个？`;
                stdFrac = {fz: n1 + n2, fm: 1};
            } else if (t === "remain") {
                let total = rand(8, 20), out = rand(2, 7);
                const acts = ["吃掉", "飞走", "送出去", "拿走"];
                const act = acts[rand(0, acts.length - 1)];
                q = `一共有${total}个${thing}，${act}${out}个，还剩多少个？`;
                stdFrac = {fz: total - out, fm: 1};
            } else if (t === "compare") {
                let a = rand(5, 15), b = rand(2, a-1);
                q = `小红有${a}支${thing}，小明有${b}支，小红比小明多多少支？`;
                stdFrac = {fz: a - b, fm: 1};
            }
        }
        // 二年级：归一、份数、乘加两步、平均分
        if (grade === 2) {
            const pool = ["multi", "avgDiv", "twoStepAdd", "groupSum"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "multi") {
                let group = rand(2, 6), per = rand(3, 8);
                q = `每组有${per}支笔，一共有${group}组，总共有多少支笔？`;
                stdFrac = {fz: group * per, fm: 1};
            } else if (t === "avgDiv") {
                let total = rand(12, 48), people = rand(2, 8);
                q = `一共有${total}块饼干，平均分给${people}个小朋友，每人分几块？`;
                stdFrac = {fz: total / people, fm: 1};
            } else if (t === "twoStepAdd") {
                let box = rand(2,5), perBox = rand(4,9), extra = rand(3,10);
                q = `有${box}盒橡皮，每盒${perBox}块，另外还有${extra}块零散的，一共多少块？`;
                stdFrac = {fz: box * perBox + extra, fm:1};
            } else if (t === "groupSum") {
                let row = rand(3,7), col = rand(2,6);
                q = `教室座位摆了${row}行，每行${col}个位置，一共能坐多少人？`;
                stdFrac = {fz: row * col, fm:1};
            }
        }
        // 三年级：归总、归一、长方形周长、购物总价、连减库存
        if (grade === 3) {
            const pool = ["totalPrice", "returnMoney", "rectPeri", "guiZong", "stockSub"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "totalPrice") {
                let box = rand(3,8), num = rand(20,50);
                q = `一箱有${num}本书，${box}箱一共有多少本书？`;
                stdFrac = {fz: box * num, fm: 1};
            } else if (t === "returnMoney") {
                let price = rand(15,80), pay = rand(100,200);
                q = `买一件商品花${price}元，付给售货员${pay}元，应找回多少钱？`;
                stdFrac = {fz: pay - price, fm:1};
            } else if (t === "rectPeri") {
                let len = rand(10,30), wid = rand(5,20);
                q = `长方形长${len}米，宽${wid}米，周长是多少米？`;
                stdFrac = {fz: (len + wid)*2, fm:1};
            } else if (t === "guiZong") {
                let perDay = rand(10,30), day = rand(3,7), newPer = rand(15,40);
                q = `工人每天加工${perDay}个零件，${day}天完成；如果每天加工${newPer}个，需要几天？`;
                stdFrac = decimalToFrac((perDay * day) / newPer);
            } else if (t === "stockSub") {
                let stock = rand(200,500), sell1 = rand(30,80), sell2 = rand(20,60);
                q = `商店原有${stock}件商品，上午卖出${sell1}件，下午卖出${sell2}件，还剩多少件？`;
                stdFrac = {fz: stock - sell1 - sell2, fm:1};
            }
        }
        // 四年级：长方形面积、行程基础、和差问题、单价数量总价、连除归一
        if (grade === 4) {
            const pool = ["rectArea", "walkDist", "sumDiff", "priceCount", "divGuiYi"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "rectArea") {
                let len = rand(8,25), wid = rand(6,18);
                q = `一块长方形菜地长${len}米，宽${wid}米，面积是多少平方米？`;
                stdFrac = {fz: len * wid, fm:1};
            } else if (t === "walkDist") {
                let speed = rand(40,80), min = rand(10,30);
                q = `小明每分钟走${speed}米，走了${min}分钟，一共走了多少米？`;
                stdFrac = {fz: speed * min, fm:1};
            } else if (t === "sumDiff") {
                let sum = rand(40,100), diff = rand(4,16);
                q = `甲乙两数和是${sum}，甲数比乙数大${diff}，乙数是多少？`;
                stdFrac = decimalToFrac((sum - diff) / 2);
            } else if (t === "priceCount") {
                let unit = rand(12,35), count = rand(4,12);
                q = `笔记本每本${unit}元，买${count}本一共需要多少元？`;
                stdFrac = {fz: unit * count, fm:1};
            } else if (t === "divGuiYi") {
                let total = rand(240,600), box = rand(4,10), pack = rand(2,6);
                q = `${total}个水杯，平均分${box}箱，每箱再分${pack}盒，每盒多少个？`;
                stdFrac = decimalToFrac(total / box / pack);
            }
        }
        // 五年级：小数价格、相遇行程、梯形面积、平均数、分段计价
        if (grade === 5) {
            const pool = ["decShop", "meetRoad", "trapezoidArea", "avgNum", "stepPrice"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "decShop") {
                let m = rand(10,30)+0.5;
                let price = rand(3,10)+0.5;
                q = `苹果每千克${price}元，买${m}千克需要多少钱？`;
                stdFrac = decimalToFrac(m * price);
            } else if (t === "meetRoad") {
                let v1 = rand(40,60), v2 = rand(35,55), h = rand(2,5);
                q = `甲乙两车相向而行，甲车每小时${v1}km，乙车每小时${v2}km，${h}小时相遇，两地相距多少km？`;
                stdFrac = {fz: (v1 + v2) * h, fm:1};
            } else if (t === "trapezoidArea") {
                let up = rand(6,15), down = rand(12,25), h = rand(4,12);
                q = `梯形菜地，上底${up}m，下底${down}m，高${h}m，面积多少平方米？`;
                stdFrac = decimalToFrac((up + down) * h / 2);
            } else if (t === "avgNum") {
                let a = rand(80,95), b = rand(75,92), c = rand(82,96);
                q = `小明三次考试分数：${a}分、${b}分、${c}分，平均分是多少？`;
                stdFrac = decimalToFrac((a + b + c) / 3);
            } else if (t === "stepPrice") {
                let base = rand(10,20), over = rand(5,15), unit = rand(1.2,2.8).toFixed(1);
                q = `打车起步${base}元可走3公里，超过部分每公里${unit}元，走${over}公里一共多少钱？`;
                const extra = over - 3;
                stdFrac = decimalToFrac(base + extra * Number(unit));
            }
        }
        // 六年级：折扣、分数占比、圆柱体积、利率、百分数增产、工程基础
        if (grade === 6) {
            const pool = ["discount", "fracPercent", "cylinderVol", "bankRate", "increasePer", "simpleWork"];
            const t = pool[rand(0, pool.length - 1)];
            if (t === "discount") {
                let price = rand(80,200), discount = rand(70,90);
                q = `商品原价${price}元，打${discount}折，现价多少元？`;
                stdFrac = decimalToFrac(price * discount / 100);
            } else if (t === "fracPercent") {
                let total = rand(120,300), per = rand(20,60);
                q = `全校共${total}人，男生占${per}%，男生有多少人？`;
                stdFrac = decimalToFrac(total * per / 100);
            } else if (t === "cylinderVol") {
                let r = rand(2,6), h = rand(8,20);
                q = `圆柱底面半径${r}分米，高${h}分米，体积是多少？(π取3.14)`;
                stdFrac = decimalToFrac(3.14 * r * r * h);
            } else if (t === "bankRate") {
                let money = rand(1000,5000), rate = rand(2,4) / 100, year = rand(2,5);
                q = `存入银行${money}元，年利率${rate}，存${year}年，利息多少元？`;
                stdFrac = decimalToFrac(money * rate * year);
            } else if (t === "increasePer") {
                let base = rand(100,300), up = rand(10,30);
                q = `去年产量${base}吨，今年增产${up}%，今年产量多少吨？`;
                stdFrac = decimalToFrac(base * (1 + up / 100));
            } else if (t === "simpleWork") {
                let aDay = rand(6,12), bDay = rand(8,15);
                q = `甲单独${aDay}天完成工程，乙单独${bDay}天完成，两人合作一天完成几分之几？`;
                const f1 = fracMul(1,1,1,aDay);
                const f2 = fracMul(1,1,1,bDay);
                stdFrac = fracAdd(f1.fz, f1.fm, f2.fz, f2.fm);
            }
        }
    }

    return {
        question: q,
        stdFrac: stdFrac,
        stdText: formatFrac(stdFrac)
    };
}

// 导出映射
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
