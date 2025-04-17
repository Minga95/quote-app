import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/interface/Quote';
import { QuoteService } from 'src/app/service/quote.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  quotes: Quote[] = [];
  favorites: Quote[] = [];
  loading = true;
  loadedCount = 0;

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    const storedFavorites = localStorage.getItem('favorites');
    this.favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    for (let i = 0; i < 5; i++) {
      this.quoteService.getQuotes().subscribe({
        next: (response) => {
          this.quotes.push(...response);
          this.checkIfFinished();
        },
        error: (err) => {
          console.error(`Errore nella chiamata #${i + 1}:`, err);
          this.checkIfFinished();
        }
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
    const index = this.favorites.findIndex(
      q => q.quote === quote.quote && q.author === quote.author
    );

    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(quote);
    }

    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  isFavorite(quote: Quote): boolean {
    return this.favorites.some(
      q => q.quote === quote.quote && q.author === quote.author
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
      }
    });
  }
}
