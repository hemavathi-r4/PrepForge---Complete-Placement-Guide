/**
 * Comprehensive SQL Sheet Data — Expanded Edition
 * 10 topics, 3–5 problems each, with LeetCode & GFG links, schemas, queries, and explanations.
 *
 * Topics:
 * 1. Basics        2. Constraints      3. Joins         4. Aggregation    5. Subqueries
 * 6. Views         7. CTEs             8. Window Funcs  9. Transactions   10. Normalization
 */

export const SQL_TOPICS = [
  // ─────────────────────────────────────────────────────
  // 1. BASICS
  // ─────────────────────────────────────────────────────
  {
    id: "sql-basics",
    name: "Basics",
    icon: "FaDatabase",
    description: "SELECT statements, WHERE filters, ORDER BY, LIMIT pagination, DISTINCT, and basic operators.",
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
        statement: "Select all employees whose salary is strictly greater than 70,000, ordered by salary descending.",
        schema: `Employees (emp_id INT PK, name VARCHAR(50), department VARCHAR(50), salary DECIMAL(10,2))`,
        solutionQuery: `SELECT emp_id, name, department, salary
FROM Employees
WHERE salary > 70000
ORDER BY salary DESC;`,
        explanation: "`WHERE` filters rows and `ORDER BY salary DESC` sorts results from highest to lowest salary.",
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
        schema: `Products (product_id INT, product_name VARCHAR(100), category VARCHAR(50), stock_quantity INT)`,
        solutionQuery: `SELECT DISTINCT category
FROM Products
WHERE stock_quantity > 0;`,
        explanation: "`DISTINCT` eliminates duplicate category values from the output.",
        keyConcept: "Deduplication"
      },
      {
        id: "sql-b-3",
        title: "Top 5 Most Recent Orders",
        difficulty: "Easy",
        companies: ["Amazon", "Flipkart", "Swiggy"],
        leetcodeUrl: "https://leetcode.com/problems/recyclable-and-low-fat-products/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-limit-clause/",
        statement: "Retrieve the 5 most recently placed orders along with their customer names.",
        schema: `Orders (order_id, customer_name, order_date, total_amount)`,
        solutionQuery: `SELECT order_id, customer_name, order_date, total_amount
FROM Orders
ORDER BY order_date DESC
LIMIT 5;`,
        explanation: "`ORDER BY order_date DESC` sorts newest first, `LIMIT 5` returns only the top 5 rows.",
        keyConcept: "Pagination with LIMIT"
      },
      {
        id: "sql-b-4",
        title: "Find Employees Hired in 2023",
        difficulty: "Easy",
        companies: ["TCS", "Infosys", "Cognizant"],
        leetcodeUrl: "https://leetcode.com/problems/employees-with-missing-information/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-between-clause/",
        statement: "Retrieve all employees who were hired in the year 2023.",
        schema: `Employees (emp_id, name, department, hire_date DATE, salary)`,
        solutionQuery: `SELECT emp_id, name, department, hire_date
FROM Employees
WHERE hire_date BETWEEN '2023-01-01' AND '2023-12-31'
ORDER BY hire_date;`,
        explanation: "`BETWEEN` is inclusive on both ends. Equivalent to `WHERE hire_date >= '2023-01-01' AND hire_date <= '2023-12-31'`.",
        keyConcept: "BETWEEN & Date Filtering"
      },
      {
        id: "sql-b-5",
        title: "Search Employees by Name Pattern",
        difficulty: "Easy",
        companies: ["TCS", "Wipro", "HCL"],
        leetcodeUrl: "https://leetcode.com/problems/find-users-with-valid-e-mails/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-like-clause/",
        statement: "Find all employees whose name starts with 'A' or ends with 'n'.",
        schema: `Employees (emp_id, name, department, salary)`,
        solutionQuery: `SELECT emp_id, name, department
FROM Employees
WHERE name LIKE 'A%' OR name LIKE '%n';`,
        explanation: "`LIKE 'A%'` matches names starting with A. `'%n'` matches names ending with n. `%` is wildcard for any sequence.",
        keyConcept: "LIKE Pattern Matching"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 2. CONSTRAINTS
  // ─────────────────────────────────────────────────────
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
        statement: "Write DDL to create a `Users` table enforcing primary key, unique email, non-negative age check, and default role.",
        schema: "DDL Table Creation Task",
        solutionQuery: `CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT CHECK (age >= 18),
  role VARCHAR(20) DEFAULT 'Customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        explanation: "Enforces entity integrity with `PRIMARY KEY`, domain integrity via `CHECK (age >= 18)`, and uniqueness with `UNIQUE` email.",
        keyConcept: "DDL & Data Integrity"
      },
      {
        id: "sql-c-2",
        title: "Foreign Key Referential Integrity",
        difficulty: "Easy",
        companies: ["Oracle", "Microsoft", "IBM"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/foreign-key-constraint-in-sql/",
        statement: "Create Orders table referencing Customers table with ON DELETE CASCADE behavior.",
        schema: "DDL Referential Integrity Task",
        solutionQuery: `CREATE TABLE Customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE
);

CREATE TABLE Orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  order_date DATE DEFAULT CURRENT_DATE,
  amount DECIMAL(10,2) CHECK (amount > 0),
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);`,
        explanation: "`FOREIGN KEY` enforces referential integrity. `ON DELETE CASCADE` auto-deletes orders when a customer is deleted.",
        keyConcept: "FOREIGN KEY & Cascade"
      },
      {
        id: "sql-c-3",
        title: "Composite Primary Key for Junction Table",
        difficulty: "Medium",
        companies: ["Oracle", "Google", "Amazon"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/composite-key-in-sql/",
        statement: "Create a StudentCourses enrollment table with a composite primary key to prevent duplicate enrollments.",
        schema: "DDL Composite Key Task",
        solutionQuery: `CREATE TABLE StudentCourses (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  grade CHAR(1) CHECK (grade IN ('A','B','C','D','F')),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES Students(student_id),
  FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);`,
        explanation: "Composite `PRIMARY KEY (student_id, course_id)` ensures no student can be enrolled in the same course twice.",
        keyConcept: "Composite Primary Key"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 3. JOINS
  // ─────────────────────────────────────────────────────
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
        companies: ["Amazon", "Uber", "Swiggy"],
        leetcodeUrl: "https://leetcode.com/problems/customers-who-never-order/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/",
        statement: "Find all customers who registered before 2024 but have never placed any orders.",
        schema: `Customers (customer_id, name, signup_date)
