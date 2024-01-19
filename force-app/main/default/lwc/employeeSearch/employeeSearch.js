import { LightningElement } from 'lwc';

export default class EmployeeSearch extends LightningElement {
    isLoading = false;
    
    handleLoading() { 
      this.isLoading = true;
    }
    
    handleDoneLoading() {
      this.isLoading = false;
    }
    
    searchEmployee(event) {
        let searchKey  = event.detail.searchKey;
        this.template.querySelector("c-employee-search-results").searchEmployee(searchKey);
        this.handleDoneLoading();
    }
}