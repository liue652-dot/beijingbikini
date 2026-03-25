const strip = document.getElementById("strip")

strip.innerHTML += strip.innerHTML

let pos = 0
let speed = 0.45

function animate(){

pos -= speed
strip.style.transform = `translateX(${pos}px)`

if(Math.abs(pos) >= strip.scrollWidth/2){
pos = 0
}

requestAnimationFrame(animate)
}

animate()

function openCard(el){

document.querySelectorAll(".info").forEach(card=>{
card.style.display="none"
})

el.querySelector(".info").style.display="block"
}