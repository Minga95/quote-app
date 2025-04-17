import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/interface/post';
import { SearchService } from 'src/app/service/search.service';
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

  constructor(private fb: FormBuilder, private searchService: SearchService) {
    this.postForm = this.fb.group({
      text: ['', Validators.required],
      author: [''],
    });
  }

  ngOnInit() {
    this.searchSub = this.searchService.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        this.filteredPosts = this.applyFilter(search);
      });
    this.addExamplePost();
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

    this.postArray = [post, ...this.postArray];
    this.filteredPosts = this.applyFilter(this.searchService.currentSearch);
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

  addExamplePost() {
    const post: Post = {
      text: 'Two gust is megl che uan',
      author: 'Albert Einstein',
      timestamp: new Date(),
    };
    this.postArray.push(post);
    this.filteredPosts = [...this.postArray];
  }
}
