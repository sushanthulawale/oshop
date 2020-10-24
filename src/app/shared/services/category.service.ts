import { async } from '@angular/core/testing';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';



@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  productList: AngularFireList<any>;
  array = [];
  constructor(private db: AngularFireDatabase) {
    this.productList = this.db.list('/categories');
    this.productList.snapshotChanges().subscribe(
      list => {
        this.array = list.map(item => {
          return {
            $key : item.key,
            ...item.payload.val()
          };
        });
      }
    );
   }


   getEverything(){
    // return this.db.list('/categories').snapshotChanges();
    // console.log(this.db.list('/categories'));
    return this.db.list('/categories');
    // .subscribe(categories => { this.categories$ = categories;
    // });
  }  
}

