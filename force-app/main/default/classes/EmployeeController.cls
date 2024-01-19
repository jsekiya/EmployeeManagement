public with sharing class EmployeeController {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> findEmployee(String department,  String name, String position) {
        String key = '%' + name + '%';
        system.debug('department:' + department);
        system.debug('name:'+ name);
        system.debug('position:'+ position);

        String query = 'SELECT Id, Name, Address__c, Phone__c, Email__c, DateOfBirth__c, Position__c, Picture__c, Department__c FROM Employee__c';
        List<String> whereClause = new List<String>();

        switch on 0 {
            when 0 {
                if (!String.isEmpty(department)) {
                    whereClause.add('Department__c = :department');
                }
                if (!String.isEmpty(name)) {
                    whereClause.add('Name LIKE :key');
                }
                if (!String.isEmpty(position)) {
                    whereClause.add('Position__c LIKE :position');
                }
            }
            when 1 {
                if (!String.isEmpty(department) && !String.isEmpty(name) && !String.isEmpty(position)) {
                    whereClause.add('Department__c = :department');
                    whereClause.add('Name LIKE :key');
                    whereClause.add('Position__c LIKE :position');
                } else if (!String.isEmpty(position) && !String.isEmpty(department)) {
                    whereClause.add('Position__c = :position');
                    whereClause.add('Department__c = :department');
                } else if (!String.isEmpty(name) && !String.isEmpty(department)) {
                    whereClause.add('Name LIKE :key');
                    whereClause.add('Department__c = :department');
                }
            }
        }

        if (!whereClause.isEmpty()) {
            query += ' WHERE ' + String.join(whereClause, ' AND ');
        }

        query += ' WITH SECURITY_ENFORCED LIMIT 10';

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