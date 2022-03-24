

// My favourite funtion (cause im lazy)
function yeet(str = 'yeet', ...rest) {
    let logStr = str;
    rest.forEach(log => {
        logStr += ' ' + log
    });
    console.log(logStr)
}

const debug = {
    getKeyCodes: [false, () => { yeet(keyCode) }],
}