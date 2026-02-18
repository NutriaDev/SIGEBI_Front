import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Tab {
  title: string;
  component: Type<any>;
}

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private tabsSubject = new BehaviorSubject<Tab[]>([]);
  tabs$ = this.tabsSubject.asObservable();

  private tabs: Tab[] = [];

  openTab(title: string, component: Type<any>) {
    const exists = this.tabs.find((t) => t.title === title);

    if (!exists) {
      this.tabs.push({ title, component });
      this.tabsSubject.next(this.tabs);
    }
  }

  closeTab(index: number) {
    this.tabs.splice(index, 1);
    this.tabsSubject.next(this.tabs);
  }
}
