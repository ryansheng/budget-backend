import { Component, inject ,input,computed,effect} from "@angular/core";
import { TabState } from "./tab-state";
import { Tab } from "./tabs";
import { contentChildren } from '@angular/core';
@Component({
  selector: 'budget-tab-group',
  providers:[TabState],
  template: `
 <div class="border-b border-gray-200 flex gap-4">
      
      @for (tab of tabs(); track tab.label()) {
        <button
          (click)="activate(tab.label())"
          class="px-28 py-10 border-b-2 transition-colors font-medium"
          [class.border-blue-600]="state.activeTab() === tab.label()"
          [class.text-green-600]="state.activeTab() === tab.label()"
          [class.border-transparent]="state.activeTab() !== tab.label()"
        >
          {{ tab.label() }}
        </button>
      }
    </div>

    
    <ng-content />
 
 `
})

export class TabGroup{
  readonly state = inject(TabState)
  readonly tabs = contentChildren(Tab);

  constructor() {
    effect(() => {
      const allTabs = this.tabs()
      if (allTabs.length > 0 && !this.state.activeTab()) {
        this.state.activate(allTabs[0].label())
      }
    })
  }
  activate(label: string) {
    this.state.activate(label)
  }
}