Orders (order_id, customer_id, order_date, amount)`,
        solutionQuery: `SELECT c.customer_id, c.name
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL AND c.signup_date < '2024-01-01';`,
        explanation: "LEFT JOIN returns all customers. `o.order_id IS NULL` filters to those with no matching orders.",
        keyConcept: "LEFT JOIN & Exclusion Filter"
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
      },
      {
        id: "sql-j-3",
        title: "Department-wise Employee Count with Names",
        difficulty: "Medium",
        companies: ["Oracle", "IBM", "Cognizant"],
        leetcodeUrl: "https://leetcode.com/problems/department-highest-salary/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-inner-join/",
        statement: "List each department name along with the number of employees in it.",
        schema: `Departments (dept_id, dept_name)
Employees (emp_id, name, dept_id, salary)`,
        solutionQuery: `SELECT d.dept_name, COUNT(e.emp_id) AS employee_count
FROM Departments d
LEFT JOIN Employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_id, d.dept_name
ORDER BY employee_count DESC;`,
        explanation: "LEFT JOIN ensures departments with 0 employees still appear. `COUNT(e.emp_id)` counts non-NULL employee IDs per department.",
        keyConcept: "LEFT JOIN + GROUP BY"
      },
      {
        id: "sql-j-4",
        title: "Products with No Sales (Anti-Join)",
        difficulty: "Medium",
        companies: ["Flipkart", "Amazon", "Walmart"],
        leetcodeUrl: "https://leetcode.com/problems/product-sales-analysis-iii/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-except-clause/",
        statement: "Find all products that have never been sold (do not appear in the Sales table).",
        schema: `Products (product_id, product_name, price)
