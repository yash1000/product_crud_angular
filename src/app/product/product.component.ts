import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  image;
  name;
  data = [];
  searchTerm;
  page;
  pageSize;
  // tslint:disable-next-line:variable-name
  total_size;

  constructor(public api: ApiService, private toastr: ToastrService, private router: Router) {
    this.image = 'http://localhost:3000/users/' + JSON.parse(localStorage.getItem('accessToken')).data.user.image;
    this.name = JSON.parse(localStorage.getItem('accessToken')).data.user.first_name;
    const page = `?page=1`;
    const perPage = '&per_page=10';
    this.getList(page + perPage, '');
  }

  ngOnInit(): void {

  }

  // tslint:disable-next-line:typedef
  getList(data, check) {
    this.api.getProduct(data).subscribe((res: any) => {
      if (res.meta.code === 1) {
        this.data = res.data;
        this.page = res.meta.page;
        this.pageSize = res.meta.per_page;
        this.total_size = res.meta.total;
        if (check !== 'fromsearch') {
          this.toastr.success(res.meta.message);
        }
      } else {
        this.toastr.error(res.meta.message);
      }
    });
  }

  toProductAdd() {
    this.router.navigate(['add-edit-product']);
  }

  // tslint:disable-next-line:typedef
  search() {
    if (this.searchTerm.length > 2) {
      const page = `?page=1`;
      const perPage = '&per_page=10';
      const search = `&search=${this.searchTerm}`;
      this.getList(page + perPage + search, 'fromsearch');
    }
  }

  // tslint:disable-next-line:typedef
  pagechange(data) {
    const page = `?page=${data}`;
    const perPage = '&per_page=10';
    this.getList(page + perPage, '');
  }

  // tslint:disable-next-line:typedef
  edit(data) {
    this.router.navigate([`add-edit-product/${data}`]);
  }

  // tslint:disable-next-line:typedef
  delete(data) {
    this.api.deleteProduct(data).subscribe((res: any) => {
      if (res.meta.code === 1) {
        this.toastr.success(res.meta.message);
        const page = `?page=1`;
        const perPage = '&per_page=10';
        this.getList(page + perPage, '');
      } else {
        this.toastr.error(res.meta.message);
      }
    });
  }

}
