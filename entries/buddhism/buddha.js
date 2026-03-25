const stack = document.getElementById("stack")

const layers = 50
const img = "buddhaimg/amitaba.jpg"

for (let i = 0; i < layers; i++) {

    setTimeout(() => {

        const layer = document.createElement("div")
        layer.className = "layer"

        const image = document.createElement("img")
        image.src = img
        layer.appendChild(image)

        const t = i / (layers - 1)

        const scale = 0.08 + t * 0.45
        const x = t * 68
        const y = t * 20

        layer.style.transform =
        `translate(${x}vw, ${y}vh) scale(${scale})`

        layer.style.zIndex = i

        stack.appendChild(layer)

        requestAnimationFrame(()=>{
            layer.classList.add("show")
        })

    }, i * 120)

}