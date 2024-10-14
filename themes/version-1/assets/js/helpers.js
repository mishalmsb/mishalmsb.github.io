function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function restartsLoading() {
  document.body.classList.toggle("loaded");
}

function finishLoading() {
  // setTimeout(function () {
  //   document.body.classList.add("loaded");
  // }, 1000);
  document.body.classList.add("loaded");
}
