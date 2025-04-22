import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/interface/Quote';
import { Post } from 'src/app/interface/post';
import { QuoteService } from 'src/app/service/quote.service';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  quotes: Quote[] = [];
  favorites: Quote[] = [];
  loading = true;
  loadedCount = 0;

  constructor(
    private quoteService: QuoteService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.quotes = [];
    this.loading = true;
    this.loadedCount = 0;

    for (let i = 0; i < 5; i++) {
      this.quoteService.getQuotes().subscribe({
        next: (response) => {
          this.quotes.push(...response);
          this.checkIfFinished();
        },
        error: (err) => {
          console.error(`Errore nella chiamata #${i + 1}:`, err);
          this.checkIfFinished();
        },
      });
    }
  }

  checkIfFinished() {
    this.loadedCount++;
    if (this.loadedCount === 5) {
      this.loading = false;
    }
  }

  toggleFavorite(quote: Quote): void {
    if (this.isFavorite(quote)) return;

    const trimmedAuthor = quote.author?.trim() || 'Anonymous';
    const post: Post = {
      text: quote.quote,
      author: trimmedAuthor,
      timestamp: new Date(),
    };

    this.favorites.push(quote);
    this.postService.addPost(post);
  }

  isFavorite(quote: Quote): boolean {
    return this.favorites.some(
      (q) => q.quote === quote.quote && q.author === quote.author
    );
  }

  replaceQuote(index: number): void {
    this.quoteService.getQuotes().subscribe({
      next: (newQuotes) => {
        if (newQuotes.length > 0) {
          this.quotes[index] = newQuotes[0];
        }
      },
      error: (err) => {
        console.error('Errore nel rimpiazzo della citazione:', err);
      },
    });
  }
}
