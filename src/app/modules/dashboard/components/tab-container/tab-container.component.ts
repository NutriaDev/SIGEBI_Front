import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { TabService, Tab } from '../../services/tab.service';

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
})
export class TabContainerComponent implements OnInit {
  tabs: Tab[] = [];
  activeTabIndex = 0;

  environmentInjector = inject(EnvironmentInjector);

  constructor(private tabService: TabService) {}

  ngOnInit(): void {
    this.tabService.tabs$.subscribe((tabs) => {
      console.log('TABS:', tabs);
      this.tabs = tabs;
      this.activeTabIndex = tabs.length - 1; // 👈 ESTA ES LA CLAVE
    });
  }

  setActive(index: number) {
    this.activeTabIndex = index;
  }

  closeTab(index: number) {
    this.tabService.closeTab(index);
  }
}
