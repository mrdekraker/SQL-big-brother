/* eslint-disable no-useless-escape */
const mysql = require('mysql2');
require('console.table');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  // MySQL username,
  user: 'root',
  // !CHANGE THIS TO FILLER STRING LATER
  password: 'River331!',
  database: 'employeesDB',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Welcome to the `employee_db` database!');
  console.log(`
  =========================================================================
  |   _____           _                    _____             _            |
  |  |   __|_____ ___| |___ _ _ ___ ___   |_   _|___ ___ ___| |_ ___ ___  |
  |  |   __|     | . | | . | | | -_| -_|    | | |  _| .'|  _| '_| -_|  _| |
  |  |_____|_|_|_|  _|_|___|_  |___|___|    |_| |_| |__,|___|_,_|___|_|   |
  |              |_|       |___|                                          |              
  =========================================================================
`);
  firstPrompt();
});

const firstPrompt = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: [
          `View All Departments`,
          `View All Roles`,
          `View All Employees`,
          `Add A Department`,
          `Add A Role`,
          `Add An Employee`,
        ],
      },
    ])
    .then((userResponse) => {
      switch (userResponse.action) {
        case `View All Roles`:
          viewRoles();
          break;

        case `View All Departments`:
          viewDeparments();
          break;

        case `View All Employees`:
          viewAllEmployees();
          break;

        case `Add A Department`:
          addDepartment();
          break;

        case `Add A Role`:
          addRole();
          break;

        case `Add An Employee`:
          addEmployee();
          break;

        default:
          firstPrompt();
          break;
      }
    });
};

const viewDeparments = () => {
  const query = `SELECT department.id, department.name AS Department
  FROM department
  ORDER BY department.id `;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log(``);
    console.log(`========================`);
    console.log(`VIEWING ALL DEPARTMENTS`);
    console.log(`========================`);
    console.table(res);
    firstPrompt();
  });
};

const viewRoles = () => {
  const query = `SELECT role.id, role.title AS Title, department.name AS Department, role.salary AS Salary
  FROM role
  LEFT JOIN department ON department.id = role.department_id
  ORDER BY role.id `;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log(``);
    console.log(`=================`);
    console.log(`VIEWING ALL ROLES`);
    console.log(`=================`);
    console.table(res);
    firstPrompt();
  });
};

const viewAllEmployees = () => {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN role ON (role.id = employee.role_id)
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY employee.id `;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log(``);
    console.log(`========================`);
    console.log(`VIEWING ALL EMPLOYEES`);
    console.log(`========================`);
    console.table(res);
    firstPrompt();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'departmentName',
      },
    ])
    .then((userResponse) => {
      const query = `INSERT INTO department(name) VALUES (?)`;
      db.query(query, [userResponse.departmentName], (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`================`);
        console.log(`DEPARTMENT ADDED`);
        console.log(`================`);
        console.table(res);
        firstPrompt();
      });
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the title of the role?',
        name: 'roleName',
      },
    ])
    .then((userResponse) => {
      const query = `INSERT INTO role(name) VALUES (?)`;
      db.query(query, [userResponse.roleName], (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`==========`);
        console.log(`ROLE ADDED`);
        console.log(`==========`);
        console.table(res);
        firstPrompt();
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the first name of the employee?',
        name: 'firstName',
      },
      {
        type: 'input',
        message: 'What is the last name of the employee?',
        name: 'lastName',
      },
      {
        type: 'input',
        message:
          'What is the role ID of the employee? (1-11) Default is 4, Sales.',
        name: 'roleID',
      },
      {
        type: 'input',
        message: 'What is the manager ID of the employee?',
        name: 'managerID',
      },
    ])
    .then((userResponse) => {
      const query = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      db.query(
        query,
        [
          userResponse.firstName,
          userResponse.lastName,
          userResponse.roleID,
          userResponse.managerID,
        ],
        // confirm user input for employee role
        (err, res) => {
          if (err) throw err;
          console.log(``);
          console.log(`================`);
          console.log(`EMPLOYEE ADDED`);
          console.log(`================`);
          console.table(res);
          firstPrompt();
        }
      );
    });
};

// !REQUIREMENTS
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
