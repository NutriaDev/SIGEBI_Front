import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Tab {
  title: string;
  component: Type<any>;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private tabs: Tab[] = [];
  private tabsSubject = new BehaviorSubject<Tab[]>([]);

  tabs$ = this.tabsSubject.asObservable();

  openTab(title: string, component: Type<any>, data?: any) {
    const existingIndex = this.tabs.findIndex((t) => t.title === title);

    if (existingIndex !== -1) {
      return; // evita duplicados
    }

    this.tabs.push({ title, component, data });
    this.tabsSubject.next(this.tabs);
  }

  closeTab(index: number) {
    this.tabs.splice(index, 1);
    this.tabsSubject.next(this.tabs);
  }
}
