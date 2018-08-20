import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight



const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners


addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

// stars
function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
        x:0,
        y: 3
    },
    this.gravity = 1
    this.friction = 0.8

}

Star.prototype.draw = function() { //this is to know how the object looks like
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
}

Star.prototype.update = function() { //this is to know how use use it as the time goes on
    this.draw()

    //when ball hits bottom of the screen
    if(this.y + this.radius + this.velocity.y > canvas.height){
        this.velocity.y = -this.velocity.y * this.friction //the 0.8 is to make the ball lose its velocity
        this.shatter()
    }else {
        this.velocity.y += this.gravity  //gravity
    }
    this.y += this.velocity.y; //mode the ball down. (three) is balls velocity
}

Star.prototype.shatter = function(){
    this.radius -= 3       //when the ball touches the floor make the radius smaller by 3
    for (let i = 0; i < 8; i++){
        miniStars.push(new MiniStar(this.x, this.y, 2))
    }
    console.log(miniStars)
}

//Ministars
function MiniStar(x, y, radius, color){
    Star.call(this, x, y, radius, color)
    this.velocity = {
        x: utils.randomIntFromRange(-5,5), //this is a random number function
        //imported from the utils file. We use this so the balls spread
        //out along the x axis so we can see them
        y: utils.randomIntFromRange(-15,15)
    },
    this.gravity = 0.1
    this.friction = 0.8
    this.ttl = 100          //time to live. For how many frames I want something to live
    this.opacity = 1


}

MiniStar.prototype.draw = function() { //this is to know how the object looks like
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(255,0,0, ${this.opacity})`
    c.fill()
    c.closePath()
}

MiniStar.prototype.update = function() { //this is to know how use use it as the time goes on
    this.draw()

    //when ball hits bottom of the screen
    if(this.y + this.radius + this.velocity.y > canvas.height){
        this.velocity.y = -this.velocity.y * this.friction //the 0.8 is to make the ball lose its velocity
    }else {
        this.velocity.y += this.gravity  //gravity
    }
    this.y += this.velocity.y; //move the ball down. (three) is balls velocity
    this.x += this.velocity.x; //move the ball down. (three) is balls velocity
    this.ttl -= 1
    this.opacity -= 1 / this.ttl

}

// Implementation
//this is to create the background. the first two arguments are where the bacground
//should start (x,y), the last two are about where it should end (x, y(canvas.height))


const backgroundGradient = c.createLinearGradient(0,0,canvas.height)

backgroundGradient.addColorStop(0, '#171e26') //------------------------------------------------------------------------------------->>>>
backgroundGradient.addColorStop(0, '#171e26') //



let stars
let miniStars
function init() {
    stars = [] //to create multiple stars
    miniStars = []

    for (let i = 0; i < 1; i++) {
        stars.push(new Star(canvas.width/2, 30, 30, 'blue'));
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    // c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y)
    stars.forEach((star, index) => {    //we added another parameter so we have to wrap them up
                                        //inside parenthesis
     star.update();
     if(star.radius == 0){          //Remove main star from array when radius is 0 
        stars.splice(index, 1)      
     }
    });

    miniStars.forEach((miniStar, index) =>{
        miniStar.update()
        if(miniStar.ttl == 0){         //remove ministars when ttl = 0
            miniStars.splice(index, 1)      
         }
    })
}

init()
animate()
