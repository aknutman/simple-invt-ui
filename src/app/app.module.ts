import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { ItemsComponent, DetailItemsDialog } from './items/items.component';

@NgModule({
  declarations: [AppComponent, ItemsComponent, DetailItemsDialog],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    ReactiveFormsModule,

    HttpClientModule,

    FlexLayoutModule,

    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
