import { Component } from '@angular/core';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchTerm = '';

  constructor(private searchService: SearchService) {}

  onSearchChange(value: string) {
    this.searchService.setSearch(value.trim());
  }
}
