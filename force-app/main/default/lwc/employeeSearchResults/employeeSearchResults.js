import { LightningElement, wire, api, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';

import SELECTED_EMPLOYEE_CHANNEL from '@salesforce/messageChannel/SelectedEmployee__c';

import getEmployeesList from '@salesforce/apex/EmployeeController.findEmployee';
import employeeModal from 'c/employeeModal';

const columns = [
    {
        type: 'customPictureType',
        typeAttributes: {
            pictureUrl: { fieldName: 'Picture__c' },
        },
        cellAttributes: { alignment: 'center' },
        fixedWidth: 70,
    },
    { fieldName: 'Name', wrapText: true },
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
    @track columns = columns;
    
    employeeName = '';
    employeeDepartment = '';
    employeePosition = '';
    employeesData;
    selectedEmployeeId;

    currentPage = 1;
    pageSize = 10;
    totalPages = 0;
    totalRecords  = 0;

    selectedRows = [];
    items = [];

    startIndex = 1;
    endIndex = 0;

    fetchEmployees() {
        getEmployeesList({ department: this.employeeDepartment, name: this.employeeName, position: this.employeePosition })
            .then((result) => {
                if (result && result.length > 0) {
                    this.items = result;
                    this.totalRecords = result.length;
                    this.totalPages = Math.ceil(result.length / this.pageSize);
                    const startIndex = (this.currentPage - 1) * this.pageSize;
                    const endIndex = startIndex + this.pageSize;
                    this.employeesData = result.slice(startIndex, endIndex);
                    
                } else {
                    this.employeesData = null;
                }
            })
            .catch((error) => {
                console.error('An error occurred: ' + error);
            });
    }

    @wire(MessageContext)
    messageContext;
    
    handleClickEmployeeCard(event){
        const rowData = event.detail.row;
        this.selectedEmployeeId = rowData.Id;
        console.log('Selected employee ID:'+JSON.stringify(this.selectedEmployeeId));

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
        this.currentPage = 1;
        this.fetchEmployees();
        
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayRecordPerPage(this.currentPage);   
        }
    }
    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.displayRecordPerPage(this.currentPage);
        }
    }

    displayRecordPerPage(currentPage) {
        this.startIndex = ((currentPage - 1) * this.pageSize);
        this.endIndex = (this.pageSize * currentPage);
        this.employeesData = this.items.slice(this.startIndex, this.endIndex);
        this.startIndex = this.startIndex + 1;
        this.template.querySelector('[data-id="datatable"]').selectedRows = this.selectedRows;
    }

    handleRowSelection(event) {
        const selectedItemsSet = new Set(this.selectedRows);
        const loadedItemsSet = new Set(this.employeesData.map(employee => employee.Id));
        const updatedItemsSet = new Set(event.detail.selectedRows.map(row => row.Id));
      
        updatedItemsSet.forEach(id => {
            if (!selectedItemsSet.has(id)) {
                selectedItemsSet.add(id);
            }
        });
      
        loadedItemsSet.forEach(id => {
            if (selectedItemsSet.has(id) && !updatedItemsSet.has(id)) {
                selectedItemsSet.delete(id);
            }
        });
        
        this.selectedRows = [...selectedItemsSet];
        console.log('selectedRows: ' + JSON.stringify(this.selectedRows));
    }

    async openModal() {
        const selectedEmployees = this.selectedRows.map(id => {
            return this.items && this.items.find(employee => employee.Id === id);
        });
      
        console.log('Selected employees:' + JSON.stringify(selectedEmployees));
      
        const result = await employeeModal.open({ selectedEmployees });
      
        // If modal closed with X button, promise returns result = 'undefined'
        // If modal closed with OK button, promise returns result = 'okay'
        console.log(result);
      }
}