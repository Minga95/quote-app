import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/interface/post';
import { SearchService } from 'src/app/service/search.service';
import { PostService } from 'src/app/service/post.service'; // Importa PostService
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  postArray: Post[] = [];
  filteredPosts: Post[] = [];
  searchSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private postService: PostService
  ) {
    this.postForm = this.fb.group({
      text: ['', Validators.required],
      author: [''],
    });
  }

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.postArray = posts;
        this.filteredPosts = this.applyFilter(this.searchService.currentSearch);
      },
      error: (err) => {
        console.error('Errore nel caricamento dei post:', err);
      },
    });

    this.searchSub = this.searchService.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        this.filteredPosts = this.applyFilter(search);
      });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  addPost() {
    if (this.postForm.invalid) return;
    const { text, author } = this.postForm.value;
    const trimmedAuthor = author?.trim();

    const post: Post = {
      text: text.trim(),
      author:
        trimmedAuthor && trimmedAuthor.length > 0 ? trimmedAuthor : 'Anonymous',
      timestamp: new Date(),
    };

    this.postService.addPost(post).subscribe({
      next: (savedPost: Post) => {
        this.postArray = [savedPost, ...this.postArray];
        this.filteredPosts = this.applyFilter(this.searchService.currentSearch);
        this.postForm.reset();
      },
      error: (err) => {
        console.error("Errore nell'aggiunta del post:", err);
      },
    });
  }

  applyFilter(search: string): Post[] {
    if (!search.trim()) return [...this.postArray];

    const keywords = search.toLowerCase().split(/\s+/);
    return this.postArray.filter((post) => {
      const combined = `${post.text} ${post.author ?? ''}`.toLowerCase();
      return keywords.some((kw) => combined.includes(kw));
    });
  }
}
