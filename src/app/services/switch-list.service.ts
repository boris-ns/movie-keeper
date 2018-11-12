import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchListService {

  showToWatchList = true;

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  
  constructor() { }
  
  switchList() {
    this.showToWatchList = !this.showToWatchList;
    this.change.emit(this.showToWatchList);
  }
}
