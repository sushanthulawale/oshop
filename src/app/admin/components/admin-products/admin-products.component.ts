import { ProductService } from 'shared/services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from 'shared/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
 products: Product[];
 filteredProducts: any[];
 subscription: Subscription;
 prod;
 dtOptions: DataTables.Settings = {};
 dtTrigger = new Subject<string>();

  constructor(public productService: ProductService, private db: AngularFireDatabase) {
    this.prod = this.db.list('/products');
    this.subscription = this.prod.snapshotChanges()
    .subscribe(products => {
      this.products = this.filteredProducts = products.map(item => {
        return {
          $key : item.key,
          ...item.payload.val()
        };
      });
      this.dtTrigger.next();
    });
    
    }
  ngOnInit(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  
  filter(query: string){
    this.filteredProducts = (query) ?
    this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
    this.products;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
  
}
