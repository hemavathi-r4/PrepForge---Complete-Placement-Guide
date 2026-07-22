/**
 * Comprehensive DSA Sheet Data covering all 13 required topics:
 * 1. Arrays
 * 2. Strings
 * 3. Searching & Sorting
 * 4. Linked List
 * 5. Stack
 * 6. Queue
 * 7. Trees
 * 8. Graph
 * 9. Greedy
 * 10. Dynamic Programming
 * 11. Sliding Window
 * 12. Backtracking
 * 13. Bit Manipulation
 */

export const DSA_TOPICS = [
  {
    id: "arrays",
    name: "Arrays",
    icon: "FaLayerGroup",
    description: "Fundamental contiguous memory operations, two-pointers, prefix sums, and array transformations.",
    difficultySummary: "Beginner to Advanced",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 border-blue-200 text-blue-700",
    problems: [
      {
        id: "dsa-arr-1",
        title: "Two Sum",
        difficulty: "Easy",
        companies: ["Google", "Amazon", "Meta", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/two-sum/",
        gfgUrl: "https://www.geeksforgeeks.org/check-if-pair-with-given-sum-exists-in-array/",
        statement: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        approach: "Use a Hash Map to store values and their indices. For each element `x`, check if `target - x` exists in the map.",
        complexity: { time: "O(N)", space: "O(N)" },
        code: {
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for(int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if(mp.count(complement)) return {mp[complement], i};
        mp[nums[i]] = i;
    }
    return {};
}`,
          python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`
        }
      },
      {
        id: "dsa-arr-2",
        title: "Kadane's Algorithm (Maximum Subarray)",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Uber", "Adobe"],
        leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
        gfgUrl: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/",
        statement: "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        approach: "Maintain a running `current_sum`. If `current_sum < 0`, reset it to 0. Continuously track maximum sum encountered.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0], maxEndingHere = 0;
    for(int x : nums) {
        maxEndingHere += x;
        maxSoFar = max(maxSoFar, maxEndingHere);
        if(maxEndingHere < 0) maxEndingHere = 0;
    }
    return maxSoFar;
}`,
          python: `def maxSubArray(nums: list[int]) -> int:
    max_so_far = nums[0]
    curr_sum = 0
    for x in nums:
        curr_sum += x
        max_so_far = max(max_so_far, curr_sum)
        if curr_sum < 0:
            curr_sum = 0
    return max_so_far`
        }
      },
      {
        id: "dsa-arr-3",
        title: "Merge Intervals",
        difficulty: "Medium",
        companies: ["Google", "Meta", "Apple", "Twitter"],
        leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
        gfgUrl: "https://www.geeksforgeeks.org/merging-intervals/",
        statement: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
        approach: "Sort intervals by start time. Iterate through intervals, extending the end time of the last interval if overlap occurs.",
        complexity: { time: "O(N log N)", space: "O(N)" },
        code: {
          cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    for(auto& interval : intervals) {
        if(merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}`,
          python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`
        }
      },
      {
        id: "dsa-arr-4",
        title: "Trapping Rain Water",
        difficulty: "Hard",
        companies: ["Google", "Amazon", "Goldman Sachs"],
        leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
        gfgUrl: "https://www.geeksforgeeks.org/trapping-rain-water/",
        statement: "Given `n` non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining.",
        approach: "Use Two Pointers (`left` and `right`) maintaining `left_max` and `right_max` heights to compute trapped units in O(1) space.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int trap(vector<int>& height) {
    int l = 0, r = height.size() - 1, water = 0;
    int maxL = 0, maxR = 0;
    while(l < r) {
        if(height[l] <= height[r]) {
            if(height[l] >= maxL) maxL = height[l];
            else water += maxL - height[l];
            l++;
        } else {
            if(height[r] >= maxR) maxR = height[r];
            else water += maxR - height[r];
            r--;
        }
    }
    return water;
}`,
          python: `def trap(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    max_l, max_r = 0, 0
    water = 0
    while l < r:
        if height[l] <= height[r]:
            if height[l] >= max_l: max_l = height[l]
            else: water += max_l - height[l]
            l += 1
        else:
            if height[r] >= max_r: max_r = height[r]
            else: water += max_r - height[r]
            r -= 1
    return water`
        }
      }
    ]
  },
  {
    id: "strings",
    name: "Strings",
    icon: "FaFont",
    description: "String manipulation, pattern searching, anagrams, palindromes, and parsing algorithms.",
    difficultySummary: "Easy to Medium",
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50 border-purple-200 text-purple-700",
    problems: [
      {
        id: "dsa-str-1",
        title: "Valid Anagram",
        difficulty: "Easy",
        companies: ["Amazon", "Uber", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
        gfgUrl: "https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/",
        statement: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
        approach: "Count character frequencies using an array of size 26 or a HashMap, then compare.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `bool isAnagram(string s, string t) {
    if(s.length() != t.length()) return false;
    int counts[26] = {0};
    for(int i = 0; i < s.length(); i++) {
        counts[s[i] - 'a']++;
        counts[t[i] - 'a']--;
    }
    for(int count : counts) if(count != 0) return false;
    return true;
}`,
          python: `def isAnagram(s: str, t: str) -> bool:
    return collections.Counter(s) == collections.Counter(t)`
        }
      },
      {
        id: "dsa-str-2",
        title: "Group Anagrams",
        difficulty: "Medium",
        companies: ["Meta", "Amazon", "Microsoft", "Salesforce"],
        leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
        gfgUrl: "https://www.geeksforgeeks.org/given-a-sequence-of-words-print-all-anagrams-together/",
        statement: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
        approach: "Use character count tuple or sorted string as key in HashMap to cluster anagram words together.",
        complexity: { time: "O(N * K log K)", space: "O(N * K)" },
        code: {
          cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> mp;
    for(string s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        mp[key].push_back(s);
    }
    vector<vector<string>> res;
    for(auto p : mp) res.push_back(p.second);
    return res;
}`,
          python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = collections.defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        groups[key].append(s)
    return list(groups.values())`
        }
      },
      {
        id: "dsa-str-3",
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Oracle", "Cisco"],
        leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/",
        gfgUrl: "https://www.geeksforgeeks.org/longest-palindrome-substring/",
        statement: "Given a string `s`, return the longest palindromic substring in `s`.",
        approach: "Expand around center for each character (both odd and even length centers). Track max length bounds.",
        complexity: { time: "O(N^2)", space: "O(1)" },
        code: {
          cpp: `string longestPalindrome(string s) {
    int start = 0, maxLen = 0;
    auto expand = [&](int l, int r) {
        while(l >= 0 && r < s.length() && s[l] == s[r]) { l--; r++; }
        if(r - l - 1 > maxLen) { start = l + 1; maxLen = r - l - 1; }
    };
    for(int i = 0; i < s.length(); i++) {
        expand(i, i);
        expand(i, i + 1);
    }
    return s.substr(start, maxLen);
}`,
          python: `def longestPalindrome(s: str) -> str:
    res = ""
    for i in range(len(s)):
        # odd len
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > len(res): res = s[l:r+1]
            l -= 1; r += 1
        # even len
        l, r = i, i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > len(res): res = s[l:r+1]
            l -= 1; r += 1
    return res`
        }
      }
    ]
  },
  {
    id: "searching-sorting",
    name: "Searching & Sorting",
    icon: "FaSearch",
    description: "Binary search variations, QuickSort, MergeSort, search space reduction, and customized sorting.",
    difficultySummary: "Beginner to Advanced",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
    problems: [
      {
        id: "dsa-ss-1",
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Microsoft", "LinkedIn"],
        leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        gfgUrl: "https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/",
        statement: "Given the rotated sorted array `nums` and a target, return the index if present, else `-1` in O(log N) time.",
        approach: "Modified binary search: determine which half (left or right) is normally sorted, then check if target lies within sorted half bounds.",
        complexity: { time: "O(log N)", space: "O(1)" },
        code: {
          cpp: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while(low <= high) {
        int mid = low + (high - low) / 2;
        if(nums[mid] == target) return mid;
        if(nums[low] <= nums[mid]) {
            if(nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if(nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
          python: `def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target: return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]: r = mid - 1
            else: l = mid + 1
        else:
            if nums[mid] < target <= nums[r]: l = mid + 1
            else: r = mid - 1
    return -1`
        }
      },
      {
        id: "dsa-ss-2",
        title: "Find First and Last Position in Sorted Array",
        difficulty: "Medium",
        companies: ["Meta", "Amazon", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
        gfgUrl: "https://www.geeksforgeeks.org/find-first-and-last-positions-of-an-element-in-a-sorted-array/",
        statement: "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given target.",
        approach: "Execute two distinct binary searches: one searching for lower bound, another for upper bound.",
        complexity: { time: "O(log N)", space: "O(1)" },
        code: {
          cpp: `vector<int> searchRange(vector<int>& nums, int target) {
    auto findBound = [&](bool isFirst) {
        int l = 0, r = nums.size() - 1, ans = -1;
        while(l <= r) {
            int mid = l + (r - l) / 2;
            if(nums[mid] == target) {
                ans = mid;
                if(isFirst) r = mid - 1;
                else l = mid + 1;
            } else if(nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return ans;
    };
    return {findBound(true), findBound(false)};
}`,
          python: `def searchRange(nums: list[int], target: int) -> list[int]:
    def find_bound(is_first):
        l, r, ans = 0, len(nums) - 1, -1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                ans = mid
                if is_first: r = mid - 1
                else: l = mid + 1
            elif nums[mid] < target: l = mid + 1
            else: r = mid - 1
        return ans
    return [find_bound(True), find_bound(False)]`
        }
      }
    ]
  },
  {
    id: "linked-list",
    name: "Linked List",
    icon: "FaLink",
    description: "Singly and doubly linked list pointer manipulations, cycle detection, reordering, and merging.",
    difficultySummary: "Easy to Hard",
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50 border-cyan-200 text-cyan-700",
    problems: [
      {
        id: "dsa-ll-1",
        title: "Reverse a Linked List",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "Apple", "Paypal"],
        leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
        gfgUrl: "https://www.geeksforgeeks.org/reverse-a-linked-list/",
        statement: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        approach: "Iterate with three pointers (`prev`, `curr`, `next`) updating `curr->next = prev` step-by-step.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while(curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
          python: `def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`
        }
      },
      {
        id: "dsa-ll-2",
        title: "Linked List Cycle II (Find Loop Entry)",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle-ii/",
        gfgUrl: "https://www.geeksforgeeks.org/find-first-node-of-loop-in-a-linked-list/",
        statement: "Given the head of a linked list, return the node where the cycle begins. If no cycle exists, return null.",
        approach: "Floyd's Cycle Detection (slow and fast pointers). When they intersect, reset slow to head and advance both 1 step at a time to find entry node.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `ListNode *detectCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while(fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if(slow == fast) {
            ListNode* p = head;
            while(p != slow) {
                p = p->next;
                slow = slow->next;
            }
            return p;
        }
    }
    return nullptr;
}`,
          python: `def detectCycle(head: Optional[ListNode]) -> Optional[ListNode]:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            p = head
            while p != slow:
                p = p.next
                slow = slow.next
            return p
    return None`
        }
      }
    ]
  },
  {
    id: "stack",
    name: "Stack",
    icon: "FaDatabase",
    description: "LIFO pattern applications, Monotonic Stack, parenthetical evaluation, and expression parsing.",
    difficultySummary: "Easy to Hard",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 border-amber-200 text-amber-700",
    problems: [
      {
        id: "dsa-stk-1",
        title: "Valid Parentheses",
        difficulty: "Easy",
        companies: ["Google", "Amazon", "Meta", "Salesforce"],
        leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
        gfgUrl: "https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/",
        statement: "Given a string `s` containing just characters '(', ')', '{', '}', '[' and ']', determine if input string is valid.",
        approach: "Push opening brackets to stack. For closing bracket, match with top of stack. Return true if stack is empty at end.",
        complexity: { time: "O(N)", space: "O(N)" },
        code: {
          cpp: `bool isValid(string s) {
    stack<char> st;
    for(char c : s) {
        if(c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if(st.empty()) return false;
            if(c == ')' && st.top() != '(') return false;
            if(c == '}' && st.top() != '{') return false;
            if(c == ']' && st.top() != '[') return false;
            st.pop();
        }
    }
    return st.empty();
}`,
          python: `def isValid(s: str) -> bool:
    st = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in pairs:
            if not st or st.pop() != pairs[char]:
                return False
        else:
            st.append(char)
    return len(st) == 0`
        }
      },
      {
        id: "dsa-stk-2",
        title: "Daily Temperatures (Monotonic Stack)",
        difficulty: "Medium",
        companies: ["Meta", "Amazon", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/",
        gfgUrl: "https://www.geeksforgeeks.org/next-greater-element/",
        statement: "Given an array of temperatures, return an array `answer` such that `answer[i]` is number of days to wait for warmer temp.",
        approach: "Monotonic decreasing stack storing indices. Pop indices when a warmer temperature is encountered.",
        complexity: { time: "O(N)", space: "O(N)" },
        code: {
          cpp: `vector<int> dailyTemperatures(vector<int>& temp) {
    int n = temp.size();
    vector<int> res(n, 0);
    stack<int> st;
    for(int i = 0; i < n; i++) {
        while(!st.empty() && temp[i] > temp[st.top()]) {
            int idx = st.top(); st.pop();
            res[idx] = i - idx;
        }
        st.push(i);
    }
    return res;
}`,
          python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    res = [0] * len(temperatures)
    stack = []
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            prev = stack.pop()
            res[prev] = i - prev
        stack.append(i)
    return res`
        }
      }
    ]
  },
  {
    id: "queue",
    name: "Queue",
    icon: "FaStream",
    description: "FIFO structures, Circular Queues, Deques, and Queue-based simulation problems.",
    difficultySummary: "Easy to Medium",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50 border-rose-200 text-rose-700",
    problems: [
      {
        id: "dsa-q-1",
        title: "Implement Queue using Stacks",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "Oracle"],
        leetcodeUrl: "https://leetcode.com/problems/implement-queue-using-stacks/",
        gfgUrl: "https://www.geeksforgeeks.org/queue-using-stacks/",
        statement: "Implement a First-In-First-Out (FIFO) queue using only two standard stacks.",
        approach: "Use `input` stack for `push`, transfer elements to `output` stack on `pop`/`peek` when `output` is empty.",
        complexity: { time: "O(1) Amortized", space: "O(N)" },
        code: {
          cpp: `class MyQueue {
    stack<int> s1, s2;
public:
    void push(int x) { s1.push(x); }
    int pop() {
        peek();
        int val = s2.top(); s2.pop();
        return val;
    }
    int peek() {
        if(s2.empty()) {
            while(!s1.empty()) { s2.push(s1.top()); s1.pop(); }
        }
        return s2.top();
    }
    bool empty() { return s1.empty() && s2.empty(); }
};`,
          python: `class MyQueue:
    def __init__(self):
        self.s1 = []
        self.s2 = []

    def push(self, x: int) -> None:
        self.s1.append(x)

    def pop(self) -> int:
        self.peek()
        return self.s2.pop()

    def peek(self) -> int:
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
        return self.s2[-1]

    def empty(self) -> bool:
        return not self.s1 and not self.s2`
        }
      }
    ]
  },
  {
    id: "trees",
    name: "Trees",
    icon: "FaTree",
    description: "Binary Trees, Binary Search Trees (BST), Traversals (Inorder, Preorder, Postorder, BFS), and Path sums.",
    difficultySummary: "Medium to Hard",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 border-green-200 text-green-700",
    problems: [
      {
        id: "dsa-tree-1",
        title: "Lowest Common Ancestor of a Binary Tree",
        difficulty: "Medium",
        companies: ["Meta", "Amazon", "Microsoft", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/lowest-common-ancestor-binary-tree/",
        statement: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes `p` and `q`.",
        approach: "Recursively search left and right subtrees. If both return non-null nodes, current node is the LCA.",
        complexity: { time: "O(N)", space: "O(H)" },
        code: {
          cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if(!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if(left && right) return root;
    return left ? left : right;
}`,
          python: `def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right:
        return root
    return left or right`
        }
      },
      {
        id: "dsa-tree-2",
        title: "Binary Tree Maximum Path Sum",
        difficulty: "Hard",
        companies: ["Google", "Meta", "Amazon", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        gfgUrl: "https://www.geeksforgeeks.org/find-maximum-path-sum-in-a-binary-tree/",
        statement: "A path in a binary tree is a sequence of nodes. Return the maximum path sum of any non-empty path.",
        approach: "Post-order traversal calculating maximum gain from left and right children. Update global max with `root + left + right`.",
        complexity: { time: "O(N)", space: "O(H)" },
        code: {
          cpp: `int maxPath = INT_MIN;
int maxGain(TreeNode* node) {
    if(!node) return 0;
    int leftGain = max(maxGain(node->left), 0);
    int rightGain = max(maxGain(node->right), 0);
    maxPath = max(maxPath, node->val + leftGain + rightGain);
    return node->val + max(leftGain, rightGain);
}
int maxPathSum(TreeNode* root) {
    maxGain(root);
    return maxPath;
}`,
          python: `def maxPathSum(root: Optional[TreeNode]) -> int:
    max_path = float('-inf')
    def get_max_gain(node):
        nonlocal max_path
        if not node: return 0
        left = max(get_max_gain(node.left), 0)
        right = max(get_max_gain(node.right), 0)
        max_path = max(max_path, node.val + left + right)
        return node.val + max(left, right)
    get_max_gain(root)
    return max_path`
        }
      }
    ]
  },
  {
    id: "graph",
    name: "Graph",
    icon: "FaProjectDiagram",
    description: "BFS, DFS, Topological Sort, Dijkstra's algorithm, Disjoint Set Union (DSU), and Cycle detection.",
    difficultySummary: "Medium to Hard",
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-50 border-indigo-200 text-indigo-700",
    problems: [
      {
        id: "dsa-grp-1",
        title: "Number of Islands (BFS / DFS)",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Meta", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
        gfgUrl: "https://www.geeksforgeeks.org/find-number-of-islands/",
        statement: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return number of islands.",
        approach: "Iterate through grid. Whenever a '1' is found, increment count and sink connected land ('1' -> '0') via DFS or BFS.",
        complexity: { time: "O(M * N)", space: "O(M * N)" },
        code: {
          cpp: `void dfs(vector<vector<char>>& grid, int i, int j) {
    if(i < 0 || j < 0 || i >= grid.size() || j >= grid[0].size() || grid[i][j] == '0') return;
    grid[i][j] = '0';
    dfs(grid, i+1, j); dfs(grid, i-1, j);
    dfs(grid, i, j+1); dfs(grid, i, j-1);
}
int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for(int i=0; i<grid.size(); i++) {
        for(int j=0; j<grid[0].size(); j++) {
            if(grid[i][j] == '1') { count++; dfs(grid, i, j); }
        }
    }
    return count;
}`,
          python: `def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`
        }
      },
      {
        id: "dsa-grp-2",
        title: "Course Schedule (Topological Sort / Kahn's)",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Twitter"],
        leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
        gfgUrl: "https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/",
        statement: "Determine if it is possible to finish all courses given prerequisite pairs. Detect cycles in directed graph.",
        approach: "Build indegree array and adjacency list. Use Kahn's algorithm (BFS queue with 0 indegrees) to check for cycles.",
        complexity: { time: "O(V + E)", space: "O(V + E)" },
        code: {
          cpp: `bool canFinish(int numCourses, vector<vector<int>>& prereq) {
    vector<int> indegree(numCourses, 0);
    vector<vector<int>> adj(numCourses);
    for(auto& p : prereq) { adj[p[1]].push_back(p[0]); indegree[p[0]]++; }
    queue<int> q;
    for(int i = 0; i < numCourses; i++) if(indegree[i] == 0) q.push(i);
    int count = 0;
    while(!q.empty()) {
        int u = q.front(); q.pop(); count++;
        for(int v : adj[u]) {
            if(--indegree[v] == 0) q.push(v);
        }
    }
    return count == numCourses;
}`,
          python: `def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    indegree = [0] * numCourses
    adj = collections.defaultdict(list)
    for crs, pre in prerequisites:
        adj[pre].append(crs)
        indegree[crs] += 1
    q = collections.deque([i for i in range(numCourses) if indegree[i] == 0])
    visited = 0
    while q:
        node = q.popleft()
        visited += 1
        for nxt in adj[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0: q.append(nxt)
    return visited == numCourses`
        }
      }
    ]
  },
  {
    id: "greedy",
    name: "Greedy",
    icon: "FaCoins",
    description: "Making locally optimal choices to achieve global optimization, interval scheduling, and fractional knapsack.",
    difficultySummary: "Easy to Hard",
    color: "from-amber-600 to-yellow-600",
    bgColor: "bg-amber-50 border-amber-200 text-amber-800",
    problems: [
      {
        id: "dsa-grd-1",
        title: "Jump Game",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Meta"],
        leetcodeUrl: "https://leetcode.com/problems/jump-game/",
        gfgUrl: "https://www.geeksforgeeks.org/minimum-number-of-jumps-to-reach-end-of-a-given-array/",
        statement: "Given an array `nums` where each element represents your max jump length at that position, return true if you can reach the last index.",
        approach: "Greedily track `max_reachable` index. At each step `i`, if `i > max_reachable`, return false. Update `max_reachable = max(max_reachable, i + nums[i])`.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for(int i = 0; i < nums.size(); i++) {
        if(i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
    }
    return true;
}`,
          python: `def canJump(nums: list[int]) -> bool:
    max_reach = 0
    for i, num in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + num)
    return True`
        }
      }
    ]
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    icon: "FaCogs",
    description: "Memoization, Tabulation, 1D/2D DP, Knapsack variants, Subsequence DP, and Matrix chain DP.",
    difficultySummary: "Medium to Hard",
    color: "from-red-500 to-rose-700",
    bgColor: "bg-red-50 border-red-200 text-red-700",
    problems: [
      {
        id: "dsa-dp-1",
        title: "Coin Change (Unbounded Knapsack)",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Walmart", "Paytm"],
        leetcodeUrl: "https://leetcode.com/problems/coin-change/",
        gfgUrl: "https://www.geeksforgeeks.org/coin-change-dp-7/",
        statement: "Given an integer array `coins` and an integer `amount`, return fewest number of coins needed to make up amount.",
        approach: "1D DP array initialized to infinity. `dp[i] = min(dp[i], 1 + dp[i - coin])` for each coin.",
        complexity: { time: "O(Amount * N)", space: "O(Amount)" },
        code: {
          cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for(int i = 1; i <= amount; i++) {
        for(int coin : coins) {
            if(i - coin >= 0) dp[i] = min(dp[i], 1 + dp[i - coin]);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
          python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], 1 + dp[i - c])
    return dp[amount] if dp[amount] != float('inf') else -1`
        }
      },
      {
        id: "dsa-dp-2",
        title: "Longest Increasing Subsequence (LIS)",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Apple", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/",
        gfgUrl: "https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/",
        statement: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
        approach: "Patience sorting / Binary search approach (`std::lower_bound`) to construct the sequence in O(N log N) time.",
        complexity: { time: "O(N log N)", space: "O(N)" },
        code: {
          cpp: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for(int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if(it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,
          python: `import bisect
def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)`
        }
      }
    ]
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    icon: "FaColumns",
    description: "Fixed and dynamic size sliding window, character count frequencies, and two pointer window constraints.",
    difficultySummary: "Medium to Hard",
    color: "from-sky-500 to-indigo-600",
    bgColor: "bg-sky-50 border-sky-200 text-sky-700",
    problems: [
      {
        id: "dsa-sw-1",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Meta", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        gfgUrl: "https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/",
        statement: "Given a string `s`, find the length of the longest substring without repeating characters.",
        approach: "Sliding window with HashMap storing character last seen index. Move `left` pointer to `max(left, last_seen[char] + 1)`.",
        complexity: { time: "O(N)", space: "O(min(M, N))" },
        code: {
          cpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> charMap;
    int maxLen = 0, left = 0;
    for(int right = 0; right < s.length(); right++) {
        if(charMap.count(s[right])) {
            left = max(left, charMap[s[right]] + 1);
        }
        charMap[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          python: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    max_len = left = 0
    for right, char in enumerate(s):
        if char in char_map:
            left = max(left, char_map[char] + 1)
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`
        }
      }
    ]
  },
  {
    id: "backtracking",
    name: "Backtracking",
    icon: "FaUndo",
    description: "State-space tree exploration, combinations, permutations, N-Queens, and Sudoku solvers.",
    difficultySummary: "Medium to Hard",
    color: "from-fuchsia-500 to-pink-600",
    bgColor: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
    problems: [
      {
        id: "dsa-bk-1",
        title: "Subsets (Power Set)",
        difficulty: "Medium",
        companies: ["Amazon", "Meta", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/subsets/",
        gfgUrl: "https://www.geeksforgeeks.org/backtracking-to-find-all-subsets/",
        statement: "Given an integer array `nums` of unique elements, return all possible subsets (the power set).",
        approach: "Backtrack by deciding for each element whether to include it or exclude it from current subset.",
        complexity: { time: "O(2^N)", space: "O(N)" },
        code: {
          cpp: `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> curr;
    auto backtrack = [&](auto& self, int idx) -> void {
        if(idx == nums.size()) { res.push_back(curr); return; }
        // Exclude
        self(self, idx + 1);
        // Include
        curr.push_back(nums[idx]);
        self(self, idx + 1);
        curr.pop_back();
    };
    backtrack(backtrack, 0);
    return res;
}`,
          python: `def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    def backtrack(idx, path):
        res.append(path[:])
        for i in range(idx, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res`
        }
      }
    ]
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    icon: "FaMemory",
    description: "Bitwise XOR, AND, OR, bit shifts, mask manipulation, and single number tricks.",
    difficultySummary: "Easy to Medium",
    color: "from-slate-600 to-gray-800",
    bgColor: "bg-slate-100 border-slate-300 text-slate-800",
    problems: [
      {
        id: "dsa-bit-1",
        title: "Single Number (XOR Property)",
        difficulty: "Easy",
        companies: ["Amazon", "Google", "Meta"],
        leetcodeUrl: "https://leetcode.com/problems/single-number/",
        gfgUrl: "https://www.geeksforgeeks.org/find-element-appears-once-in-array-where-every-other-element-appears-twice/",
        statement: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.",
        approach: "XOR all elements together. Since `x ^ x = 0` and `x ^ 0 = x`, duplicate numbers cancel out leaving the single number.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for(int x : nums) result ^= x;
    return result;
}`,
          python: `def singleNumber(nums: list[int]) -> int:
    res = 0
    for x in nums:
        res ^= x
    return res`
        }
      }
    ]
  }
];
