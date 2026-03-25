// Optional future interaction support

document.querySelectorAll(".drawer").forEach(drawer => {

    drawer.addEventListener("mouseenter", () => {
        drawer.classList.add("active");
    });

    drawer.addEventListener("mouseleave", () => {
        drawer.classList.remove("active");
    });

});