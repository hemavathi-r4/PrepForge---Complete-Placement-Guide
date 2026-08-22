/**
 * Comprehensive DSA Sheet Data — Expanded Edition
 * 13 topics, 5+ curated problems each, with LeetCode & GFG links, C++ & Python solutions.
 *
 * Topics:
 * 1. Arrays           2. Strings          3. Searching & Sorting
 * 4. Linked List      5. Stack            6. Queue
 * 7. Trees            8. Graph            9. Greedy
 * 10. Dynamic Programming  11. Sliding Window  12. Backtracking  13. Bit Manipulation
 */

export const DSA_TOPICS = [
  // ─────────────────────────────────────────────────────
  // 1. ARRAYS
  // ─────────────────────────────────────────────────────
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
        approach: "Two Pointers: maintain `left_max` and `right_max`. Advance the pointer with smaller max value and accumulate water.",
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
    max_l = max_r = water = 0
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
      },
      {
        id: "dsa-arr-5",
        title: "Product of Array Except Self",
        difficulty: "Medium",
        companies: ["Meta", "Amazon", "Microsoft", "Apple"],
        leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
        gfgUrl: "https://www.geeksforgeeks.org/a-product-array-puzzle/",
        statement: "Given integer array `nums`, return an array where output[i] equals the product of all elements except nums[i], without using division in O(N).",
        approach: "Two passes: first fill prefix products left-to-right, then multiply by suffix products right-to-left using a running variable.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, 1);
    int prefix = 1;
    for(int i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }
    int suffix = 1;
    for(int i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }
    return res;
}`,
          python: `def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    return res`
        }
      },
      {
        id: "dsa-arr-6",
        title: "3Sum",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Meta", "Microsoft", "Adobe"],
        leetcodeUrl: "https://leetcode.com/problems/3sum/",
        gfgUrl: "https://www.geeksforgeeks.org/find-a-triplet-that-sum-to-a-given-value/",
        statement: "Given integer array `nums`, return all the triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i]+nums[j]+nums[k] == 0.",
        approach: "Sort array, then fix one element and use two-pointer technique on the remaining. Skip duplicate elements to avoid duplicate triplets.",
        complexity: { time: "O(N²)", space: "O(1)" },
        code: {
          cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for(int i = 0; i < nums.size() - 2; i++) {
        if(i > 0 && nums[i] == nums[i-1]) continue;
        int l = i+1, r = nums.size()-1;
        while(l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if(sum == 0) {
                res.push_back({nums[i], nums[l], nums[r]});
                while(l < r && nums[l] == nums[l+1]) l++;
                while(l < r && nums[r] == nums[r-1]) r--;
                l++; r--;
            } else if(sum < 0) l++;
            else r--;
        }
    }
    return res;
}`,
          python: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]: continue
        l, r = i+1, len(nums)-1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]: l += 1
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1; r -= 1
            elif s < 0: l += 1
            else: r -= 1
    return res`
        }
      },
      {
        id: "dsa-arr-7",
        title: "Maximum Product Subarray",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Google", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/",
        gfgUrl: "https://www.geeksforgeeks.org/maximum-product-subarray/",
        statement: "Given integer array `nums`, find the contiguous subarray which has the largest product, and return the product.",
        approach: "Track both max and min products at each position (negative × negative = positive). Update global max at each step.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int maxProduct(vector<int>& nums) {
    int maxP = nums[0], minP = nums[0], res = nums[0];
    for(int i = 1; i < nums.size(); i++) {
        if(nums[i] < 0) swap(maxP, minP);
        maxP = max(nums[i], maxP * nums[i]);
        minP = min(nums[i], minP * nums[i]);
        res = max(res, maxP);
    }
    return res;
}`,
          python: `def maxProduct(nums: list[int]) -> int:
    max_p = min_p = res = nums[0]
    for x in nums[1:]:
        if x < 0: max_p, min_p = min_p, max_p
        max_p = max(x, max_p * x)
        min_p = min(x, min_p * x)
        res = max(res, max_p)
    return res`
        }
      },
      {
        id: "dsa-arr-8",
        title: "Container With Most Water",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Bloomberg", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
        gfgUrl: "https://www.geeksforgeeks.org/container-with-most-water/",
        statement: "Given `n` non-negative integers where each represents a point (i, height[i]), find two lines that together with the x-axis forms a container holding the most water.",
        approach: "Two Pointers starting from both ends. Always advance the pointer pointing to the shorter line to possibly find a taller line.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1, maxWater = 0;
    while(l < r) {
        maxWater = max(maxWater, min(height[l], height[r]) * (r - l));
        if(height[l] < height[r]) l++;
        else r--;
    }
    return maxWater;
}`,
          python: `def maxArea(height: list[int]) -> int:
    l, r, max_water = 0, len(height)-1, 0
    while l < r:
        max_water = max(max_water, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]: l += 1
        else: r -= 1
    return max_water`
        }
      },
      {
        id: "dsa-arr-9",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "Meta", "Apple"],
        leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        gfgUrl: "https://www.geeksforgeeks.org/best-time-to-buy-and-sell-stock/",
        statement: "Given an array `prices` where prices[i] is the price on the i-th day, find the maximum profit you can achieve from one buy and one sell.",
        approach: "Track minimum price seen so far. At each day, compute profit as `price - min_price` and update global max profit.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, maxProfit = 0;
    for(int p : prices) {
        minPrice = min(minPrice, p);
        maxProfit = max(maxProfit, p - minPrice);
    }
    return maxProfit;
}`,
          python: `def maxProfit(prices: list[int]) -> int:
    min_price, max_profit = float('inf'), 0
    for p in prices:
        min_price = min(min_price, p)
        max_profit = max(max_profit, p - min_price)
    return max_profit`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 2. STRINGS
  // ─────────────────────────────────────────────────────
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
        statement: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`.",
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
        statement: "Given an array of strings `strs`, group the anagrams together.",
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
        companies: ["Amazon", "Microsoft", "Oracle"],
        leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/",
        gfgUrl: "https://www.geeksforgeeks.org/longest-palindrome-substring/",
        statement: "Given a string `s`, return the longest palindromic substring in `s`.",
        approach: "Expand around center for each character (odd and even centers). Track max length bounds.",
        complexity: { time: "O(N²)", space: "O(1)" },
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
        for l, r in [(i, i), (i, i+1)]:
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if r - l + 1 > len(res): res = s[l:r+1]
                l -= 1; r += 1
    return res`
        }
      },
      {
        id: "dsa-str-4",
        title: "Valid Palindrome",
        difficulty: "Easy",
        companies: ["Facebook", "Microsoft", "Apple"],
        leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
        gfgUrl: "https://www.geeksforgeeks.org/check-if-a-string-is-palindrome/",
        statement: "Given a string `s`, return true if it is a palindrome considering only alphanumeric characters and ignoring case.",
        approach: "Use two pointers from both ends. Skip non-alphanumeric characters and compare lowercase versions.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `bool isPalindrome(string s) {
    int l = 0, r = s.length() - 1;
    while(l < r) {
        while(l < r && !isalnum(s[l])) l++;
        while(l < r && !isalnum(s[r])) r--;
        if(tolower(s[l++]) != tolower(s[r--])) return false;
    }
    return true;
}`,
          python: `def isPalindrome(s: str) -> bool:
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]`
        }
      },
      {
        id: "dsa-str-5",
        title: "Roman to Integer",
        difficulty: "Easy",
        companies: ["Amazon", "Google", "Bloomberg", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/roman-to-integer/",
        gfgUrl: "https://www.geeksforgeeks.org/converting-roman-numerals-decimal-lying-1-3999/",
        statement: "Given a string `s` of roman numerals, convert it to an integer.",
        approach: "Map each symbol to its value. Iterate right to left: if current value is less than the next seen, subtract it; otherwise add it.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int romanToInt(string s) {
    unordered_map<char, int> val = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
    int result = 0, prev = 0;
    for(int i = s.length()-1; i >= 0; i--) {
        int curr = val[s[i]];
        result += (curr < prev) ? -curr : curr;
        prev = curr;
    }
    return result;
}`,
          python: `def romanToInt(s: str) -> int:
    vals = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    res, prev = 0, 0
    for c in reversed(s):
        curr = vals[c]
        res += -curr if curr < prev else curr
        prev = curr
    return res`
        }
      },
      {
        id: "dsa-str-6",
        title: "String to Integer (atoi)",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/string-to-integer-atoi/",
        gfgUrl: "https://www.geeksforgeeks.org/write-your-own-atoi/",
        statement: "Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer.",
        approach: "Trim whitespace, detect sign, then parse digits while checking for INT_MIN/INT_MAX overflow.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int myAtoi(string s) {
    int i = 0, sign = 1;
    long result = 0;
    while(i < s.size() && s[i] == ' ') i++;
    if(i < s.size() && (s[i] == '-' || s[i] == '+')) {
        sign = (s[i++] == '-') ? -1 : 1;
    }
    while(i < s.size() && isdigit(s[i])) {
        result = result * 10 + (s[i++] - '0');
        if(result * sign > INT_MAX) return INT_MAX;
        if(result * sign < INT_MIN) return INT_MIN;
    }
    return result * sign;
}`,
          python: `def myAtoi(s: str) -> int:
    s = s.lstrip()
    if not s: return 0
    sign, i = 1, 0
    if s[0] in '+-':
        sign = -1 if s[0] == '-' else 1
        i = 1
    result = 0
    while i < len(s) and s[i].isdigit():
        result = result * 10 + int(s[i])
        i += 1
    result *= sign
    return max(min(result, 2**31 - 1), -2**31)`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 3. SEARCHING & SORTING
  // ─────────────────────────────────────────────────────
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
        statement: "Given the rotated sorted array `nums` and a target, return the index if present, else -1 in O(log N).",
        approach: "Modified binary search: determine which half is normally sorted, then check if target lies within sorted half bounds.",
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
        statement: "Find the starting and ending position of a given target in a sorted array in O(log N).",
        approach: "Two binary searches: one for lower bound, another for upper bound.",
        complexity: { time: "O(log N)", space: "O(1)" },
        code: {
          cpp: `vector<int> searchRange(vector<int>& nums, int target) {
    auto findBound = [&](bool isFirst) {
        int l = 0, r = nums.size() - 1, ans = -1;
        while(l <= r) {
            int mid = l + (r - l) / 2;
            if(nums[mid] == target) {
                ans = mid;
                if(isFirst) r = mid - 1; else l = mid + 1;
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
      },
      {
        id: "dsa-ss-3",
        title: "Kth Largest Element in an Array",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Facebook", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        gfgUrl: "https://www.geeksforgeeks.org/kth-largest-element-in-an-array/",
        statement: "Given an integer array `nums` and integer `k`, return the k-th largest element in the array.",
        approach: "Use a min-heap of size k. Iterate through elements: push each, then pop if heap exceeds k. The heap top is the k-th largest.",
        complexity: { time: "O(N log K)", space: "O(K)" },
        code: {
          cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for(int x : nums) {
        pq.push(x);
        if(pq.size() > k) pq.pop();
    }
    return pq.top();
}`,
          python: `import heapq
def findKthLargest(nums: list[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]`
        }
      },
      {
        id: "dsa-ss-4",
        title: "Square Root (Binary Search on Answer)",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/sqrtx/",
        gfgUrl: "https://www.geeksforgeeks.org/square-root-of-an-integer/",
        statement: "Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer.",
        approach: "Binary search on answer range [0, x]. Find largest integer `mid` such that mid*mid <= x.",
        complexity: { time: "O(log N)", space: "O(1)" },
        code: {
          cpp: `int mySqrt(int x) {
    if(x < 2) return x;
    int l = 1, r = x / 2, ans = 0;
    while(l <= r) {
        long mid = l + (r - l) / 2;
        if(mid * mid == x) return mid;
        else if(mid * mid < x) { ans = mid; l = mid + 1; }
        else r = mid - 1;
    }
    return ans;
}`,
          python: `def mySqrt(x: int) -> int:
    l, r, ans = 0, x, 0
    while l <= r:
        mid = (l + r) // 2
        if mid * mid <= x: ans = mid; l = mid + 1
        else: r = mid - 1
    return ans`
        }
      },
      {
        id: "dsa-ss-5",
        title: "Sort Colors (Dutch National Flag)",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Google", "Adobe"],
        leetcodeUrl: "https://leetcode.com/problems/sort-colors/",
        gfgUrl: "https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-and-2s/",
        statement: "Given an array `nums` with only values 0, 1, and 2, sort it in-place so that 0s come first, 1s next, and 2s last.",
        approach: "Dutch National Flag: three pointers `low`, `mid`, `high`. Advance mid and swap with low or high based on value.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while(mid <= high) {
        if(nums[mid] == 0) swap(nums[low++], nums[mid++]);
        else if(nums[mid] == 1) mid++;
        else swap(nums[mid], nums[high--]);
    }
}`,
          python: `def sortColors(nums: list[int]) -> None:
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 4. LINKED LIST
  // ─────────────────────────────────────────────────────
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
        companies: ["Amazon", "Microsoft", "Apple"],
        leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
        gfgUrl: "https://www.geeksforgeeks.org/reverse-a-linked-list/",
        statement: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        approach: "Iterate with three pointers (prev, curr, next) updating curr->next = prev step-by-step.",
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
          python: `def reverseList(head):
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
        statement: "Return the node where the cycle begins. If no cycle exists, return null.",
        approach: "Floyd's Cycle Detection: after slow and fast pointers meet, reset slow to head. Advance both 1 step to find entry node.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `ListNode *detectCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while(fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if(slow == fast) {
            ListNode* p = head;
            while(p != slow) { p = p->next; slow = slow->next; }
            return p;
        }
    }
    return nullptr;
}`,
          python: `def detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next; fast = fast.next.next
        if slow == fast:
            p = head
            while p != slow: p = p.next; slow = slow.next
            return p
    return None`
        }
      },
      {
        id: "dsa-ll-3",
        title: "Merge Two Sorted Linked Lists",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "Meta", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
        gfgUrl: "https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/",
        statement: "Merge two sorted linked lists and return the head of the merged sorted list.",
        approach: "Use a dummy head node. At each step, append the smaller of the two current nodes and advance that pointer.",
        complexity: { time: "O(N+M)", space: "O(1)" },
        code: {
          cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* curr = &dummy;
    while(l1 && l2) {
        if(l1->val <= l2->val) { curr->next = l1; l1 = l1->next; }
        else { curr->next = l2; l2 = l2->next; }
        curr = curr->next;
    }
    curr->next = l1 ? l1 : l2;
    return dummy.next;
}`,
          python: `def mergeTwoLists(l1, l2):
    dummy = curr = ListNode(0)
    while l1 and l2:
        if l1.val <= l2.val: curr.next = l1; l1 = l1.next
        else: curr.next = l2; l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`
        }
      },
      {
        id: "dsa-ll-4",
        title: "Remove Nth Node From End of List",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        gfgUrl: "https://www.geeksforgeeks.org/delete-nth-node-from-the-end-of-the-given-linked-list/",
        statement: "Given the head of a linked list, remove the n-th node from the end of the list and return its head.",
        approach: "Two pointers: advance fast pointer n+1 steps ahead, then move both until fast reaches end. Slow will be at the node before the target.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0, head);
    ListNode *fast = &dummy, *slow = &dummy;
    for(int i = 0; i <= n; i++) fast = fast->next;
    while(fast) { fast = fast->next; slow = slow->next; }
    slow->next = slow->next->next;
    return dummy.next;
}`,
          python: `def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1): fast = fast.next
    while fast: fast = fast.next; slow = slow.next
    slow.next = slow.next.next
    return dummy.next`
        }
      },
      {
        id: "dsa-ll-5",
        title: "Reorder List",
        difficulty: "Medium",
        companies: ["Amazon", "Meta", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/reorder-list/",
        gfgUrl: "https://www.geeksforgeeks.org/reorder-a-linked-list/",
        statement: "Given a singly linked list L0→L1→…→Ln-1→Ln, reorder it to: L0→Ln→L1→Ln-1→L2→Ln-2→…",
        approach: "1. Find middle with slow/fast. 2. Reverse second half. 3. Interleave first and reversed second halves.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `void reorderList(ListNode* head) {
    // Find middle
    ListNode *slow = head, *fast = head;
    while(fast->next && fast->next->next) {
        slow = slow->next; fast = fast->next->next;
    }
    // Reverse second half
    ListNode *prev = nullptr, *curr = slow->next;
    slow->next = nullptr;
    while(curr) { ListNode* nxt = curr->next; curr->next = prev; prev = curr; curr = nxt; }
    // Merge
    ListNode *first = head, *second = prev;
    while(second) {
        ListNode *tmp1 = first->next, *tmp2 = second->next;
        first->next = second; second->next = tmp1;
        first = tmp1; second = tmp2;
    }
}`,
          python: `def reorderList(head) -> None:
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next; fast = fast.next.next
    prev, curr = None, slow.next
    slow.next = None
    while curr:
        nxt = curr.next; curr.next = prev; prev = curr; curr = nxt
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second; second.next = tmp1
        first = tmp1; second = tmp2`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 5. STACK
  // ─────────────────────────────────────────────────────
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
        statement: "Given string `s` containing only '(', ')', '{', '}', '[', ']', determine if the input string is valid.",
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
    for c in s:
        if c in pairs:
            if not st or st.pop() != pairs[c]: return False
        else: st.append(c)
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
        statement: "Given array `temperatures`, return array `answer` where answer[i] is days until a warmer temperature. If no future warmer day, put 0.",
        approach: "Monotonic decreasing stack storing indices. When current temp > stack top temp, pop and compute days difference.",
        complexity: { time: "O(N)", space: "O(N)" },
        code: {
          cpp: `vector<int> dailyTemperatures(vector<int>& T) {
    int n = T.size();
    vector<int> res(n, 0);
    stack<int> st;
    for(int i = 0; i < n; i++) {
        while(!st.empty() && T[i] > T[st.top()]) {
            res[st.top()] = i - st.top();
            st.pop();
        }
        st.push(i);
    }
    return res;
}`,
          python: `def dailyTemperatures(T: list[int]) -> list[int]:
    res, st = [0] * len(T), []
    for i, t in enumerate(T):
        while st and T[st[-1]] < t:
            j = st.pop()
            res[j] = i - j
        st.append(i)
    return res`
        }
      },
      {
        id: "dsa-stk-3",
        title: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        companies: ["Amazon", "Google", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        gfgUrl: "https://www.geeksforgeeks.org/largest-rectangle-under-histogram/",
        statement: "Given an array of integers `heights` representing a histogram where each bar width is 1, return the area of the largest rectangle.",
        approach: "Monotonic increasing stack: when current bar is shorter, pop and calculate area using popped bar as the minimum height.",
        complexity: { time: "O(N)", space: "O(N)" },
        code: {
          cpp: `int largestRectangleArea(vector<int>& heights) {
    stack<int> st;
    int maxArea = 0;
    heights.push_back(0);
    for(int i = 0; i < heights.size(); i++) {
        while(!st.empty() && heights[i] < heights[st.top()]) {
            int h = heights[st.top()]; st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        st.push(i);
    }
    return maxArea;
}`,
          python: `def largestRectangleArea(heights: list[int]) -> int:
    heights.append(0)
    st, max_area = [], 0
    for i, h in enumerate(heights):
        start = i
        while st and st[-1][1] > h:
            idx, height = st.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx
        st.append((start, h))
    return max_area`
        }
      },
      {
        id: "dsa-stk-4",
        title: "Min Stack",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/min-stack/",
        gfgUrl: "https://www.geeksforgeeks.org/design-a-stack-that-supports-getmin-in-o1-time-and-o1-extra-space/",
        statement: "Design a stack that supports push, pop, top, and retrieving the minimum element in O(1) time.",
        approach: "Maintain two stacks: one normal stack and a second stack that stores the current minimum at each level.",
        complexity: { time: "O(1) all operations", space: "O(N)" },
        code: {
          cpp: `class MinStack {
    stack<int> st, minSt;
public:
    void push(int val) {
        st.push(val);
        minSt.push(minSt.empty() ? val : min(val, minSt.top()));
    }
    void pop() { st.pop(); minSt.pop(); }
    int top() { return st.top(); }
    int getMin() { return minSt.top(); }
};`,
          python: `class MinStack:
    def __init__(self): self.st = []; self.min_st = []
    def push(self, val):
        self.st.append(val)
        self.min_st.append(val if not self.min_st else min(val, self.min_st[-1]))
    def pop(self): self.st.pop(); self.min_st.pop()
    def top(self): return self.st[-1]
    def getMin(self): return self.min_st[-1]`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 6. QUEUE
  // ─────────────────────────────────────────────────────
  {
    id: "queue",
    name: "Queue",
    icon: "FaStream",
    description: "FIFO structure, Deque-based sliding window maximum, circular queues, and BFS pattern.",
    difficultySummary: "Easy to Hard",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50 border-rose-200 text-rose-700",
    problems: [
      {
        id: "dsa-q-1",
        title: "Sliding Window Maximum",
        difficulty: "Hard",
        companies: ["Amazon", "Google", "Microsoft", "Adobe"],
        leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/",
        gfgUrl: "https://www.geeksforgeeks.org/sliding-window-maximum-maximum-of-all-subarrays-of-size-k/",
        statement: "Given array `nums` and sliding window of size `k`, return max value in each window position.",
        approach: "Monotonic deque storing indices in decreasing order of values. Remove expired indices from front, remove smaller elements from back.",
        complexity: { time: "O(N)", space: "O(K)" },
        code: {
          cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> res;
    for(int i = 0; i < nums.size(); i++) {
        while(!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
        while(!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if(i >= k - 1) res.push_back(nums[dq.front()]);
    }
    return res;
}`,
          python: `from collections import deque
def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    dq, res = deque(), []
    for i, n in enumerate(nums):
        while dq and dq[0] < i - k + 1: dq.popleft()
        while dq and nums[dq[-1]] < n: dq.pop()
        dq.append(i)
        if i >= k - 1: res.append(nums[dq[0]])
    return res`
        }
      },
      {
        id: "dsa-q-2",
        title: "Implement Queue Using Stacks",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/implement-queue-using-stacks/",
        gfgUrl: "https://www.geeksforgeeks.org/queue-using-stacks/",
        statement: "Implement a queue using only two stacks, supporting push, pop, peek, and empty in amortized O(1).",
        approach: "Input stack for push. When pop/peek needed, if output stack empty, transfer all from input to output, reversing order.",
        complexity: { time: "Amortized O(1)", space: "O(N)" },
        code: {
          cpp: `class MyQueue {
    stack<int> in, out;
    void transfer() { while(!in.empty()) { out.push(in.top()); in.pop(); } }
public:
    void push(int x) { in.push(x); }
    int pop() { if(out.empty()) transfer(); int t = out.top(); out.pop(); return t; }
    int peek() { if(out.empty()) transfer(); return out.top(); }
    bool empty() { return in.empty() && out.empty(); }
};`,
          python: `class MyQueue:
    def __init__(self): self.inp = []; self.out = []
    def push(self, x): self.inp.append(x)
    def _transfer(self):
        if not self.out:
            while self.inp: self.out.append(self.inp.pop())
    def pop(self): self._transfer(); return self.out.pop()
    def peek(self): self._transfer(); return self.out[-1]
    def empty(self): return not self.inp and not self.out`
        }
      },
      {
        id: "dsa-q-3",
        title: "Design Circular Queue",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Qualcomm"],
        leetcodeUrl: "https://leetcode.com/problems/design-circular-queue/",
        gfgUrl: "https://www.geeksforgeeks.org/circular-queue-set-1-introduction-array-implementation/",
        statement: "Design a circular queue implementation with MyCircularQueue(k), enQueue, deQueue, Front, Rear, isEmpty, isFull operations.",
        approach: "Use fixed-size array with head/tail pointers and count. Use modular arithmetic for wrapping.",
        complexity: { time: "O(1) all ops", space: "O(K)" },
        code: {
          cpp: `class MyCircularQueue {
    vector<int> q;
    int head = 0, tail = 0, size = 0, cap;
public:
    MyCircularQueue(int k) : q(k), cap(k) {}
    bool enQueue(int val) {
        if(isFull()) return false;
        q[tail] = val; tail = (tail + 1) % cap; size++;
        return true;
    }
    bool deQueue() {
        if(isEmpty()) return false;
        head = (head + 1) % cap; size--;
        return true;
    }
    int Front() { return isEmpty() ? -1 : q[head]; }
    int Rear() { return isEmpty() ? -1 : q[(tail - 1 + cap) % cap]; }
    bool isEmpty() { return size == 0; }
    bool isFull() { return size == cap; }
};`,
          python: `class MyCircularQueue:
    def __init__(self, k): self.q = [0]*k; self.head = self.size = 0; self.cap = k
    @property
    def tail(self): return (self.head + self.size) % self.cap
    def enQueue(self, val):
        if self.isFull(): return False
        self.q[self.tail] = val; self.size += 1; return True
    def deQueue(self):
        if self.isEmpty(): return False
        self.head = (self.head + 1) % self.cap; self.size -= 1; return True
    def Front(self): return -1 if self.isEmpty() else self.q[self.head]
    def Rear(self): return -1 if self.isEmpty() else self.q[(self.tail - 1) % self.cap]
    def isEmpty(self): return self.size == 0
    def isFull(self): return self.size == self.cap`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 7. TREES
  // ─────────────────────────────────────────────────────
  {
    id: "trees",
    name: "Trees",
    icon: "FaTree",
    description: "Binary Trees, BSTs, AVL, heap, traversals, diameter, path sums, and LCA problems.",
    difficultySummary: "Easy to Hard",
    color: "from-lime-500 to-green-600",
    bgColor: "bg-lime-50 border-lime-200 text-lime-700",
    problems: [
      {
        id: "dsa-tree-1",
        title: "Binary Tree Level Order Traversal (BFS)",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Bloomberg", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        gfgUrl: "https://www.geeksforgeeks.org/level-order-tree-traversal/",
        statement: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
        approach: "BFS using a queue. For each level, record the queue size, process exactly that many nodes, collecting their values.",
        complexity: { time: "O(N)", space: "O(N)" },
        code: {
          cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    if(!root) return {};
    vector<vector<int>> res;
    queue<TreeNode*> q;
    q.push(root);
    while(!q.empty()) {
        int size = q.size();
        vector<int> level;
        for(int i = 0; i < size; i++) {
            auto node = q.front(); q.pop();
            level.push_back(node->val);
            if(node->left) q.push(node->left);
            if(node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}`,
          python: `from collections import deque
def levelOrder(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res`
        }
      },
      {
        id: "dsa-tree-2",
        title: "Validate Binary Search Tree",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Google", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/a-program-to-check-if-a-binary-tree-is-bst-or-not/",
        statement: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
        approach: "DFS passing min/max bounds. Left subtree values must be < node val, right subtree > node val.",
        complexity: { time: "O(N)", space: "O(H)" },
        code: {
          cpp: `bool isValidBST(TreeNode* root, long lo = LONG_MIN, long hi = LONG_MAX) {
    if(!root) return true;
    if(root->val <= lo || root->val >= hi) return false;
    return isValidBST(root->left, lo, root->val) && isValidBST(root->right, root->val, hi);
}`,
          python: `def isValidBST(root, lo=float('-inf'), hi=float('inf')):
    if not root: return True
    if not (lo < root.val < hi): return False
    return isValidBST(root.left, lo, root.val) and isValidBST(root.right, root.val, hi)`
        }
      },
      {
        id: "dsa-tree-3",
        title: "Lowest Common Ancestor of BST",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/lowest-common-ancestor-in-a-binary-search-tree/",
        statement: "Given a BST, find the LCA of two given nodes p and q.",
        approach: "Use BST property: if both p, q < root go left. If both > root go right. Otherwise current node is LCA.",
        complexity: { time: "O(H)", space: "O(1)" },
        code: {
          cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    while(root) {
        if(p->val < root->val && q->val < root->val) root = root->left;
        else if(p->val > root->val && q->val > root->val) root = root->right;
        else return root;
    }
    return nullptr;
}`,
          python: `def lowestCommonAncestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val: root = root.left
        elif p.val > root.val and q.val > root.val: root = root.right
        else: return root`
        }
      },
      {
        id: "dsa-tree-4",
        title: "Diameter of Binary Tree",
        difficulty: "Easy",
        companies: ["Amazon", "Google", "Facebook"],
        leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/diameter-of-a-binary-tree/",
        statement: "Given the root of a binary tree, return the length of the diameter (longest path between any two nodes).",
        approach: "DFS returning height. At each node, update diameter with left_height + right_height.",
        complexity: { time: "O(N)", space: "O(H)" },
        code: {
          cpp: `int diameterOfBinaryTree(TreeNode* root) {
    int diameter = 0;
    function<int(TreeNode*)> dfs = [&](TreeNode* node) -> int {
        if(!node) return 0;
        int left = dfs(node->left), right = dfs(node->right);
        diameter = max(diameter, left + right);
        return 1 + max(left, right);
    };
    dfs(root);
    return diameter;
}`,
          python: `def diameterOfBinaryTree(root) -> int:
    diameter = [0]
    def dfs(node):
        if not node: return 0
        l, r = dfs(node.left), dfs(node.right)
        diameter[0] = max(diameter[0], l + r)
        return 1 + max(l, r)
    dfs(root)
    return diameter[0]`
        }
      },
      {
        id: "dsa-tree-5",
        title: "Binary Tree Maximum Path Sum",
        difficulty: "Hard",
        companies: ["Amazon", "Google", "Microsoft", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        gfgUrl: "https://www.geeksforgeeks.org/find-maximum-path-sum-in-a-binary-tree/",
        statement: "Given the root of a binary tree, return the maximum path sum of any non-empty path.",
        approach: "DFS returning max one-branch gain. At each node, candidate path = left_gain + right_gain + node.val. Update global max.",
        complexity: { time: "O(N)", space: "O(H)" },
        code: {
          cpp: `int maxPathSum(TreeNode* root) {
    int res = INT_MIN;
    function<int(TreeNode*)> dfs = [&](TreeNode* node) -> int {
        if(!node) return 0;
        int left = max(0, dfs(node->left)), right = max(0, dfs(node->right));
        res = max(res, node->val + left + right);
        return node->val + max(left, right);
    };
    dfs(root);
    return res;
}`,
          python: `def maxPathSum(root) -> int:
    res = [float('-inf')]
    def dfs(node):
        if not node: return 0
        l, r = max(0, dfs(node.left)), max(0, dfs(node.right))
        res[0] = max(res[0], node.val + l + r)
        return node.val + max(l, r)
    dfs(root)
    return res[0]`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 8. GRAPH
  // ─────────────────────────────────────────────────────
  {
    id: "graph",
    name: "Graph",
    icon: "FaProjectDiagram",
    description: "BFS, DFS, Dijkstra, Union-Find, Topological Sort, and shortest path algorithms.",
    difficultySummary: "Medium to Hard",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50 border-orange-200 text-orange-700",
    problems: [
      {
        id: "dsa-graph-1",
        title: "Number of Islands (BFS/DFS on Grid)",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Microsoft", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
        gfgUrl: "https://www.geeksforgeeks.org/find-number-of-islands/",
        statement: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands.",
        approach: "DFS/BFS from each unvisited '1' cell, marking connected land cells as visited. Count initiations.",
        complexity: { time: "O(M*N)", space: "O(M*N)" },
        code: {
          cpp: `int numIslands(vector<vector<char>>& grid) {
    int m = grid.size(), n = grid[0].size(), count = 0;
    auto dfs = [&](auto& self, int r, int c) -> void {
        if(r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
        grid[r][c] = '0';
        self(self, r+1, c); self(self, r-1, c);
        self(self, r, c+1); self(self, r, c-1);
    };
    for(int i = 0; i < m; i++)
        for(int j = 0; j < n; j++)
            if(grid[i][j] == '1') { count++; dfs(dfs, i, j); }
    return count;
}`,
          python: `def numIslands(grid: list[list[str]]) -> int:
    m, n, count = len(grid), len(grid[0]), 0
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1': return
        grid[r][c] = '0'
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]: dfs(r+dr, c+dc)
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1': count += 1; dfs(i, j)
    return count`
        }
      },
      {
        id: "dsa-graph-2",
        title: "Course Schedule (Cycle in Directed Graph)",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Microsoft", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
        gfgUrl: "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/",
        statement: "Return true if you can finish all courses given prerequisite pairs (course schedule is feasible).",
        approach: "Kahn's Algorithm (BFS with in-degrees). Count processed nodes; if = N then no cycle exists.",
        complexity: { time: "O(V+E)", space: "O(V+E)" },
        code: {
          cpp: `bool canFinish(int n, vector<vector<int>>& prereq) {
    vector<vector<int>> adj(n);
    vector<int> indegree(n, 0);
    for(auto& p : prereq) { adj[p[1]].push_back(p[0]); indegree[p[0]]++; }
    queue<int> q;
    for(int i = 0; i < n; i++) if(indegree[i] == 0) q.push(i);
    int count = 0;
    while(!q.empty()) {
        int u = q.front(); q.pop(); count++;
        for(int v : adj[u]) if(--indegree[v] == 0) q.push(v);
    }
    return count == n;
}`,
          python: `from collections import deque
def canFinish(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest); indegree[dest] += 1
    q = deque([i for i in range(numCourses) if indegree[i] == 0])
    visited = 0
    while q:
        node = q.popleft(); visited += 1
        for nxt in adj[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0: q.append(nxt)
    return visited == numCourses`
        }
      },
      {
        id: "dsa-graph-3",
        title: "Clone Graph",
        difficulty: "Medium",
        companies: ["Meta", "Amazon", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/clone-graph/",
        gfgUrl: "https://www.geeksforgeeks.org/clone-an-undirected-graph/",
        statement: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
        approach: "DFS/BFS with a HashMap mapping original nodes to their clones. For each unvisited neighbor, create clone and recurse.",
        complexity: { time: "O(V+E)", space: "O(V)" },
        code: {
          cpp: `Node* cloneGraph(Node* node) {
    unordered_map<Node*, Node*> visited;
    function<Node*(Node*)> dfs = [&](Node* n) -> Node* {
        if(!n) return nullptr;
        if(visited.count(n)) return visited[n];
        Node* clone = new Node(n->val);
        visited[n] = clone;
        for(Node* nb : n->neighbors) clone->neighbors.push_back(dfs(nb));
        return clone;
    };
    return dfs(node);
}`,
          python: `def cloneGraph(node):
    if not node: return None
    visited = {}
    def dfs(n):
        if n in visited: return visited[n]
        clone = Node(n.val)
        visited[n] = clone
        for nb in n.neighbors: clone.neighbors.append(dfs(nb))
        return clone
    return dfs(node)`
        }
      },
      {
        id: "dsa-graph-4",
        title: "Dijkstra's Shortest Path",
        difficulty: "Hard",
        companies: ["Amazon", "Google", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/network-delay-time/",
        gfgUrl: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
        statement: "Find shortest path from source node to all other nodes in a weighted directed graph.",
        approach: "Min-heap priority queue. Relax edges: if dist[src] + weight < dist[dest], update and push to heap.",
        complexity: { time: "O((V+E) log V)", space: "O(V)" },
        code: {
          cpp: `vector<int> dijkstra(int src, int n, vector<vector<pair<int,int>>>& adj) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[src] = 0; pq.push({0, src});
    while(!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if(d > dist[u]) continue;
        for(auto [w, v] : adj[u]) {
            if(dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
          python: `import heapq
def dijkstra(src, n, adj):
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for w, v in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    return dist`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 9. GREEDY
  // ─────────────────────────────────────────────────────
  {
    id: "greedy",
    name: "Greedy",
    icon: "FaBolt",
    description: "Activity selection, interval scheduling, Huffman coding, coin change greedy, and jump game.",
    difficultySummary: "Easy to Medium",
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50 border-yellow-200 text-yellow-700",
    problems: [
      {
        id: "dsa-gr-1",
        title: "Jump Game",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Google"],
        leetcodeUrl: "https://leetcode.com/problems/jump-game/",
        gfgUrl: "https://www.geeksforgeeks.org/jump-game/",
        statement: "Given array `nums` where nums[i] is the max jump length from position i, return true if you can reach the last index.",
        approach: "Track the farthest reachable index. Iterate: if current index > farthest, return false. Update farthest at each step.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `bool canJump(vector<int>& nums) {
    int farthest = 0;
    for(int i = 0; i < nums.size(); i++) {
        if(i > farthest) return false;
        farthest = max(farthest, i + nums[i]);
    }
    return true;
}`,
          python: `def canJump(nums: list[int]) -> bool:
    farthest = 0
    for i, n in enumerate(nums):
        if i > farthest: return False
        farthest = max(farthest, i + n)
    return True`
        }
      },
      {
        id: "dsa-gr-2",
        title: "Meeting Rooms II (Minimum Conference Rooms)",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Facebook", "Uber"],
        leetcodeUrl: "https://leetcode.com/problems/meeting-rooms-ii/",
        gfgUrl: "https://www.geeksforgeeks.org/find-minimum-number-of-rooms-required/",
        statement: "Given an array of meeting time intervals, find the minimum number of conference rooms required.",
        approach: "Sort by start time. Use a min-heap of end times. If meeting start >= heap top (earliest ending), reuse room. Else add room.",
        complexity: { time: "O(N log N)", space: "O(N)" },
        code: {
          cpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> pq;
    for(auto& iv : intervals) {
        if(!pq.empty() && pq.top() <= iv[0]) pq.pop();
        pq.push(iv[1]);
    }
    return pq.size();
}`,
          python: `import heapq
def minMeetingRooms(intervals: list[list[int]]) -> int:
    intervals.sort()
    heap = []
    for start, end in intervals:
        if heap and heap[0] <= start: heapq.heappop(heap)
        heapq.heappush(heap, end)
    return len(heap)`
        }
      },
      {
        id: "dsa-gr-3",
        title: "Gas Station (Circular Route)",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/gas-station/",
        gfgUrl: "https://www.geeksforgeeks.org/find-a-starting-gas-station/",
        statement: "Given gas and cost arrays, find the starting station index to complete the circuit, or -1 if impossible.",
        approach: "If total gas >= total cost, a solution exists. Traverse once: if tank drops negative, reset start to next station.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, tank = 0, start = 0;
    for(int i = 0; i < gas.size(); i++) {
        tank += gas[i] - cost[i];
        total += gas[i] - cost[i];
        if(tank < 0) { start = i + 1; tank = 0; }
    }
    return total >= 0 ? start : -1;
}`,
          python: `def canCompleteCircuit(gas: list[int], cost: list[int]) -> int:
    total = tank = start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        total += gas[i] - cost[i]
        if tank < 0: start = i + 1; tank = 0
    return start if total >= 0 else -1`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 10. DYNAMIC PROGRAMMING
  // ─────────────────────────────────────────────────────
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    icon: "FaChartLine",
    description: "Memoization, tabulation, knapsack variants, LCS, LIS, edit distance, and coin change.",
    difficultySummary: "Medium to Hard",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 border-violet-200 text-violet-700",
    problems: [
      {
        id: "dsa-dp-1",
        title: "Climbing Stairs (Fibonacci DP)",
        difficulty: "Easy",
        companies: ["Amazon", "Google", "Adobe", "Oracle"],
        leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
        gfgUrl: "https://www.geeksforgeeks.org/count-ways-reach-nth-stair/",
        statement: "You climb n stairs, taking 1 or 2 steps at a time. Return the number of distinct ways to reach the top.",
        approach: "dp[i] = dp[i-1] + dp[i-2]. Space-optimize to two variables. Equivalent to Fibonacci sequence.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int climbStairs(int n) {
    if(n <= 2) return n;
    int a = 1, b = 2;
    for(int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
}`,
          python: `def climbStairs(n: int) -> int:
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n+1): a, b = b, a + b
    return b`
        }
      },
      {
        id: "dsa-dp-2",
        title: "0/1 Knapsack Problem",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Google", "TCS"],
        leetcodeUrl: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
        gfgUrl: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
        statement: "Given n items with weights and values, and a max capacity W, maximize value of items that fit in the knapsack.",
        approach: "dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i]). Optimize to 1D DP array traversed right-to-left.",
        complexity: { time: "O(N*W)", space: "O(W)" },
        code: {
          cpp: `int knapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();
    vector<int> dp(W + 1, 0);
    for(int i = 0; i < n; i++)
        for(int w = W; w >= wt[i]; w--)
            dp[w] = max(dp[w], dp[w - wt[i]] + val[i]);
    return dp[W];
}`,
          python: `def knapsack(wt: list[int], val: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for i in range(len(wt)):
        for w in range(W, wt[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - wt[i]] + val[i])
    return dp[W]`
        }
      },
      {
        id: "dsa-dp-3",
        title: "Longest Common Subsequence (LCS)",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Adobe", "Infosys"],
        leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/",
        gfgUrl: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/",
        statement: "Given two strings `text1` and `text2`, return the length of their longest common subsequence.",
        approach: "2D DP: if chars match, dp[i][j] = dp[i-1][j-1]+1. Else dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
        complexity: { time: "O(M*N)", space: "O(M*N)" },
        code: {
          cpp: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for(int i = 1; i <= m; i++)
        for(int j = 1; j <= n; j++) {
            if(text1[i-1] == text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    return dp[m][n];
}`,
          python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`
        }
      },
      {
        id: "dsa-dp-4",
        title: "Coin Change (Minimum Coins)",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Meta", "Paypal"],
        leetcodeUrl: "https://leetcode.com/problems/coin-change/",
        gfgUrl: "https://www.geeksforgeeks.org/coin-change-dp-7/",
        statement: "Given coins and an amount, return the fewest number of coins needed to make up the amount, or -1 if impossible.",
        approach: "BFS on amounts OR DP: dp[a] = min(dp[a], dp[a-coin]+1) for each coin. dp[0]=0, others init to infinity.",
        complexity: { time: "O(Amount * N)", space: "O(Amount)" },
        code: {
          cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for(int a = 1; a <= amount; a++)
        for(int c : coins)
            if(c <= a && dp[a - c] != INT_MAX)
                dp[a] = min(dp[a], dp[a - c] + 1);
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
          python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a: dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`
        }
      },
      {
        id: "dsa-dp-5",
        title: "Longest Increasing Subsequence (LIS)",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Adobe", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/",
        gfgUrl: "https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/",
        statement: "Given integer array `nums`, return the length of the longest strictly increasing subsequence.",
        approach: "O(N log N) approach using patience sorting with binary search. Maintain `tails` array where tails[i] is the smallest tail element.",
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
        if idx == len(tails): tails.append(x)
        else: tails[idx] = x
    return len(tails)`
        }
      },
      {
        id: "dsa-dp-6",
        title: "Edit Distance (Levenshtein Distance)",
        difficulty: "Hard",
        companies: ["Google", "Amazon", "Microsoft", "LinkedIn"],
        leetcodeUrl: "https://leetcode.com/problems/edit-distance/",
        gfgUrl: "https://www.geeksforgeeks.org/edit-distance-dp-5/",
        statement: "Given two strings `word1` and `word2`, return the minimum number of insert/delete/replace operations to convert word1 to word2.",
        approach: "2D DP: if chars match dp[i][j]=dp[i-1][j-1], else dp[i][j]=1+min(insert, delete, replace).",
        complexity: { time: "O(M*N)", space: "O(M*N)" },
        code: {
          cpp: `int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    for(int i = 0; i <= m; i++) dp[i][0] = i;
    for(int j = 0; j <= n; j++) dp[0][j] = j;
    for(int i = 1; i <= m; i++)
        for(int j = 1; j <= n; j++) {
            if(word1[i-1] == word2[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
        }
    return dp[m][n];
}`,
          python: `def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            if word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]
            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 11. SLIDING WINDOW
  // ─────────────────────────────────────────────────────
  {
    id: "sliding-window",
    name: "Sliding Window",
    icon: "FaWindowMaximize",
    description: "Fixed and variable-size windows, frequency maps, and subarray/substring optimization.",
    difficultySummary: "Medium to Hard",
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50 border-sky-200 text-sky-700",
    problems: [
      {
        id: "dsa-sw-1",
        title: "Minimum Window Substring",
        difficulty: "Hard",
        companies: ["Google", "Meta", "Amazon", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
        gfgUrl: "https://www.geeksforgeeks.org/find-the-smallest-window-in-a-string-containing-all-characters-of-another-string/",
        statement: "Given strings `s` and `t`, return the minimum window substring of `s` containing all characters of `t`.",
        approach: "Sliding window with two frequency maps. Expand right until all chars covered. Contract left while maintaining validity.",
        complexity: { time: "O(N+M)", space: "O(N+M)" },
        code: {
          cpp: `string minWindow(string s, string t) {
    unordered_map<char, int> need, have;
    for(char c : t) need[c]++;
    int formed = 0, required = need.size(), l = 0, minLen = INT_MAX, start = 0;
    for(int r = 0; r < s.size(); r++) {
        have[s[r]]++;
        if(need.count(s[r]) && have[s[r]] == need[s[r]]) formed++;
        while(formed == required) {
            if(r - l + 1 < minLen) { minLen = r - l + 1; start = l; }
            have[s[l]]--;
            if(need.count(s[l]) && have[s[l]] < need[s[l]]) formed--;
            l++;
        }
    }
    return minLen == INT_MAX ? "" : s.substr(start, minLen);
}`,
          python: `from collections import Counter
def minWindow(s: str, t: str) -> str:
    need, have = Counter(t), {}
    formed, required = 0, len(need)
    l, res, res_len = 0, (-1,-1), float('inf')
    for r, c in enumerate(s):
        have[c] = have.get(c, 0) + 1
        if c in need and have[c] == need[c]: formed += 1
        while formed == required:
            if r - l + 1 < res_len: res_len = r - l + 1; res = (l, r)
            have[s[l]] -= 1
            if s[l] in need and have[s[l]] < need[s[l]]: formed -= 1
            l += 1
    l, r = res
    return s[l:r+1] if res_len != float('inf') else ""`
        }
      },
      {
        id: "dsa-sw-2",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Meta", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        gfgUrl: "https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/",
        statement: "Given string `s`, find the length of the longest substring without repeating characters.",
        approach: "Sliding window with HashMap storing last index of each char. Move left pointer to max(left, charMap[s[right]]+1).",
        complexity: { time: "O(N)", space: "O(K)" },
        code: {
          cpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> charMap;
    int maxLen = 0, left = 0;
    for(int right = 0; right < s.length(); right++) {
        if(charMap.count(s[right])) left = max(left, charMap[s[right]] + 1);
        charMap[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          python: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    max_len = left = 0
    for right, char in enumerate(s):
        if char in char_map: left = max(left, char_map[char] + 1)
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`
        }
      },
      {
        id: "dsa-sw-3",
        title: "Permutation in String",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Uber", "Bloomberg"],
        leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/",
        gfgUrl: "https://www.geeksforgeeks.org/check-if-a-string-contains-a-permutation-of-another-string/",
        statement: "Return true if one of s1's permutations is a substring of s2.",
        approach: "Fixed window of len(s1). Compare frequency arrays. Slide right, updating only affected characters.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `bool checkInclusion(string s1, string s2) {
    if(s1.size() > s2.size()) return false;
    vector<int> count(26, 0);
    for(char c : s1) count[c-'a']++;
    int l = 0, matches = 0;
    for(int r = 0; r < s2.size(); r++) {
        count[s2[r]-'a']--;
        if(count[s2[r]-'a'] == 0) matches++;
        if(r >= s1.size()) {
            if(count[s2[l]-'a'] == 0) matches--;
            count[s2[l++]-'a']++;
        }
        if(matches == 26) return true;
    }
    return false;
}`,
          python: `from collections import Counter
def checkInclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2): return False
    s1c, wc = Counter(s1), Counter(s2[:len(s1)])
    if s1c == wc: return True
    for i in range(len(s1), len(s2)):
        wc[s2[i]] += 1
        l = s2[i - len(s1)]
        wc[l] -= 1
        if wc[l] == 0: del wc[l]
        if wc == s1c: return True
    return False`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 12. BACKTRACKING
  // ─────────────────────────────────────────────────────
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
        statement: "Given integer array `nums` of unique elements, return all possible subsets (the power set).",
        approach: "Backtrack by deciding for each element whether to include or exclude it from current subset.",
        complexity: { time: "O(2^N)", space: "O(N)" },
        code: {
          cpp: `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> curr;
    auto backtrack = [&](auto& self, int idx) -> void {
        res.push_back(curr);
        for(int i = idx; i < nums.size(); i++) {
            curr.push_back(nums[i]);
            self(self, i + 1);
            curr.pop_back();
        }
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
      },
      {
        id: "dsa-bk-2",
        title: "Permutations",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Microsoft", "Apple"],
        leetcodeUrl: "https://leetcode.com/problems/permutations/",
        gfgUrl: "https://www.geeksforgeeks.org/write-a-c-program-to-print-all-permutations-of-a-given-string/",
        statement: "Given an array `nums` of distinct integers, return all possible permutations.",
        approach: "Backtrack with a visited/used set. At each position, pick any unused number and recurse.",
        complexity: { time: "O(N! * N)", space: "O(N)" },
        code: {
          cpp: `vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> res;
    vector<bool> used(nums.size(), false);
    vector<int> perm;
    auto bt = [&](auto& self) -> void {
        if(perm.size() == nums.size()) { res.push_back(perm); return; }
        for(int i = 0; i < nums.size(); i++) {
            if(used[i]) continue;
            used[i] = true; perm.push_back(nums[i]);
            self(self);
            used[i] = false; perm.pop_back();
        }
    };
    bt(bt);
    return res;
}`,
          python: `def permute(nums: list[int]) -> list[list[int]]:
    res = []
    def backtrack(path, remaining):
        if not remaining: res.append(path[:]); return
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()
    backtrack([], nums)
    return res`
        }
      },
      {
        id: "dsa-bk-3",
        title: "N-Queens",
        difficulty: "Hard",
        companies: ["Amazon", "Google", "Adobe"],
        leetcodeUrl: "https://leetcode.com/problems/n-queens/",
        gfgUrl: "https://www.geeksforgeeks.org/n-queen-problem-backtracking-3/",
        statement: "Return all distinct solutions to the N-Queens puzzle on an NxN board.",
        approach: "Backtrack row by row. Track occupied columns, diagonals (/), and anti-diagonals (\\). Place queen only if all three are free.",
        complexity: { time: "O(N!)", space: "O(N)" },
        code: {
          cpp: `vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> res;
    vector<string> board(n, string(n, '.'));
    set<int> cols, diag, antiDiag;
    auto bt = [&](auto& self, int row) -> void {
        if(row == n) { res.push_back(board); return; }
        for(int col = 0; col < n; col++) {
            if(cols.count(col) || diag.count(row-col) || antiDiag.count(row+col)) continue;
            cols.insert(col); diag.insert(row-col); antiDiag.insert(row+col);
            board[row][col] = 'Q';
            self(self, row + 1);
            board[row][col] = '.';
            cols.erase(col); diag.erase(row-col); antiDiag.erase(row+col);
        }
    };
    bt(bt, 0);
    return res;
}`,
          python: `def solveNQueens(n: int) -> list[list[str]]:
    res = []
    cols, diag, anti = set(), set(), set()
    board = [['.']*n for _ in range(n)]
    def bt(row):
        if row == n: res.append([''.join(r) for r in board]); return
        for col in range(n):
            if col in cols or (row-col) in diag or (row+col) in anti: continue
            cols.add(col); diag.add(row-col); anti.add(row+col)
            board[row][col] = 'Q'
            bt(row + 1)
            board[row][col] = '.'
            cols.discard(col); diag.discard(row-col); anti.discard(row+col)
    bt(0)
    return res`
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────
  // 13. BIT MANIPULATION
  // ─────────────────────────────────────────────────────
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
        statement: "Every element appears twice except for one. Find that single one.",
        approach: "XOR all elements: x ^ x = 0 and x ^ 0 = x, so duplicates cancel out.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for(int x : nums) result ^= x;
    return result;
}`,
          python: `def singleNumber(nums: list[int]) -> int:
    res = 0
    for x in nums: res ^= x
    return res`
        }
      },
      {
        id: "dsa-bit-2",
        title: "Number of 1 Bits (Hamming Weight)",
        difficulty: "Easy",
        companies: ["Apple", "Microsoft", "Amazon"],
        leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/",
        gfgUrl: "https://www.geeksforgeeks.org/count-set-bits-in-an-integer/",
        statement: "Return the number of '1' bits in the binary representation of a positive integer `n`.",
        approach: "Brian Kernighan's trick: n & (n-1) removes the lowest set bit. Count iterations until n=0.",
        complexity: { time: "O(log N)", space: "O(1)" },
        code: {
          cpp: `int hammingWeight(uint32_t n) {
    int count = 0;
    while(n) { n &= (n - 1); count++; }
    return count;
}`,
          python: `def hammingWeight(n: int) -> int:
    return bin(n).count('1')
# Or Brian Kernighan:
# count = 0
# while n: n &= n-1; count += 1
# return count`
        }
      },
      {
        id: "dsa-bit-3",
        title: "Reverse Bits",
        difficulty: "Easy",
        companies: ["Apple", "Amazon", "Qualcomm"],
        leetcodeUrl: "https://leetcode.com/problems/reverse-bits/",
        gfgUrl: "https://www.geeksforgeeks.org/reverse-actual-bits-given-number/",
        statement: "Reverse the bits of a given 32-bit unsigned integer.",
        approach: "Process bit by bit: left-shift result by 1, OR it with LSB of n, right-shift n. Repeat 32 times.",
        complexity: { time: "O(32)", space: "O(1)" },
        code: {
          cpp: `uint32_t reverseBits(uint32_t n) {
    uint32_t result = 0;
    for(int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>= 1;
    }
    return result;
}`,
          python: `def reverseBits(n: int) -> int:
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`
        }
      },
      {
        id: "dsa-bit-4",
        title: "Power of Two",
        difficulty: "Easy",
        companies: ["Google", "Amazon", "Microsoft"],
        leetcodeUrl: "https://leetcode.com/problems/power-of-two/",
        gfgUrl: "https://www.geeksforgeeks.org/program-to-find-whether-a-given-number-is-power-of-2/",
        statement: "Given an integer `n`, return true if it is a power of two.",
        approach: "A power of two has exactly one set bit. n & (n-1) == 0 removes that bit, making result 0. Also check n > 0.",
        complexity: { time: "O(1)", space: "O(1)" },
        code: {
          cpp: `bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
          python: `def isPowerOfTwo(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0`
        }
      },
      {
        id: "dsa-bit-5",
        title: "Missing Number (XOR / Gauss)",
        difficulty: "Easy",
        companies: ["Microsoft", "Amazon", "Google", "TCS"],
        leetcodeUrl: "https://leetcode.com/problems/missing-number/",
        gfgUrl: "https://www.geeksforgeeks.org/find-the-missing-number/",
        statement: "Given array of n distinct numbers in [0, n], find the missing one.",
        approach: "XOR approach: XOR all indices 0..n and all array values. Duplicate values cancel, leaving the missing number.",
        complexity: { time: "O(N)", space: "O(1)" },
        code: {
          cpp: `int missingNumber(vector<int>& nums) {
    int n = nums.size(), xorVal = n;
    for(int i = 0; i < n; i++) xorVal ^= i ^ nums[i];
    return xorVal;
}`,
          python: `def missingNumber(nums: list[int]) -> int:
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)
# Or XOR: reduce(lambda a, b: a^b, nums + list(range(n+1)))`
        }
      }
    ]
  }
];
