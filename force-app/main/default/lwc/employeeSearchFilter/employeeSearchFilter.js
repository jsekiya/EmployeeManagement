import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import Employee_Object from '@salesforce/schema/Employee__c';
import Department_Field from '@salesforce/schema/Employee__c.Department__c';
import Position_Field from '@salesforce/schema/Employee__c.Position__c';

export default class EmployeeSearchFilter extends LightningElement {
    recordTypeId;
    picklistValue;
    departmentsOptionsArray;
    positionsOptionsArray;
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

    @wire(getPicklistValues, {recordTypeId: '$recordTypeId', fieldApiName: Department_Field})
    departmentFieldValues({ data,error }){
        if(error){
            console.log('error:' + JSON.stringify(error));
        }else if(data){
            let arr = [];
            this.picklistValue = data.values;
            console.log('recordTypeId:' + JSON.stringify(this.picklistValue));

            // wyszukiwanie poprzez wszystkie opcje department
            arr.push({ label: 'All', value: '' });

            this.picklistValue.forEach( element => {
                arr.push({ label : element.value, value : element.value })
            })
            this.departmentsOptionsArray = arr;
            console.log('departmentOptionsArray:' + JSON.stringify(this.departmentsOptionsArray));
        }
    }
    @wire(getPicklistValues, {recordTypeId: '$recordTypeId', fieldApiName: Position_Field})
    positionFieldValues({ data,error }){
        if(error){
            console.log('error:' + JSON.stringify(error));
        }else if(data){
            let arr = [];
            this.picklistValue = data.values;
            console.log('recordTypeId:' + JSON.stringify(this.picklistValue));

            // wyszukiwanie poprzez wszystkie opcje department
            arr.push({ label: 'All', value: '' });

            this.picklistValue.forEach( element => {
                arr.push({ label : element.value, value : element.value })
            })
            this.positionsOptionsArray = arr;
            console.log('positionOptionsArray:' + JSON.stringify(this.positionsOptionsArray));
        }
    }

    handleDepartmentOptionsChange(event) {
        this.selectedEmployeeDepartment = event.detail.value;
        console.log('this.selectedEmployeeDepartment:' + JSON.stringify(this.selectedEmployeeDepartment));
        this.searchEmployees();
    }

    handlePositionOptionsChange(event) {
        this.selectedEmployeePosition = event.detail.value;
        console.log('this.selectedEmployeePosition:' + JSON.stringify(this.selectedEmployeePosition));
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