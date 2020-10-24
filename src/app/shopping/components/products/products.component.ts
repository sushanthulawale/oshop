import { ShoppingCart } from 'shared/models/shopping-cart';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { switchMap } from 'rxjs/operators';
import { Product } from 'shared/models/product';
import { ProductService } from 'shared/services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
products: Product[] = [];
filteredProducts: Product[] = [];
category: string;
products$;
cart$: Observable<ShoppingCart>;
prod: Observable<any>;

  constructor(private route: ActivatedRoute,
              public productService: ProductService,
              private shoppingCartService: ShoppingCartService) {
//Old implementation start
    this.products$ = productService.geteverything();
    this.products$.snapshotChanges()
      .subscribe(products => {
        this.products = this.filteredProducts = products.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
      });

    route.queryParamMap.subscribe(params => {
      this.category = params.get('category');
      // console.log(this.category);
      this.filteredProducts = (this.category) ?
        this.products.filter(p => p.category === this.category) :
        this.products;
    });
/////////////////////////////////////end
  // const products$  = productService.geteverything();
  // products$.valueChanges().pipe(
  //   map(res => Object.values(res['payload']))).subscribe(courses => console.log(courses));
//////// new Implementation start
    // productService.geteverything().valueChanges()
    //   .pipe(
    //     switchMap((products: Product[]) => {
    //       this.products = products;
    //       return route.queryParamMap;
    //     })
    //   )
    //   .subscribe((params) => {
    //     this.category = params.get('category');

    //     this.filteredProducts = this.category
    //       ? this.products.filter((p) => p.category === this.category)
    //       : this.products;
    //   });
//////////////////////////////////end new
  }
 async ngOnInit(){
    this.cart$ = await this.shoppingCartService.getCart();
    this.populateProducts();
  }

  private populateProducts(){
    let prod = this.productService.geteverything();
    this.prod.pipe(switchMap(products => {
      products = products;
      return this.route.queryParamMap;
    })).subscribe(params => {
      this.category = params.get('category');
      this.applyFilter();
    });
  }

  private applyFilter(){
    this.filteredProducts = (this.category) ?
    this.products.filter(p => p.category === this.category) :
    this.products;
  }
}
