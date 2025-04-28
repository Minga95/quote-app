
import { Component, inject, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/interface/post';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {


  @Input() post: Post | undefined

   private postService = inject(PostService);

  constructor() { }

  ngOnInit() {

  }


  copyToClipboard(post: Post) {
    const comment = `${post.text}\n(${post.author || 'Anonymous'})`;
    navigator.clipboard.writeText(comment).then(() => {
      console.log('Citazione copiata!');
    }).catch(err => {
      console.error('Errore nella copia:', err);
    });
  }

  deletePost(post: Post){
    this.postService.deletePost(post);
  }



}
