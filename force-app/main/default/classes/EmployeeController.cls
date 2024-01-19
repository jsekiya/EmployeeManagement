public with sharing class EmployeeController {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> findEmployee(String department,  String name) {
        //String key = '%' + searchKey + '%';
        system.debug('department:' + department);
        system.debug('name:'+ name);

        String query = 'SELECT Id, Name, Address__c, Phone__c, Email__c, DateOfBirth__c, Position__c, Picture__c, Department__c FROM Employee__c';
        String whereClause = '';

        if (!String.isEmpty(department) && !String.isEmpty(name)) {
            whereClause = ' WHERE Department__c = :department AND Name LIKE :name';
        } else if (!String.isEmpty(department)) {
            whereClause = ' WHERE Department__c = :department';
        } else if (!String.isEmpty(name)) {
            whereClause = ' WHERE Name LIKE :name';
        } 

        query += whereClause + ' WITH SECURITY_ENFORCED LIMIT 10';
    
        return Database.query(query);
       
    }

    @AuraEnabled
    public static Employee__c getSelectedEmployeeDetail(String employeeId){
        return [
            SELECT Id, Name, Address__c, Phone__c, Email__c, DateOfBirth__c, Position__c, Picture__c, Department__c	
            FROM Employee__c
            WHERE Id = :employeeId
            WITH USER_MODE
            LIMIT 10
        ];
    }
}