
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Params, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DISHES } from '../shared/dishes';
import { Comment } from '../shared/comment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/switchmap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';




 @Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

  commentForm: FormGroup;
  comment: Comment;
  dishIds: number[];
  prev: number;
  next: number;
  selectedDish: Dish;
  @Input() dish: Dish;

  formErrors = {
    'rating': '',
    'comment': '',
    'author': '',
    'date': ''
  };
  /*
    rating: number;
    comment: string;
    author: string;
    date: string;
  */

  validationMessages = {
    'rating': {
      'required':      'Rating is required.',
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
      'maxlength':     'Comment cannot be more than 25 characters long.'
    },
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.',
      'maxlength':     'Author cannot be more than 25 characters long.'
    }
  };

  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
       this.createForm();
    }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params
        .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
        .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }

    createForm(): void {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      });

      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
      this.onValueChanged(); // (re)set validation messages now
    }




  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

    onSelect(dish: Dish) {
      this.selectedDish = dish;
    }
    goBack(): void {
      this.location.back();
    }


  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.dish.comments.push(this.comment);
    console.log(this.comment);
    this.commentForm.reset({
      rating: '',
      comment: '',
      author: '',
      date: ''
    });
  }
}
