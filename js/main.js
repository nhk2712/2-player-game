var main = document.querySelector('#main')
var ctx = main.getContext('2d')

ctx.fillStyle = '#000000'
ctx.fillRect(0, 0,main.width, main.height)

var bg = document.querySelector('#bg'),
    p1 = document.querySelector('#p1'),
    p2 = document.querySelector('#p2'),
    wall = document.querySelector('#wall'),
    trap = document.querySelector('#trap'),
    coin = document.querySelector('#coin'),
    empty = document.querySelector('#empty')
setTimeout(maingame,100)

const EMPTY = 0
const PLAYER = 1
const WALL = 2
const TRAP = 3
const COIN = 4

var matrix = [
    [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL],
    [WALL, EMPTY, WALL, EMPTY, WALL, EMPTY, EMPTY, EMPTY, WALL],
    [WALL, EMPTY, EMPTY, EMPTY, WALL, EMPTY, EMPTY, EMPTY, WALL],
    [WALL, WALL, WALL, EMPTY, WALL, WALL, EMPTY, WALL, WALL],
    [WALL, EMPTY, EMPTY, EMPTY, WALL, EMPTY, EMPTY, EMPTY, WALL],
    [WALL, EMPTY, WALL, EMPTY, EMPTY, EMPTY, WALL, EMPTY, WALL],
    [WALL, EMPTY, EMPTY, EMPTY, WALL, EMPTY, WALL, EMPTY, WALL],
    [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL]
]

function renderMat(){
    var xpos=0,ypos=0;

    for (var i=0;i<matrix.length;i++){
        xpos=0
        for (var j=0;j<matrix[i].length;j++){
            if (matrix[i][j]==WALL) ctx.drawImage(wall,350+xpos,50+ypos)
            else if (matrix[i][j]==PLAYER) ctx.drawImage(p1,350+xpos,50+ypos)
            else if (matrix[i][j]==EMPTY) ctx.drawImage(empty,350+xpos,50+ypos)
            else if (matrix[i][j]==TRAP) ctx.drawImage(trap,350+xpos,50+ypos)
            else if (matrix[i][j]==COIN) ctx.drawImage(coin,350+xpos,50+ypos)
            xpos+=100
        }
        ypos+=100
    }
}

var isPlay = true

class Player{
    constructor(row,col,coin=0){
        this.row=row
        this.col=col
        matrix[this.row][this.col]=PLAYER
        this.coin = coin
        this.health=3
        this.name=prompt("Enter player's name: ")
        ctx.drawImage(p1,350+this.col*100,50+this.row*100)
        this.show()
    }

    behave(cmd) {
        //var cont
        if (cmd=="down"){
            this.move(1,0)
            //if (cont==false) break
        }
        else if (cmd=="up"){
            this.move(-1,0)
            //if (cont==false) break
        }
        else if (cmd=="right"){
            this.move(0,1)
            //if (cont==false) break
        }
        else if (cmd=="left"){
            this.move(0,-1)
            //if (cont==false) break
        }
        else if (cmd=="trap") {
            matrix[this.row][this.col]=TRAP
            ctx.drawImage(trap,350+this.col*100,50+this.row*100)
        }
        else if (cmd=="skip"){
            alert("Skipped")
            //break
        }
    }

    move(x,y) {
        if (matrix[this.row+x][this.col+y]!=WALL && matrix[this.row+x][this.col+y]!=PLAYER){
            if (matrix[this.row][this.col]==PLAYER) {
                matrix[this.row][this.col]=EMPTY
                ctx.drawImage(empty,350+this.col*100,50+this.row*100)
            }
            
            this.row+=x
            this.col+=y

            if (matrix[this.row][this.col]==TRAP){
                this.health-=1
                this.show()
                if (this.health>0){
                    matrix[this.row][this.col]=PLAYER
                    ctx.drawImage(p1,350+this.col*100,50+this.row*100)
                    //return true
                }
                else{
                    this.die()
                    //return false
                }
            }
            else if (matrix[this.row][this.col]==COIN){
                this.coin+=1
                matrix[this.row][this.col]=PLAYER
                ctx.drawImage(p1,350+this.col*100,50+this.row*100)
                this.show()
                createCoin()
                //return true
            }
            else{
                matrix[this.row][this.col]=PLAYER
                ctx.drawImage(p1,350+this.col*100,50+this.row*100)
                //return true
            }
        }
        else{
            //alert("Cannot move")
            //return false
        }
    }

    show(){
        console.log({
            name: this.name,
            row: this.row,
            col: this.col,
            health: this.health,
            coin: this.coin
        })
    }

    surrender() {
        console.log("Surrendered")
        this.health=0
        this.end()
    }

    die() {
        console.log("Died!")
        this.end()
    }

    end(){
        isPlay = false
        matrix[this.row][this.col]=EMPTY
        ctx.drawImage(empty,350+this.col*100,50+this.row*100)
        this.row=-1
        this.col=-1
        alert(this.name+" lost!")
    }
}

function createCoin(){
    r=Math.floor(Math.random()*(matrix.length-2))+1
    c=Math.floor(Math.random()*(matrix[0].length-2))+1

    if (matrix[r][c]==EMPTY){
        matrix[r][c]=COIN
        ctx.drawImage(coin,350+c*100,50+r*100)
    }
    else createCoin()
}
/*
function getCmd(cmd,player){
    for(var i=0;i<cmd.length;i++) {
        cmd[i]=prompt("Enter command:")

        if (cmd[i]=="surrender"){
            player.surrender()
            player.show()
            break
        }
        else if (cmd[i]=="skip") break
        else if (cmd[i]=="locate"){
            player.show()
            getCmd(cmd,player)
            break
        }
    }
}
*/
var pl1,pl2
function turn(){
    document.addEventListener("keydown",function(e){
        if (e.key=="s") pl1.behave("down")
        else if (e.key=="w") pl1.behave("up")
        else if (e.key=="a") pl1.behave("left")
        else if (e.key=="d") pl1.behave("right")
        else if (e.key==" ") pl1.behave("trap")

        else if (e.key=="ArrowDown") pl2.behave("down")
        else if (e.key=="ArrowUp") pl2.behave("up")
        else if (e.key=="ArrowLeft") pl2.behave("left")
        else if (e.key=="ArrowRight") pl2.behave("right")
        else if (e.key=="Enter") pl2.behave("trap")
    })
}

function maingame(){
    ctx.drawImage(bg,0,0)
    renderMat()

    pl1 = new Player(1,1)
    pl2 = new Player(matrix.length-2,matrix[0].length-2)
    createCoin()

    turn()
}