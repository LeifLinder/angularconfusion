import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import {ProcessHTTPMsgService } from './process-httpmsg.service';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DishService {

  constructor(private http: Http,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) { }
  /*
  getDishes(): Observable<Dish[]> {
    return Observable.of(DISHES).delay(2000);
  }
*/
/*
getDishes(): Observable<Dish[]> {
  return this.http.get(baseURL + 'dishes').map(res => { return this.processHTTPMsgService.extractData(res); });
}
*/
getDishes(): Observable<Dish[]> {
  return this.http.get(baseURL + 'dishes').map(res => this.processHTTPMsgService.extractData(res));
}
/*
  getDish(id: number): Observable<Dish> {
    return Observable.of(DISHES.filter((dish) => (dish.id === id))[0]).delay(2000);
  }
*/
getDish(id: number): Observable<Dish> {
  return  this.http.get(baseURL + 'dishes/' + id).map(res => this.processHTTPMsgService.extractData(res));
}
/*
  getFeaturedDish(): Observable<Dish> {
    return Observable.of(DISHES.filter((dish) => dish.featured)[0]).delay(2000);
  }
*/
getFeaturedDish(): Observable<Dish> {
  return this.http.get(baseURL + 'dishes?featured=true').map(res => this.processHTTPMsgService.extractData(res)[0]);
}
/*
  getDishIds(): Observable<number[]> {
    return Observable.of(DISHES.map(dish => dish.id ));
  }
*/
getDishIds(): Observable<number[]> {
  return this.getDishes().map(dishes => dishes.map(dish => dish.id));
}

}
