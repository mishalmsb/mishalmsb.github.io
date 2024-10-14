function printCv(lang = "en") {
  // document.body.classList.add("printing");

  // setTimeout(() => {
  //   window.print();
  // }, 1000);
  window.print();
}

var beforePrint = function () {
  console.log("Functionality to run before printing.");
  document.body.classList.add("printing");
};

var afterPrint = function () {
  console.log("Functionality to run after printing");
  document.body.classList.remove("printing");
};

// if (window.matchMedia) {
//   var mediaQueryList = window.matchMedia("print");
//   mediaQueryList.addListener(function (mql) {
//     if (mql.matches) {
//       beforePrint();
//     } else {
//       afterPrint();
//     }
//   });
// }

window.onbeforeprint = beforePrint;
window.onafterprint = afterPrint;
