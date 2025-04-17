import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from '../interface/post';
import { environment } from '../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = environment.apiUrl + environment.post;

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  addPost(post:Post): Observable<any> {
    return this.http.post<any>(this.apiUrl, post);
  }

}
