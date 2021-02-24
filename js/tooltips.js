let toolTips = document.getElementsByClassName('tooltip');
let inputFields = document.getElementsByClassName('input-field');
let formSubmit = document.getElementById('submit-btn');

let terminalPrint = function() {
  let fullTxt = this.getAttribute('data-tooltip');
  document.getElementById("text-output").innerHTML = fullTxt;
}

let terminalReset = function() {
  document.getElementById("text-output").innerHTML = '';
}

for (let i = 0; i < toolTips.length; i++) {
  toolTips[i].addEventListener('mouseenter', terminalPrint);
  toolTips[i].addEventListener('mouseleave', terminalReset, false);
}

for (let i = 0; i < inputFields.length; i++) {
  inputFields[i].addEventListener('focus', terminalPrint);
  inputFields[i].addEventListener('blur', terminalReset, false);
}