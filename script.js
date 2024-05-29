// yasseen kissy kissy bobo
let brackets, stack = [];
let result = "", fail = [['X'], ['-']];

function validate(s) {
    let st = [];
    for (i = 0; i < s.length; i++) {
        if (s[i] == '(') {
            st.push('(');
        }
        if (s[i] == ')') {
            if (st.length) {
                st.pop();
            }
            else {
                return -1;
            }
        }
    }
    for (i = 0; i < st.length; i++) {
        s += ')';
    }
    return s;
}

function is_var(s) {
    return !(s == '(' || s == ')' || s == '!' || s == '&' || s == '^' || s == '|' || s == '⁛' || s == '⁝' || s == '⁞' || s == '⁚' || s == '⁘' || s == '⁙' || s == '♪');
}

function is_gate(s) {
    return (s == '&' || s == '^' || s == '|' || s == '⁛' || s == '⁝' || s == '⁞' || s == '⁚' || s == '⁘' || s == '⁙');
}

function sub(gate, s1, s2, s3) {
    while (result.indexOf(gate) != -1) {
        let i = result.indexOf(gate), idx1, idx2;
        let expression1 = "";
        let cnt = 0, fin = 0;
        for (j = i - 1; j >= 0; j--) {
            if (result[j] == ')') {
                cnt++;
            }
            if (result[j] == '(') {
                if (cnt) {
                    cnt--;
                }
                else {
                    fin = j + 1;
                    break;
                }
            }
        }
        if (fin == i) {
            return -1;
        }
        expression1 = result.substring(fin, i);
        let expression2 = "";
        if (i + gate.length >= result.length) {
            return -1;
        }
        if (brackets[i + gate.length] != -1 && result[i + gate.length] == '(') {
            idx2 = brackets[i + gate.length] + 1;
            expression2 = result.substring(i + gate.length, brackets[i + gate.length] + 1);
        }
        else {
            if (result[i + gate.length] == '!') {
                if (i + gate.length + 1 >= result.length) {
                    return -1;
                }
                if (brackets[i + gate.length + 1] != -1 && result[i + gate.length + 1] == '(') {
                    idx2 = brackets[i + gate.length + 1] + 1;
                    expression2 = result.substring(i + gate.length, brackets[i + gate.length + 1] + 1);
                }
                else {
                    if (!is_var(result[i + gate.length + 1])) {
                        return -1;
                    }
                    if (i + gate.length + 2 < result.length) {
                        if (!is_gate(result[i + gate.length + 2])) {
                            return -1;
                        }
                    }
                    expression2 = "!" + result[i + gate.length + 1];
                    idx2 = i + gate.length + 2;
                }
            }
            else {
                if (!is_var(result[i + gate.length])) {
                    return -1;
                }
                if (i + gate.length + 1 < result.length) {
                    if (!is_gate(result[i + gate.length + 1]) && result[i + gate.length + 1] != ')') {
                        return -1;
                    }
                }
                expression2 = result[i + gate.length];
                idx2 = i + gate.length + 1;
            }
        }
        result = result.replace(result.substring(fin, idx2), s1 + expression1 + s2 + expression2 + s3);
        stack = [];
        for (i = 0; i < result.length; i++) {
            brackets[i] = -1;
        }
        for (i = 0; i < result.length; i++) {
            if (result[i] == '(') {
                stack.push(i);
            }
            if (result[i] == ')') {
                brackets[stack[stack.length - 1]] = i;
                brackets[i] = stack[stack.length - 1];
                stack.pop();
            }
        }
    }
    return 1;
}

