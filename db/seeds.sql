USE employeesDB;

INSERT INTO department(name)
  VALUES 
      ('Corporate'),
      ('Regional Manager'), 
      ('Sales'), 
      ('Quality Assurance'), 
      ('Accounting'), 
      ('Supplier Relations'), 
      ('Customer Relations'), 
      ('Warehouse'), 
      ('Reception'), 
      ('Human Resources');

INSERT INTO role(title, salary, department_id)
  VALUES
      ('CEO', 500000, 1),
      ('chief financial officer', 200000, 1),
      ('district manager', 100000, 1),
      ('regional manager', 65000, 2),
      ('sales rep', 55000, 3),
      ('QA', 55000, 4),
      ('accountant', 55000, 5),
      ('supplier relations', 45000, 6),
      ('customer service rep', 45000, 7),
      ('warehouse foreman', 55000, 8),
      ('warehouse worker', 45000, 9),
      ('receptionist', 40000,  10),
      ('human resources', 55000,  11);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
  VALUES 
    ('Alan', 'Brand', 1, NULL),
    ('David', 'Wallace', 2, 1),
    ('Jan', 'Levinson', 3, 2),
    ('Michael', 'Scott', 4, 3),
    ('Josh', 'Porter', 4, 3),
    ('Dwight', 'Schrute', 5, 4),
    ('Jim', 'Halpert', 5, 4),
    ('Andy', 'Bernard', 5, 4),
    ('Stanley', 'Hudson', 5, 4),
    ('Phyllis', 'Vance', 5, 4),
    ('Creed', 'Bratton', 6, 4),
    ('Angela', 'Martin', 7, 4),
    ('Oscar', 'Martinez', 7, 4),
    ('Kevin', 'Malone', 7, 4),
    ('Meredith', 'Palmer', 8, 4),
    ('Kelly', 'Kapoor', 9, 4),
    ('Ryan', 'Howard', 9, 4),
    ('Darryl', 'Philbin', 10, 4),
    ('Roy', 'Anderson', 11, 18),
    ('Hidetoshi', 'Hasegawa', 11, 18),
    ('Pam', 'Beesly', 12, 4),
    ('Erin', 'Hannon', 12, 4),
    ('Toby', 'Flenderson', 13, 4),
    ('Holly', 'Flax', 13, 4);
