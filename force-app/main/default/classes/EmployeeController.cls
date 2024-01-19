public with sharing class EmployeeController {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> findEmployee(String department) {
        //String key = '%' + searchKey + '%';
        system.debug('department:' + department);
        if(department == ''){
            return [
            SELECT Id, Name, Address__c, Phone__c, Email__c, DateOfBirth__c, Position__c, Picture__c, Department__c	
            FROM Employee__c
            WITH USER_MODE
            LIMIT 10
            ];
        }else{
            return [
            SELECT Id, Name, Address__c, Phone__c, Email__c, DateOfBirth__c, Position__c, Picture__c, Department__c	
            FROM Employee__c
            WHERE Department__c =: department //AND Picture__c != NULL
            WITH USER_MODE
            LIMIT 10
            ];
        }    
    }

    @AuraEnabled
    public static Employee__c getSelectedEmployeeDetail(String employeeId){

        Employee__c employee = [ SELECT Id, Name, Address__c, Phone__c, Email__c, DateOfBirth__c, Position__c, Picture__c, Department__c	
        FROM Employee__c
        WHERE Id =: employeeId //AND Picture__c != NULL
        WITH USER_MODE
        LIMIT 10 ];

        return employee;
    }
}