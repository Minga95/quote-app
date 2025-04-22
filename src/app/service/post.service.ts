import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from '../interface/post';
import { environment } from '../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = environment.apiUrl + environment.post;

  private postAddedSource = new Subject<Post>();
  postAdded$ = this.postAddedSource.asObservable();

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  addPost(post: Post): void {
    this.http.post<Post>(this.apiUrl, post).subscribe({
      next: (savedPost) => this.postAddedSource.next(savedPost),
      error: (err) => console.error('Errore nell\'aggiunta:', err),
    });
  }
}
