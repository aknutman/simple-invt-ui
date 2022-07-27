import { Component, OnInit, OnChanges, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
  command: string;
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

  ngOnChanges() {}

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

    dialogRef.afterClosed().subscribe((result: ItemDialogData) => {
      if (typeof result !== 'undefined') {
        if (result.command === 'DELETE') {
          this.api
            .deleteItem(result.item.itemName)
            .subscribe(
              (del) => {
                console.log(del);
              },
              (error) => {
                console.log(error);
              }
            )
            .add(() => {
              this.getItems();
            });
        } else if (result.command === 'UPDATE') {
          this.updateItem(result);
        } else if (result.command === 'NEW') {
          this.createNew(result);
        }
      }
    });
  }

  getItems() {
    this.api
      .getItems()
      .subscribe((result: ItemApiElement[]) => {
        this.downloadedData = [];

        this.datasource = new MatTableDataSource(this.downloadedData);

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

  createNew(data: ItemDialogData) {
    const savedData = {
      purchase_price: data.item.purchasePrice,
      sell_price: data.item.sellPrice,
      stock_count: data.item.stockCount,
      image: {
        filename: '1d95f6e759234ec5b97227600',
        mimetype: 'image/png',
        original_filename: 'Screenshot from 2022-04-24 04-35-04.png',
      },
    };

    this.api
      .createNew(data.item.itemName, savedData)
      .subscribe(
        (result) => {
          console.log(result);
        },
        (err) => {
          console.log(err);
        }
      )
      .add(() => {
        this.getItems();
      });
  }

  updateItem(data: ItemDialogData) {
    const savedData = {
      purchase_price: data.item.purchasePrice,
      sell_price: data.item.sellPrice,
      stock_count: data.item.stockCount,
      image: {
        filename: '1d95f6e759234ec5b97227600',
        mimetype: 'image/png',
        original_filename: 'Screenshot from 2022-04-24 04-35-04.png',
      },
    };

    this.api
      .updateItem(data.item.itemName, savedData)
      .subscribe(
        (result) => {
          console.log(result);
        },
        (err) => {
          console.log(err);
        }
      )
      .add(() => {
        this.getItems();
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
    fileImage: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<DetailItemsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDialogData
  ) {}

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

  deleteItem() {
    this.data.command = 'DELETE';
    this.dialogRef.close(this.data);
  }

  saveItem() {
    if (this.data.isNew) {
      this.createNew();
    } else {
      this.updateItem();
    }
  }

  createNew() {
    this.data.command = 'NEW';
    this.data.item = {
      itemName: this.itemForm.controls['itemName'].value!,
      fileImage: this.itemForm.controls['fileImage'].value!,
      purchasePrice: this.itemForm.controls['purchasePrice'].value!,
      sellPrice: this.itemForm.controls['sellPrice'].value!,
      stockCount: this.itemForm.controls['stockCount'].value!,
    };
    this.dialogRef.close(this.data);
  }

  updateItem() {
    this.data.command = 'UPDATE';
    this.data.item = {
      itemName: this.itemForm.controls['itemName'].value!,
      fileImage: this.itemForm.controls['fileImage'].value!,
      purchasePrice: this.itemForm.controls['purchasePrice'].value!,
      sellPrice: this.itemForm.controls['sellPrice'].value!,
      stockCount: this.itemForm.controls['stockCount'].value!,
    };
    this.dialogRef.close(this.data);
  }
}
