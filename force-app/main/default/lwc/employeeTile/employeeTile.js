import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import SELECTED_EMPLOYEE_CHANNEL from '@salesforce/messageChannel/SelectedEmployee__c';
import getSelectedEmployeeDetail from '@salesforce/apex/EmployeeController.getSelectedEmployeeDetail';
import { NavigationMixin } from 'lightning/navigation';

export default class EmployeeTile extends NavigationMixin(LightningElement) {

   selectedEmployeeId;
   employeeData;

   @wire(MessageContext)
   messageContext;

   //odbiera employeeId z LMS channel
   connectedCallback(){
    subscribe(
        this.messageContext,
        SELECTED_EMPLOYEE_CHANNEL,
        (message) => {
            console.log('message from LMS: '+JSON.stringify(message));
            this.handleSelectedEmployee(message.employeeId);
        }
    )
   }

   handleSelectedEmployee(employeeId){
    this.selectedEmployeeId = employeeId;

    getSelectedEmployeeDetail({employeeId: this.selectedEmployeeId})
    .then(result => {
        this.employeeData = result;
        console.log('Selected employee detail:' +JSON.stringify(result));

    })
    .catch(error =>{
        console.error(error);
    })
   }

   handleNavigateToRecord(){
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes:{
            recordId: this.selectedEmployeeId,
            objectApiName: 'Employee__c',
            actionName: 'view'
        }
    })
   }
}
  