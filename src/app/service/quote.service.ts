import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../interface/Quote';


@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = 'https://api.api-ninjas.com/v1/quotes';

  private headers = new HttpHeaders({
    'X-Api-Key': '8ZcasIh6JcoSTHz+xEg+DQ==xI5y61lRhspCq6Dl'
  });

  constructor(private http: HttpClient) { }


  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl, { headers: this.headers });
  }
}
