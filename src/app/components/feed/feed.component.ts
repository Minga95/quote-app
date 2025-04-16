import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/interface/post';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  postForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      text: ['', Validators.required],
      author: ['']
    });
  }


  ngOnInit() {
  }

  addPost() {
    if (this.postForm.invalid) return;
    const { text, author } = this.postForm.value;
    const post: Post = {
      text: text.trim(),
      author: author.trim() || 'Anonymous',
      timestamp: new Date()
    };
    console.log(post)
    this.postForm.reset();
  }

}
