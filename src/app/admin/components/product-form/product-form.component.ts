import { ProductService } from 'shared/services/product.service';
import { CategoryService } from 'shared/services/category.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
product: any = {} ;
id;


  constructor(private router: Router,
              private route: ActivatedRoute,
              public categoryService: CategoryService,
              private productService: ProductService) {
    // this.categories$ = categoryService.getCategories();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id){
      this.productService.getProd(this.id).valueChanges()
      .pipe(take(1)).subscribe(p => {
        this.product = p;
      });
    }
}

  save(product){
    if (this.id) {
       console.log('update item');
       this.productService.update(this.id, product);
    }

    else {
      console.log('new item');
      this.productService.create(product);
    }

    window.alert('Product Saved/Updated successfully.');
    this.router.navigate(['/admin/products']);
  }

  delete(){
    if (!confirm('Are you sure you want delete the product?')) return; 

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }

  // back(){
  //   this.router.navigate(['/admin/products']);
  // }
  ngOnInit(): void {
  }

}
