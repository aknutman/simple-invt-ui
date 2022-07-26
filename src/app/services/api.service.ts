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
}

export interface ItemApiElement {
  filename: string;
  data: {
    purchase_price: number;
    sell_price: number;
    stock_count: number;
    image: {
      filename: string;
      mimetype: string;
      original_filename: string;
    };
  };
}
