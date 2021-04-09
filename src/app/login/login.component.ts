import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidatorService} from '../services/custom-validator.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, public api: ApiService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: [
        null,
        [
          Validators.required,
          Validators.compose([
            CustomValidatorService.patternValidator(/\d/, {hasNumber: true}),
            CustomValidatorService.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            CustomValidatorService.patternValidator(/[a-z]/, {hasSmallCase: true}),
            CustomValidatorService.patternValidator(/[!@#\$%\^&?]/, {
              haslengthCase: true
            }),
            ,
          ]),
          Validators.minLength(8)
        ]
      ],
      email: ['', [Validators.required, Validators.pattern(/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\s*$/)]],
    });
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.submitted = true;
    if(this.form.valid) {
      const data = {
        email: this.form.value.email,
        password: this.form.value.password,
      };
      this.api.login(data).subscribe((res: any) => {
        console.log(res);
        if (res.meta.code === 1) {
          this.toastr.success(res.meta.message);
          localStorage.setItem('accessToken', JSON.stringify(res));
          this.router.navigate(['/product']);
        } else {
          this.toastr.error(res.meta.message);
        }
      });
    }
  }

}
