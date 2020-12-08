function sleepsCalc() {
  let chosenDay = document.getElementById('date-picker').value.split('-');

  let today = Date.now();
  let newDate = new Date(chosenDay[0], chosenDay[1] - 1, chosenDay[2]);
  let newDay = newDate.getTime();

  let sleeps = Math.ceil((newDay - today)/86400000);

  plural = 's'
  if (Math.abs(sleeps) == 1) {
    plural = ''
  }
  
  document.getElementById('number-of-sleeps').innerHTML = sleeps + ' sleep' + plural;
}