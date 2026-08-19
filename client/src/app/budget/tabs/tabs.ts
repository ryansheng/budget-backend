import { Component, inject,input, signal ,computed} from "@angular/core";
import { TabState } from "./tab-state";

@Component({
  selector: 'budget-tab',
  template: `
  @if (isActive()) {

  <div class="py-20 px-20 animate-in fade-in duration-300">
        <ng-content />
      </div>
  }
  `
})

export class Tab{
  readonly state = inject(TabState)
  readonly label = input.required<string>();
  readonly isActive = computed( () => this.state.activeTab() === this.label())
}