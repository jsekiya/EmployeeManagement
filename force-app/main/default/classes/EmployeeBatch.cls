public class EmployeeBatch implements Database.Batchable<SObject> {
    private String department;
    private String name;
    private String position;

    public EmployeeBatch(String department, String name, String position) {
        this.department = department;
        this.name = name;
        this.position = position;
    }

    public Database.QueryLocator start(Database.BatchableContext bc) {
        String key = '%' + name + '%';

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

        query += ' WITH SECURITY_ENFORCED ORDER BY Name ASC';

        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext bc, List<SObject> scope) {
        List<Employee__c> employees = (List<Employee__c>) scope;
    
        for (Employee__c employee : employees) {
            
            List<Examination__c> examinations = [
                SELECT Id, Name, Result__c, ExamDate__c, CertificationName__r.Name
                FROM Examination__c
                WHERE EmployeeCertification__c = :employee.Id
                WITH USER_MODE
            ];
    
            for (Examination__c examination : examinations) {
                
            }
    
            List<WorkHistory__c> workHistoryList = [
                SELECT Id, Name, CompanyName__c, EmployeeName__r.Name, JobDescription__c, EndDate__c, Position__c, Department__c, StartDate__c
                FROM WorkHistory__c
                WHERE EmployeeName__c = :employee.Id
                WITH USER_MODE
            ];
    
        }
    }

    public void finish(Database.BatchableContext bc) {

    }
}