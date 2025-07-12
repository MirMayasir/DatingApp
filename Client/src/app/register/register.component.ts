import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { eventListeners } from '@popperjs/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/Services/account.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm : FormGroup = new FormGroup({});
  validationError : string[] | undefined;

  maxDate : Date = new Date;
  constructor(private accountcontroller:AccountService, private toaster: ToastrService, private fb:FormBuilder, private router:Router){}
  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender :['male'],
      knownAs :['', Validators.required],
      dateOfBirth :['', Validators.required],
      city :['', Validators.required],
      country :['', Validators.required],
      username :['', Validators.required],
      password : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword : ['', [Validators.required, this.matchValues('password')]],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next : ()=>{
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      }
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control : AbstractControl) =>{
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching :true}
    }
  }


  register(){

    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value, dateOfBirth:dob }
    
    this.accountcontroller.register(values).subscribe({
      next : () =>{
        this.router.navigateByUrl('/members')
      },
      error : error => {
       this.validationError = error;
      } 
      
    })
  }

  private getDateOnly(dob: string | undefined){
    if(!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())).toISOString().slice(0,10);
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
