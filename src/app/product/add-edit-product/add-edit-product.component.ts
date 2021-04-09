import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidatorService} from '../../services/custom-validator.service';
import {ApiService} from '../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {
  form: FormGroup;
  fileToUpload;
  oldImage;
  base64textString;
  finalFile;
  productId;
  imageError: boolean;

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public api: ApiService,
              private toastr: ToastrService) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      price: [null, [Validators.required,
        Validators.compose([
          CustomValidatorService.patternValidator(/^\d+$/, {hasNumber: true}),
        ])]],
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.productId = +params.get('id');
    });
  }

  ngOnInit(): void {
    this.api.getOneProduct(this.productId).subscribe((response: any) => {
      this.form = this.formBuilder.group({
        name: [response.data.name, [Validators.required]],
        category: [response.data.category, [Validators.required]],
        sku: [response.data.sku, [Validators.required]],
        price: [response.data.price, [Validators.required,
          Validators.compose([
            CustomValidatorService.patternValidator(/^\d+$/, {hasNumber: true}),
          ])]],
      });
      this.oldImage = response.data.image;
    });
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

  // tslint:disable-next-line:typedef
  onSubmit() {
    if (!this.finalFile && this.form.valid) {
      this.imageError = true;
    }
    if (this.form.valid && this.finalFile) {
      let data = {
        name: this.form.value.name,
        image: this.finalFile,
        sku: this.form.value.sku,
        price: this.form.value.price,
        category: this.form.value.category,
        id: undefined

      };
      if (this.productId) {
        data.id = this.productId;
      }
      this.api.addProduct(data).subscribe((res: any) => {
        if (res.meta.code === 1) {
          this.toastr.success(res.meta.message);
          this.router.navigate(['/product']);
        } else {
          this.toastr.error(res.meta.message);
        }
      });
    }
  }

}
