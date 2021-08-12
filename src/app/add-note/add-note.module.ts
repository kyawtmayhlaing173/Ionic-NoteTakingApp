import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { IonicModule } from '@ionic/angular';

import { AddNotePageRoutingModule } from './add-note-routing.module';

import { AddNotePage } from './add-note.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CKEditorModule,
    AddNotePageRoutingModule
  ],
  declarations: [AddNotePage]
})
export class AddNotePageModule { }
