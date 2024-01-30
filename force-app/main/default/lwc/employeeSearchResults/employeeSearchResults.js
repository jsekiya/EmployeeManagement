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
    { fieldName: 'Department__c' },
    { fieldName: 'Position__c' },
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
    totalPages;
    totalRecords;

    selectedRows = new Set();

    fetchEmployees() {
        getEmployeesList({ department: this.employeeDepartment, name: this.employeeName, position: this.employeePosition })
            .then((result) => {
                if (result && result.length > 0) {
                    this.totalRecords = result.length;
                    this.totalPages = Math.ceil(result.length / this.pageSize);
                    const startIndex = (this.currentPage - 1) * this.pageSize;
                    const endIndex = startIndex + this.pageSize;
                    this.employeesData = result.slice(startIndex, endIndex);

                    // Update selected rows based on saved selected rows
                    const selectedRowsIds = Array.from(this.selectedRows).map(row => row.Id);
                    this.selectedRows = new Set(this.employeesData.filter(row => selectedRowsIds.includes(row.Id)));

                    console.log('wyniki wysukiwanie:' + JSON.stringify(this.employeesData));
                    console.log('liczba records:' + JSON.stringify(this.totalRecords));
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

    handleClickEmployeeCard(event) {
        const rowData = event.detail.row;
        this.selectedEmployeeId = rowData.Id;
        console.log('Selected employee ID:' + JSON.stringify(this.selectedEmployeeId));

        publish(this.messageContext, SELECTED_EMPLOYEE_CHANNEL, { employeeId: this.selectedEmployeeId });

        // Custom event firing to parent
        this.dispatchEvent(new CustomEvent('select', {
            detail: {
                employeeId: this.selectedEmployeeId
            }
        }));
    }

    @api searchEmployee(employeeDepartment, employeeName, employeePosition) {
        console.log('value in child lwc:' + JSON.stringify(employeeDepartment + employeeName + employeePosition));
        this.employeeDepartment = employeeDepartment;
        this.employeeName = employeeName;
        this.employeePosition = employeePosition;
        this.currentPage = 1;
        this.fetchEmployees();
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchEmployees();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchEmployees();
        }
    }

    handleRowSelection(event) {
        const updatedEmployeesSet = new Set(event.detail.selectedRows.map(row => row.Id));
        const loadedEmployeesSet = new Set(this.employeesData.map(row => row.Id));

        loadedEmployeesSet.forEach((employeeId) => {
            if (updatedEmployeesSet.has(employeeId)) {
                this.selectedRows.add(this.employeesData.find(row => row.Id === employeeId));
            } else {
                this.selectedRows.delete(this.employeesData.find(row => row.Id === employeeId));
            }
        });

        console.log('selectedRows: ' + JSON.stringify(Array.from(this.selectedRows)));
    }

    async openModal() {
        const selectedRecords = Array.from(this.selectedRows);
        console.log('Selected records:' + JSON.stringify(selectedRecords));

        const result = await employeeModal.open({
            selectedRecords: selectedRecords // Pass the selectedRecords to the employeeModal component
        });

        // if modal closed with X button, promise returns result = 'undefined'
        // if modal closed with OK button, promise returns result = 'okay'
        console.log(result);
    }
}