function translate(s) {
    let s1 = "";
    brackets = new Array(s.length);
    s = s.replaceAll('+', 'or');
    s = s.replaceAll('⊕', 'xor');
    s = s.replaceAll('.', 'and');
    s = s.replaceAll('~', '♪');
    s = s.replaceAll('|', 'or');
    s = s.replaceAll('^', 'xor');
    s = s.replaceAll('&', 'and');
    s = s.replaceAll('!', '♪');
    s = s.replace(/(nand)/gi, '⁛');
    s = s.replace(/(xnor)/gi, '⁝');
    s = s.replace(/(nor)/gi, '⁞');
    s = s.replace(/(xor)/gi, '⁚');
    s = s.replace(/(and)/gi, '⁘');
    s = s.replace(/(or)/gi, '⁙');
    s = s.replace(/(not)/gi, '♪');
    for (i = 0; i < s.length; i++) {
        if (s[i] == ' ') {
            continue;
        }
        s1 += s[i];
    }
    s = s1;
    s1 = "";
    s = validate(s);
    if (s == -1) {
        return fail;
    }
    for (i = 0; i < s.length; i++) {
        brackets[i] = -1;
    }
    for (i = 0; i < s.length; i++) {
        if (s[i] == '(') {
            stack.push(i);
        }
        if (s[i] == ')') {
            brackets[stack[stack.length - 1]] = i;
            brackets[i] = stack[stack.length - 1];
            stack.pop();
        }
    }
    let cnt1 = 0, val = 0;
    for (i = 0; i < s.length; i++) {
        if (brackets[i] == -1 && is_var(s[i])) {
            cnt1++;
        }
        if (brackets[i] == -1 && (is_gate(s[i]) || s[i] == '♪')) {
            val = -1;
            break;
        }
    }
    if (cnt1 == 1 && val == 0) {
        return s;
    }
    if (s.indexOf("♪") == -1 && s.indexOf("⁛") == -1 && s.indexOf("⁝") == -1 && s.indexOf("⁞") == -1 && s.indexOf("⁘") == -1 && s.indexOf("⁚") == -1 && s.indexOf("⁙") == -1) {
        return fail;
    }
    // not
    while (s.indexOf("♪") != -1) {
        let i = s.indexOf("♪"), idx1 = i, idx2, fin = s.length, cnt = 0;
        let expression2 = "";
        if (i + 1 >= s.length) {
            return fail;
        }
        if (i > 0) {
            if (!is_gate(s[i - 1])) {
                return fail;
            }
        }
        for (j = i + 1; j < s.length; j++) {
            if (s[j] == '♪') {
                cnt++;
            }
            else {
                fin = j;
                break;
            }
        }
        if (fin == s.length) {
            return fail;
        }
        if (brackets[fin] != -1 && s[fin] == '(') {
            idx2 = brackets[fin] + 1;
            expression2 = s.substring(fin, brackets[fin] + 1);
        }
        else {
            if (!is_var(s[fin])) {
                return fail;
            }
            if (fin + 1 < s.length) {
                if (!is_gate(s[fin + 1]) && s[fin + 1] != ')') {
                    return fail;
                }
            }
            expression2 = s[fin];
            idx2 = fin + 1;
        }
        if (cnt % 2) {
            s = s.replace(s.substring(idx1, idx2), "(" + expression2 + ")");
        }
        else {
            s = s.replace(s.substring(idx1, idx2), "!(" + expression2 + ")");
        }
        stack = [];
        for (i = 0; i < s.length; i++) {
            brackets[i] = -1;
        }
        for (i = 0; i < s.length; i++) {
            if (s[i] == '(') {
                stack.push(i);
            }
            if (s[i] == ')') {
                brackets[stack[stack.length - 1]] = i;
                brackets[i] = stack[stack.length - 1];
                stack.pop();
            }
        }
    }
    result = s;
    let t = sub("⁛", "!(", "&", ")");
    if (t == -1) {
        return fail;
    }
    t = sub("⁝", "!(", "^", ")");
    if (t == -1) {
        return fail;
    }
    t = sub("⁞", "!(", "|", ")");
    if (t == -1) {
        return fail;
    }
    t = sub("⁘", "(", "&", ")");
    if (t == -1) {
        return fail;
    }
    t = sub("⁚", "(", "^", ")");
    if (t == -1) {
        return fail;
    }
    t = sub("⁙", "(", "|", ")");
    if (t == -1) {
        return fail;
    }
    return result;
}
// end of yasseen part

// thx internet
function denaryToBinary(nMask) {
    for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32; nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    return sMask;
}
// end of internet part

function truthTable(expression = '') {
    expression = translate(expression)
    if (JSON.stringify(expression) != JSON.stringify([['X'], ['-']])) {
        const variables = []
        const table = []

        // looping to capture variables, sorting them and pushing them to table 
        for (let i = 0; i < expression.length; i++) {
            if (expression[i] != '!' && expression[i] != '(' && expression[i] != ')' && expression[i] != '&' && expression[i] != '|' && expression[i] != '^' && !variables.includes(expression[i])) {
                variables.push(expression[i])
            }
        }
        variables.sort()
        table.push(variables)
        // 

        if (variables.length > 5 && document.getElementById('exceed-limit-check').checked == false) { return [['X'], ['-']] }

        let counter = -1

        //evaluating
        for (let i = 0; i < Math.pow(2, variables.length); i++) {
            counter = denaryToBinary((parseInt(counter, 2) + 1))
            const arr = []
            for (let j = 0; j < variables.length; j++) {
                arr.push(counter[counter.length - j - 1])
            }
            arr.reverse()
            let tempExpression = expression
            for (let j = 0; j < variables.length; j++) {
                tempExpression = tempExpression.replaceAll(variables[j], arr[j])
            }
            arr.push(Number(eval(tempExpression)))
            table.push(arr)
        }
        table[0][table[0].length] = 'X'
        return table
    }

    return [['X'], ['-']]
}

function drawTable(arr = []) {
    // drawing table
    const table = document.getElementById('table')
    table.innerHTML = ''

    table.style = `--rows: ${arr.length};--columns: ${arr[0].length};`

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if (j == arr[0].length - 1) {
                table.innerHTML += `<div class="table-cell result">${arr[i][j]}</div>`
            } else {
                table.innerHTML += `<div class="table-cell">${arr[i][j]}</div>`
            }
        }
    }
}

document.getElementById('the-input').addEventListener('input', (e) => {
    drawTable(truthTable(document.getElementById('the-input').value))
})

document.getElementById('exceed-limit-check').addEventListener('input', (e) => {
    drawTable(truthTable(document.getElementById('the-input').value))
})

drawTable([['X'], ['-']]) 
