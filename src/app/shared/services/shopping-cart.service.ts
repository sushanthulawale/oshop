import { Observable } from 'rxjs';
// import { Product } from 'src/app/models/product';
import { take, map } from 'rxjs/operators';
import { Product } from 'c:/oshop/src/app/shared/models/product';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { ShoppingCart } from 'c:/oshop/src/app/shared/models/shopping-cart';


@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) {
  }

  async getCart(): Promise<Observable<ShoppingCart>>{
    const cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges().pipe(map((x: any) => new ShoppingCart(x.items)));
  }

  async addToCart(product: Product){
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product){
    this.updateItem(product, -1);
  }

  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items' ).remove();
  }

  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string>{
    const cartId = localStorage.getItem('cartId');
    if (cartId) { return cartId; }

    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(product: Product, change: number){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.$key);
    item$.valueChanges().pipe(take(1)).subscribe((item: any) => {
      if (item === null)  {item = {}; }
      let quantity = (item.quantity || 0) + change;
      if (quantity === 0)
      {
        item$.remove();
        return;
      }
    // if (item.payload.exists()){
    //   item$.update({product: {title: product.title,
    //   category: product.category,
    //   imageUrl: product.imageUrl,
    //   price: product.price}, quantity: item.payload.exportVal().quantity + change });
    //  }
    //  else {
    //   item$.update({product: {title: product.title,
    //   category: product.category,
    //   imageUrl: product.imageUrl,
    //   price: product.price}, quantity: 1 });
    //  }
     else
     {
          item$.update({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity
        });
      }
    });
  }
}