Sales (sale_id, product_id, sale_date, quantity)`,
        solutionQuery: `-- Method 1: LEFT JOIN Anti-join
SELECT p.product_id, p.product_name
FROM Products p
LEFT JOIN Sales s ON p.product_id = s.product_id
WHERE s.sale_id IS NULL;

-- Method 2: NOT EXISTS
SELECT product_id, product_name
FROM Products p
WHERE NOT EXISTS (
  SELECT 1 FROM Sales s WHERE s.product_id = p.product_id
);`,
        explanation: "Two equivalent anti-join patterns: LEFT JOIN + IS NULL, or NOT EXISTS correlated subquery.",
        keyConcept: "Anti-Join Pattern"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 4. AGGREGATION
  // ─────────────────────────────────────────────────────
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
        explanation: "`GROUP BY` aggregates per department. `HAVING` filters aggregated groups (while `WHERE` filters individual rows before grouping).",
        keyConcept: "GROUP BY vs HAVING"
      },
      {
        id: "sql-a-2",
        title: "Monthly Revenue Report",
        difficulty: "Medium",
        companies: ["Amazon", "Flipkart", "Paytm"],
        leetcodeUrl: "https://leetcode.com/problems/monthly-transactions-i/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-date-functions/",
        statement: "Calculate total revenue and order count for each month in 2024.",
        schema: `Orders (order_id, customer_id, order_date DATE, total_amount DECIMAL)`,
        solutionQuery: `SELECT
  YEAR(order_date) AS year,
  MONTH(order_date) AS month,
  COUNT(order_id) AS total_orders,
  SUM(total_amount) AS total_revenue
FROM Orders
WHERE YEAR(order_date) = 2024
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY month;`,
        explanation: "`YEAR()` and `MONTH()` extract date parts for grouping. Aggregating after grouping gives per-month stats.",
        keyConcept: "Date Functions + Aggregation"
      },
      {
        id: "sql-a-3",
        title: "Category-wise Maximum and Minimum Prices",
        difficulty: "Easy",
        companies: ["Flipkart", "Walmart", "Target"],
        leetcodeUrl: "https://leetcode.com/problems/biggest-single-number/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-aggregate-functions/",
        statement: "Find the maximum price, minimum price, and average price grouped by product category.",
        schema: `Products (product_id, name, category, price DECIMAL)`,
        solutionQuery: `SELECT
  category,
  MAX(price) AS max_price,
  MIN(price) AS min_price,
  ROUND(AVG(price), 2) AS avg_price,
  COUNT(*) AS total_products
FROM Products
GROUP BY category
ORDER BY avg_price DESC;`,
        explanation: "`MAX`, `MIN`, `AVG` are aggregate functions. `ROUND(AVG(...), 2)` limits decimal places. `GROUP BY category` segments the analysis.",
        keyConcept: "Aggregate Functions"
      },
      {
        id: "sql-a-4",
        title: "Customers with Repeat Orders",
        difficulty: "Medium",
        companies: ["Amazon", "Zomato", "Swiggy"],
        leetcodeUrl: "https://leetcode.com/problems/customer-who-visited-but-did-not-make-any-transactions/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-having-clause-with-examples/",
        statement: "Find all customers who have placed more than 3 orders, with their total spend.",
        schema: `Orders (order_id, customer_id, order_date, amount)`,
        solutionQuery: `SELECT
  customer_id,
  COUNT(order_id) AS order_count,
  SUM(amount) AS total_spent
