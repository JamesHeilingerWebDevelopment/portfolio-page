var lut = []; for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
}

const monthConvert = {
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
}

class UI {
  static getDateInfo() {
    return {
      date: document.getElementById('date-picker').value,
      title: document.getElementById('title').value,
      yearly: document.getElementById('recurring').checked
    }
  }

  static updateDateSelection() {
    UI.setDate();
    // UI.validateDate();
  }

  static setDate() {
    let chosenDay = document.getElementById('date-picker').value.split('-');

    let sleeps = Calc.sleeps(chosenDay)
    
    let unit = ' sleeps'
    if (Math.abs(sleeps) == 1) {
      unit = ' sleep'
    }

    document.getElementById('number-of-sleeps').innerHTML = sleeps + unit;
    document.getElementById('save-button').removeAttribute('disabled');
  }

  static displaySavedDates() {
    const dates = Storage.getDates();
    const ul = document.getElementById('saved-dates')

    dates.forEach(date => {
      let saneDateFormat = `${date.day}-${monthConvert[date.month]}-${date.year}`;

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
      dateDiv.innerHTML = saneDateFormat;

      // Create the info div
      let infoDiv = li.appendChild(document.createElement('div'));
      infoDiv.className = 'info';
      infoDiv.innerHTML = Calc.sleeps([date.year, date.month, date.day]);

      // Create the delete div
      let deleteDiv = li.appendChild(document.createElement('div'));
      deleteDiv.className = 'delete';
      let delIcon = deleteDiv.appendChild(document.createElement('i'));
      delIcon.className = 'fas fa-times-circle';

      // Create the edit div
      let editDiv = li.appendChild(document.createElement('div'));
      editDiv.className = 'edit';
      let editIcon = editDiv.appendChild(document.createElement('i'));
      editIcon.className = 'fas fa-pencil-alt';

      // Add the li to the ul
      ul.appendChild(li);
    });




    // <li>
    //   <div class="title">Christmas Day!</div>
    //   <div class="date">25-Dec-2020</div>
    //   <div class="info">18,356 sleeps ago</div>
    //   <div class="delete"><i class="fas fa-times-circle"></i></div>
    //   <div class="edit"><i class="fas fa-pencil-alt"></i></div>
    // </li>
  }
}

document.addEventListener('DOMContentLoaded', UI.displaySavedDates(), false);