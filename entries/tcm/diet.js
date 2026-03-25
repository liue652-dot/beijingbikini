function checkAnswer(button,choice){

let food = button.closest(".food")
let answer = food.dataset.answer
let burst = food.querySelector(".burst")

if(choice === answer){

    if(answer === "hot"){
        burst.src = "tcmimg/red.png"
    }else{
        burst.src = "tcmimg/blue.png"
    }

    burst.style.display = "block"

}else{

    alert("Try again")

}

}


const foods = document.querySelectorAll(".food")
const padding = 60

let objects = []

foods.forEach(food => {

let obj = {

el: food,
x: padding + Math.random() * (window.innerWidth - padding*2 - 200),
y: padding + Math.random() * (window.innerHeight - padding*2 - 200),
dx: (Math.random()*0.4)+0.2,
dy: (Math.random()*0.4)+0.2

}

food.style.left = obj.x + "px"
food.style.top = obj.y + "px"

objects.push(obj)

})

function animate(){

objects.forEach(obj => {

let w = obj.el.offsetWidth
let h = obj.el.offsetHeight

obj.x += obj.dx
obj.y += obj.dy


if(obj.x < padding){
obj.x = padding
obj.dx *= -1
}

if(obj.x + w > window.innerWidth - padding){
obj.x = window.innerWidth - padding - w
obj.dx *= -1
}

if(obj.y < padding){
obj.y = padding
obj.dy *= -1
}

if(obj.y + h > window.innerHeight - padding){
obj.y = window.innerHeight - padding - h
obj.dy *= -1
}


objects.forEach(other => {

if(obj === other) return

let dx = obj.x - other.x
let dy = obj.y - other.y
let distance = Math.sqrt(dx*dx + dy*dy)

if(distance < 120){

obj.x += dx * 0.2
obj.y += dy * 0.2

let tempDx = obj.dx
let tempDy = obj.dy

obj.dx = other.dx
obj.dy = other.dy

other.dx = tempDx
other.dy = tempDy

}

})

obj.el.style.left = obj.x + "px"
obj.el.style.top = obj.y + "px"

})

requestAnimationFrame(animate)

}

animate()

function toggleSpeech(){

let speech = document.getElementById("speechText")

if(speech.style.display === "block"){

speech.style.display = "none"

}else{

speech.style.display = "block"

}

}


document.addEventListener("DOMContentLoaded", () => {

const speech = document.getElementById("speechText")

speech.addEventListener("click", () => {

window.location.href = "../menu/menu.html"

})

})