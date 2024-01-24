import { LightningElement, wire, api } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_EMPLOYEE_CHANNEL from '@salesforce/messageChannel/SelectedEmployee__c';
import getEmployeesList from '@salesforce/apex/EmployeeController.findEmployee';

const COLS = [
    {
        type: 'customPictureType',
        typeAttributes: {
            pictureUrl: { fieldName: 'Picture__c' }
        },
        cellAttributes: { alignment: 'center' },
        fixedWidth: 70,
    },
    { fieldName: 'Name', fixedWidth: 95 },
    { fieldName: 'Department__c'},
    { fieldName: 'Position__c'},
    { 
        type: 'button',
        typeAttributes: {
            label: '詳細',
            name: 'View',
            title: 'View',
            disabled: false,
            value: 'view'
        },
        cellAttributes: { 
            alignment: 'center'
        },
        fixedWidth: 77,
    },
];

export default class EmployeeSearchResults extends LightningElement {
    columns = COLS;
    
    employeeName = '';
    employeeDepartment = '';
    employeePosition = '';
    employeesData;
    selectedEmployeeId;
    
    @wire(getEmployeesList, { department : '$employeeDepartment', name : '$employeeName', position : '$employeePosition'})
    async wiredEmployees({ error, data }) {
        try {
            if (error) {
                console.error(error);
            } else if (data) {
                if (data.length > 0) {
                    this.employeesData = data;
                    console.log('this.employeesData:' + JSON.stringify(this.employeesData));
                } else {
                    this.employeesData = null;
                    console.log('nie ma danych');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    @wire(MessageContext)
    messageContext;
    
    //jak wybierzemy pracownika to zaznaczy sie on ramka
    handleClickEmployeeCard(event){
        const rowData = event.detail.row;
        this.selectedEmployeeId = rowData.Id;
        console.log('Selected employee ID:'+JSON.stringify(this.selectedEmployeeId));

        //message channel wysyla employeeid do LMS channel
        publish( this.messageContext, SELECTED_EMPLOYEE_CHANNEL , { employeeId : this.selectedEmployeeId });
        
        //custom event firing to parent
        this.dispatchEvent(new CustomEvent('select',{
            detail:{
                employeeId : this.selectedEmployeeId
            }
        }))
    }
    
    @api searchEmployee(employeeDepartment, employeeName, employeePosition){
        console.log('value in child lwc:' + JSON.stringify(employeeDepartment + employeeName + employeePosition));
        this.employeeDepartment = employeeDepartment;
        this.employeeName = employeeName;
        this.employeePosition = employeePosition;
    }
}