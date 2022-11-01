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
          `Update An Employee's Role`,
          `Update Manager for Employee`,
          `Delete Department`,
          `Delete Role`,
          `Delete Employee`,
          `EXIT THE DATABASE`,
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

        case `Update An Employee's Role`:
          updateEmployeeRole();
          break;

        case `Update Manager for Employee`:
          updateEmployeeManager();
          break;

        case `Delete Department`:
          deleteDepartment();
          break;

        case `Delete Role`:
          deleteRole();
          break;

        case `Delete Employee`:
          deleteEmployee();
          break;

        case `EXIT THE DATABASE`:
          exitDB();
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
    console.log(`=============================`);
    console.log(`|  VIEWING ALL DEPARTMENTS  |`);
    console.log(`=============================`);
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
    console.log(`=======================`);
    console.log(`|  VIEWING ALL ROLES  |`);
    console.log(`=======================`);
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
    console.log(`===========================`);
    console.log(`|  VIEWING ALL EMPLOYEES  |`);
    console.log(`===========================`);
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
        console.log(`======================`);
        console.log(`|  DEPARTMENT ADDED  |`);
        console.log(`======================`);
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
        name: 'title',
      },
      {
        type: 'input',
        message: 'What is the salary of the role?',
        name: 'salary',
      },
      {
        type: 'input',
        message: 'What is the department ID of the role?',
        name: 'departmentID',
      },
    ])
    .then((userResponse) => {
      const query = `INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`;
      db.query(
        query,
        [userResponse.title, userResponse.salary, userResponse.departmentID],
        (err, res) => {
          if (err) throw err;
          console.log(``);
          console.log(`================`);
          console.log(`|  ROLE ADDED  |`);
          console.log(`================`);
          console.table(res);
          firstPrompt();
        }
      );
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
          'What is the role ID of the employee? (1-13) The default is 5 (Sales). \n 1 - CEO \n 2 - CFO \n 3 - District Manager \n 4 - Regional Manager \n 5 - Sales Rep \n 6 - QA (Quality Assurance) \n 7 - Accountant \n 8 - Supplier Relations \n 9 - Customer Service Rep \n 10 - Warehouse Foreman \n 11 - Warehouse Worker \n 12 - Receptionist \n 13 - Human Resources \n Please enter the number of the role ID.',
        name: 'roleID',
      },
      {
        type: 'input',
        message:
          'What is the manager ID of the employee? (1-5, 18) The default is 4 (Michael Scott)\n 1 - Alan Brand \n 2 - David Wallace \n 3 - Jan Levinson \n 4 - Michael Scott \n 5 - Josh Porter \n 18 - Darryl Philbin \n Please enter the number of the manager ID.',
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
          console.log(`========================`);
          console.log(`|    EMPLOYEE ADDED    |`);
          console.log(`========================`);
          console.table(res);
          firstPrompt();
        }
      );
    });
};

const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the ID of the employee you want to update?',
        name: 'employeeID',
      },
      {
        type: 'input',
        message: 'What is the new role ID of the employee?',
        name: 'roleID',
      },
    ])
    .then((userResponse) => {
      const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      db.query(
        query,
        [userResponse.roleID, userResponse.employeeID],
        (err, res) => {
          if (err) throw err;
          console.log(``);
          console.log(`============================`);
          console.log(`|  EMPLOYEE ROLE UPDATED   |`);
          console.log(`============================`);
          console.table(res);
          firstPrompt();
        }
      );
    });
};

const updateEmployeeManager = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the ID of the employee you want to update?',
        name: 'employeeID',
      },
      {
        type: 'input',
        message: 'What is the new manager ID of the employee?',
        name: 'managerID',
      },
    ])
    .then((userResponse) => {
      const query = `UPDATE employee SET manager_id = ? WHERE id = ?`;
      db.query(
        query,
        [userResponse.managerID, userResponse.employeeID],
        (err, res) => {
          if (err) throw err;
          console.log(``);
          console.log(`=============================`);
          console.log(`|  EMPLOYEE MANAGER UPDATED |`);
          console.log(`=============================`);
          console.table(res);
          firstPrompt();
        }
      );
    });
};

const deleteDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the ID of the department you want to delete?',
        name: 'departmentID',
      },
    ])
    .then((userResponse) => {
      const query = `DELETE FROM department WHERE id = ?`;
      db.query(query, [userResponse.departmentID], (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`==========================`);
        console.log(`|   DEPARTMENT DELETED   |`);
        console.log(`==========================`);
        console.table(res);
        firstPrompt();
      });
    });
};

const deleteRole = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the ID of the role you want to delete?',
        name: 'roleID',
      },
    ])
    .then((userResponse) => {
      const query = `DELETE FROM role WHERE id = ?`;
      db.query(query, [userResponse.roleID], (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`====================`);
        console.log(`|   ROLE DELETED   |`);
        console.log(`====================`);
        console.table(res);
        firstPrompt();
      });
    });
};

const deleteEmployee = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the ID of the employee you want to delete?',
        name: 'employeeID',
      },
    ])
    .then((userResponse) => {
      const query = `DELETE FROM employee WHERE id = ?`;
      db.query(query, [userResponse.employeeID], (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`========================`);
        console.log(`|   EMPLOYEE DELETED   |`);
        console.log(`========================`);
        console.table(res);
        firstPrompt();
      });
    });
};

const exitDB = () => {
  console.log(``);
  console.log(`======================`);
  console.log(`|  EXITING DATABASE  |`);
  console.log(`======================`);
  console.log(``);
  process.exit();
};
