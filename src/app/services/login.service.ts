import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParameterCodec,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { CustomHttpParamEncoder } from '../helpers/custom-encoder'
import { LoginDetails } from '../models/login-details';

@Injectable()
export class LoginService {

  get isLogged(): boolean {
    return this.isLoggedField;
  }
  public get currentUserValue(): LoginDetails {
    return this.currentUserSubject.value;
  }


  private currentUserSubject: BehaviorSubject<LoginDetails>;
  public currentUser: Observable<LoginDetails>;
  public  encoder: HttpParameterCodec;

  private userName: string;
  private isLoggedField = false;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<LoginDetails>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    if (this.currentUserValue) {
      this.isLoggedField = true;
    }
  }

  login(user: any) {
    const url = 'https://connect.paj-gps.de/api/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-CSRF-TOKEN': ' ',
     
      }),
      params: new HttpParams({encoder: new CustomHttpParamEncoder()}).append('email', user.email)
        .append('password', user.password)
    };
    return this.http.post<any>(url, '', httpOptions).pipe(map(data => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      let loginDetails: LoginDetails = data.success;
      sessionStorage.setItem('currentUser', JSON.stringify(loginDetails));
      const tokenStr = 'Bearer ' + loginDetails.token;
      sessionStorage.setItem('token', tokenStr);
      this.currentUserSubject.next(loginDetails);
      this.isLoggedField = true;
      return loginDetails;
    })).subscribe({
      next: (val) => console.log("response", val),
      error: this.handleError
    });
  }

  handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}