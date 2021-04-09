import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {CustomValidatorService} from '../services/custom-validator.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;
  fileToUpload;
  base64textString;
  finalFile;
  imageError: boolean;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private router: Router, public api: ApiService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      mobile: [null, [Validators.required,
        Validators.compose([
          CustomValidatorService.patternValidator(/^[0-9]*$/, {hasNumber: true}),
        ]),
        Validators.minLength(10)]],
      gender: ['', [Validators.required]],
      category: ['', [Validators.required]],
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
      confirm_password: [null, [Validators.required, Validators.compose([CustomValidatorService.matchValues('password')])]],
      email: ['', [Validators.required, Validators.pattern(/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\s*$/)]],
    });
  }

  // tslint:disable-next-line:typedef
  setConfirmPassword() {
    this.form.controls.confirm_password.setValue('');
  }

  // tslint:disable-next-line:typedef
  handleFileInput(files: FileList) {
    this.imageError = false;
    this.fileToUpload = files.item(0);
    const file = files.item(0);
    if (files && file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  // tslint:disable-next-line:typedef
  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.finalFile = 'data:image/png;base64,' + btoa(binaryString);
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.finalFile && this.form.valid) {
      this.imageError = true;
    }
    if (this.form.valid && this.finalFile) {
      const data = {
        first_name: this.form.value.first_name,
        last_name: this.form.value.last_name,
        email: this.form.value.email,
        image: this.finalFile,
        password: this.form.value.password,
        gender: this.form.value.gender,
        category: this.form.value.category,
        mobile: this.form.value.mobile
      };
      this.api.register(data).subscribe((res: any) => {
        if (res.meta.code === 1) {
          this.toastr.success(res.meta.message);
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(res.meta.message);
        }
      });
    }
  }
}
