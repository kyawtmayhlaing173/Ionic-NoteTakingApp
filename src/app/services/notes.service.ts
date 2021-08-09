import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  id: any;
  title: any;
  description: any;
  createdAt: any;

  constructor() { }

  set_id(id) {
    this.id = id;
  }

  get_id() {
    return this.id;
  }

  set_title(title) {
    this.title = title;
  }

  get_title() {
    return this.title;
  }

  set_description(description) {
    this.description = description;
  }

  get_description() {
    return this.description;
  }

  set_createdAt(dateTime) {
    this.createdAt = dateTime;
  }

  get_createdAt() {
    return this.createdAt;
  }
}