FROM Orders
GROUP BY customer_id
HAVING COUNT(order_id) > 3
ORDER BY total_spent DESC;`,
        explanation: "HAVING filters after GROUP BY. Only customers with more than 3 orders are returned alongside their aggregated spend.",
        keyConcept: "HAVING Filter on Aggregates"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 5. SUBQUERIES
  // ─────────────────────────────────────────────────────
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
        statement: "Report the second highest distinct salary from the Employee table. Return NULL if fewer than 2 distinct salaries.",
        schema: `Employee (id INT, salary INT)`,
        solutionQuery: `SELECT (
  SELECT DISTINCT salary
  FROM Employee
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`,
        explanation: "Outer SELECT wrapping ensures NULL is returned when the subquery yields no result. `LIMIT 1 OFFSET 1` skips the highest and picks the second.",
        keyConcept: "Subquery with OFFSET"
      },
      {
        id: "sql-sq-2",
        title: "Employees Earning Above Department Average",
        difficulty: "Hard",
        companies: ["Google", "Amazon", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/employees-whose-manager-left-the-company/",
        gfgUrl: "https://www.geeksforgeeks.org/correlated-subquery-in-sql/",
        statement: "Find employees who earn more than the average salary of their own department.",
        schema: `Employees (emp_id, name, dept_id, salary)`,
        solutionQuery: `SELECT e.emp_id, e.name, e.dept_id, e.salary
FROM Employees e
WHERE e.salary > (
  SELECT AVG(salary)
  FROM Employees
  WHERE dept_id = e.dept_id
);`,
        explanation: "Correlated subquery: the inner query references `e.dept_id` from the outer query, re-evaluating once per row.",
        keyConcept: "Correlated Subquery"
      },
      {
        id: "sql-sq-3",
        title: "Products Ordered by All Customers",
        difficulty: "Hard",
        companies: ["Amazon", "Google", "Flipkart"],
        leetcodeUrl: "https://leetcode.com/problems/product-sales-analysis-i/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-exists/",
        statement: "Find products that have been ordered by every customer in the database.",
        schema: `Products (product_id, name)
Orders (order_id, customer_id, product_id)
Customers (customer_id, name)`,
        solutionQuery: `SELECT p.product_id, p.name
FROM Products p
WHERE NOT EXISTS (
  SELECT customer_id FROM Customers c
  WHERE NOT EXISTS (
    SELECT 1 FROM Orders o
    WHERE o.customer_id = c.customer_id
      AND o.product_id = p.product_id
  )
);`,
        explanation: "Double NOT EXISTS implements relational division: 'there is no customer who has NOT ordered this product'.",
        keyConcept: "Relational Division with NOT EXISTS"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 6. VIEWS
  // ─────────────────────────────────────────────────────
  {
    id: "sql-views",
    name: "Views",
    icon: "FaEye",
    description: "Creating, querying, updating, and dropping virtual tables (Views). Materialized vs Standard Views.",
    difficultySummary: "Intermediate",
    color: "from-cyan-600 to-sky-700",
    bgColor: "bg-cyan-50 border-cyan-200 text-cyan-800",
    problems: [
      {
        id: "sql-v-1",
        title: "Create High-Value Customer View",
        difficulty: "Medium",
        companies: ["Oracle", "IBM", "SAP"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-views/",
        statement: "Create a view `HighValueCustomers` showing customers who have spent more than $10,000 total, along with their total spend.",
        schema: `Customers (customer_id, name)
Orders (order_id, customer_id, amount)`,
        solutionQuery: `CREATE VIEW HighValueCustomers AS
SELECT
  c.customer_id,
  c.name,
  SUM(o.amount) AS total_spent
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
HAVING SUM(o.amount) > 10000;

-- Query the View
SELECT * FROM HighValueCustomers ORDER BY total_spent DESC;`,
        explanation: "A view is a stored SELECT query. It can be queried like a table but always reflects up-to-date data from underlying tables.",
        keyConcept: "CREATE VIEW"
      },
      {
        id: "sql-v-2",
        title: "Read-Only Summary View vs Updatable View",
        difficulty: "Medium",
        companies: ["Oracle", "IBM"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-views/",
        statement: "Explain via DDL when a view is updatable. Create an active employees updatable view and attempt an UPDATE through it.",
        schema: "DDL / DML View Concept Task",
        solutionQuery: `-- Simple updatable view (single table, no GROUP BY, no DISTINCT)
CREATE VIEW ActiveEmployees AS
SELECT emp_id, name, department, salary
FROM Employees
WHERE status = 'Active';

-- Update through view (valid: updates base table)
UPDATE ActiveEmployees
SET salary = salary * 1.1
WHERE department = 'Engineering';

-- Non-updatable view example (uses aggregation)
CREATE VIEW DeptAvgSalary AS
SELECT department, AVG(salary) AS avg_salary
FROM Employees GROUP BY department;
-- UPDATE on DeptAvgSalary would FAIL.`,
        explanation: "Updatable views must reference a single base table with no DISTINCT, GROUP BY, or aggregate functions. Updates propagate to base table.",
        keyConcept: "Updatable vs Non-Updatable Views"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 7. CTEs (Common Table Expressions)
  // ─────────────────────────────────────────────────────
  {
    id: "sql-ctes",
    name: "CTEs",
    icon: "FaLayerGroup",
    description: "WITH clause CTEs, Recursive CTEs for hierarchies, and CTE chaining for readable complex queries.",
    difficultySummary: "Intermediate to Advanced",
    color: "from-pink-600 to-rose-700",
    bgColor: "bg-pink-50 border-pink-200 text-pink-800",
    problems: [
      {
        id: "sql-cte-1",
        title: "Top Salary Earner per Department using CTE",
        difficulty: "Medium",
        companies: ["Google", "Microsoft", "Amazon"],
        leetcodeUrl: "https://leetcode.com/problems/department-top-three-salaries/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-with-clause/",
        statement: "Find the highest earning employee in each department using a CTE.",
        schema: `Employees (emp_id, name, dept_id, salary)
Departments (dept_id, dept_name)`,
        solutionQuery: `WITH DeptMaxSalary AS (
  SELECT dept_id, MAX(salary) AS max_salary
  FROM Employees
  GROUP BY dept_id
)
SELECT e.name, d.dept_name, e.salary
FROM Employees e
JOIN Departments d ON e.dept_id = d.dept_id
JOIN DeptMaxSalary dms ON e.dept_id = dms.dept_id AND e.salary = dms.max_salary
ORDER BY d.dept_name;`,
        explanation: "CTE `DeptMaxSalary` computes max salary per department. The main query joins employees matching their department max salary.",
        keyConcept: "CTE for Readable Multi-Step Queries"
      },
      {
        id: "sql-cte-2",
        title: "Recursive CTE: Employee Hierarchy Tree",
        difficulty: "Hard",
        companies: ["Oracle", "Microsoft", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/employees-whose-manager-left-the-company/",
        gfgUrl: "https://www.geeksforgeeks.org/recursive-cte-in-sql/",
        statement: "List all employees in the reporting hierarchy under a given manager (recursive chain).",
        schema: `Employees (emp_id, name, manager_id)`,
        solutionQuery: `WITH RECURSIVE OrgChart AS (
  -- Anchor: top-level manager (manager_id is NULL or root manager id=1)
  SELECT emp_id, name, manager_id, 1 AS depth
  FROM Employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive member: employees one level down
  SELECT e.emp_id, e.name, e.manager_id, oc.depth + 1
  FROM Employees e
  INNER JOIN OrgChart oc ON e.manager_id = oc.emp_id
)
SELECT emp_id, name, depth
FROM OrgChart
ORDER BY depth, name;`,
        explanation: "Recursive CTE: anchor defines base case (root manager). Recursive member joins to expand the tree one level at a time until no more rows are added.",
        keyConcept: "Recursive CTE for Hierarchical Data"
      },
      {
        id: "sql-cte-3",
        title: "CTE Chaining: Rolling 3-Month Revenue",
        difficulty: "Hard",
        companies: ["Amazon", "Google", "Flipkart"],
        leetcodeUrl: "https://leetcode.com/problems/monthly-transactions-i/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-with-clause/",
        statement: "Compute monthly revenue, then find months where revenue grew compared to the previous month.",
        schema: `Orders (order_id, order_date DATE, amount DECIMAL)`,
        solutionQuery: `WITH MonthlyRevenue AS (
  SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    SUM(amount) AS revenue
  FROM Orders
  GROUP BY DATE_FORMAT(order_date, '%Y-%m')
),
RevenueWithPrev AS (
  SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_revenue
  FROM MonthlyRevenue
)
SELECT month, revenue, prev_revenue,
  ROUND((revenue - prev_revenue) / prev_revenue * 100, 2) AS growth_pct
FROM RevenueWithPrev
WHERE prev_revenue IS NOT NULL AND revenue > prev_revenue;`,
        explanation: "CTE chaining: first CTE computes monthly totals, second CTE adds LAG() for previous month comparison. Main query filters growing months.",
        keyConcept: "CTE Chaining + Window Functions"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 8. WINDOW FUNCTIONS
  // ─────────────────────────────────────────────────────
  {
    id: "sql-window-functions",
    name: "Window Functions",
    icon: "FaChartBar",
    description: "ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, FIRST_VALUE, SUM OVER PARTITION, and frame clauses.",
    difficultySummary: "Advanced",
    color: "from-violet-600 to-fuchsia-700",
    bgColor: "bg-violet-50 border-violet-200 text-violet-800",
    problems: [
      {
        id: "sql-wf-1",
        title: "Rank Employees by Salary within Department",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Microsoft", "Oracle"],
        leetcodeUrl: "https://leetcode.com/problems/rank-scores/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-rank-function/",
        statement: "Rank employees by salary within each department. Use DENSE_RANK so tied salaries share the same rank.",
        schema: `Employees (emp_id, name, dept_id, salary)`,
        solutionQuery: `SELECT
  emp_id,
  name,
  dept_id,
  salary,
  DENSE_RANK() OVER (
    PARTITION BY dept_id
    ORDER BY salary DESC
  ) AS salary_rank
FROM Employees
ORDER BY dept_id, salary_rank;`,
        explanation: "`PARTITION BY dept_id` creates separate ranking within each department. `DENSE_RANK()` assigns same rank to equal salaries without gaps (vs RANK which leaves gaps).",
        keyConcept: "DENSE_RANK vs RANK vs ROW_NUMBER"
      },
      {
        id: "sql-wf-2",
        title: "Running Total of Sales (Cumulative SUM)",
        difficulty: "Medium",
        companies: ["Amazon", "Flipkart", "Paytm"],
        leetcodeUrl: "https://leetcode.com/problems/find-cumulative-salary-of-an-employee/",
        gfgUrl: "https://www.geeksforgeeks.org/window-functions-in-sql/",
        statement: "Calculate a running (cumulative) total of order amounts ordered by date per customer.",
        schema: `Orders (order_id, customer_id, order_date DATE, amount DECIMAL)`,
        solutionQuery: `SELECT
  order_id,
  customer_id,
  order_date,
  amount,
  SUM(amount) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM Orders
ORDER BY customer_id, order_date;`,
        explanation: "`SUM OVER` with `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` creates a cumulative sum frame within each customer's partition.",
        keyConcept: "Running Total with Frame Clause"
      },
      {
        id: "sql-wf-3",
        title: "Month-over-Month Growth using LAG",
        difficulty: "Hard",
        companies: ["Google", "Amazon", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/monthly-transactions-ii/",
        gfgUrl: "https://www.geeksforgeeks.org/lag-and-lead-function-in-sql/",
        statement: "Use LAG to find months where revenue declined compared to the previous month.",
        schema: `MonthlySales (month VARCHAR(7), revenue DECIMAL)`,
        solutionQuery: `SELECT
  month,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_revenue,
  revenue - LAG(revenue, 1) OVER (ORDER BY month) AS revenue_change,
  ROUND((revenue - LAG(revenue, 1) OVER (ORDER BY month)) /
        LAG(revenue, 1) OVER (ORDER BY month) * 100, 2) AS pct_change
FROM MonthlySales
ORDER BY month;`,
        explanation: "`LAG(revenue, 1)` accesses the previous row's revenue. Comparing current vs previous enables growth/decline analysis without a JOIN.",
        keyConcept: "LAG Window Function"
      },
      {
        id: "sql-wf-4",
        title: "Top N Records per Group (ROW_NUMBER Trick)",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/department-top-three-salaries/",
        gfgUrl: "https://www.geeksforgeeks.org/row_number-function-in-sql/",
        statement: "Return the top 3 highest earning employees per department.",
        schema: `Employees (emp_id, name, dept_id, salary)`,
        solutionQuery: `WITH RankedEmployees AS (
  SELECT
    emp_id, name, dept_id, salary,
    ROW_NUMBER() OVER (
      PARTITION BY dept_id
      ORDER BY salary DESC
    ) AS rn
  FROM Employees
)
SELECT emp_id, name, dept_id, salary
FROM RankedEmployees
WHERE rn <= 3
ORDER BY dept_id, salary DESC;`,
        explanation: "`ROW_NUMBER()` assigns unique sequential integers per partition. Filtering `WHERE rn <= 3` in outer query gets top 3 per department.",
        keyConcept: "Top-N per Group Pattern"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 9. TRANSACTIONS
  // ─────────────────────────────────────────────────────
  {
    id: "sql-transactions",
    name: "Transactions",
    icon: "FaExchangeAlt",
    description: "ACID properties, COMMIT, ROLLBACK, SAVEPOINT, isolation levels, and deadlock avoidance.",
    difficultySummary: "Advanced",
    color: "from-red-600 to-rose-700",
    bgColor: "bg-red-50 border-red-200 text-red-800",
    problems: [
      {
        id: "sql-t-1",
        title: "Bank Transfer with ROLLBACK on Failure",
        difficulty: "Medium",
        companies: ["Paytm", "PhonePe", "Goldman Sachs"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/sql-transactions/",
        statement: "Transfer $500 from Account A to Account B. Rollback the entire transaction if either update fails.",
        schema: `Accounts (account_id INT PK, holder_name VARCHAR, balance DECIMAL)`,
        solutionQuery: `START TRANSACTION;

-- Debit sender
UPDATE Accounts SET balance = balance - 500
WHERE account_id = 101 AND balance >= 500;

-- Check debit succeeded
SELECT ROW_COUNT(); -- Must be 1

-- Credit receiver
UPDATE Accounts SET balance = balance + 500
WHERE account_id = 202;

-- If all good: persist changes
COMMIT;

-- If any step failed: undo ALL changes
-- ROLLBACK;`,
        explanation: "Transaction wraps both UPDATEs atomically. `COMMIT` persists both, `ROLLBACK` undoes both — database remains consistent either way.",
        keyConcept: "Atomicity with COMMIT/ROLLBACK"
      },
      {
        id: "sql-t-2",
        title: "SAVEPOINT for Partial Rollback",
        difficulty: "Hard",
        companies: ["Oracle", "IBM", "SAP"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/savepoint-in-sql/",
        statement: "Insert an order header, set a SAVEPOINT, attempt order item inserts — rollback only the items if they fail.",
        schema: `Orders (order_id, customer_id, order_date)
OrderItems (item_id, order_id, product_id, quantity, price)`,
        solutionQuery: `START TRANSACTION;

INSERT INTO Orders VALUES (5001, 101, NOW());

SAVEPOINT order_header_saved;

INSERT INTO OrderItems VALUES (1, 5001, 301, 2, 150.00);
INSERT INTO OrderItems VALUES (2, 5001, 302, 1, 299.99);

-- If items failed:
-- ROLLBACK TO SAVEPOINT order_header_saved;
-- Only order items are undone; order header preserved.

-- If all succeeded:
COMMIT;`,
        explanation: "`SAVEPOINT` creates a named point within a transaction. `ROLLBACK TO SAVEPOINT` partially undoes to that checkpoint without cancelling the entire transaction.",
        keyConcept: "SAVEPOINT & Partial Rollback"
      },
      {
        id: "sql-t-3",
        title: "Transaction Isolation Levels",
        difficulty: "Hard",
        companies: ["Oracle", "Google", "Amazon"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/",
        statement: "Demonstrate the difference between READ COMMITTED and REPEATABLE READ isolation levels for preventing dirty and phantom reads.",
        schema: "Concept + DDL Demonstration",
        solutionQuery: `-- Set isolation level for session
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- Prevents dirty reads. Allows non-repeatable reads & phantom reads.

SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- Prevents dirty reads + non-repeatable reads. May allow phantom reads.

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Fully ACID compliant. Prevents all read anomalies. Lowest concurrency.

-- Example: Check current isolation level
SELECT @@transaction_isolation;

-- Example Usage in Java (JDBC):
-- connection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);`,
        explanation: "Isolation levels trade consistency for concurrency: READ UNCOMMITTED -> READ COMMITTED -> REPEATABLE READ -> SERIALIZABLE (ascending strictness).",
        keyConcept: "Isolation Levels Tradeoffs"
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 10. NORMALIZATION
  // ─────────────────────────────────────────────────────
  {
    id: "sql-normalization",
    name: "Normalization",
    icon: "FaCompressArrowsAlt",
    description: "1NF, 2NF, 3NF, BCNF decomposition, functional dependencies, and denormalization trade-offs.",
    difficultySummary: "Intermediate to Advanced",
    color: "from-teal-600 to-green-700",
    bgColor: "bg-teal-50 border-teal-200 text-teal-800",
    problems: [
      {
        id: "sql-n-1",
        title: "Decompose Unnormalized Order Sheet to 3NF",
        difficulty: "Hard",
        companies: ["Oracle", "Microsoft", "Accenture"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/normalization-in-dbms/",
        statement: "Explain functional dependencies in an unnormalized spreadsheet and write DDL normalizing it into 3NF.",
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
      },
      {
        id: "sql-n-2",
        title: "Identify BCNF Violations and Decompose",
        difficulty: "Hard",
        companies: ["Oracle", "Google", "IBM"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/boyce-codd-normal-form-bcnf/",
        statement: "Given relation R(Student, Course, Teacher) where each Teacher teaches only one Course, identify BCNF violation and decompose.",
        schema: `R (Student, Course, Teacher)\nFDs: (Student, Course) -> Teacher, Teacher -> Course`,
        solutionQuery: `-- BCNF Violation: Teacher -> Course, but Teacher is NOT a superkey.
