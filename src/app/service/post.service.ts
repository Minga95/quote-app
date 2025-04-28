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

  private postDeletedSource = new Subject<number>();
  postDeleted$ = this.postDeletedSource.asObservable();

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  addPost(post: Post): void {
    this.http.post<Post>(this.apiUrl, post).subscribe({
      next: (savedPost) => this.postAddedSource.next(savedPost),
      error: (err) => console.error('Error adding post:', err),
    });
  }

  deletePost(post: Post): void {
    const url = `${this.apiUrl}/${post.id}`;
    this.http.delete<{ message: string, post: Post }>(url).subscribe({
      next: () => this.postDeletedSource.next(post.id!),
      error: (err) => console.error('Error deleting post:', err),
    });
  }
}
