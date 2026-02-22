import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { TabService, Tab } from '../../services/tab.service';

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
})
export class TabContainerComponent implements OnInit {
  tabs: Tab[] = [];
  activeTabIndex = 0;

  constructor(private tabService: TabService) {}

  private environment = inject(EnvironmentInjector);

  ngOnInit(): void {
    this.tabService.tabs$.subscribe((tabs) => {
      this.tabs = tabs;
    });
  }

  setActive(index: number) {
    this.activeTabIndex = index;
  }

  closeTab(index: number) {
    this.tabService.closeTab(index);
  }
}
