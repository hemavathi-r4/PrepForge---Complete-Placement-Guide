/**
 * Company Wise DSA Data: Curated problems for top technical recruiters.
 * Features embedded GeeksforGeeks (GFG) & LeetCode links, problem statements, solutions, and complexity analysis.
 */

export const COMPANY_DSA_LIST = [
  {
    id: "google",
    name: "Google",
    tier: "MAANG / FAANG",
    logoColor: "from-red-500 via-yellow-500 to-green-500",
    description: "Focuses heavily on Graphs, Dynamic Programming, Trees, Advanced Data Structures, and Clean Code.",
    totalQuestions: 28,
    difficultyBreakdown: { easy: 5, medium: 15, hard: 8 },
    problems: [
      {
        id: "goog-1",
        title: "Word Ladder",
        topic: "Graph / BFS",
        difficulty: "Hard",
        frequency: "High (Asked 42+ times)",
        leetcodeUrl: "https://leetcode.com/problems/word-ladder/",
        gfgUrl: "https://www.geeksforgeeks.org/word-ladder-length-of-shortest-chain-to-reach-a-target-word/",
        statement: "Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord.",
        approach: "Use Breadth-First Search (BFS) starting from beginWord. For each character, try changing it to 'a'-'z' and check if the resulting word exists in the dictionary.",
        complexity: { time: "O(M^2 * N)", space: "O(M * N)" },
        code: {
          cpp: `int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> st(wordList.begin(), wordList.end());
    if(!st.count(endWord)) return 0;
    queue<pair<string, int>> q;
    q.push({beginWord, 1});
    while(!q.empty()) {
        auto [word, len] = q.front(); q.pop();
        if(word == endWord) return len;
        for(int i = 0; i < word.size(); i++) {
            char orig = word[i];
            for(char c = 'a'; c <= 'z'; c++) {
                word[i] = c;
                if(st.count(word)) {
                    st.erase(word);
                    q.push({word, len + 1});
                }
            }
            word[i] = orig;
        }
    }
    return 0;
}`,
          python: `from collections import deque

def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    words = set(wordList)
    if endWord not in words: return 0
    queue = deque([(beginWord, 1)])
    while queue:
        word, length = queue.popleft()
        if word == endWord: return length
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                nxt = word[:i] + c + word[i+1:]
                if nxt in words:
                    words.remove(nxt)
                    queue.append((nxt, length + 1))
    return 0`
        }
      },
      {
        id: "goog-2",
        title: "LRU Cache Implementation",
        topic: "Design / Doubly Linked List",
        difficulty: "Medium",
        frequency: "Very High",
        leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
        gfgUrl: "https://www.geeksforgeeks.org/lru-cache-implementation/",
        statement: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.",
        approach: "Combine a Hash Map (for O(1) key lookups) with a Doubly Linked List (for O(1) node removal and moving most recently used nodes to head).",
        complexity: { time: "O(1) average for both get & put", space: "O(Capacity)" },
        code: {
          cpp: `class LRUCache {
    int cap;
    list<pair<int, int>> dll;
    unordered_map<int, list<pair<int, int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if(!mp.count(key)) return -1;
        dll.splice(dll.begin(), dll, mp[key]);
        return mp[key]->second;
    }
    void put(int key, int value) {
        if(mp.count(key)) {
            mp[key]->second = value;
            dll.splice(dll.begin(), dll, mp[key]);
            return;
        }
        if(dll.size() == cap) {
            mp.erase(dll.back().first);
            dll.pop_back();
        }
        dll.push_front({key, value});
        mp[key] = dll.begin();
    }
};`,
          python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)`
        }
      }
    ]
  },
  {
    id: "amazon",
    name: "Amazon",
    tier: "MAANG / Product",
    logoColor: "from-amber-500 to-yellow-600",
    description: "Emphasizes Trees, Priority Queue (Heaps), Slinding Window, Strings, and Leadership Principles in SDE-1 rounds.",
    totalQuestions: 35,
    difficultyBreakdown: { easy: 10, medium: 20, hard: 5 },
    problems: [
      {
        id: "amzn-1",
        title: "Top K Frequent Elements",
        topic: "Heap / Priority Queue",
        difficulty: "Medium",
        frequency: "High (Asked 50+ times)",
        leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
        gfgUrl: "https://www.geeksforgeeks.org/find-k-numbers-occurrences-given-array/",
        statement: "Given an integer array nums and an integer k, return the k most frequent elements in any order.",
        approach: "Build a frequency hash map, then push pairs into a Min-Heap of size K (or Bucket Sort for O(N) time).",
        complexity: { time: "O(N log K)", space: "O(N)" },
        code: {
          cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for(int x : nums) freq[x]++;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    for(auto& p : freq) {
        pq.push({p.second, p.first});
        if(pq.size() > k) pq.pop();
    }
    vector<int> res;
    while(!pq.empty()) { res.push_back(pq.top().second); pq.pop(); }
    return res;
}`,
          python: `import heapq
from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    return [item for item, freq in count.most_common(k)]`
        }
      },
      {
        id: "amzn-2",
        title: "Course Schedule (Cycle in Directed Graph)",
        topic: "Graph / Topological Sort",
        difficulty: "Medium",
        frequency: "Very High",
        leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
        gfgUrl: "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/",
        statement: "There are a total of numCourses courses. Return true if you can finish all courses given prerequisite pairs.",
        approach: "Use Kahn's Algorithm (BFS topological sort using In-degrees) or DFS with visited state array (0: unvisited, 1: visiting, 2: visited).",
        complexity: { time: "O(V + E)", space: "O(V + E)" },
        code: {
          cpp: `bool canFinish(int n, vector<vector<int>>& prereq) {
    vector<vector<int>> adj(n);
    vector<int> indegree(n, 0);
    for(auto& p : prereq) {
        adj[p[1]].push_back(p[0]);
        indegree[p[0]]++;
    }
    queue<int> q;
    for(int i = 0; i < n; i++) if(indegree[i] == 0) q.push(i);
    int count = 0;
    while(!q.empty()) {
        int u = q.front(); q.pop();
        count++;
        for(int v : adj[u]) {
            if(--indegree[v] == 0) q.push(v);
        }
    }
    return count == n;
}`,
          python: `from collections import deque

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1
    q = deque([i for i in range(numCourses) if indegree[i] == 0])
    visited = 0
    while q:
        node = q.popleft()
        visited += 1
        for nxt in adj[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)
    return visited == numCourses`
        }
      }
    ]
  },
  {
    id: "microsoft",
    name: "Microsoft",
    tier: "MAANG / Product",
    logoColor: "from-blue-600 to-teal-500",
    description: "Focuses on Binary Trees, Linked Lists, Arrays, Dynamic Programming, and System Corner Cases.",
    totalQuestions: 30,
    difficultyBreakdown: { easy: 8, medium: 18, hard: 4 },
    problems: [
      {
        id: "msft-1",
        title: "Serialize and Deserialize Binary Tree",
        topic: "Trees / BFS",
        difficulty: "Hard",
        frequency: "High",
        leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/serialize-deserialization-binary-tree/",
        statement: "Design an algorithm to serialize a binary tree to a string and deserialize a string back to a binary tree.",
        approach: "Use Level-Order traversal (BFS) using comma-separated strings and 'null' markers for missing children.",
        complexity: { time: "O(N)", space: "O(N)" },
        code: {
          cpp: `// BFS Level Order Serialization
string serialize(TreeNode* root) {
    if(!root) return "#";
    string s = "";
    queue<TreeNode*> q;
    q.push(root);
    while(!q.empty()) {
        TreeNode* curr = q.front(); q.pop();
        if(curr) {
            s += to_string(curr->val) + ",";
            q.push(curr->left);
            q.push(curr->right);
        } else {
            s += "#,";
        }
    }
    return s;
}`,
          python: `def serialize(root):
    if not root: return "#"
    res, q = [], [root]
    for node in q:
        if node:
            res.append(str(node.val))
            q.extend([node.left, node.right])
        else:
            res.append("#")
    return ",".join(res)`
        }
      }
    ]
  },
  {
    id: "tcs",
    name: "TCS (Ninja & Digital)",
    tier: "Service / High Volume",
    logoColor: "from-purple-600 to-indigo-600",
    description: "Covers Numbers, Strings, Basic Array Manipulations, Matrix Operations, and Speed Coding in TCS NQT.",
    totalQuestions: 25,
    difficultyBreakdown: { easy: 15, medium: 10, hard: 0 },
    problems: [
      {
        id: "tcs-1",
        title: "Smallest and Second Smallest Element in Array",
        topic: "Arrays",
        difficulty: "Easy",
        frequency: "Very High in NQT",
        leetcodeUrl: "https://leetcode.com/problems/third-maximum-number/",
        gfgUrl: "https://www.geeksforgeeks.org/to-find-smallest-and-second-smallest-element-in-an-array/",
        statement: "Write a program to find the smallest and second smallest elements in a given array of integers.",
        approach: "Traverse the array once while updating first_min and second_min variables.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `pair<int, int> getTwoSmallest(vector<int>& arr) {
    int first = INT_MAX, second = INT_MAX;
    for(int x : arr) {
        if(x < first) {
            second = first;
            first = x;
        } else if(x < second && x != first) {
            second = x;
        }
    }
    return {first, second};
}`,
          python: `def getTwoSmallest(arr: list[int]) -> tuple[int, int]:
    first = second = float('inf')
    for x in arr:
        if x < first:
            second, first = first, x
        elif x < second and x != first:
            second = x
    return (first, second)`
        }
      }
    ]
  },
  {
    id: "infosys",
    name: "Infosys (DSE & HackWithInfy)",
    tier: "Service & Specialist",
    logoColor: "from-blue-700 to-sky-500",
    description: "HackWithInfy and DSE coding rounds focus on Greedy Algorithms, Dynamic Programming, and Bitwise operations.",
    totalQuestions: 22,
    difficultyBreakdown: { easy: 6, medium: 12, hard: 4 },
    problems: [
      {
        id: "infy-1",
        title: "Maximum Subarray Sum (Kadane's Variant)",
        topic: "Arrays / Dynamic Programming",
        difficulty: "Medium",
        frequency: "High in HackWithInfy",
        leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
        gfgUrl: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/",
        statement: "Find the contiguous subarray with maximum sum and output both the sum and subarray indices.",
        approach: "Use Kadane's Algorithm while updating start and end pointers whenever max_ending_here drops below zero.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int maxSubarray(vector<int>& nums) {
    int maxSoFar = nums[0], curr = 0;
    for(int x : nums) {
        curr += x;
        maxSoFar = max(maxSoFar, curr);
        if(curr < 0) curr = 0;
    }
    return maxSoFar;
}`,
          python: `def maxSubarray(nums: list[int]) -> int:
    max_so_far, curr = nums[0], 0
    for x in nums:
        curr += x
        max_so_far = max(max_so_far, curr)
        if curr < 0: curr = 0
    return max_so_far`
        }
      }
    ]
  }
];
