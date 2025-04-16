import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from '../interface/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:3000/post';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addPost(quote: string, author: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { quote, author });
  }

}
