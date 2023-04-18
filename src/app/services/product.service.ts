import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productUrlCloud="http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/product";
  private cartUrlCloud="http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/cart";
  private orderUrlCloud="http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/order";


  //private product="http://localhost:3000/api/product";

  cartData = new EventEmitter<product[] | []>();
  constructor(private http: HttpClient) { }
  addProduct(data: product) {
    return this.http.post(this.productUrlCloud, data);
  }
  productList() {
    return this.http.get<product[]>(this.productUrlCloud);
  }

  deleteProduct(id: number) {
    return this.http.delete(` ${this.productUrlCloud}/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`${this.productUrlCloud}/${id}`);
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      ` ${this.productUrlCloud}/${product.id}`,
      product
    );
  }
  popularProducts() {
    return this.http.get<product[]>('http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/product?_limit=3');
  }

  trendyProducts() {
    return this.http.get<product[]>('http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/product?_limit=8');
  }

  searchProduct(query: string) {
    return this.http.get<product[]>(
      `http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/product?q=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post(this.cartUrlCloud, cartData);
  }
  getCartList(userId: number) {
    return this.http
      .get<product[]>('?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }
  removeToCart(cartId: number) {
    return this.http.delete('http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/cart/' + cartId);
  }
  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/cart?userId=' + userData.id);
  }

  orderNow(data: order) {
    return this.http.post(this.orderUrlCloud, data);
  }
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/order?userId=' + userData.id);
  }

  deleteCartItems(cartId: number) {
    return this.http.delete('http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/cart/' + cartId).subscribe((result) => {
      this.cartData.emit([]);
    })
  }

  cancelOrder(orderId:number){
    return this.http.delete('http://flipkartnodejsapi.ap-south-1.elasticbeanstalk.com/api/order/'+orderId)

  }

}
