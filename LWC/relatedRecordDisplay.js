import { LightningElement, api, track } from 'lwc';
import fetchChildRecords from '@salesforce/apex/RecordFetcherController.fetchChildRecords';

export default class RelatedRecordDisplay extends LightningElement {
    @api childObjectName;
    @api parentRecordId;
    @api relationshipFieldName;
    @api fieldSetName;
    
    @track recordList;
    @track errorMessage;
    @track displayFields = [];

    // Fetch records when the component is initialized
    connectedCallback() {
        this.loadRelatedRecords();
    }

    // Function to call Apex and load related records
    loadRelatedRecords() {
        fetchChildRecords({
            objectName: this.childObjectName,
            parentId: this.parentRecordId,
            lookupField: this.relationshipFieldName,
            displayFieldsSet: this.fieldSetName
        })
        .then(data => {
            this.recordList = data;
            if (data && data.length > 0) {
                this.displayFields = Object.keys(data[0]).filter(field => field !== 'Id');
            }
            this.errorMessage = undefined;
        })
        .catch(error => {
            this.recordList = undefined;
            this.errorMessage = 'An error occurred while fetching records: ' + JSON.stringify(error);
        });
    }
}
