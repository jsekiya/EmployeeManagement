import { LightningElement, wire, api } from 'lwc';
import findEmployee from '@salesforce/apex/EmployeeController.findEmployee';

const COLS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Department', fieldName: 'Department__c' },
    { label: 'Position', fieldName: 'Position__c' },
    { label: 'Phone', fieldName: 'Phone__c', type: 'phone' },
    { label: 'Email', fieldName: 'Email__c', type: 'email' },
    {
        label: 'Employee Picture',
        type: 'customPictureType',
        typeAttributes: {
            pictureUrl: { fieldName: 'Picture__c' }
        },
        cellAttributes: { alignment: 'center' }
    }
];
export default class EmployeeTileList extends LightningElement {
    columns = COLS;
    @api employees;
    @api searchKey;
    error;

    handleKeyChange(event) {
        // Debouncing this method: Do not actually invoke the Apex call as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(async () => {
            try {
                this.employees = await findEmployee({ searchKey });
                this.error = undefined;
            } catch (error) {
                this.error = error;
                this.employees = undefined;
            }
        }, DELAY);
    }
}