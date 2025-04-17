import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../interface/Quote';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = environment.apiUrl + environment.quote;

  constructor(private http: HttpClient) { }

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl);
  }
}
