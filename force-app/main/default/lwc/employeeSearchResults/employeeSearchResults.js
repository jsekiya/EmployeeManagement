import { LightningElement, wire, api } from 'lwc';
import getEmployeesList from '@salesforce/apex/EmployeeController.findEmployee';
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_EMPLOYEE_CHANNEL from '@salesforce/messageChannel/SelectedEmployee__c';

export default class EmployeeSearchResults extends LightningElement {
  
  employeeDepartment = '';
  employeesData;
  selectedEmployeeId;

  @wire(getEmployeesList, { department : '$employeeDepartment'})
  wiredEmployees({error,data}){
    if(error){
      console.error(error);
    }else if(data){
      this.employeesData = data;
      console.log('this.employeesData:' +JSON.stringify(this.employeesData));
    }
  }

  @wire(MessageContext)
  messageContext;

  //jak wybierzemy pracownika to zaznaczy sie on ramka
  handleClickEmployeeCard(event){
    this.selectedEmployeeId = event.currentTarget.dataset.id;
    console.log('this.selectedEmployeeId:' +JSON.stringify(this.selectedEmployeeId));

    //message channel wysyla employeeid do LMS channel
    publish( this.messageContext, SELECTED_EMPLOYEE_CHANNEL , { employeeId : this.selectedEmployeeId });

    let boxClass = this.template.querySelectorAll('.selected');
    if(boxClass.length > 0){
      this.removeClass();
    }
    //current selected employee card details
    let employeeBox = this.template.querySelector('[data-id="' + this.selectedEmployeeId + '"]');

    if(employeeBox){
      employeeBox.className = 'title-wrapper selected';
    }
    //custom event firing to parent
    this.dispatchEvent(new CustomEvent('select',{
      detail:{
        employeeId : this.selectedEmployeeId
      }
    }))
  }
  //jak wybierzemy innego to usunie sie zaznaczenie
  removeClass(){
    this.template.querySelectorAll('.selected')[0].classList.remove('selected');
  }

  @api searchEmployee(employeeDepartment){
    console.log('value in child lwc:' + JSON.stringify(employeeDepartment));
    this.employeeDepartment = employeeDepartment;
  }
}