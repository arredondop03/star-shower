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
        x: (Math.random()-0.5) * 18 ,
        y: 2
    },
    this.gravity = 0.3
    this.friction = 0.8

}

Star.prototype.draw = function() { //this is to know how the object looks like
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.shadowColor = '#E3EAEF'   //if we only want this shadow for the mini stars we write 
    c.shadowBlur = 20           //c.save() at the beggining and c.restore() at the end
    c.fill()
    c.closePath()
    c.restore()
}

Star.prototype.update = function() { //this is to know how use use it as the time goes on
    this.draw()

    //when ball hits bottom of the screen
    if(this.y + this.radius + this.velocity.y > utils.randomIntFromRange(canvas.height, canvas.height-groundHeight)){
        this.velocity.y = -this.velocity.y * this.friction //the 0.8 is to make the ball lose its velocity
        this.shatter()
    }else {
        this.velocity.y += this.gravity  //gravity
    }
    this.x += this.velocity.x
    this.y += this.velocity.y; //move the ball down. (three) is balls velocity
}

Star.prototype.shatter = function(){
    this.radius -= 3       //when the ball touches the floor make the radius smaller by 3
    for (let i = 0; i < 8; i++){
        miniStars.push(new MiniStar(this.x, this.y, 2))
    }
    
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
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(227,234,239, ${this.opacity})`
    c.shadowColor = '#E3EAEF'   //if we only want this shadow for the mini stars we write 
    c.shadowBlur = 20           //c.save() at the beggining and c.restore() at the end
    c.fill()
    c.closePath()
    c.restore()
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


//FUNCTIONS TO DRAW THE MOUNTAINS

function createMountainRange(mountainAmount, height, color){

    for(let i =0 ; i < mountainAmount ; i++){
        const mountainWidth = canvas.width/mountainAmount
        c.beginPath()                              
        c.moveTo(i * mountainWidth, canvas.height )                   //starting at bottom left corner
        c.lineTo(i * mountainWidth + mountainWidth + 200, canvas.height)       //to bottom right corner
        c.lineTo(i * mountainWidth + mountainWidth/2, canvas.height - height) //to middle of canvas up to whatever the desired height is
        //since 100 is 100 from the top down and we want it to be from the bottom up 
        //we will have to take the canva's height and substract the desired height
        c.lineTo(i * mountainWidth - 200, canvas.height)
        c.fillStyle = color
        c.fill()
        c.closePath()

    }


}








// Implementation
//this is to create the background. the first two arguments are where the bacground
//should start (x,y), the last two are about where it should end (x, y(canvas.height))
//the first argument in add color stop is from 0(beggining) to 1(bottom of the page)


const backgroundGradient = c.createLinearGradient(0,0,0,canvas.height)

backgroundGradient.addColorStop(0, '#171e26') //
backgroundGradient.addColorStop(1, '#3f586b') //



let stars
let miniStars
let backgroundStars
let ticker = 0
let randomSpawnRate = 75
let groundHeight = 50
function init() {
    stars = [] //to create multiple stars
    miniStars = []
    backgroundStars = [ ]

    

    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() *3

        backgroundStars.push(new Star(x, y, radius, 'white'));
    }

}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    //GRADIENT BACKGROUND
    c.fillStyle = backgroundGradient
    c.fillRect(0, 0, canvas.width, canvas.height) //we changed the clearRect by fill rect and at first it changed it
    //to red because we didnt assign our const background gradient to be the fillStyle

    //BACKGROUND STARS draw
    backgroundStars.forEach((backgroundStar)=>{
        backgroundStar.draw()

    })


    //drawing mountains
    createMountainRange(1, canvas.height - 250, '#384551')
    createMountainRange(2, canvas.height - 300, '#2B3843')
    createMountainRange(3, canvas.height - 500, '#26333E')
    c.fillStyle = '#182028'
    c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)




    // c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y)
    stars.forEach((star, index) => {    //we added another parameter so we have to wrap them up
                                        //inside parenthesis
     star.update();
     if(star.radius <= 0){          //Remove main star from array when radius is 0 
        stars.splice(index, 1)      
     }
    });

    miniStars.forEach((miniStar, index) =>{
        miniStar.update()
        if(miniStar.ttl == 0){         //remove ministars when ttl = 0
            miniStars.splice(index, 1)      
         }
    })

    ticker++
    if(ticker % randomSpawnRate === 0){
        const x = Math.random() * canvas.width
        stars.push( new Star (x, -100, 12, 'white' ))
        randomSpawnRate = utils.randomIntFromRange(75, 200)
    }
}

init()
animate()
