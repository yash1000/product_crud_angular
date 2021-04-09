import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly baseurl = 'http://localhost:3000/';
  httpOptions;

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  // tslint:disable-next-line:typedef
  getAuthHeader() {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    if (token) {
      this.httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + token.data.token
        }),
      };
    }
    return this.httpOptions;
  }

  // tslint:disable-next-line:typedef
  private handleAuthError(err: HttpErrorResponse) {
    switch (err.status) {
      case 0   :
        break;
      case 400 :
        this.toastr.error(err.error.message);
      case 401 :
        this.toastr.error(err.error.message);
    }
  }

  // tslint:disable-next-line:typedef
  register(data) {
    return this.http.post(this.baseurl + 'add-user', data).pipe(
      catchError((err => {
          this.handleAuthError(err);
          return throwError(err);
        })
      ));
  }

  // tslint:disable-next-line:typedef
  addProduct(data) {
    return this.http.post(this.baseurl + 'add-edit-product', data, this.getAuthHeader()).pipe(
      catchError((err => {
          this.handleAuthError(err);
          return throwError(err);
        })
      ));
  }
  // tslint:disable-next-line:typedef
  getOneProduct(data) {
    return this.http.get(this.baseurl + 'product/' + data, this.getAuthHeader()).pipe(
      catchError((err => {
          this.handleAuthError(err);
          return throwError(err);
        })
      ));
  }
  // tslint:disable-next-line:typedef
  login(data) {
    return this.http.post(this.baseurl + 'login', data).pipe(
      catchError((err => {
          this.handleAuthError(err);
          return throwError(err);
        })
      ));
  }

  // tslint:disable-next-line:typedef
  getProduct(data) {
    return this.http.get(this.baseurl + 'product' + data, this.getAuthHeader()).pipe(
      catchError((err => {
          this.handleAuthError(err);
          return throwError(err);
        })
      ));
  }

  // tslint:disable-next-line:typedef
  deleteProduct(data) {
    return this.http.delete(this.baseurl + 'product/' + data, this.getAuthHeader()).pipe(
      catchError((err => {
          this.handleAuthError(err);
          return throwError(err);
        })
      ));
  }
}
