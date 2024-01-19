import { LightningElement } from 'lwc';

export default class EmployeeSearchForm extends LightningElement {
    error = undefined;
    
    handleKeyChange(event) {
        this.selectedEmployeeId  = event.detail.value;
        const searchEvent = new CustomEvent('search', { 
            detail: { 
                employeeId: this.selectedEmployeeId 
            } 
        });
        this.dispatchEvent(searchEvent);
    }
}
  