import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, formatDate } from '@angular/common';
import { PrivatExchange } from './models/privat-exchange';
import { PbDataManager } from './services/pb-data';
import { CurCodes, curSymbols } from './models/cur-codes-enum';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyExchange } from './models/currency-in-uah';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  curSymbols = curSymbols;
  curs: string[] = Object.keys(CurCodes);
  selectedRow: number;

  public form: FormGroup;



  constructor(public pbManager: PbDataManager, private fb: FormBuilder, private currencyPipe: CurrencyPipe) {
    this.form = this.createForm();
    this.pushCur('UAH');
    this.pushCur('USD');

    this.selectedRow = 0;

  }

  ngOnInit(): void {

    this.form.controls['courses'].valueChanges.subscribe(cuMas => {
      let val = cuMas[this.selectedRow].valueCur.replace(/[^\d.]/g, '').replace(/^0+/, '');
      val = val.split('.').length >= 2 ? val.split('.')[0] + '.' + val.split('.')[1].slice(0, 5) : val;
      for (let index = 0; index < cuMas.length; index++) {
        const element = cuMas[index];


        let formattedVal;

        if (index == this.selectedRow) {
          formattedVal = val.slice(-1) == '.' ?
            val : this.currencyPipe.transform(val, 'USD', '', '1.0-5')
        }
        else {

          formattedVal = cuMas[this.selectedRow].selectedCode && element.selectedCode ?
            this.currencyPipe.transform(
              this.pbManager.convertCurrency(cuMas[this.selectedRow].selectedCode, element.selectedCode, val)
              , 'USD', '', '1.0-5') :
            "";

        }

        this.courses.controls[index].patchValue({
          selectedCode: element.selectedCode,
          valueCur: formattedVal
        }, { emitEvent: false })
      }
    })
  }




  get courses() { return (this.form.get('courses') as FormArray); }

  createForm() {
    return this.fb.group({
      courses: this.fb.array([])
    })
  }

  pushCur(code: string) {
    this.courses.push(this.fb.group({
      valueCur: '',
      selectedCode: code
    }));
  }

  addCurClick(index: number) {
    this.courses.insert(index + 1, this.fb.group({
      valueCur: '',
      selectedCode: ''
    }))
  }
  delCurClick(index: number) {
    this.courses.removeAt(index);
  }
  spinCurClick(i: number) {

    let con = this.courses.controls[i].value;
    let con2 = this.courses.controls[i+1].value;
    this.courses.controls[i].patchValue({
      valueCur:con.valueCur,
      selectedCode: con2.selectedCode
    })
    this.courses.controls[i + 1].patchValue({
      valueCur:con2.valueCur,
      selectedCode: con.selectedCode
    })
  }

  inputChange(index: number) {
    this.selectedRow = index;
  }
}
