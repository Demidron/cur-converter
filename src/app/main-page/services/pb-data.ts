import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CurCodes } from "../models/cur-codes-enum";
import { CurrencyExchange } from "../models/currency-in-uah";
import { PrivatExchange } from "../models/privat-exchange";

@Injectable()
export class PbDataManager {

    private _privatExchange: PrivatExchange | undefined;

    private _actualCursesMas: CurrencyExchange[] = [];

    constructor(private http: HttpClient) {
        this.init();
    }

    private init() {
        this.http.get<PrivatExchange>('https://api.privatbank.ua/p24api/exchange_rates?date=' + formatDate(new Date(), 'dd.MM.yyyy', 'en-US', 'GMT+2')).subscribe(data => {
            this._privatExchange = data;
            this.addCourseInActual(CurCodes.EUR)
            this.addCourseInActual(CurCodes.USD)
        });
    }

    get actualCursesMas() {
        return this._actualCursesMas;
    }

    addCourseInActual(code: CurCodes) {
        let cour = this._privatExchange?.exchangeRate.find(x => (x.currency == code) && x.purchaseRate);
        cour ? this._actualCursesMas.push({
            code: code,
            buy: cour.purchaseRate,
            sale: cour.saleRate
        }) : '';
    }
    
    public convertCurrency(codeSell: CurCodes, codeBuy: CurCodes, sum: number) {      
        return ((this.getPurchaseRate(codeSell).buy*sum)/this.getPurchaseRate(codeBuy).sale);
    }

    private getPurchaseRate(code: CurCodes) : CurrencyExchange{
        if(code=='UAH'){
            return  {
                code: 'UAH',
                buy: 1,
                sale:1
            }
        }
        let cour=this._privatExchange?.exchangeRate.find(x => (x.currency == code) && x.purchaseRate);
 
        if(cour){
            return  {
                code: code,
                buy: cour.purchaseRate,
                sale: cour.saleRate
            }
        }
        else throw new Error("Currency " +code+" not find!" );
        
    }


}