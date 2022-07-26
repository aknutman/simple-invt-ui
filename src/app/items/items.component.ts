import { Component, OnInit, OnChanges, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

import { ApiService, ItemApiElement } from '../services/api.service';

export interface ItemElement {
  itemName: string;
  purchasePrice: number;
  sellPrice: number;
  stockCount: number;
  fileImage: string;
}

export interface ItemDialogData {
  isNew: boolean;
  item: ItemElement;
}

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  downloadedData: ItemElement[] = [];

  displayedColumns: string[] = [
    'itemName',
    'purchasePrice',
    'sellPrice',
    'stockCount',
    'fileImage',
  ];
  datasource = new MatTableDataSource(this.downloadedData);

  constructor(public dialog: MatDialog, public api: ApiService) {}

  ngOnInit(): void {
    this.getItems();
  }

  ngOnChanges() {
    // this.getItems();
    // console.log(this.downloadedData);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(isNew: boolean, event?: Event) {
    const dialogRef = this.dialog.open(DetailItemsDialog, {
      data: {
        isNew: isNew,
        item: event,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined' && result === true) {
        if (isNew) {
          console.log('Save new', result);
        } else {
          console.log('Update existing', result);
        }
      }
    });
  }

  getItems() {
    this.api
      .getItems()
      .subscribe((result: ItemApiElement[]) => {
        result.forEach((item) => {
          this.downloadedData.push({
            itemName: item.filename.replace('.json', ''),
            purchasePrice: item.data.purchase_price,
            sellPrice: item.data.sell_price,
            stockCount: item.data.stock_count,
            fileImage: item.data.image.filename,
          });
        });
      })
      .add(() => {
        // console.log(this.downloadedData);
        this.datasource = new MatTableDataSource(this.downloadedData);
      });
  }
}

const ELEMENT_DATA: ItemElement[] = [
  {
    itemName: 'First Item',
    purchasePrice: 100.2,
    sellPrice: 1000.1,
    stockCount: 100,
    fileImage: 'here',
  },
];

@Component({
  selector: 'detail-items-dialog',
  templateUrl: 'detail-items.component.html',
  styleUrls: ['./items.component.css'],
})
export class DetailItemsDialog {
  itemForm = new FormGroup({
    itemName: new FormControl(''),
    purchasePrice: new FormControl(0),
    sellPrice: new FormControl(0),
    stockCount: new FormControl(0),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ItemDialogData) {}

  ngOnInit() {
    if (typeof this.data.item !== 'undefined') {
      this.itemForm.patchValue({
        itemName: this.data.item.itemName,
        purchasePrice: this.data.item.purchasePrice,
        sellPrice: this.data.item.sellPrice,
        stockCount: this.data.item.stockCount,
      });
    }

    if (!this.data.isNew) {
      this.itemForm.controls['itemName'].disable();
    }
  }
}