-- Decomposition into BCNF:

-- Table 1: TeacherCourse (lossless, dependency preserving)
CREATE TABLE TeacherCourse (
  teacher_id VARCHAR(50) PRIMARY KEY,
  teacher_name VARCHAR(100),
  course_name VARCHAR(100)
);

-- Table 2: StudentTeacher
CREATE TABLE StudentTeacher (
  student_id INT,
  teacher_id VARCHAR(50),
  PRIMARY KEY (student_id, teacher_id),
  FOREIGN KEY (teacher_id) REFERENCES TeacherCourse(teacher_id)
);

-- Verify: No non-trivial FD X->Y where X is NOT a superkey in either table.`,
        explanation: "BCNF requires every non-trivial FD X->Y must have X as a superkey. Decompose by splitting out the FD that violates this (Teacher->Course).",
        keyConcept: "BCNF Decomposition"
      },
      {
        id: "sql-n-3",
        title: "Denormalization for Read Performance",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Netflix"],
        leetcodeUrl: "https://leetcode.com/studyplan/top-sql-50/",
        gfgUrl: "https://www.geeksforgeeks.org/denormalization-in-databases/",
        statement: "Explain with DDL when and how to denormalize a Product-Category-Seller schema for read-heavy analytics.",
        schema: `Products (product_id, name, category_id, seller_id)\nCategories (category_id, name)\nSellers (seller_id, name, rating)`,
        solutionQuery: `-- NORMALIZED (3NF): Requires JOIN for category/seller info
SELECT p.name, c.name AS category, s.name AS seller, s.rating
FROM Products p
JOIN Categories c ON p.category_id = c.category_id
JOIN Sellers s ON p.seller_id = s.seller_id;

-- DENORMALIZED (for Analytics / Data Warehouse):
CREATE TABLE ProductsFlat (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(200),
  category_name VARCHAR(100),  -- Duplicated from Categories
  seller_name VARCHAR(100),    -- Duplicated from Sellers
  seller_rating DECIMAL(3,2),  -- Duplicated from Sellers
  price DECIMAL(10,2)
);

-- Benefit: Single table scan, no JOINs needed for read queries.
-- Cost: Data redundancy, harder UPDATEs (must update seller_name in all rows).`,
        explanation: "Denormalization trades storage and write complexity for read performance. Used in OLAP/data warehouses where queries need to be extremely fast and writes are infrequent.",
        keyConcept: "Normalization vs Denormalization Tradeoffs"
      }
    ]
  }
];
