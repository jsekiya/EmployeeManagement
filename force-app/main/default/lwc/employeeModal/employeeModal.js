import { LightningElement, api } from 'lwc';

import LightningModal from 'lightning/modal';

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
];

export default class EmployeeModal extends LightningModal {
    columns = columns;
    @api selectedRecords;
    

    handleOkay() {
        // OKボタン、送信ボタン時処理
        const result = { status: "success", record: this.record };
        this.close(result);
      }   
}