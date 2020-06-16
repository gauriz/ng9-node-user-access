module.exports.getNow = (flag) => {
    const date = new Date();
    const day = date.getDate();
    const month = getMonth(date.getMonth(), 'sc');
    const year = date.getFullYear();
    let ret = day + '-' + month + '-' + year;
    if (flag === 1) {
        ret += ' ' + formatTime(date) + '| ';
    }
    return ret;
}

function getMonth(month, flag) {
    let months = ['January', 'February', ' March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let monthSc = ['JAN', 'FEB', ' MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    switch (flag) {
        case 'sc': return monthSc[month];
        case 'full': return months[month];
        default: return 'UNDEFINED';
    }
}

function formatTime(date) {
    const leadingZero = (num) => `0${num}`.slice(-2);
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map(leadingZero)
        .join(':');
}