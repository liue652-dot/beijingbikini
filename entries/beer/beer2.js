const trigger = document.getElementById("trigger");
const rushImage = document.getElementById("rushImage");

const kanpaiTrigger = document.getElementById("kanpaiTrigger");
const rushVideo = document.getElementById("rushVideo");

trigger.addEventListener("click", () => {
  rushImage.classList.toggle("show");
});

kanpaiTrigger.addEventListener("click", () => {

  const isVisible = rushVideo.classList.toggle("show");

  if (isVisible) {
    rushVideo.play();
  } else {
    rushVideo.pause();
    rushVideo.currentTime = 0; 
  }

});