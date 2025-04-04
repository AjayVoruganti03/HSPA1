import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../services/user-service.service';
import { User } from '../../model/user';
import { AlertifyService } from '../../services/alertify.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;

  user!: User;

  userSubmittted: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserServiceService,
     private alertify: AlertifyService) { }

  ngOnInit() {
    // this.registerForm = this.fb.group(
    //   {
    //     userName: new FormControl(null, Validators.required),
    //     email: new FormControl(null, [Validators.required, Validators.email]),
    //     password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    //     confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    //     mobile: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    //   },
    //   { validators: this.passwordMatchingValidator }
    // );
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      userName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]],
      mobile: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    }, { validators: this.passwordMatchingValidator });
  }

  passwordMatchingValidator(fg: FormGroup): ValidationErrors | null {
    return fg.get('password')?.value === fg.get('confirmPassword')?.value ? null : { notMatching: true };
  }

  get userName() {
    return this.registerForm.get('userName') as FormControl;
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get password() {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get mobile() {
    return this.registerForm.get('mobile') as FormControl;
  }

  onSubmit() {
    console.log(this.registerForm.value);
    this.userSubmittted = true;
    if (this.registerForm.valid) {
      //this.user = Object.assign(this.user, this.registerForm.value);
      this.userService.addUser(this.userData());
      this.registerForm.reset();
      this.userSubmittted = false;
      this.alertify.success('Congrats, you are successfully registered!');
    }
    else{
      this.alertify.error('Kindly fill all the required fields!');
    }
    
  }
  userData(): User {
    return this.user={
      userName: this.userName.value,
      email: this.email.value,  
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
      mobile: this.mobile.value
    }
  }

}
