import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: AngularFireList<any>;
  prod = [];

  constructor(private db: AngularFireDatabase) {
     this.getAll();
  }

  create(product){
    return this.db.list('/products').push(product);
  }

  getAll() {
    this.products = this.db.list('/products');
    this.products.snapshotChanges()
    .subscribe(list => {
      this.prod = list.map(item => {
        return {
          $key : item.key,
          ...item.payload.val()
        };
      });
    });
  }

  geteverything(){
    return this.db.list('/products');
  }
  getProd(productId){
    return this.db.object('/products/' + productId);
  }

  update(productId, product){
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId){
    return this.db.object('/products/' + productId).remove();
  }

}
