/**
 * Comprehensive SQL Sheet Data covering all 10 required SQL topics:
 * 1. Basics
 * 2. Constraints
 * 3. Joins
 * 4. Aggregation
 * 5. Subqueries
 * 6. Views
 * 7. CTEs
 * 8. Window Functions
 * 9. Transactions
 * 10. Normalization
 */

export const SQL_TOPICS = [
  {
    id: "sql-basics",
    name: "Basics",
    icon: "FaDatabase",
    description: "SELECT statements, WHERE clause filters, ORDER BY sorting, LIMIT pagination, and basic operators.",
    difficultySummary: "Beginner",
    color: "from-blue-600 to-sky-600",
    bgColor: "bg-blue-50 border-blue-200 text-blue-800",
    problems: [
      {
        id: "sql-b-1",
        title: "Find High Earning Employees",
        difficulty: "Easy",
        companies: ["Amazon", "TCS", "Infosys", "Wipro"],
        leetcodeUrl: "https://leetcode.com/problems/employees-earning-more-than-their-managers/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-where-clause/",
        statement: "Write a SQL query to select all employees whose salary is strictly greater than 70,000, ordered by salary in descending order.",
        schema: `Employees (
  emp_id INT PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  salary DECIMAL(10,2)
)`,
        solutionQuery: `SELECT emp_id, name, department, salary
FROM Employees
WHERE salary > 70000
ORDER BY salary DESC;`,
        explanation: "The `WHERE` clause filters rows meeting the condition `salary > 70000`, and `ORDER BY salary DESC` sorts results from highest to lowest salary.",
        keyConcept: "Filtering & Ordering"
      },
      {
        id: "sql-b-2",
        title: "Distinct Product Categories in Stock",
        difficulty: "Easy",
        companies: ["Flipkart", "Walmart", "Target"],
        leetcodeUrl: "https://leetcode.com/problems/find-customer-referee/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-distinct-clause/",
        statement: "Fetch unique product categories that currently have stock level greater than zero.",
        schema: `Products (
  product_id INT,
  product_name VARCHAR(100),
  category VARCHAR(50),
  stock_quantity INT
)`,
        solutionQuery: `SELECT DISTINCT category
FROM Products
WHERE stock_quantity > 0;`,
        explanation: "The `DISTINCT` keyword eliminates duplicate category values from the output.",
        keyConcept: "Deduplication"
      }
    ]
  },
  {
    id: "sql-constraints",
    name: "Constraints",
    icon: "FaLock",
    description: "PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK constraints, and DEFAULT values.",
    difficultySummary: "Beginner to Intermediate",
    color: "from-slate-600 to-gray-700",
    bgColor: "bg-slate-100 border-slate-300 text-slate-800",
    problems: [
      {
        id: "sql-c-1",
        title: "Define E-Commerce Users Table with Integrity Checks",
        difficulty: "Easy",
        companies: ["Paytm", "Oracle", "IBM"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-constraints/",
        statement: "Write DDL script to create a `Users` table enforcing primary key, unique email, non-negative age check, and default role.",
        schema: "DDL Table Creation Task",
        solutionQuery: `CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT CHECK (age >= 18),
  role VARCHAR(20) DEFAULT 'Customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        explanation: "Enforces entity integrity with `PRIMARY KEY`, domain integrity via `CHECK (age >= 18)`, and uniqueness with `UNIQUE` email constraint.",
        keyConcept: "DDL & Data Integrity"
      }
    ]
  },
  {
    id: "sql-joins",
    name: "Joins",
    icon: "FaObjectGroup",
    description: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, and Self Joins.",
    difficultySummary: "Intermediate",
    color: "from-indigo-600 to-violet-600",
    bgColor: "bg-indigo-50 border-indigo-200 text-indigo-800",
    problems: [
      {
        id: "sql-j-1",
        title: "Customers Without Recent Orders",
        difficulty: "Medium",
        companies: ["Amazon", "Uber", "Swiggy", "Zomato"],
        leetcodeUrl: "https://leetcode.com/problems/customers-who-never-order/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/",
        statement: "Find all customers who registered before 2024 but have never placed any orders.",
        schema: `Customers (customer_id, name, signup_date)
Orders (order_id, customer_id, order_date, amount)`,
        solutionQuery: `SELECT c.customer_id, c.name
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL AND c.signup_date < '2024-01-01';`,
        explanation: "Using a `LEFT JOIN`, customers without matching orders yield `NULL` in order columns. Filtering `o.order_id IS NULL` captures inactive customers.",
        keyConcept: "LEFT JOIN & Exclusion Filtering"
      },
      {
        id: "sql-j-2",
        title: "Employee Manager Hierarchy (Self Join)",
        difficulty: "Medium",
        companies: ["Google", "Microsoft", "Goldman Sachs"],
        leetcodeUrl: "https://leetcode.com/problems/employees-earning-more-than-their-managers/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-self-join/",
        statement: "Find all employees who earn more than their direct manager.",
        schema: `Employee (id, name, salary, managerId)`,
        solutionQuery: `SELECT e.name AS Employee
FROM Employee e
INNER JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;`,
        explanation: "Self-join pairs each employee row `e` with their manager row `m` by matching `e.managerId = m.id`.",
        keyConcept: "Self Join"
      }
    ]
  },
  {
    id: "sql-aggregation",
    name: "Aggregation",
    icon: "FaCalculator",
    description: "COUNT, SUM, AVG, MIN, MAX, GROUP BY grouping, and HAVING clause filtering.",
    difficultySummary: "Beginner to Intermediate",
    color: "from-emerald-600 to-teal-700",
    bgColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
    problems: [
      {
        id: "sql-a-1",
        title: "Departments with High Average Salary",
        difficulty: "Medium",
        companies: ["Microsoft", "Oracle", "Deloitte"],
        leetcodeUrl: "https://leetcode.com/problems/department-highest-salary/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-group-by/",
        statement: "Find all departments having more than 5 employees and an average salary above 85,000.",
        schema: `Employees (emp_id, name, department_id, salary)`,
        solutionQuery: `SELECT department_id, COUNT(emp_id) AS total_employees, AVG(salary) AS avg_salary
FROM Employees
GROUP BY department_id
HAVING COUNT(emp_id) > 5 AND AVG(salary) > 85000;`,
        explanation: "`GROUP BY department_id` aggregates statistics per department. `HAVING` filters aggregated groups (whereas `WHERE` filters individual rows).",
        keyConcept: "GROUP BY vs HAVING"
      }
    ]
  },
  {
    id: "sql-subqueries",
    name: "Subqueries",
    icon: "FaSitemap",
    description: "Scalar subqueries, Correlated subqueries, IN, EXISTS, ANY, and ALL clause operations.",
    difficultySummary: "Intermediate to Advanced",
    color: "from-amber-600 to-orange-700",
    bgColor: "bg-amber-50 border-amber-200 text-amber-900",
    problems: [
      {
        id: "sql-sq-1",
        title: "Second Highest Salary in Company",
        difficulty: "Medium",
        companies: ["Meta", "Amazon", "Apple"],
        leetcodeUrl: "https://leetcode.com/problems/second-highest-salary/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-query-to-find-second-highest-salary-of-employee/",
        statement: "Write a SQL query to report the second highest distinct salary from the `Employee` table. If there is no second highest, return NULL.",
        schema: `Employee (id INT, salary INT)`,
        solutionQuery: `SELECT (
  SELECT DISTINCT salary
  FROM Employee
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`,
        explanation: "Subquery with `DISTINCT`, `ORDER BY DESC`, and `LIMIT 1 OFFSET 1` safely handles duplicates and returns NULL if fewer than 2 distinct salaries exist.",
        keyConcept: "Subquery with OFFSET"
      }
    ]
  },
  {
    id: "sql-views",
    name: "Views",
    icon: "FaEye",
    description: "Creating virtual tables, security abstractions, materialization concepts, and UPDATABLE views.",
    difficultySummary: "Intermediate",
    color: "from-purple-600 to-pink-600",
    bgColor: "bg-purple-50 border-purple-200 text-purple-800",
    problems: [
      {
        id: "sql-v-1",
        title: "Create High Value Sales View",
        difficulty: "Medium",
        companies: ["JPMorgan", "Morgan Stanley", "Barclays"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-views/",
        statement: "Create a database view named `HighValueSales` summarizing orders with total value over $10,000 for executive reporting.",
        schema: `Orders (order_id, customer_id, order_date, total_amount)`,
        solutionQuery: `CREATE VIEW HighValueSales AS
SELECT order_id, customer_id, order_date, total_amount
FROM Orders
WHERE total_amount > 10000;`,
        explanation: "Views encapsulate complex logic into reusable virtual tables without storing redundant physical data.",
        keyConcept: "Virtual Tables & Abstraction"
      }
    ]
  },
  {
    id: "sql-ctes",
    name: "CTEs",
    icon: "FaProjectDiagram",
    description: "Common Table Expressions (WITH clause), modular query organization, and Recursive CTEs.",
    difficultySummary: "Intermediate to Advanced",
    color: "from-cyan-600 to-blue-700",
    bgColor: "bg-cyan-50 border-cyan-200 text-cyan-800",
    problems: [
      {
        id: "sql-cte-1",
        title: "Top Performing Sales Reps via CTE",
        difficulty: "Medium",
        companies: ["Salesforce", "HubSpot", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/department-top-three-salaries/",
        gfgUrl: "https://www.geeksforgeeks.org/cte-in-sql/",
        statement: "Calculate total revenue per sales representative using a CTE, then filter for reps generating top 10% revenue.",
        schema: `Sales (sale_id, rep_id, amount, sale_date)`,
        solutionQuery: `WITH RepRevenue AS (
  SELECT rep_id, SUM(amount) AS total_revenue
  FROM Sales
  GROUP BY rep_id
)
SELECT rep_id, total_revenue
FROM RepRevenue
WHERE total_revenue > 50000
ORDER BY total_revenue DESC;`,
        explanation: "`WITH` clause constructs a readable temporary result set `RepRevenue` referenced cleanly in the main query.",
        keyConcept: "Modular Queries with WITH"
      }
    ]
  },
  {
    id: "sql-window-functions",
    name: "Window Functions",
    icon: "FaChartLine",
    description: "ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), LEAD(), LAG(), and OVER(PARTITION BY ...) clauses.",
    difficultySummary: "Advanced",
    color: "from-rose-600 to-red-600",
    bgColor: "bg-rose-50 border-rose-200 text-rose-800",
    problems: [
      {
        id: "sql-wf-1",
        title: "Department Top 3 Salaries (DENSE_RANK)",
        difficulty: "Hard",
        companies: ["Google", "Amazon", "Meta", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/department-top-three-salaries/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-window-functions/",
        statement: "Find employees who earn high salaries in each of the departments (top 3 unique salaries per department).",
        schema: `Employee (id, name, salary, departmentId)
Department (id, name)`,
        solutionQuery: `WITH RankedSalaries AS (
  SELECT e.name AS Employee, e.salary, d.name AS Department,
         DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk
  FROM Employee e
  JOIN Department d ON e.departmentId = d.id
)
SELECT Department, Employee, Salary
FROM RankedSalaries
WHERE rnk <= 3;`,
        explanation: "`DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC)` ranks salaries without skipping rank numbers on ties.",
        keyConcept: "DENSE_RANK & PARTITION BY"
      },
      {
        id: "sql-wf-2",
        title: "Monthly Revenue Growth Comparison (LAG)",
        difficulty: "Hard",
        companies: ["Stripe", "PayPal", "Square"],
        leetcodeUrl: "https://leetcode.com/problems/monthly-transactions-i/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-lag-function/",
        statement: "Calculate month-over-month percentage change in total revenue using the `LAG()` window function.",
        schema: `MonthlySales (year_month VARCHAR(7), total_revenue DECIMAL(12,2))`,
        solutionQuery: `SELECT year_month, total_revenue,
  LAG(total_revenue, 1) OVER (ORDER BY year_month) AS prev_month_revenue,
  ROUND(((total_revenue - LAG(total_revenue, 1) OVER (ORDER BY year_month)) / LAG(total_revenue, 1) OVER (ORDER BY year_month)) * 100, 2) AS growth_pct
FROM MonthlySales;`,
        explanation: "`LAG(total_revenue, 1)` accesses previous row's value to calculate relative growth rate across chronological rows.",
        keyConcept: "LEAD & LAG Time Series Analysis"
      }
    ]
  },
  {
    id: "sql-transactions",
    name: "Transactions",
    icon: "FaExchangeAlt",
    description: "ACID properties (Atomicity, Consistency, Isolation, Durability), BEGIN, COMMIT, ROLLBACK, and SAVEPOINT.",
    difficultySummary: "Advanced",
    color: "from-teal-600 to-emerald-700",
    bgColor: "bg-teal-50 border-teal-200 text-teal-800",
    problems: [
      {
        id: "sql-t-1",
        title: "Bank Account Transfer with Atomicity",
        difficulty: "Medium",
        companies: ["Goldman Sachs", "JP Morgan", "Citigroup"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-transactions/",
        statement: "Write a transactional SQL script transferring $500 from Account A to Account B ensuring atomicity.",
        schema: `Accounts (account_id, balance)`,
        solutionQuery: `START TRANSACTION;

UPDATE Accounts SET balance = balance - 500 WHERE account_id = 101;
UPDATE Accounts SET balance = balance + 500 WHERE account_id = 202;

-- Check if balance drops below zero
IF (SELECT balance FROM Accounts WHERE account_id = 101) < 0 THEN
  ROLLBACK;
ELSE
  COMMIT;
END IF;`,
        explanation: "Transactions guarantee either all statements commit or none take effect (`Atomicity`), preserving consistency.",
        keyConcept: "ACID & ROLLBACK"
      }
    ]
  },
  {
    id: "sql-normalization",
    name: "Normalization",
    icon: "FaCubes",
    description: "1NF, 2NF, 3NF, BCNF, Functional Dependencies, anomalies (Insertion, Deletion, Update), and Denormalization trade-offs.",
    difficultySummary: "Intermediate to Advanced",
    color: "from-indigo-700 to-slate-800",
    bgColor: "bg-indigo-50 border-indigo-200 text-indigo-900",
    problems: [
      {
        id: "sql-n-1",
        title: "Decompose Unnormalized Order Sheet to 3NF",
        difficulty: "Hard",
        companies: ["Oracle", "Microsoft", "Accenture"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/normalization-in-dbms/",
        statement: "Explain functional dependencies in an unnormalized spreadsheet and write DDL normalizing it into 3rd Normal Form (3NF).",
        schema: `Unnormalized: OrderSheet (OrderID, CustomerName, CustomerAddress, ProductID, ProductName, Price, Quantity)`,
        solutionQuery: `-- 1. Customers Table (3NF)
CREATE TABLE Customers (
  customer_id INT PRIMARY KEY,
  customer_name VARCHAR(100),
  customer_address TEXT
);

-- 2. Products Table (3NF)
CREATE TABLE Products (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(100),
  unit_price DECIMAL(10,2)
);

-- 3. Orders Table
CREATE TABLE Orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  order_date DATE,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- 4. OrderItems Table (Junction Table)
CREATE TABLE OrderItems (
  order_id INT,
  product_id INT,
  quantity INT,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);`,
        explanation: "Eliminates repeating groups (1NF), partial dependencies (2NF), and transitive dependencies (3NF) to eliminate update/insertion anomalies.",
        keyConcept: "1NF, 2NF, 3NF Decomposition"
      }
    ]
  }
];
