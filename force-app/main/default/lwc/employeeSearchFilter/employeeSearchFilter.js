import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import Employee_Object from '@salesforce/schema/Employee__c';
import Department_Field from '@salesforce/schema/Employee__c.Department__c';

export default class EmployeeSearchFilter extends LightningElement {
    recordTypeId;
    picklistValue;
    optionsArray;
    selectedEmployeeDepartment;
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

            this.picklistValue.forEach( element => {
                arr.push({ label : element.value, value : element.value })
            })
            this.optionsArray = arr;
            console.log('options array:' + JSON.stringify(this.optionsArray));
        }
    }

    handleOptionsChange(event){
        this.selectedEmployeeDepartment = event.detail.value;
        console.log('this.selectedEmployeeDepartment:' + JSON.stringify(this.selectedEmployeeDepartment));
        
        this.template.querySelector('c-employee-search-results').searchEmployee(this.selectedEmployeeDepartment);
    }
    
//odbiera custom event od innego komponentu
    handleCustomEvent(event){
        this.selectedEmployeeId = event.detail.employeeId;
        console.log('this.selectedEmployeeId in parent lwc: '+ JSON.stringify(this.selectedEmployeeId));
    }
}