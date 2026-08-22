/**
 * CS Fundamentals Data: DBMS, Computer Networks, OOPs, System Design
 * Contains embedded GFG (GeeksforGeeks) links, core concepts, interview Q&As, and code examples.
 */

export const CS_FUNDAMENTALS_CATEGORIES = [
  {
    id: "dbms",
    name: "Database Management Systems (DBMS)",
    shortName: "DBMS",
    icon: "FaDatabase",
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-50 border-blue-200 text-blue-800",
    description: "Master Relational Databases, SQL vs NoSQL, Normalization, ACID Properties, Indexing, and Concurrency Control.",
    gfgHubUrl: "https://www.geeksforgeeks.org/dbms/",
    topics: [
      {
        id: "dbms-acid",
        title: "ACID Properties & Transaction Management",
        gfgUrl: "https://www.geeksforgeeks.org/acid-properties-in-dbms/",
        summary: "Atomicity, Consistency, Isolation, and Durability ensure reliable processing of database transactions.",
        keyConcepts: [
          "Atomicity: 'All or nothing' execution of transaction steps.",
          "Consistency: Database transitions from one valid state to another.",
          "Isolation: Concurrent execution of transactions yields same state as serial execution.",
          "Durability: Committed changes persist even in system failures."
        ],
        interviewQAs: [
          {
            q: "What is dirty read in transaction isolation?",
            a: "A dirty read occurs when a transaction reads data that has been modified by another concurrent transaction but has not yet been committed."
          },
          {
            q: "Explain phantom reads vs non-repeatable reads.",
            a: "Non-repeatable read happens when re-reading a row yields updated data. Phantom read happens when re-executing a query returns new matching rows inserted by another transaction."
          }
        ],
        codeSnippet: `-- Transaction Example with Lock / Savepoint
BEGIN TRANSACTION;
  UPDATE Accounts SET balance = balance - 500 WHERE account_id = 101;
  UPDATE Accounts SET balance = balance + 500 WHERE account_id = 202;
COMMIT;`
      },
      {
        id: "dbms-normalization",
        title: "Database Normalization (1NF, 2NF, 3NF, BCNF)",
        gfgUrl: "https://www.geeksforgeeks.org/normalization-in-dbms/",
        summary: "Process of structuring a relational database to reduce data redundancy and improve data integrity.",
        keyConcepts: [
          "1NF: Atomic values only, unique column names, no repeating groups.",
          "2NF: In 1NF and no partial dependency (non-prime attributes depend on whole candidate key).",
          "3NF: In 2NF and no transitive dependency.",
          "BCNF: Boyce-Codd Normal Form: For every FD X -> Y, X must be a super key."
        ],
        interviewQAs: [
          {
            q: "When would you intentionally denormalize a database?",
            a: "Denormalization is used in read-heavy data warehouses and analytics to eliminate expensive JOIN operations and speed up queries."
          }
        ],
        codeSnippet: `-- Denormalized Order Table vs Normalized Customer/Order tables
-- 3NF: Customer details separated from Orders
CREATE TABLE Customers (customer_id INT PRIMARY KEY, name VARCHAR(100));
CREATE TABLE Orders (order_id INT PRIMARY KEY, customer_id INT FOREIGN KEY REFERENCES Customers(customer_id));`
      },
      {
        id: "dbms-indexing",
        title: "Indexing & B/B+ Trees",
        gfgUrl: "https://www.geeksforgeeks.org/indexing-in-databases-set-1/",
        summary: "Data structures used to rapidly locate and access data without scanning every row in a database table.",
        keyConcepts: [
          "Clustered Index: Dictates the physical order of data on disk (only 1 per table).",
          "Non-Clustered Index: Separate structure holding pointer to data row.",
          "B+ Tree: All keys exist at leaf node level; leaf nodes linked for fast range queries."
        ],
        interviewQAs: [
          {
            q: "Why do databases prefer B+ trees over Binary Search Trees for indexing?",
            a: "B+ trees have a high fan-out factor, reducing tree height and requiring far fewer disk I/O operations."
          }
        ],
        codeSnippet: `CREATE INDEX idx_user_email ON Users(email);
CREATE UNIQUE INDEX idx_emp_code ON Employees(emp_code);`
      },
      {
        id: "dbms-nosql",
        title: "SQL vs NoSQL Databases",
        gfgUrl: "https://www.geeksforgeeks.org/difference-between-sql-and-nosql/",
        summary: "Comparing structured relational schemas (PostgreSQL, MySQL) against document/key-value/graph stores (MongoDB, Redis, Cassandra).",
        keyConcepts: [
          "Relational (SQL): ACID compliant, tabular, fixed schema, vertical scaling.",
          "NoSQL Document (MongoDB): JSON/BSON documents, dynamic schema, horizontal scaling.",
          "Key-Value (Redis): In-memory caching, sub-millisecond lookups."
        ],
        interviewQAs: [
          {
            q: "How does MongoDB achieve horizontal scalability?",
            a: "MongoDB uses sharding to distribute data across multiple physical servers based on a shard key."
          }
        ],
        codeSnippet: `// MongoDB Document representation
{
  "_id": ObjectId("60d5ec49f1a2c81234567890"),
  "user": "Alice",
  "skills": ["React", "Node", "Python"]
}`
      }
    ]
  },
  {
    id: "cn",
    name: "Computer Networks (CN)",
    shortName: "Computer Networks",
    icon: "FaNetworkWired",
    color: "from-indigo-600 to-purple-600",
    bgColor: "bg-indigo-50 border-indigo-200 text-indigo-800",
    description: "Understand OSI & TCP/IP models, IP Subnetting, TCP 3-Way Handshake, HTTP/S protocols, DNS, and Socket Communication.",
    gfgHubUrl: "https://www.geeksforgeeks.org/computer-network-tutorials/",
    topics: [
      {
        id: "cn-osi-tcpip",
        title: "OSI Model vs TCP/IP Protocol Suite",
        gfgUrl: "https://www.geeksforgeeks.org/layers-of-osi-model/",
        summary: "Conceptual frameworks defining data communication across network layers.",
        keyConcepts: [
          "OSI 7 Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
          "TCP/IP 4 Layers: Network Access, Internet, Transport, Application.",
          "Encapsulation: Data -> Segment (Transport) -> Packet (Network) -> Frame (Data Link) -> Bits (Physical)."
        ],
        interviewQAs: [
          {
            q: "At which OSI layer do Routers and Switches operate?",
            a: "Routers operate at Layer 3 (Network Layer) using IP addresses. Switches operate primarily at Layer 2 (Data Link Layer) using MAC addresses."
          }
        ],
        codeSnippet: `# Ping utility checking Layer 3 connectivity
ping -c 4 8.8.8.8

# Traceroute tracing hop path across network routers
traceroute google.com`
      },
      {
        id: "cn-tcp-udp",
        title: "TCP 3-Way Handshake & TCP vs UDP",
        gfgUrl: "https://www.geeksforgeeks.org/tcp-3-way-handshake-process/",
        summary: "Transmission Control Protocol (connection-oriented, reliable) vs User Datagram Protocol (connectionless, fast).",
        keyConcepts: [
          "3-Way Handshake: SYN -> SYN-ACK -> ACK.",
          "TCP Features: Flow control (sliding window), Congestion control, Sequence numbers.",
          "UDP Features: Low latency, no handshakes, ideal for streaming & multiplayer gaming."
        ],
        interviewQAs: [
          {
            q: "How does TCP guarantee ordered delivery of packets?",
            a: "Each TCP packet includes a sequence number. The receiver reassembles packets in order and sends ACKs back to the sender."
          }
        ],
        codeSnippet: `// Node.js TCP Socket Creation
const net = require('net');
const client = net.createConnection({ port: 8080, host: '127.0.0.1' }, () => {
  console.log('Connected via TCP 3-Way Handshake!');
});`
      },
      {
        id: "cn-http-https",
        title: "HTTP, HTTPS & TLS/SSL Handshake",
        gfgUrl: "https://www.geeksforgeeks.org/http-vs-https-for-beginners/",
        summary: "Web protocol standards for secure data transfer between client and server.",
        keyConcepts: [
          "HTTP Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS.",
          "HTTPS Encryption: Uses TLS/SSL with asymmetric key exchange and symmetric data encryption.",
          "Status Codes: 2xx (Success), 3xx (Redirection), 4xx (Client Error), 5xx (Server Error)."
        ],
        interviewQAs: [
          {
            q: "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?",
            a: "HTTP/1.1 uses persistent connections. HTTP/2 introduces multiplexing over a single TCP stream. HTTP/3 uses QUIC protocol over UDP to solve head-of-line blocking."
          }
        ],
        codeSnippet: `// HTTP GET Request Header example
GET /api/v1/users HTTP/1.1
Host: api.prepforge.com
Authorization: Bearer <JWT_TOKEN>
Accept: application/json`
      },
      {
        id: "cn-dns-routing",
        title: "DNS Resolution Process & IP Addressing",
        gfgUrl: "https://www.geeksforgeeks.org/dns-domain-name-server/",
        summary: "Translating human-friendly domain names (e.g. google.com) into IP addresses (e.g. 142.250.190.46).",
        keyConcepts: [
          "DNS Hierarchy: Root Server -> TLD (.com) -> Authoritative Nameserver.",
          "IPv4 vs IPv6: 32-bit (4.3 Billion addresses) vs 128-bit.",
          "Subnetting: CIDR notation (/24 = 255.255.255.0)."
        ],
        interviewQAs: [
          {
            q: "What happens when you type a URL into your browser?",
            a: "1. Browser checks local cache -> 2. OS DNS Resolver query -> 3. TCP Handshake -> 4. TLS Handshake -> 5. HTTP GET Request -> 6. Server Response rendering."
          }
        ],
        codeSnippet: `# Lookup DNS records using nslookup
nslookup prepforge.com`
      }
    ]
  },
  {
    id: "oops",
    name: "Object Oriented Programming (OOPs)",
    shortName: "OOPs",
    icon: "FaCode",
    color: "from-emerald-600 to-teal-600",
    bgColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description: "Master the 4 Pillars of OOPs, Inheritance, Polymorphism, Access Modifiers, SOLID Principles, and Vtables.",
    gfgHubUrl: "https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/",
    topics: [
      {
        id: "oops-4-pillars",
        title: "The 4 Pillars of Object-Oriented Programming",
        gfgUrl: "https://www.geeksforgeeks.org/four-main-object-oriented-programming-concepts-in-java/",
        summary: "Core structural foundation of object-oriented design.",
        keyConcepts: [
          "Encapsulation: Bundling data and functions together into a class; restricting direct access using private/protected specifiers.",
          "Abstraction: Hiding complex implementation details and showing only necessary features (Abstract classes, Interfaces).",
          "Inheritance: Mechanism where a child class acquires properties and behavior of parent class.",
          "Polymorphism: Ability of an object to take many forms (Compile-time Method Overloading & Runtime Method Overriding)."
        ],
        interviewQAs: [
          {
            q: "What is the difference between Abstract Class and Interface?",
            a: "Abstract class can have state (member variables) and implementation code. Interfaces define pure method contracts (till Java 8 default methods)."
          }
        ],
        codeSnippet: `// C++ Polymorphism & Inheritance example
class Animal {
public:
    virtual void makeSound() { cout << "Generic Sound" << endl; }
};

class Dog : public Animal {
public:
    void makeSound() override { cout << "Bark Bark!" << endl; }
};`
      },
      {
        id: "oops-solid",
        title: "SOLID Principles of Object-Oriented Design",
        gfgUrl: "https://www.geeksforgeeks.org/solid-principles-example-java/",
        summary: "Five design principles for writing maintainable, readable, and expandable software.",
        keyConcepts: [
          "S - Single Responsibility: A class should have only one reason to change.",
          "O - Open/Closed: Software entities should be open for extension, but closed for modification.",
          "L - Liskov Substitution: Derived classes must be substitutable for their base classes.",
          "I - Interface Segregation: Clients shouldn't be forced to depend on methods they don't use.",
          "D - Dependency Inversion: Depend on abstractions, not concrete implementations."
        ],
        interviewQAs: [
          {
            q: "How does Dependency Inversion (DIP) aid unit testing?",
            a: "DIP allows passing mock objects or interfaces into classes via Constructor Injection instead of hardcoding database/API dependencies."
          }
        ],
        codeSnippet: `// Python Single Responsibility Principle
class User:
    def __init__(self, name: str):
        self.name = name

class UserRepository:
    def save(self, user: User):
        # Dedicated DB save logic
        pass`
      },
      {
        id: "oops-vtables",
        title: "Virtual Functions & Vtable Mechanism",
        gfgUrl: "https://www.geeksforgeeks.org/vtable-and-vptr-in-cpp/",
        summary: "Internal implementation mechanism of dynamic polymorphism in C++.",
        keyConcepts: [
          "Vtable (Virtual Table): Static lookup table of function pointers created for classes with virtual functions.",
          "Vptr (Virtual Pointer): Hidden pointer injected into object instances pointing to class Vtable.",
          "Dynamic Dispatch: Function call resolved at runtime by looking up Vptr -> Vtable."
        ],
        interviewQAs: [
          {
            q: "Can a constructor be virtual in C++?",
            a: "No, constructors cannot be virtual because the object and its vptr are not fully initialized until constructor execution completes."
          }
        ],
        codeSnippet: `// C++ Virtual Destructor
class Base {
public:
    virtual ~Base() { cout << "Base Destroyed\\n"; }
};
class Derived : public Base {
public:
    ~Derived() { cout << "Derived Destroyed\\n"; }
};`
      }
    ]
  },
  {
    id: "system-design",
    name: "System Design (HLD & LLD)",
    shortName: "System Design",
    icon: "FaSitemap",
    color: "from-amber-600 to-orange-600",
    bgColor: "bg-amber-50 border-amber-200 text-amber-800",
    description: "Learn High-Level Design (Load Balancers, Caching, DB Sharding, Kafka, CAP Theorem) & Low-Level Design Patterns.",
    gfgHubUrl: "https://www.geeksforgeeks.org/system-design-tutorial/",
    topics: [
      {
        id: "sd-hld-basics",
        title: "High Level Design: Caching, Load Balancing & CAP Theorem",
        gfgUrl: "https://www.geeksforgeeks.org/system-design-load-balancing/",
        summary: "Building scalable, distributed systems capable of handling millions of concurrent users.",
        keyConcepts: [
          "Load Balancer: Distributes traffic across backend instances (Round Robin, Least Connections, Consistent Hashing).",
          "Caching: In-memory store (Redis, Memcached) with eviction policies (LRU, LFU, FIFO).",
          "CAP Theorem: In distributed systems under network Partition, pick Consistency OR Availability.",
          "DB Scaling: Vertical (scale up CPU/RAM) vs Horizontal (Sharding, Primary-Replica read replicas)."
        ],
        interviewQAs: [
          {
            q: "How does Consistent Hashing minimize data movement when scaling cache clusters?",
            a: "Consistent hashing maps both servers and keys onto a virtual ring. When a server is added or removed, only k/n keys are remapped on average."
          }
        ],
        codeSnippet: `# Redis LRU Cache Configuration snippet
maxmemory 2gb
maxmemory-policy allkeys-lru`
      },
      {
        id: "sd-lld-patterns",
        title: "Low Level Design: Classic Design Patterns",
        gfgUrl: "https://www.geeksforgeeks.org/software-design-patterns/",
        summary: "Reusable solutions to common software architecture problems.",
        keyConcepts: [
          "Creational: Singleton (single instance), Factory (object creation delegation), Builder.",
          "Structural: Adapter, Decorator (dynamic feature wrapping), Proxy.",
          "Behavioral: Observer (pub/sub events), Strategy (interchangeable algorithms)."
        ],
        interviewQAs: [
          {
            q: "Explain Thread-Safe Singleton implementation in Java/C++.",
            a: "Thread safety is achieved using Double-Checked Locking with volatile keyword or C++ local static variable initialization (Meyer's Singleton)."
          }
        ],
        codeSnippet: `// Singleton Pattern in C++ (Meyer's Singleton)
class Logger {
public:
    static Logger& getInstance() {
        static Logger instance; // Thread-safe in C++11
        return instance;
    }
    void log(string msg) { cout << "[LOG]: " << msg << endl; }
private:
    Logger() {} // Private Constructor
};`
      }
    ]
  }
];
