import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import Employee_Object from '@salesforce/schema/Employee__c';
import Department_Field from '@salesforce/schema/Employee__c.Department__c';
import Position_Field from '@salesforce/schema/Employee__c.Position__c';

export default class EmployeeSearchFilter extends LightningElement {
    recordTypeId;
    picklistValue;
    departmentsOptionsArray;
    @track selectedEmployeeName = '';
    @track selectedEmployeeDepartment = '';
    @track selectedEmployeePosition = '';
    selectedEmployeeId;
    

    @wire(getObjectInfo, {objectApiName: Employee_Object})
    objectsInfo({ data, error }){
        if(error){
            console.log('error:' + JSON.stringify(error))
        }else if(data){
            this.recordTypeId = data.defaultRecordTypeId;
            console.log('this.recordTypeId:' + JSON.stringify(this.recordTypeId));
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: [Department_Field, Position_Field] })
    fieldValues({ data, error }) {
        if (error) {
            console.log('error:' + JSON.stringify(error));
        } else if (data) {
            let arr = [];
            this.picklistValue = data.values;
            console.log('recordTypeId:' + JSON.stringify(this.picklistValue));

            // Add the "All" option to the picklist values
            arr.push({ label: 'All', value: '' });

            this.picklistValue.forEach(element => {
                arr.push({ label: element.value, value: element.value });
            });

            this.departmentsOptionsArray = arr;
            this.positionsOptionsArray = arr;

            console.log('departmentOptionsArray:' + JSON.stringify(this.departmentsOptionsArray));
            console.log('positionOptionsArray:' + JSON.stringify(this.positionsOptionsArray));
        }
    }

    handleOptionsChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.detail.value;

        if (fieldName === 'department') {
            this.selectedEmployeeDepartment = fieldValue;
        } else if (fieldName === 'position') {
            this.selectedEmployeePosition = fieldValue;
        }

        console.log(`this.selectedEmployee${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${JSON.stringify(fieldValue)}`);
        this.searchEmployees();
    }
      
    handleKeyChange(event) {
        this.selectedEmployeeName = event.target.value;
        console.log('this.selectedEmployeeName:' + JSON.stringify(this.selectedEmployeeName));
        this.searchEmployees();
    }
      
    searchEmployees() {
        let employeeName = this.selectedEmployeeName;
        let employeeDepartment = this.selectedEmployeeDepartment;
        let employeePositon = this.selectedEmployeePosition;

        this.template.querySelector('c-employee-search-results').searchEmployee(employeeDepartment,employeeName,employeePositon);
    }
    
//odbiera custom event od innego komponentu
    handleCustomEvent(event){
        this.selectedEmployeeId = event.detail.employeeId;
        console.log('this.selectedEmployeeId in parent lwc: '+ JSON.stringify(this.selectedEmployeeId));
    }
}