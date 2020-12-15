var lut = []; for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
}

const monthLUT = {
  "01": 'Jan',
  "02": 'Feb',
  "03": 'Mar',
  "04": 'Apr',
  "05": 'May',
  "06": 'June',
  "07": 'July',
  "08": 'Aug',
  "09": 'Sept',
  "10": 'Oct',
  "11": 'Nov',
  "12": 'Dec'
}

class Calc {
  static sleeps(chosenDay) {
    let today = Date.now();
    let newDate = new Date(chosenDay[0], chosenDay[1] - 1, chosenDay[2]);
    let newDay = newDate.getTime();

    return Math.ceil((newDay - today)/86400000);
  }

  static e7() {
    // https://stackoverflow.com/a/21963136/5823604
    // 181ms to generate 500,000 IDs
    let d0 = Math.random() * 0xffffffff | 0;
    let d1 = Math.random() * 0xffffffff | 0;
    let d2 = Math.random() * 0xffffffff | 0;
    let d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
      lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
      lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  }

  static uniqueIdGenerator() {
    // https://stackoverflow.com/a/44078785/5823604
    // 571ms to generate 500,000 IDs
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  static whichYear(selectedDate) {
    const today = new Date();
    
    if (selectedDate.year !== null) {
      return selectedDate.year;
    } else {
      let newDate = new Date(today.getFullYear(), selectedDate.month-1, selectedDate.day);
      let dateDiff = newDate.getTime() - today.getTime();

      if (dateDiff >= 0) {
        // The selected date hasn't happened yet this year, so we use the current year
        return today.getFullYear();
      } else {
        // The selected date has already happened this year so we add one to the current year
        return today.getFullYear() + 1;
      }
    }
  }

  static makeUnits(val) {
    let unit = ' sleeps';
    if (Math.abs(val) == 1) {
      unit = ' sleep';
    }

    let pastOrFuture = '';
    if (val < 0) {
      pastOrFuture = ' ago';
    }

    return unit + pastOrFuture;
  }
}

// Storage Class: Handles Storage
class Storage {
  static getDates() {
    let dates;

    if (localStorage.getItem('how-many-sleeps') === null) {
      dates = [];
    } else {
      dates = JSON.parse(localStorage.getItem('how-many-sleeps'));
    }

    return dates;
  }

  static addDate() {
    const data = UI.getDateInfo();
    const dates = Storage.getDates();

    let splitDate = data.date.split('-');

    let year = splitDate[0];
    if (data.yearly == true) {
      year = null;
    }

    let newDate = {
      "uid": Calc.e7(),
      "year": year,
      "month": splitDate[1],
      "day": splitDate[2],
      "title": data.title
    }

    dates.push(newDate);

    localStorage.setItem('how-many-sleeps', JSON.stringify(dates));
  }

  static removeDate(uid) {
    const dates = Storage.getDates();

    dates.forEach((date, index) => {
      if (date.uid === uid) {
        dates.splice(index, 1);
      }
    });

    localStorage.setItem('how-many-sleeps', JSON.stringify(dates));
  }

  static available(type) {
    try {
        let storage = window[type], x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch(e) {
        return false;
    }
  }
}

class UI {
  static getDateInfo() {
    return {
      date: document.getElementById('date-picker').value,
      title: document.getElementById('title').value,
      yearly: document.getElementById('recurring').checked
    }
  }

  static setDate() {
    let chosenDay = document.getElementById('date-picker').value.split('-');
    let sleeps = Calc.sleeps(chosenDay);
    let saveButton = document.getElementById('save-button');

    document.getElementById('number-of-sleeps').innerHTML = Math.abs(sleeps) + Calc.makeUnits(sleeps);
    if (saveButton !== null) {
      saveButton.removeAttribute('disabled')
    }
  }

  static displaySavedDates() {
    const dates = Storage.getDates();
    const ul = document.getElementById('saved-dates');

    dates.forEach(date => {
      // Create the li and add it to the ul
      ul.appendChild(this.createSavedDateElement(date));
    });
  }

  static createSavedDateElement(date) {
    let computedYear = Calc.whichYear(date);
    let saneDate = `${date.day}-${monthLUT[date.month]}-${computedYear}`;

    // Create the li element and set the data-id attribute to the UID of the current date item
    let li = document.createElement('li');
    li.setAttribute('data-id', date.uid);

    // Create the title div
    let titleDiv = li.appendChild(document.createElement('div'));
    titleDiv.className = 'title';
    titleDiv.innerHTML = date.title;

    // Create the date div
    let dateDiv = li.appendChild(document.createElement('div'));
    dateDiv.className = 'date';
    dateDiv.innerHTML = saneDate;

    // Create the info div
    let infoDiv = li.appendChild(document.createElement('div'));
    infoDiv.className = 'info';
    let sleeps = Calc.sleeps([computedYear, date.month, date.day]);
    infoDiv.innerHTML = Math.abs(sleeps) + Calc.makeUnits(sleeps);

    // Create the delete div
    let deleteDiv = li.appendChild(document.createElement('div'));
    deleteDiv.className = 'delete-div';
    let delIcon = deleteDiv.appendChild(document.createElement('i'));
    delIcon.className = 'fas fa-times-circle delete';

    return li;
  }

  static updateSavedDatesDisplay() {
    const ul = document.getElementById('saved-dates');
    ul.appendChild(this.createSavedDateElement(Storage.getDates().pop()));
  }

  static resetFormDisplay() {
    // Reset the form input fields
    document.getElementById('date-form').reset();

    // Reset the sleeps display
    document.getElementById('number-of-sleeps').innerHTML = 'Pick a date first!';

    // Disable the button
    document.getElementById('save-button').disabled = true;
  }

  static deleteSavedDate(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static hideSaveSections() {
    document.getElementById('save-section').remove();
    document.getElementById('saved-dates-container').remove();
  }
}

// Event: Prepare the page
document.addEventListener('DOMContentLoaded', () => {
  // document.getElementById('date-picker').addEventListener('blur', UI.setDate());

  if (Storage.available('localStorage')) {
    UI.displaySavedDates();
    
    // Event: Remove a Saved Date
    document.getElementById('saved-dates').addEventListener('click', (e) => {
      // Remove Saved Date from UI
      UI.deleteSavedDate(e.target);
      
      // Remove Saved Date from Storage
      Storage.removeDate(e.target.parentElement.parentElement.getAttribute('data-id'));
    });
    
    // Event: Saving a Date
    document.getElementById('save-button').addEventListener('click', () => {
      Storage.addDate();
      UI.updateSavedDatesDisplay();
      UI.resetFormDisplay();
    });
  } else {
    UI.hideSaveSections();
  }
});
