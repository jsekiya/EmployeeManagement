import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import SELECTED_EMPLOYEE_CHANNEL from '@salesforce/messageChannel/SelectedEmployee__c';

import getSelectedEmployeeDetail from '@salesforce/apex/EmployeeController.getSelectedEmployeeDetail';
import getExaminationDetail from '@salesforce/apex/EmployeeController.getExaminationDetail';
import getWorkHistoryDetail from '@salesforce/apex/EmployeeController.getWorkHistoryDetail';

import { NavigationMixin } from 'lightning/navigation';

const COLS = [
    { label: '資格名', fieldName: 'CertificationName__c', sortable: "true" },
    { label: '受験日', fieldName: 'ExamDate__c', fixedWidth: 90, sortable: "true" },
    { label: '結果', fieldName: 'Result__c', fixedWidth: 70,sortable: "true" }
];

export default class EmployeeTile extends NavigationMixin(LightningElement) {
    columns = COLS;

    activeSections = ['description'];
    
    selectedEmployeeId;
    employeeData;

    certificationData;
    workHistoryData;
    
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
    
    async handleSelectedEmployee(employeeId) {
        this.selectedEmployeeId = employeeId;
        await this.fetchEmployeeDetails();
        await this.fetchCertificationDetails();
        await this.fetchWorkHistoryDetails();
    }
    async fetchEmployeeDetails() {
        try {
            const result = await getSelectedEmployeeDetail({ employeeId: this.selectedEmployeeId });
            this.employeeData = result;
            console.log('Selected employee detail:' + JSON.stringify(result));
        } catch (error) {
            console.error(error);
        }
    }
    async fetchCertificationDetails() {
        try {
            const result = await getExaminationDetail({ employeeId: this.selectedEmployeeId });
            if (result.length > 0) {
                this.certificationData = result.map(item => ({
                    Id: item.Id,
                    CertificationName__c: item.CertificationName__r.Name,
                    ExamDate__c: item.ExamDate__c,
                    Result__c: item.Result__c
                }));
            } else {
                this.certificationData = null;
            }
            console.log('Selected employee certificate detail:' + JSON.stringify(result));
        } catch (error) {
            console.error('nie ma zadnych certyfikatow');
        }
    }
    async fetchWorkHistoryDetails() {
        try {
            const result = await getWorkHistoryDetail({ employeeId: this.selectedEmployeeId });
            if (result.length > 0) {
                this.workHistoryData = result.map(item => ({
                    Id: item.Id,
                    EmployeeName__c: item.EmployeeName__r.Name,
                    CompanyName__c: item.CompanyName__c,
                    Position__c: item.Position__c,
                    JobDescription__c: item.JobDescription__c,
                    EndDate__c: item.EndDate__c,
                    Department__c: item.Department__c,
                    StartDate__c: item.StartDate__c
                }));
            } else {
                this.workHistoryData = null;
            }
            console.log('Selected employee work History Data:' + JSON.stringify(result));
        } catch (error) {
            console.error('nie ma zadnych historii');
        }
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
  