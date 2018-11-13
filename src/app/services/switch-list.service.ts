import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchListService {

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  
  constructor() { }
  
  switchList(showToWatchList: boolean): void {
    this.change.emit(showToWatchList);
  }
}
