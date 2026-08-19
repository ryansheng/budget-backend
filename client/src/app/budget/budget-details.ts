import { Component } from "@angular/core";
import {MatCardModule} from '@angular/material/card';
import { Tab } from "./tabs/tabs";
import { TabGroup } from "./tabs/tab-group";
@Component({
  selector: 'budget-details',
  imports: [MatCardModule,Tab,TabGroup],
  template: `
  <div class="details">
<budget-tab-group>


  <budget-tab label="Overivew">
    <p>Overivew</p>
  </budget-tab>
  <budget-tab label="Monthly">
    <p>Monthly Expenses</p>
  </budget-tab>
  <budget-tab label="Yearly">
    <p>Yearly</p>
  </budget-tab>
  <budget-tab label="Finanicial Health">
    </budget-tab>
    
  
  </budget-tab-group>
    
  </div>
  `,
  
  
  styles: [`
    .details {
      min-height:1000px; 
      max-height: 1400px;
       width: auto;
     // background-color:#F5F2E8;
      // border: 2px solid black;
      width: 100%;
      color: black;
    }
    
    `],
  
  
})

export class BudgetDetails{

}