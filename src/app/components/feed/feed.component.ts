import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/interface/post';
import { SearchService } from 'src/app/service/search.service';
import { PostService } from 'src/app/service/post.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit, OnDestroy {
  postForm!: FormGroup;
  postArray: Post[] = [];
  filteredPosts: Post[] = [];
  searchSub!: Subscription;
  postSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      text: ['', Validators.required],
      author: [''],
    });

    this.postService.getPosts().subscribe((posts) => {
      this.postArray = posts;
      this.filteredPosts = this.applyFilter(this.searchService.currentSearch);
    });

    this.searchSub = this.searchService.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        this.filteredPosts = this.applyFilter(search);
      });

    this.postSub = this.postService.postAdded$.subscribe((newPost) => {
      this.postArray = [newPost, ...this.postArray];
      this.filteredPosts = this.applyFilter(this.searchService.currentSearch);
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    this.postSub?.unsubscribe();
  }

  addPost() {
    if (this.postForm.invalid) return;

    const { text, author } = this.postForm.value;
    const post: Post = {
      text: text.trim(),
      author: author?.trim() || 'Anonymous',
      timestamp: new Date(),
    };

    this.postService.addPost(post);
    this.postForm.reset();
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
