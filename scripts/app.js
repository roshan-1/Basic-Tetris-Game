document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const restartButton = document.querySelector('#restart-button')
    const easylevelBtn = document.querySelector('#es')
    const mediumlevelBtn = document.querySelector('#md')
    const hardlevelBtn = document.querySelector('#hd')
    const width = 10
    let nextRandom = 0
    let score = 0
    let timerId
    const colors = [
        'red', 
        'blue',
        'green', 
        'yellow',
        'orange',
    ]
    
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]
    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],        
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
    ]
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1],
    ]
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],        
    ]
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],        
        [width, width + 1, width + 2, width + 3],        
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ]
    let curPosition = 4
    let curRotation = 0    
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    let random = Math.floor(Math.random() * theTetrominoes.length)    
    let current = theTetrominoes[random][curRotation]
    //draw tetromino by selecting randomly among the five types in their initial rotation
    function draw(){
        current.forEach(index => {
            squares[curPosition + index].classList.add('tetromino')
            squares[curPosition + index].style.backgroundColor = colors[random]
        })
    }
    //undraw the current tetromino - used for moving down the tetromino - undraw and draw in one block below the current block
    function undraw(){
        current.forEach(index => {
            squares[curPosition + index].classList.remove('tetromino')
            squares[curPosition + index].style.backgroundColor = ''
        })
    }    
    
    function control(e){
            if(e.keyCode === 37)
                moveLeft()
            else if(e.keyCode === 38){
                rotate()
            }
            else if(e.keyCode === 39){
                moveRight()
            }
            else if(e.keyCode === 40){
                moveDown()
            }
    }

    //undraw change positon and redraw
    function moveDown(){
        undraw()
        curPosition += width
        draw()
        freeze()
    }    
    //freeze function
    function freeze(){
        if(current.some( index => squares[curPosition + index + width].classList.contains('taken'))){
            current.forEach(index => {squares[curPosition + index].classList.add('taken')})
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][curRotation]
            curPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    function moveLeft(){
        undraw()
        const isAtEdge = current.some(index => (curPosition + index) % width === 0)
        if(!isAtEdge) curPosition -= 1
        if(current.some(index => squares[curPosition + index].classList.contains('taken'))){
            curPosition += 1
        }            
        draw()
    }
    function moveRight(){
        undraw()
        const isAtEdge = current.some(index => (curPosition + index + 1) % width === 0)
        if(!isAtEdge)
            curPosition += 1
        if(current.some(index => squares[curPosition + index].classList.contains('taken')))
            curPosition -= 1
        draw()
    }
    function rotate(){
        let currentTemp = theTetrominoes[random][(curRotation + 1) % current.length]
        if(!(currentTemp.some(index => (curPosition + index + 1) % width == 0)) && !(currentTemp.some(index => (curPosition + index) % width == 0))){
            undraw()        
            curRotation++        
            if(curRotation == current.length){
                curRotation = 0
            }        
            current = theTetrominoes[random][curRotation]                
            draw()
        }        
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    let displayIndex = 0
    const displayWidth = 4

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],//L Tetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //Z
        [1, displayWidth, displayWidth + 1, displayWidth + 2],//T
        [0, 1, displayWidth , displayWidth + 1],//O
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],//I
    ]    
    function displayShape(){                
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })                
        upNextTetrominoes[nextRandom].forEach(index => {            
            displaySquares[displayIndex + index].classList.add('tetromino')            
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })        
    }
    var timeInterval = 0
    var gameOn = 0
    var startGame
    easylevelBtn.addEventListener('click', () => {
        if(!gameOn){
            easylevelBtn.style.backgroundColor = 'lightgreen';
            mediumlevelBtn.style.backgroundColor = '';
            hardlevelBtn.style.backgroundColor = '';
            timeInterval = 1000
        }   
        else{
            alert('You are already in a game')
        }     
    })
    mediumlevelBtn.addEventListener('click', () => {
        if(!gameOn){
            easylevelBtn.style.backgroundColor = '';
            mediumlevelBtn.style.backgroundColor = 'lightgreen';
            hardlevelBtn.style.backgroundColor = '';
            timeInterval = 500    
        }
        else{
            alert('You are already in a game')
        }
    })
    hardlevelBtn.addEventListener('click', () => {
        if(!gameOn){
            easylevelBtn.style.backgroundColor = '';
            mediumlevelBtn.style.backgroundColor = '';
            hardlevelBtn.style.backgroundColor = 'lightgreen';
            timeInterval = 250
        }
        else{
            alert('You are already in a game')
        }
    })
    startBtn.addEventListener('click', startGame = () => {        
        if(timerId && gameOn){
            clearInterval(timerId)
            document.removeEventListener('keyup', control)
            timerId = null
        }
        else {
            if(timeInterval === 0)  {                
                alert('Choose Level First')
                gameOn = 0
            }                          
            else{
                gameOn = 1
                draw()            
                timerId = setInterval(moveDown, timeInterval)
                document.addEventListener('keyup', control)
                // nextRandom = Math.floor(Math.random() * theTetrominoes.length)
                displayShape()
            }            
        }
    })    
    restartButton.addEventListener('click', () => {
        gameOn = 0     
        curPosition = 4   
        clearInterval(timerId)
        squares.forEach(square => {
            square.classList.remove('tetromino')            
            square.style.backgroundColor = ''
        })  
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')            
            square.style.backgroundColor = ''
        })                    
        easylevelBtn.style.backgroundColor = '';
        mediumlevelBtn.style.backgroundColor = '';
        hardlevelBtn.style.backgroundColor = '';         
        for(var i = 0; i < 200; i++){
            squares[i].classList.remove('taken')
        }                   
    })
    function addScore(){
        for(var i = 0; i < 199; i += width){
            row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            if(row.every(index => squares[index].classList.contains('taken'))){
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                score += 10
                scoreDisplay.innerHTML = score
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
    function gameOver(){
        if(current.some(index => squares[curPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
            gameOn = 0
        }
    }
})