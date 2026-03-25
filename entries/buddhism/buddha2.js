const link = document.getElementById("tranquilLink")

if(link){

const text = link.textContent
link.textContent = ""

text.split("").forEach((letter,i)=>{

const span = document.createElement("span")
span.textContent = letter

span.style.setProperty("--i", i)

link.appendChild(span)

})

}