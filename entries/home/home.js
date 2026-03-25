const img = document.getElementById("floatImg")

let x = 120
let y = 120

let dx = 2
let dy = 2

const padding = 40

function move(){

const maxX = window.innerWidth - img.offsetWidth - padding
const maxY = window.innerHeight - img.offsetHeight - padding

x += dx
y += dy

if(x <= padding || x >= maxX){
dx *= -1
}

if(y <= padding || y >= maxY){
dy *= -1
}

img.style.left = x + "px"
img.style.top = y + "px"

requestAnimationFrame(move)

}

move()