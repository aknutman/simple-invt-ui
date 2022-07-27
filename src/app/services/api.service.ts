import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { api_url } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getItems() {
    return this.http.get<ItemApiElement[]>(api_url + '/api/items');
  }

  createNew(fileName: string, data: BasicItemElement) {
    return this.http.post<any>(api_url + '/api/item/' + fileName, data);
  }

  updateItem(fileName: string, data: BasicItemElement) {
    return this.http.put<any>(api_url + '/api/item/' + fileName, data);
  }

  deleteItem(itemName: string) {
    return this.http.delete<any>(api_url + '/api/item/' + itemName);
  }
}

export interface BasicItemElement {
  purchase_price: number;
  sell_price: number;
  stock_count: number;
  image: {
    filename: string;
    mimetype: string;
    original_filename: string;
  };
}

export interface ItemApiElement {
  filename: string;
  data: BasicItemElement;
}
