import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/interface/post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {


  @Input() post: Post | undefined

  constructor() { }

  ngOnInit() {
    console.log(this.post)
  }


  copyToClipboard(post: Post) {
    const comment = `${post.text}\n(${post.author || 'Anonymous'})`;
    navigator.clipboard.writeText(comment).then(() => {
      console.log('Citazione copiata!');
    }).catch(err => {
      console.error('Errore nella copia:', err);
    });
  }

}
