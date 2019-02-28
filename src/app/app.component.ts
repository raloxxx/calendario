import { Component, OnInit } from '@angular/core';
import { colors } from '../assets/colors';
import { daysDictionarie } from '../assets/daysDictionarie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public daysDictionarie = daysDictionarie;
  // Data structure para cada curso
  public course = {
    hourMax: {
      hour: 0,
      minutes: 0
    },
    hourMin: {
      hour: 0,
      minutes: 0
    },
    color: '',
    name: '',
    pixels: ''
  }

  // Pixeles que indican el tamaño del calendario horas
  public pixels: String = '';

  public calendary = {
    monday: {
      courses: []
    },
    tuesday: {
      courses: []
    },
    wednesday: {
      courses: []
    },
    thursday: {
      courses: []
    },
    friday: {
      courses: []
    },
    saturday: {
      courses: []
    },
    sunday: {
      courses: []
    }
  };

  public day = '';

  public boxSize: number = 0;
  public emptyBoxes: any = [];
  public hours: number[] = [];
  public sizeElementList = '';
  public colorSelected = '';
  public colors = colors;


  ngOnInit() {
    this.boxSize = this.setBoxSize([15, 0], [21, 0]);
    this.pixels = (this.boxSize).toString() + 'px';
  }

  private setBoxSize(hourMin: Array<number>, hourMax: Array<number>) {
    this.setHours(hourMin, hourMax);
    return 60 * this.hours.length;
  }

  private setHours(hourMin: Array<number>, hourMax: Array<number>) {
    let start = hourMin[0];
    let finish = 0;
    finish = hourMax[1] > 0 ? finish = hourMax[0] + 1 : finish = hourMax[0];
    for (let i = start; i <= finish; i++) {
      this.hours.push(i);
    }

  }

  public setColor(color: string) {
    this.colorSelected = color;
    this.course.color = color;
  }

  public addCourse(objCourse) {

    console.log(this.sumTotal(this.calendary[this.day]['courses']))
    if (this.boxSize <= this.sumTotal(this.calendary[this.day]['courses']) + objCourse['pixels']) {
      alert("objCourse");
      return false;
    }

    let max = 0, min = 0;
    let courseUndefined = {
      hourMax: {
        hour: 0,
        minutes: 0
      },
      hourMin: {
        hour: 0,
        minutes: 0
      },
      color: '',
      name: '',
      pixels: ''
    };
    let course = {
      hourMax: {
        hour: objCourse['hourMax']['hour'],
        minutes: objCourse['hourMax']['minutes']
      },
      hourMin: {
        hour: objCourse['hourMin']['hour'],
        minutes: objCourse['hourMin']['minutes']
      },
      color: objCourse['color'],
      name: objCourse['name'],
      pixels: this.calculateCourse(objCourse['hourMax'], objCourse['hourMin']).toString() + 'px'
    }


    if (parseInt(course['hourMin']['hour']) + parseInt(course['hourMin']['minutes']) == this.hours[0]) {

      this.calendary[this.day]['courses'].push(course);
    } else {
      this.calendary[this.day]['courses'].push(course);
      console.log(this.calendary)
      this.calendary[this.day]['courses'] = this.sortHour(this.calendary[this.day]['courses']);

      let evalHour = this.calendary[this.day]['courses'].length == 1 ? this.hours[0] : this.calendary[this.day]['courses'][this.calendary[this.day]['courses'].length - 2]['hourMax']['hour'];
      let evalMin = this.calendary[this.day]['courses'].length == 1 ? 0 : parseInt(this.calendary[this.day]['courses'][this.calendary[this.day]['courses'].length - 2]['hourMax']['minutes']);

      // Ultimo elemento
      min = (this.calendary[this.day]['courses'][this.calendary[this.day]['courses'].length - 1]['hourMin']['hour'] * 60) + parseInt(this.calendary[this.day]['courses'][this.calendary[this.day]['courses'].length - 1]['hourMin']['minutes']);
      // Penultimo elemento
      max = (evalHour * 60) + evalMin;

      if ((min - max) != 0) {
        courseUndefined['hourMax']['hour'] = this.calendary[this.day]['courses'][this.calendary[this.day]['courses'].length - 1]['hourMin']['hour'];
        courseUndefined['hourMax']['minutes'] = this.calendary[this.day]['courses'][this.calendary[this.day]['courses'].length - 1]['hourMin']['minutes'];
        courseUndefined['hourMin']['hour'] = evalHour;
        courseUndefined['hourMin']['minutes'] = evalMin;
        courseUndefined['name'] = 'No definido';
        courseUndefined['color'] = '#6c757d';
        courseUndefined['pixels'] = (min - max) + 'px';

        console.log("viendo", courseUndefined);

        this.calendary[this.day]['courses'][this.calendary[this.day]['courses'].length - 1] = courseUndefined;
        this.calendary[this.day]['courses'].push(course);

      }
    }

  }

  private calculateCourse(hourMax, hourMin) {

    let max = (hourMax['hour'] * 60) + parseInt(hourMax['minutes']);
    let min = (hourMin['hour'] * 60) + parseInt(hourMin['minutes']);


    return (max - min);
  }


  public sortHour(courses) {

    let aux = 0;
    let minutesi = 0;
    let minutesj = 0;

    for (let i = 0; i < courses.length - 1; i++) {
      for (let j = 1 + i; j < courses.length; j++) {

        minutesi = (courses[i]['hourMin']['hour'] * 60) + courses[i]['hourMin']['minutes'];
        minutesj = (courses[j]['hourMin']['hour'] * 60) + courses[j]['hourMin']['minutes'];
        if (minutesi > minutesj) {
          aux = courses[i];
          courses[i] = courses[j];
          courses[j] = aux;
        }
      }
    }

    return courses;

  }

  private sumTotal(courses) {
    let total = 0;
    for (let i = 0; i < courses.length; i++) {
      total += parseInt(courses[i]['pixels'].substr(0, courses[i]['pixels'].length - 2));
    }
    return total;
  }

  public setDay(day) {
    this.day = day;
  }
}
