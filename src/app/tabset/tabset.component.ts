import { Component, OnInit } from '@angular/core';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})
export class TabsetComponent implements OnInit {
  reset_seed: string = '';
  constructor() { }

  ngOnInit(): void {
    this.reset_seed = 'tabset-init';
  }

  tabChanged(event: MatTabChangeEvent) {
      console.log('TAB changed');
      console.log(event.tab.textLabel);
      console.log({ event });

      this.reset_seed = 'tabchanged_' + Date.now.toString();
      if(event.tab.textLabel == ''){
        // event.tab.tabSelected();
      }

  }
}
