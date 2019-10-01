function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    expr = deleteSpaces(expr)
    let finalString = mainBrcts(expr)
    finalString = parseFloat(finalString)

    //correct mantissa for big numbers
    if (Math.abs(finalString) > 1e12 ) {
        finalString = Math.sign(finalString) * Math.round(Math.abs(finalString)*1000)/1000
        finalString.toFixed(4)
    }
    return finalString
}

function deleteSpaces(expr) {
    while (expr.includes(' ')) {
        expr = expr.slice(0, expr.indexOf(' ')) + expr.slice(expr.indexOf(' ')+1)
    }

    return expr
}

//main and brackets
function mainBrcts(expr) {
    if (!expr.includes(')') && !expr.includes('(')) {return firstAction(expr) }

    let br = 0
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] == '(') br+=1
      if (expr[i] == ')') br-=1
    }
    if (br !=0) {throw 'ExpressionError: Brackets must be paired'}


    let subExpr = ''
    p = 1
    firstBrcts = expr.indexOf('(')
    for (let i = firstBrcts+1; i < expr.length; i++) {
        if (expr[i] == '(') p+=1
        if (expr[i] == ')') p-=1
        if (p == 0) {
            lastBrcts = i
            break
        } 
    }

    subExpr = expr.slice(firstBrcts + 1, lastBrcts)

    subExpr = deleteRepeat(subExpr)

    expr = expr.slice(0, expr.indexOf('(') ) + mainBrcts(subExpr) + expr.slice(expr.indexOf('(') + subExpr.length + 2)
    return mainBrcts(expr)

}

function deleteRepeat(expr){
    while (expr.includes('++')){
        expr = expr.slice(0,expr.indexOf('++')) + '+' + expr.slice(expr.indexOf('++')+2)
      } 
  
      while (expr.includes('+-')){
        expr = expr.slice(0,expr.indexOf('+-')) + '-' + expr.slice(expr.indexOf('+-')+2)
      }
  
      while (expr.includes('-+')){
        expr = expr.slice(0,expr.indexOf('-+')) + '-' + expr.slice(expr.indexOf('-+')+2)
      } 
  
      while (expr.includes('--')){
        expr = expr.slice(0,expr.indexOf('--')) + '+' + expr.slice(expr.indexOf('--')+2)
      } 

     return expr
}


//correct order of signs
function correct(expr, pattern) {
  while (expr.includes(pattern)) {
      let indMinus = expr.lastIndexOf('-',expr.indexOf(pattern)-1)
      let indPlus = expr.lastIndexOf('+',expr.indexOf(pattern)-1)
      if (indMinus == -1 && indPlus == -1)
        expr = pattern[1] + expr.slice(0,expr.indexOf(pattern)) + pattern[0] + expr.slice(expr.indexOf(pattern)+2)
      if (indMinus > indPlus) 
        expr = expr.slice(0,indMinus + 1) + pattern[1]  + expr.slice(indMinus + 1, expr.indexOf(pattern)) + pattern[0] +expr.slice(expr.indexOf(pattern)+2) 
      if (indPlus > indMinus) 
        expr = expr.slice(0,indPlus + 1) + pattern[1]  + expr.slice(indPlus + 1, expr.indexOf(pattern)) + pattern[0] +expr.slice(expr.indexOf(pattern)+2)
    }
    return expr
}

// Sum and substarct
function firstAction(expr) {
    expr = correct(expr, '/-',)
    expr = correct(expr, '/+',)
    expr = correct(expr, '*-',)
    expr = correct(expr, '*+',)

    expr = deleteRepeat(expr)
    if (!expr.includes('+') && !expr.includes('-')) {return secondAction(expr)}
    if (expr[0] == '-' || expr[0] == '+') {expr = '0' + expr}


    let result = 0
    while (expr.includes('+') || expr.includes('-')) {
        let subExpr = ''
        if (expr.lastIndexOf('+') > expr.lastIndexOf('-')) {
            subExpr = expr.slice(expr.lastIndexOf('+')+1)
            result += secondAction(subExpr)
            expr = expr.slice(0, expr.lastIndexOf('+'))
        }   
        else {
            subExpr = expr.slice(expr.lastIndexOf('-') + 1)
            result -= secondAction(subExpr)
            expr = expr.slice(0, expr.lastIndexOf('-'))
        }
    }   
    return result + secondAction(expr)
}

//mult and division
function secondAction(expr) {
    let result = 1
    while (expr.includes('*') || expr.includes('/')) {
        let piece = ''
        if (expr.lastIndexOf('*') > expr.lastIndexOf('/')) {
            piece = expr.slice(expr.lastIndexOf('*')+1)
            result *=parseFloat(piece)
            expr = expr.slice(0, expr.lastIndexOf('*'))
        }
        else {
            piece = expr.slice(expr.lastIndexOf('/')+1)
            result /=parseFloat(piece)
             expr = expr.slice(0, expr.lastIndexOf('/'))
        }
    }

    result = result*parseFloat(expr)
    if (result == 'Infinity') throw "TypeError: Division by zero."
    return result
}


module.exports = {
    expressionCalculator
}