import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { max, switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Comment } from '../shared/comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirectvie:NgForm?;

  dish!: Dish;
  errMess!: string;
  dishIds!: string[];
  prev!: string;
  next!: string;

  commentForm!: FormGroup;
  comment!: Comment;
  dishcopy!: Dish;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author':{
      'required':   'Name is required',
      'minlength':  'Name must be at least 2 characters long',
      'maxlength':  'Name cannot be more than 15 characters long'
    },
    'comment':{
      'required':   'Comment name is required',
      'minlength':  'Comment must be at least 3 characters long'
    }
  };

  constructor(private dishService: DishService, 
    private route: ActivatedRoute, 
    private location: Location,
    private fb:FormBuilder,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit(): void {
    this.createForm();

    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
    errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]], 
      date: ''
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // reset validation messages
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date = Date.now().toString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish => {
      this.dish = dish; this.dishcopy = dish;
    },
    errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.commentForm.reset({
        rating: 5,
        comment: '', 
        author: ''
    });
    this.commentFormDirectvie.resetForm();
  }

}
