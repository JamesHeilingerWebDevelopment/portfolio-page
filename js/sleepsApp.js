class Calc {
  static sleeps() {
    let chosenDay = document.getElementById('date-picker').value.split('-');

    let today = Date.now();
    let newDate = new Date(chosenDay[0], chosenDay[1] - 1, chosenDay[2]);
    let newDay = newDate.getTime();

    let sleeps = Math.ceil((newDay - today)/86400000);

    unit = ' sleeps'
    if (Math.abs(sleeps) == 1) {
      unit = ' sleep'
    }

    document.getElementById('number-of-sleeps').innerHTML = sleeps + unit;
  }
}

// Store Class: Handles Storage
class Store {
  static getDates() {
    let dates;

    if (localStorage.getItem('how-many-sleeps') === null) {
      dates = [];
    } else {
      dates = JSON.parse(localStorage.getItem('how-many-sleeps'));
    }

    return dates;
  }

  static addDate(date) {
    const dates = Store.getDates();

    dates.push(date);

    localStorage.setItem('how-many-sleeps', JSON.stringify('dates'));
  }

  static removeDate(uid) {
    const dates = Store.getDates();

    dates.forEach((date, index) => {
      if (date.uid === uid) {
        dates.splice(index, 1);
      }
    });

    localStorage.setItem('how-many-sleeps', JSON.stringify(dates));
  }
}