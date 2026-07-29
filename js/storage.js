const RECORD_KEY = "zs_math_record";
const ERROR_KEY = "zs_math_error";

export function getAllRecords() {
    const data = localStorage.getItem(RECORD_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveRecord(record) {
    const list = getAllRecords();
    list.push(record);
    localStorage.setItem(RECORD_KEY, JSON.stringify(list));
}

export function getAllErrorList() {
    const data = localStorage.getItem(ERROR_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveWrongQuestion(wrongObj) {
    let errorList = getAllErrorList();
    const exist = errorList.find(item => item.q === wrongObj.q);
    if (!exist) {
        errorList.push(wrongObj);
        localStorage.setItem(ERROR_KEY, JSON.stringify(errorList));
    }
}

export function clearRecords() {
    localStorage.removeItem(RECORD_KEY);
}
export function clearAllError() {
    localStorage.removeItem(ERROR_KEY);
}

export function exportAllData() {
    const data = {records: getAllRecords(),errors: getAllErrorList()}
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "中山数学训练备份.json";
    a.click();
    URL.revokeObjectURL(url);
}

export function importData(jsonStr) {
    try {
        const data = JSON.parse(jsonStr);
        if (data.records) localStorage.setItem(RECORD_KEY, JSON.stringify(data.records));
        if (data.errors) localStorage.setItem(ERROR_KEY, JSON.stringify(data.errors));
        return true;
    } catch (e) {
        return false;
    }
}
