'use strict';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const Timers = {
  list: new Set(),
  add(id) { this.list.add(id); },
  clear() { this.list.forEach(id => { clearInterval(id); clearTimeout(id); }); this.list.clear(); }
};
const CodeReg = {};
let codeSeq = 0;
const I = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v3a5 5 0 0 1-10 0V4z"/><path d="M7 4H4v2a4 4 0 0 0 4 4"/><path d="M17 4h3v2a4 4 0 0 1-4 4"/><path d="M12 13v4"/><path d="M9 21h6"/><path d="M8 17h8v-1a4 4 0 0 0-8 0v1z"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 13h6l-1 9 9-11h-6l1-9z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z"/><path d="M4 18.5V5.5"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 11.1l6.8-3.8M8.6 12.9l6.8 3.8"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
  arrR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>',
  arrL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M11 5l-7 7 7 7"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1.7 2.2 2.7 3.7 2.7 5.7A4.3 4.3 0 1 1 6.3 8c0-2.1 1-3.7 2.8-5.7 1.1 1.5 1.8 2.7 2.9 4.5 1.1-1.8 1.8-3 2.9-4.5z"/><path d="M12 10.5c2.7 1.8 3.3 3.7 3.3 5.3A5.8 5.8 0 0 1 12 21a5.8 5.8 0 0 1-3.3-5.2c0-1.6.6-3.5 3.3-5.3z"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7"/></svg>',
  chevD: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8l-5 4 5 4"/><path d="M16 8l5 4-5 4"/><path d="M14 4l-4 16"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="8 5 19 12 8 19 8 5"/></svg>'
};
const DIFFS = ['Easy', 'Medium', 'Hard', 'Expert'];
const DIFF_XP = { Easy: 20, Medium: 40, Hard: 80, Expert: 120 };
const ALGO_CATS = ['Arrays', 'Graphs', 'Dynamic Programming', 'Strings', 'System Design'];
const DEFAULT_STATE = {theme:'dark',contrast:false,xp:0,solved:{},bookmarks:[],notes:{},attempts:[],
 streak:{count:0,best:0,last:null},daily:{date:null,quizBest:null,challengeDone:false},
 quiz:[],activity:{},recent:[],paths:{},achievements:[],pomoTotal:0,pomoToday:{date:null,count:0},dailyEver:false};

const ACH = [
  {id:'first-solve', t:'First Spark', d:'Solve your first problem.', ic:'check', c:s => Object.keys(s.solved).length >= 1},
  {id:'streak-3', t:'3-Day Streak', d:'Maintain a 3-day learning streak.', ic:'flame', c:s => s.streak.count >= 3},
  {id:'ten-solved', t:'Forge Builder', d:'Solve 10 problems.', ic:'target', c:s => Object.keys(s.solved).length >= 10},
  {id:'daily-hero', t:'Daily Hero', d:'Complete today\'s daily challenge.', ic:'award', c:s => !!s.daily.challengeDone},
  {id:'quiz-master', t:'Quiz Master', d:'Score 100% on a daily quiz.', ic:'trophy', c:s => s.quiz.some(q => q.score === q.total)}
];

const QUIZ = [
  {d:'Easy', q:'What is the time complexity of binary search on a sorted array of length n?', o:['O(log n)','O(n)','O(n log n)','O(1)'], a:0, w:'Binary search halves the search space at each step, so the complexity is logarithmic.'},
  {d:'Easy', q:'Which data structure is best for FIFO operations?', o:['Stack','Queue','Set','Tree'], a:1, w:'A queue processes items in the order they were added.'},
  {d:'Easy', q:'Which array operation is usually the fastest for insertion at the front of a dynamic array?', o:['Append','Unshift','Sort','Reverse'], a:1, w:'Unshifting an element at the front requires shifting the rest of the array, so it is costlier than appending.'},
  {d:'Easy', q:'A balanced binary search tree gives which property?', o:['Worst-case O(log n) lookup','Worst-case O(n) lookup','No ordering','Only constant-time inserts'], a:0, w:'BSTs preserve order so lookup, insertion, and deletion stay logarithmic on average in a balanced tree.'},
  {d:'Medium', q:'Which statement best describes dynamic programming?', o:['It always explores every path blindly','It reuses subproblem solutions to avoid repeated work','It only works on trees','It makes all algorithms constant time'], a:1, w:'Dynamic programming stores or reuses the results of overlapping subproblems.'},
  {d:'Medium', q:'What does a hash map trade for O(1) average lookup?', o:['Extra memory','Lower code complexity','Sorted order','No collisions'], a:0, w:'Hash maps typically use extra memory for fast lookup tables.'},
  {d:'Medium', q:'In a graph, the degree of a vertex refers to:', o:['The number of edges incident to it','Its shortest path length','Its parent pointer','Its value in an adjacency matrix'], a:0, w:'Degree counts how many edges touch the vertex.'},
  {d:'Medium', q:'Which step is essential for a correct topological sort?', o:['Always choose the smallest unvisited node','Process nodes with zero in-degree first','Use recursion on every edge','Sort the adjacency list descending'], a:1, w:'Kahn\'s algorithm repeatedly processes nodes that currently have no incoming edges.'},
  {d:'Hard', q:'A graph with no cycles is called a ___.', o:['Complete graph','Connected graph','Acyclic graph','Weighted graph'], a:2, w:'A graph without cycles is acyclic.'},
  {d:'Hard', q:'Which traversal is usually used to find the shortest path in an unweighted graph?', o:['Depth-first search','Breadth-first search','Quick sort','Binary search'], a:1, w:'Breadth-first search guarantees shortest paths in unweighted graphs.'},
  {d:'Hard', q:'What is the main benefit of memoization?', o:['It reduces repeated recomputation of subproblems','It guarantees the answer is always unique','It sorts a list automatically','It eliminates all recursion'], a:0, w:'Memoization caches expensive subproblem results so the same state is not recomputed.'},
  {d:'Hard', q:'If a problem has overlapping subproblems and optimal substructure, which pattern is usually appropriate?', o:['Greedy','Dynamic programming','Linear scan','Traversal only'], a:1, w:'DP is designed for problems that reuse intermediate states and can be decomposed optimally.'},
  {d:'Hard', q:'Which property is true for a min-heap?', o:['The root is the smallest element','The root is the largest element','Leaves always contain the minimum','It is sorted in ascending order at all levels'], a:0, w:'A min-heap ensures the smallest element is always at the root.'},
  {d:'Expert', q:'In a trie, which operation is most naturally optimized?', o:['Prefix lookup','Prime factorization','Merge sort','Matrix multiplication'], a:0, w:'A trie stores characters as a branching tree and is excellent for prefix-based lookups.'},
  {d:'Expert', q:'Which statement best describes a sliding-window approach?', o:['It process every possible subarray in O(n^2)','It keeps a moving range of data and updates it incrementally','It only works on sorted arrays','It discards all prior state'], a:1, w:'Sliding window maintains a window and updates it as the boundaries move, avoiding unnecessary recomputation.'},
  {d:'Expert', q:'For an interval scheduling problem, the greedy choice is usually to:', o:['Pick the interval with the largest duration first','Sort by end time and take the earliest finishing interval','Skip all overlapping intervals','Use BFS from every node'], a:1, w:'Greedy interval scheduling typically sorts by finishing time and selects the next compatible interval.'},
  {d:'Expert', q:'Which data structure is best for finding the k smallest values efficiently?', o:['Queue','Min-heap','Stack','Hash table'], a:1, w:'A min-heap supports efficient extraction of the smallest values.'},
  {d:'Expert', q:'What is the key idea behind union-find?', o:['It maintains sets and quickly merges them with parent pointers','It always sorts edges in descending order','It stores all values in a trie','It runs Dijkstra to check all paths'], a:0, w:'Union-find tracks connected components and supports near-constant time merges and finds under path compression.'}
];

const PROBLEMS = [
  {
    id: 'two-sum',
    t: 'Two Sum',
    diff: 'Easy',
    topics: ['Arrays', 'Hash Maps'],
    comps: ['Amazon', 'Microsoft'],
    pop: 96,
    stmt: 'Given an array of integers and a target value, return the indices of the two numbers that add up to the target. Assume exactly one valid answer exists.',
    cons: ['1 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    ex: [{ i: 'nums = [2, 7, 11, 15], target = 9', o: '[0, 1]', e: '2 + 7 = 9.' }, { i: 'nums = [3, 2, 4], target = 6', o: '[1, 2]', e: '2 + 4 = 6.' }],
    hints: ['Use a hash map to remember seen values and their indices.', 'For each number, check whether the complement is already in the map.'],
    sols: [{
      a: 'Hash map scanning',
      tc: 'O(n)',
      sc: 'O(n)',
      py: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        need = target - num
        if need in seen:
            return [seen[need], i]
        seen[num] = i
    return []
`,
      js: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`
    }],
    rel: ['binary-search', 'valid-parentheses'],
    params: ['nums', 'target'],
    fn: 'twoSum'
  },
  {
    id: 'binary-search',
    t: 'Binary Search in Sorted Array',
    diff: 'Easy',
    topics: ['Searching'],
    comps: ['Google', 'Meta'],
    pop: 89,
    stmt: 'Implement binary search to find the index of a target value in a sorted array. Return -1 if the target is not present.',
    cons: ['1 <= nums.length <= 10^5', 'nums is sorted in ascending order'],
    ex: [{ i: 'nums = [1, 3, 5, 7, 9], target = 7', o: '3', e: '7 is at index 3.' }, { i: 'nums = [1, 3, 5, 7, 9], target = 6', o: '-1', e: '6 is not in the array.' }],
    hints: ['Maintain a left and right boundary.', 'Move the left pointer right or the right pointer left based on the comparison.'],
    sols: [{
      a: 'Classic binary search',
      tc: 'O(log n)',
      sc: 'O(1)',
      py: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
      js: `function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`
    }],
    rel: ['two-sum'],
    params: ['nums', 'target'],
    fn: 'binarySearch'
  },
  {
    id: 'valid-parentheses',
    t: 'Valid Parentheses',
    diff: 'Easy',
    topics: ['Stacks', 'Strings'],
    comps: ['Apple', 'Stripe'],
    pop: 82,
    stmt: 'Given a string containing only parentheses, determine if it is valid. Every opening bracket must be closed by a matching closing bracket in the correct order.',
    cons: ['1 <= s.length <= 10^4', 's contains only ()[]{}'],
    ex: [{ i: 's = "()[]{}"', o: 'true', e: 'The brackets are balanced.' }, { i: 's = "([)]"', o: 'false', e: 'The closing order is wrong.' }],
    hints: ['Use a stack for opening brackets.', 'When you see a closing bracket, match it with the last opening bracket.'],
    sols: [{
      a: 'Stack matching',
      tc: 'O(n)',
      sc: 'O(n)',
      py: `def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif not stack or pairs[ch] != stack.pop():
            return False
    return not stack
`,
      js: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if ("([{\".includes(ch)) stack.push(ch);
    else if (!stack.length || pairs[ch] !== stack.pop()) return false;
  }
  return stack.length === 0;
}`
    }],
    rel: ['two-sum', 'binary-search'],
    params: ['s'],
    fn: 'isValid'
  },
  {
    id: 'climbing-stairs',
    t: 'Climbing Stairs',
    diff: 'Medium',
    topics: ['Dynamic Programming'],
    comps: ['Uber', 'Netflix'],
    pop: 88,
    stmt: 'You are climbing a staircase. Each step can be taken in 1 or 2 steps. Count how many distinct ways to reach the top.',
    cons: ['1 <= n <= 45'],
    ex: [{ i: 'n = 2', o: '2', e: '1+1 and 2.' }, { i: 'n = 3', o: '3', e: '1+1+1, 1+2, 2+1.' }],
    hints: ['This is a classic Fibonacci-style recurrence.', 'Work from the bottom up using the previous two counts.'],
    sols: [{
      a: 'DP bottom-up',
      tc: 'O(n)',
      sc: 'O(1)',
      py: `def climb_stairs(n):
    a, b = 1, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b if n >= 1 else 1
`,
      js: `function climbStairs(n) {
  let prev = 1, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}`
    }],
    rel: ['binary-search'],
    params: ['n'],
    fn: 'climbStairs'
  },
  {
    id: 'number-of-islands',
    t: 'Number of Islands',
    diff: 'Medium',
    topics: ['Graphs', 'DFS'],
    comps: ['Amazon', 'Dropbox'],
    pop: 85,
    stmt: 'Given a grid of 1s and 0s, count the number of connected islands of land cells.',
    cons: ['m, n >= 1', 'grid[i][j] is 0 or 1'],
    ex: [{ i: 'grid = [[1,1,0],[1,0,1],[0,1,0]]', o: '3', e: 'There are three disconnected groups of land.' }],
    hints: ['Perform DFS or BFS over each unvisited land cell.', 'Mark visited cells to avoid double counting.'],
    sols: [{
      a: 'DFS flood fill',
      tc: 'O(mn)',
      sc: 'O(mn)',
      py: `def num_islands(grid):
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    seen = [[False]*n for _ in range(m)]
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == 0 or seen[r][c]:
            return
        seen[r][c] = True
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            dfs(r+dr, c+dc)
    count = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1 and not seen[r][c]:
                count += 1
                dfs(r, c)
    return count
`,
      js: `function numIslands(grid) {
  const m = grid.length, n = grid[0].length;
  const seen = Array.from({ length: m }, () => Array(n).fill(false));
  const dfs = (r, c) => {
    if (r < 0 || r >= m || c < 0 || c >= n || !grid[r][c] || seen[r][c]) return;
    seen[r][c] = true;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => dfs(r + dr, c + dc));
  };
  let count = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] && !seen[r][c]) { count++; dfs(r, c); }
    }
  }
  return count;
}`
    }],
    rel: ['binary-search'],
    params: ['grid'],
    fn: 'numIslands'
  },
  {
    id: 'merge-intervals',
    t: 'Merge Intervals',
    diff: 'Medium',
    topics: ['Arrays', 'Sorting'],
    comps: ['Google', 'Uber'],
    pop: 83,
    stmt: 'Given an array of intervals, merge all overlapping intervals and return the merged list.',
    cons: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2'],
    ex: [{ i: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', o: '[[1,6],[8,10],[15,18]]', e: 'The overlapping intervals [1,3] and [2,6] merge into [1,6].' }, { i: 'intervals = [[1,4],[4,5]]', o: '[[1,5]]', e: 'Touching intervals are merged when they overlap or connect by adjacency.' }],
    hints: ['Sort by the start value first.', 'Keep the current merged interval and extend it when the next interval overlaps.'],
    sols: [{
      a: 'Sort and merge',
      tc: 'O(n log n)',
      sc: 'O(n)',
      py: `def merge_intervals(intervals):
    if not intervals: return []
    intervals = sorted(intervals)
    merged = [intervals[0]]
    for s, e in intervals[1:]:
        last = merged[-1]
        if s <= last[1]:
            last[1] = max(last[1], e)
        else:
            merged.append([s, e])
    return merged
`,
      js: `function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (const [s, e] of intervals.slice(1)) {
    const last = merged[merged.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  return merged;
}`
    }],
    rel: ['binary-search'],
    params: ['intervals'],
    fn: 'mergeIntervals'
  },
  {
    id: 'longest-substring',
    t: 'Longest Substring Without Repeating Characters',
    diff: 'Medium',
    topics: ['Strings', 'Sliding Window'],
    comps: ['Microsoft', 'Amazon'],
    pop: 91,
    stmt: 'Return the length of the longest substring without repeating characters.',
    cons: ['0 <= s.length <= 5 * 10^4', 's consists only of English letters, digits, symbols, and spaces'],
    ex: [{ i: 's = "abcabcbb"', o: '3', e: '"abc" is the longest substring without repetition.' }, { i: 's = "bbbbb"', o: '1', e: 'Only one unique character can appear in the longest window.' }],
    hints: ['Use a sliding window with a hash map of seen characters.', 'When a duplicate is found, move the left pointer forward.'],
    sols: [{
      a: 'Sliding window',
      tc: 'O(n)',
      sc: 'O(n)',
      py: `def length_of_longest_substring(s):
    seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in seen:
            left = max(left, seen[ch] + 1)
        seen[ch] = right
        best = max(best, right - left + 1)
    return best
`,
      js: `function lengthOfLongestSubstring(s) {
  const seen = {};
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (seen[ch] !== undefined) left = Math.max(left, seen[ch] + 1);
    seen[ch] = right;
    best = Math.max(best, right - left + 1);
  }
  return best;
}`
    }],
    rel: ['binary-search'],
    params: ['s'],
    fn: 'lengthOfLongestSubstring'
  },
  {
    id: 'house-robber',
    t: 'House Robber',
    diff: 'Medium',
    topics: ['Dynamic Programming'],
    comps: ['Meta', 'Apple'],
    pop: 77,
    stmt: 'You are a robber planning the maximum amount of money you can rob without robbing two adjacent houses.',
    cons: ['1 <= nums.length <= 200', '0 <= nums[i] <= 400'],
    ex: [{ i: 'nums = [1,2,3,1]', o: '4', e: 'Rob houses at index 0 and 2 for a total of 4.' }, { i: 'nums = [2,7,9,3,1]', o: '12', e: 'Rob 2 + 9 + 1 = 12.' }],
    hints: ['Use a rolling DP state: either rob this house or skip it.', 'Track the best value up to the previous house.'],
    sols: [{
      a: 'DP with rolling state',
      tc: 'O(n)',
      sc: 'O(1)',
      py: `def house_robber(nums):
    prev_two = 0
    prev_one = 0
    for n in nums:
        curr = max(prev_one, prev_two + n)
        prev_two, prev_one = prev_one, curr
    return prev_one
`,
      js: `function houseRobber(nums) {
  let prevTwo = 0, prevOne = 0;
  for (const n of nums) {
    const curr = Math.max(prevOne, prevTwo + n);
    prevTwo = prevOne;
    prevOne = curr;
  }
  return prevOne;
}`
    }],
    rel: ['binary-search'],
    params: ['nums'],
    fn: 'houseRobber'
  },
  {
    id: 'course-schedule',
    t: 'Course Schedule',
    diff: 'Hard',
    topics: ['Graphs', 'Topological Sort'],
    comps: ['Amazon', 'Netflix'],
    pop: 94,
    stmt: 'There are numCourses courses and prerequisites edges. Determine whether you can finish all courses.',
    cons: ['1 <= numCourses <= 2000', 'prerequisites.length <= 5000'],
    ex: [{ i: 'numCourses = 2, prerequisites = [[1,0]]', o: 'true', e: 'You can take course 0 then 1.' }, { i: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', o: 'false', e: 'There is a cycle.' }],
    hints: ["Use Kahn's algorithm or DFS with a state map.", 'If you process all nodes, the graph is acyclic.'],
    sols: [{
      a: 'Kahn topological sort',
      tc: 'O(V + E)',
      sc: 'O(V + E)',
      py: `from collections import deque

def can_finish(num_courses, prerequisites):
    indeg = [0] * num_courses
    graph = [[] for _ in range(num_courses)]
    for course, pre in prerequisites:
        graph[pre].append(course)
        indeg[course] += 1
    q = deque([i for i in range(num_courses) if indeg[i] == 0])
    seen = 0
    while q:
        node = q.popleft()
        seen += 1
        for nxt in graph[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return seen == num_courses
`,
      js: `function canFinish(numCourses, prerequisites) {
  const indeg = Array(numCourses).fill(0);
  const graph = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indeg[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
  let seen = 0;
  while (queue.length) {
    const node = queue.shift();
    seen++;
    for (const nxt of graph[node]) {
      indeg[nxt]--;
      if (indeg[nxt] === 0) queue.push(nxt);
    }
  }
  return seen === numCourses;
}`
    }],
    rel: ['number-of-islands'],
    params: ['numCourses', 'prerequisites'],
    fn: 'canFinish'
  },
  {
    id: 'word-ladder',
    t: 'Word Ladder',
    diff: 'Hard',
    topics: ['Graphs', 'Breadth-First Search'],
    comps: ['Google', 'LinkedIn'],
    pop: 90,
    stmt: 'Return the length of the shortest transformation sequence from beginWord to endWord, converting one letter at a time.',
    cons: ['All words have same length', 'You can only use words in the word list'],
    ex: [{ i: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', o: '5', e: 'hit -> hot -> dot -> dog -> cog, a five-step ladder.' }, { i: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', o: '0', e: 'No transformation sequence exists.' }],
    hints: ['This is BFS on word states.', 'Each neighbor differs by one character.'],
    sols: [{
      a: 'Breadth-first search',
      tc: 'O(n * L^2)',
      sc: 'O(n)',
      py: `from collections import deque

def ladder_length(begin_word, end_word, word_list):
    if end_word not in word_list: return 0
    q = deque([(begin_word, 1)])
    seen = {begin_word}
    while q:
        word, dist = q.popleft()
        if word == end_word: return dist
        for i in range(len(word)):
            for ch in 'abcdefghijklmnopqrstuvwxyz':
                nxt = word[:i] + ch + word[i+1:]
                if nxt in word_list and nxt not in seen:
                    seen.add(nxt)
                    q.append((nxt, dist + 1))
    return 0
`,
      js: `function ladderLength(beginWord, endWord, wordList) {
  if (!wordList.includes(endWord)) return 0;
  const queue = [[beginWord, 1]];
  const seen = new Set([beginWord]);
  while (queue.length) {
    const [word, dist] = queue.shift();
    if (word === endWord) return dist;
    for (let i = 0; i < word.length; i++) {
      for (const ch of 'abcdefghijklmnopqrstuvwxyz') {
        const nextWord = word.slice(0, i) + ch + word.slice(i + 1);
        if (wordList.includes(nextWord) && !seen.has(nextWord)) {
          seen.add(nextWord);
          queue.push([nextWord, dist + 1]);
        }
      }
    }
  }
  return 0;
}`
    }],
    rel: ['number-of-islands'],
    params: ['beginWord', 'endWord', 'wordList'],
    fn: 'ladderLength'
  },
  {
    id: 'lru-cache',
    t: 'LRU Cache',
    diff: 'Hard',
    topics: ['Design', 'Hash Maps'],
    comps: ['Amazon', 'Oracle'],
    pop: 87,
    stmt: 'Design an LRU cache with get and put operations using O(1) average time complexity.',
    cons: ['capacity > 0'],
    ex: [{ i: 'capacity = 2, operations = [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2],["get",1],["get",3]]', o: '[null,null,1,null,-1,1,3]', e: 'Reading key 1 makes it recently used, so inserting key 3 evicts key 2.' }],
    hints: ['Use a hash map plus a doubly linked list.', 'The list tracks recency order.'],
    sols: [{
      a: 'Hash map + doubly linked list',
      tc: 'O(1)',
      sc: 'O(capacity)',
        py: `from collections import OrderedDict

    class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache: self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity: self.cache.popitem(last=False)
`,
      js: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) this.map.delete(this.map.keys().next().value);
  }
}`
    }],
    rel: ['number-of-islands'],
    params: ['capacity'],
    fn: 'LRUCache'
  },
  {
    id: 'top-k-frequent',
    t: 'Top K Frequent Elements',
    diff: 'Medium',
    topics: ['Hash Maps', 'Heaps'],
    comps: ['Meta', 'Amazon'],
    pop: 79,
    stmt: 'Return the k most frequent elements in the array. The answer can be returned in any order.',
    cons: ['1 <= nums.length <= 10^5', '1 <= k <= nums.length'],
    ex: [{ i: 'nums = [1,1,1,2,2,3], k = 2', o: '[1,2]', e: '1 appears three times and 2 appears twice.' }, { i: 'nums = [1], k = 1', o: '[1]', e: 'The single element is the only answer.' }],
    hints: ['Count frequencies with a hash map.', 'Use a heap or sorting by count.'],
    sols: [{
      a: 'Hash map + heap',
      tc: 'O(n log k)',
      sc: 'O(n)',
      py: `import heapq

def top_k_frequent(nums, k):
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    return [n for n, _ in sorted(counts.items(), key=lambda kv: kv[1], reverse=True)[:k]]
`,
      js: `function topKFrequent(nums, k) {
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([n]) => n);
}`
    }],
    rel: ['number-of-islands'],
    params: ['nums', 'k'],
    fn: 'topKFrequent'
  },
  {
    id: 'n-queens',
    t: 'N-Queens',
    diff: 'Expert',
    topics: ['Backtracking', 'Arrays'],
    comps: ['Google', 'Amazon'],
    pop: 96,
    stmt: 'Return all distinct solutions to the n-queens puzzle, where n queens are placed on an n x n board so that no two attack each other.',
    cons: ['1 <= n <= 9'],
    ex: [{ i: 'n = 4', o: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', e: 'There are two valid queen arrangements.' }],
    hints: ['Try placing one queen at a time.', 'Track columns and diagonals to prune invalid branches.'],
    sols: [{
      a: 'Backtracking',
      tc: 'O(n!)',
      sc: 'O(n)',
      py: `def solve_n_queens(n):
    cols = set(); diag1 = set(); diag2 = set(); board = []; res = []
    def backtrack(r):
        if r == n:
            res.append([''.join(row) for row in board])
            return
        for c in range(n):
            if c in cols or (r - c) in diag1 or (r + c) in diag2:
                continue
            cols.add(c); diag1.add(r - c); diag2.add(r + c)
            board.append(['.'] * n); board[-1][c] = 'Q'
            backtrack(r + 1)
            board.pop()
            cols.remove(c); diag1.remove(r - c); diag2.remove(r + c)
    backtrack(0)
    return res
`,
      js: `function solveNQueens(n) {
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  const board = [];
  const res = [];
  function backtrack(r) {
    if (r === n) {
      res.push(board.map(row => row.join('')));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;
      cols.add(c); diag1.add(r - c); diag2.add(r + c);
      const row = Array(n).fill('.');
      row[c] = 'Q';
      board.push(row);
      backtrack(r + 1);
      board.pop();
      cols.delete(c); diag1.delete(r - c); diag2.delete(r + c);
    }
  }
  backtrack(0);
  return res;
}`
    }],
    rel: ['number-of-islands'],
    params: ['n'],
    fn: 'solveNQueens'
  },
  {
    id: 'product-except-self',
    t: 'Product of Array Except Self',
    diff: 'Medium',
    topics: ['Arrays', 'Prefix Products'],
    comps: ['Amazon', 'Microsoft'],
    pop: 84,
    stmt: 'Return an array where each position contains the product of every input value except the value at that position. Do not use division.',
    cons: ['2 <= nums.length <= 10^5', 'The product of any prefix or suffix fits in a 32-bit integer'],
    ex: [{ i: 'nums = [1,2,3,4]', o: '[24,12,8,6]', e: 'Each result combines the product before and after its index.' }, { i: 'nums = [-1,1,0,-3,3]', o: '[0,0,9,0,0]', e: 'The zero makes every result zero except the zero position.' }],
    hints: ['Store prefix products in the result first.', 'Multiply by a rolling suffix product in a second pass.'],
    sols: [{
      a: 'Prefix and suffix products',
      tc: 'O(n)',
      sc: 'O(1) extra',
      py: `def product_except_self(nums):
    result = [1] * len(nums)
    prefix = 1
    for i in range(len(nums)):
        result[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(len(nums) - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    return result
`,
      js: `function productExceptSelf(nums) {
  const result = Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}`
    }],
    rel: ['two-sum', 'merge-intervals'],
    params: ['nums'],
    fn: 'productExceptSelf'
  },
  {
    id: 'coin-change',
    t: 'Coin Change',
    diff: 'Hard',
    topics: ['Dynamic Programming', 'Unbounded Knapsack'],
    comps: ['Amazon', 'Google'],
    pop: 86,
    stmt: 'Given coin denominations and an amount, return the minimum number of coins needed to make that amount, or -1 if it is impossible.',
    cons: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    ex: [{ i: 'coins = [1,2,5], amount = 11', o: '3', e: '11 is made with 5 + 5 + 1.' }, { i: 'coins = [2], amount = 3', o: '-1', e: 'No combination of 2-value coins makes 3.' }],
    hints: ['Let dp[x] be the fewest coins needed to make amount x.', 'For each amount, try every coin that does not exceed it.'],
    sols: [{
      a: 'Bottom-up dynamic programming',
      tc: 'O(amount * coins)',
      sc: 'O(amount)',
      py: `def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for value in range(1, amount + 1):
        for coin in coins:
            if coin <= value:
                dp[value] = min(dp[value], dp[value - coin] + 1)
    return dp[amount] if dp[amount] <= amount else -1
`,
      js: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let value = 1; value <= amount; value++) {
    for (const coin of coins) {
      if (coin <= value) dp[value] = Math.min(dp[value], dp[value - coin] + 1);
    }
  }
  return dp[amount] <= amount ? dp[amount] : -1;
}`
    }],
    rel: ['climbing-stairs', 'house-robber'],
    params: ['coins', 'amount'],
    fn: 'coinChange'
  },
  {
    id: 'trapping-rain-water',
    t: 'Trapping Rain Water',
    diff: 'Hard',
    topics: ['Arrays', 'Two Pointers'],
    comps: ['Google', 'Amazon'],
    pop: 92,
    stmt: 'Given non-negative bar heights, compute how much rain water can be trapped between the bars.',
    cons: ['1 <= height.length <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    ex: [{ i: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', o: '6', e: 'The elevation map traps six units of water.' }, { i: 'height = [4,2,0,3,2,5]', o: '9', e: 'Water is bounded by the tallest bars on both sides.' }],
    hints: ['Water at a position depends on the shorter of its left and right maximums.', 'Move the pointer whose current height is smaller while tracking its maximum.'],
    sols: [{
      a: 'Two pointers',
      tc: 'O(n)',
      sc: 'O(1)',
      py: `def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1
    return water
`,
      js: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left++];
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right--];
    }
  }
  return water;
}`
    }],
    rel: ['two-sum', 'merge-intervals'],
    params: ['height'],
    fn: 'trap'
  },
  {
    id: 'regex-matching',
    t: 'Regular Expression Matching',
    diff: 'Expert',
    topics: ['Dynamic Programming', 'Strings'],
    comps: ['Google', 'Meta'],
    pop: 89,
    stmt: 'Implement full-string matching for a pattern containing lowercase letters, dot (any one character), and star (zero or more of the preceding element).',
    cons: ['1 <= s.length <= 20', '1 <= p.length <= 30', 'The pattern is valid'],
    ex: [{ i: 's = "aa", p = "a"', o: 'false', e: 'The pattern does not consume both characters.' }, { i: 's = "ab", p = ".*"', o: 'true', e: 'Dot-star can match any sequence.' }, { i: 's = "aab", p = "c*a*b"', o: 'true', e: 'The c-star can match zero characters, then a-star matches aa.' }],
    hints: ['Define dp[i][j] as whether the first i text characters match the first j pattern characters.', 'For star, consider matching zero copies or consuming one matching text character.'],
    sols: [{
      a: 'Two-dimensional dynamic programming',
      tc: 'O(mn)',
      sc: 'O(mn)',
      py: `def is_match(s, p):
    dp = [[False] * (len(p) + 1) for _ in range(len(s) + 1)]
    dp[0][0] = True
    for j in range(2, len(p) + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    for i in range(1, len(s) + 1):
        for j in range(1, len(p) + 1):
            if p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            elif p[j - 1] == '*':
                dp[i][j] = dp[i][j - 2]
                if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
    return dp[-1][-1]
`,
      js: `function isMatch(s, p) {
  const dp = Array.from({ length: s.length + 1 }, () => Array(p.length + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= p.length; j++) {
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= p.length; j++) {
      if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) dp[i][j] = dp[i - 1][j - 1];
      else if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2];
        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) dp[i][j] ||= dp[i - 1][j];
      }
    }
  }
  return dp[s.length][p.length];
}`
    }],
    rel: ['longest-substring'],
    params: ['s', 'p'],
    fn: 'isMatch'
  }
];

const PATHS = [
  {id:'starter', t:'Foundation Path', lvl:'Beginner', time:'2 weeks', color:'#6d8bff', icon:'code', desc:'Learn arrays, hashes, and core patterns to build confidence.', steps:[
    {id:'arrays', t:'Array basics', d:'Understand indexing and common operations.', type:'algo', ref:'binary-search'},
    {id:'hashes', t:'Hash maps', d:'Use maps for constant-time lookups.', type:'problem', ref:'two-sum'},
    {id:'stacks', t:'Stack patterns', d:'Handle nested structures and undo flows.', type:'problem', ref:'valid-parentheses'}
  ]},
  {id:'graphs', t:'Graphs & Traversal', lvl:'Intermediate', time:'3 weeks', color:'#22d3ee', icon:'target', desc:'Understand connected components, traversal, and shortest-path thinking.', steps:[
    {id:'dfs', t:'Depth-first search', d:'Recognize graph reachability patterns.', type:'problem', ref:'number-of-islands'},
    {id:'bfs', t:'Breadth-first search', d:'Practice queue-driven exploration.', type:'algo', ref:'bfs'},
    {id:'paths', t:'Shortest paths', d:'Review why BFS matters in unweighted graphs.', type:'quiz', ref:'daily'}
  ]}
];

const ALGOS = [
  {id:'binary-search', name:'Binary Search', cat:'Arrays', desc:'Efficiently locate a target by halving the search space each step.', time:'O(log n)', space:'O(1)', stable:true, steps:['Set a low and high pointer.','Compare the midpoint with the target.','Discard the half that cannot contain the target.'], code:{py:'def binary_search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n', js:'function binarySearch(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}' }},
  {id:'deque', name:'Deque', cat:'Arrays', desc:'A double-ended queue supports fast insertion and removal from both ends.', time:'O(1)', space:'O(n)', stable:true, steps:['Use a deque for sliding-window problems.','Add on the front or back depending on the operation.'], code:{py:'from collections import deque\nq = deque([1, 2, 3])\nq.appendleft(0)\nq.pop()\n', js:'const q = [1, 2, 3];\nq.unshift(0);\nq.pop();\n'}},
  {id:'bfs', name:'Breadth-First Search', cat:'Graphs', desc:'Explore neighbors level by level to find shortest paths in unweighted graphs.', time:'O(V + E)', space:'O(V)', stable:false, steps:['Enqueue the start node.','Visit the frontier one layer at a time.','Track visited nodes to prevent loops.'], code:{py:'from collections import deque\n\ndef bfs(graph, start):\n    seen = {start}\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nxt in graph.get(node, []):\n            if nxt not in seen:\n                seen.add(nxt)\n                q.append(nxt)\n    return seen\n', js:'function bfs(graph, start) {\n  const queue = [start];\n  const seen = new Set([start]);\n  while (queue.length) {\n    const node = queue.shift();\n    for (const nxt of graph[node] || []) {\n      if (!seen.has(nxt)) { seen.add(nxt); queue.push(nxt); }\n    }\n  }\n  return seen;\n}'}},
  {id:'dp-intro', name:'Dynamic Programming', cat:'Dynamic Programming', desc:'Break a problem into overlapping subproblems and cache the intermediate answers.', time:'O(n)', space:'O(n)', stable:true, steps:['Define the recurrence.','Cache previous states.','Compute from base cases upward.'], code:{py:'def fib(n):\n    dp = [0, 1]\n    for _ in range(2, n + 1):\n        dp.append(dp[-1] + dp[-2])\n    return dp[n]\n', js:'function fib(n) {\n  const dp = [0, 1];\n  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];\n  return dp[n];\n}' }},
  {id:'hash-map', name:'Hash Map', cat:'Arrays', desc:'Store data in key-value pairs for fast lookup and updates.', time:'O(1) avg', space:'O(n)', stable:true, steps:['Compute a hash for the key.','Store the value in a bucket.','Use collision resolution to avoid overwriting entries.'], code:{py:'seen = {"apple": 2, "banana": 3}\nprint(seen["apple"])\n', js:'const seen = { apple: 2, banana: 3 };\nconsole.log(seen.apple);\n'}}
];

let state;
function cloneState(obj) { return JSON.parse(JSON.stringify(obj)); }
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch])); }
function pad(n) { return String(n).padStart(2, '0'); }
function todayKey(date = new Date()) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
function dayKeyOf(date) { return todayKey(date); }
function dayOfYear(date = new Date()) { const start = new Date(date.getFullYear(), 0, 0); return Math.floor((date - start) / 86400000); }
function mulberry32(seed) { return function() { let t = (seed += 0x6D2B79F5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function debounce(fn, wait = 150) { let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), wait); }; }
function fmtDate(ts) { return new Date(ts).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}); }
function snake(name) { return name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/\s+/g, '_').toLowerCase(); }
const P_BY_ID = Object.fromEntries(PROBLEMS.map(p => [p.id, p]));
const EXTERNAL_EQUIVALENTS = {
  'two-sum': 'https://leetcode.com/problems/two-sum/',
  'binary-search': 'https://leetcode.com/problems/binary-search/',
  'valid-parentheses': 'https://leetcode.com/problems/valid-parentheses/',
  'climbing-stairs': 'https://leetcode.com/problems/climbing-stairs/',
  'number-of-islands': 'https://leetcode.com/problems/number-of-islands/',
  'merge-intervals': 'https://leetcode.com/problems/merge-intervals/',
  'longest-substring': 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  'house-robber': 'https://leetcode.com/problems/house-robber/',
  'course-schedule': 'https://leetcode.com/problems/course-schedule/',
  'word-ladder': 'https://leetcode.com/problems/word-ladder/',
  'lru-cache': 'https://leetcode.com/problems/lru-cache/',
  'top-k-frequent': 'https://leetcode.com/problems/top-k-frequent-elements/',
  'n-queens': 'https://leetcode.com/problems/n-queens/',
  'product-except-self': 'https://leetcode.com/problems/product-of-array-except-self/',
  'coin-change': 'https://leetcode.com/problems/coin-change/',
  'trapping-rain-water': 'https://leetcode.com/problems/trapping-rain-water/',
  'regex-matching': 'https://leetcode.com/problems/regular-expression-matching/'
};
const EXTERNAL_CATALOG_FALLBACKS = {
  py: 'https://www.codechef.com/practice/python',
  cpp: 'https://codeforces.com/problemset',
  csharp: 'https://leetcode.com/problemset/',
  java: 'https://www.interviewbit.com/courses/fast-track-java/',
  go: 'https://www.codechef.com/practice/go'
};
const EXTERNAL_PLATFORMS = [
  {name: 'LeetCode', url: 'https://leetcode.com/problemset/'},
  {name: 'InterviewBit', url: 'https://www.interviewbit.com/coding-interview-questions/'},
  {name: 'AlgoExpert', url: 'https://www.algoexpert.io/questions'},
  {name: 'AlgoMaster', url: 'https://algomaster.io/practice/dsa-patterns'},
  {name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/explore/'},
  {name: 'Codeforces', url: 'https://codeforces.com/problemset'},
  {name: 'CodeChef', url: 'https://www.codechef.com/practice'},
  {name: 'AtCoder', url: 'https://atcoder.jp/contests/'},
  {name: 'SPOJ', url: 'https://www.spoj.com/problems/'},
  {name: 'Project Euler', url: 'https://projecteuler.net/archives'}
];
const HIDDEN_TESTS = {
  'two-sum': [{args: [[3, 3], 6], output: [0, 1]}],
  'lru-cache': [{args: [1, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['get', 2]]], output: [null, null, -1, 2]}],
  'binary-search': [{args: [[1, 2, 3, 4, 5], 2], output: 1}],
  'valid-parentheses': [{args: ['([)]'], output: false}],
  'climbing-stairs': [{args: [5], output: 8}],
  'number-of-islands': [{args: [[[1, 1], [0, 1]]], output: 1}],
  'merge-intervals': [{args: [[[1, 4], [2, 3], [6, 8]]], output: [[1, 4], [6, 8]]}],
  'longest-substring': [{args: ['pwwkew'], output: 3}],
  'house-robber': [{args: [[2, 1, 1, 2]], output: 4}],
  'course-schedule': [{args: [2, [[1, 0], [0, 1]]], output: false}],
  'word-ladder': [{args: ['a', 'c', ['a', 'b', 'c']], output: 2}],
  'top-k-frequent': [{args: [[7, 7, 7, 8, 8, 9], 1], output: [7]}],
  'n-queens': [{args: [1], output: [['Q']]}],
  'product-except-self': [{args: [[0, 2]], output: [2, 0]}],
  'coin-change': [{args: [[1, 3, 4], 6], output: 2}],
  'trapping-rain-water': [{args: [[2, 0, 2]], output: 2}],
  'regex-matching': [{args: ['mississippi', 'mis*is*p*.'], output: false}]
};
try {
  state = Object.assign(cloneState(DEFAULT_STATE), JSON.parse(localStorage.getItem('algoforge_v1') || '{}'));
} catch (e) {
  state = cloneState(DEFAULT_STATE);
}
/* Saves to the logged-in student's own slot (see auth.js),
   or the legacy single-profile key in guest mode. */
const save = () => {
  try {
    const user = (typeof AFAuth !== 'undefined') ? AFAuth.currentUser() : null;
    if (user && typeof AFData !== 'undefined') AFData.save(user, state);
    else localStorage.setItem('algoforge_v1', JSON.stringify(state));
  } catch (e) { /* storage full/blocked */ }
};
const Solved = {
  ids: () => Object.keys(state.solved),
  count: () => Object.keys(state.solved).length,
  has: id => !!state.solved[id],
  byDiff: d => Object.keys(state.solved).filter(id => P_BY_ID[id] && P_BY_ID[id].diff === d).length
};

/* ---------------- GAMIFICATION ---------------- */
const level = () => Math.floor(state.xp / 200) + 1;
const levelProg = () => state.xp % 200;
function rollDaily() {
  if (state.daily.date !== todayKey()) { state.daily = {date: todayKey(), quizBest: null, challengeDone: false}; save(); }
  if (state.pomoToday.date !== todayKey()) { state.pomoToday = {date: todayKey(), count: 0}; save(); }
}
function touchActivity(n = 1) {
  const k = todayKey();
  state.activity[k] = (state.activity[k] || 0) + n;
  const st = state.streak;
  if (st.last !== k) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    st.count = (st.last === dayKeyOf(y)) ? (st.count + 1) : 1;
    st.last = k; st.best = Math.max(st.best, st.count);
    if (st.count > 1) toast(`🔥 ${st.count}-day streak! Keep it alive.`, 'ach');
  }
}
function addXP(n) {
  const before = level();
  state.xp += n;
  if (level() > before) { toast(`⭐ Level ${level()} reached! Keep forging.`, 'ach'); Confetti.burst(90); }
  save(); renderChrome();
  const bar = document.querySelector('.xp-bar');
  if (bar) { bar.classList.remove('gain'); void bar.offsetWidth; bar.classList.add('gain'); }
}
function checkAch() {
  ACH.forEach(a => {
    if (!state.achievements.includes(a.id) && a.c(state)) {
      state.achievements.push(a.id);
      state.xp += 20;
      save(); renderChrome();
      toast(`🏆 Achievement unlocked: ${a.t} (+20 XP)`, 'ach');
      Confetti.burst(120);
    }
  });
}
function solveProblem(id) {
  if (state.solved[id]) return;
  const p = P_BY_ID[id]; if (!p) return;
  state.solved[id] = {ts: Date.now()};
  state.daily.challengeDone = state.daily.challengeDone || (dailyProblem().id === id);
  state.dailyEver = state.dailyEver || (dailyProblem().id === id);
  touchActivity(2); save();
  Confetti.burst(140);
  toast(`✅ Solved: ${p.t} (+${DIFF_XP[p.diff]} XP)`, 'success');
  addXP(DIFF_XP[p.diff]);
  checkAch();
}
function dailyProblem() {
  const pool = PROBLEMS.filter(p => p.diff === 'Medium' || p.diff === 'Hard' || p.diff === 'Expert');
  return pool[dayOfYear() % pool.length];
}
function dailyQuiz() {
  const rng = mulberry32(dayOfYear() * 7919 + 13);
  const counts = {Easy: 2, Medium: 3, Hard: 2, Expert: 1};
  const out = [];
  for (const level of ['Easy', 'Medium', 'Hard', 'Expert']) {
    const pool = QUIZ.filter(q => q.d === level);
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (let i = 0; i < Math.min(counts[level], shuffled.length); i++) out.push(shuffled[i]);
  }
  return out.slice(0, 8);
}
function recommend() {
  const q = state.quiz;
  if (Solved.count() === 0 && !q.length) return 'Easy';
  const avg = q.length ? q.reduce((a, b) => a + b.score / Math.max(b.total, 1), 0) / q.length : 0;
  const hardOk = Solved.byDiff('Hard') + Solved.byDiff('Expert');
  if (avg < 0.5) return 'Easy';
  if (Solved.count() >= 15 && (avg >= 0.75 || hardOk >= 3)) return 'Hard';
  return 'Medium';
}

/* ---------------- TOAST / CONFETTI / MODAL / COPY ---------------- */
function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.setAttribute('role', 'status');
  const ico = type === 'success' ? I.check : type === 'warn' ? I.x : type === 'ach' ? I.trophy : I.zap;
  t.innerHTML = `${ico}<span>${msg}</span>`;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 3600);
}
const Confetti = (() => {
  const c = $('#confetti'), x = c.getContext('2d'); let P = [], raf = null;
  const fit = () => { c.width = innerWidth; c.height = innerHeight; };
  addEventListener('resize', fit); fit();
  function burst(n = 140) {
    const cols = ['#6d8bff','#22d3ee','#34d399','#fbbf24','#f472b6','#a78bfa'];
    for (let i = 0; i < n; i++) P.push({
      x: innerWidth / 2 + (Math.random() - .5) * 260, y: innerHeight * .35,
      vx: (Math.random() - .5) * 15, vy: Math.random() * -13 - 5, g: .34,
      s: Math.random() * 7 + 4, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
      c: cols[i % cols.length], o: 1
    });
    if (!raf) loop();
  }
  function loop() {
    x.clearRect(0, 0, c.width, c.height);
    P = P.filter(p => p.o > 0 && p.y < c.height + 50);
    if (!P.length) { raf = null; return; }
    for (const p of P) {
      p.x += p.vx; p.vx *= .99; p.y += p.vy; p.vy += p.g; p.r += p.vr; p.o -= .008;
      x.save(); x.globalAlpha = Math.max(p.o, 0); x.translate(p.x, p.y); x.rotate(p.r);
      x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .62); x.restore();
    }
    raf = requestAnimationFrame(loop);
  }
  return {burst};
})();
function modal(html) {
  const root = $('#modalRoot');
  root.innerHTML = `<div class="modal-scrim" data-action="modal-close"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  root.querySelector('.modal').addEventListener('click', e => e.stopPropagation());
}
const closeModal = () => { $('#modalRoot').innerHTML = ''; };
function copyText(txt, okMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard.writeText(txt).then(() => toast(okMsg || '📋 Copied to clipboard', 'success')).catch(() => fallbackCopy(txt, okMsg));
  else fallbackCopy(txt, okMsg);
}
function fallbackCopy(txt, okMsg) {
  const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); toast(okMsg || '📋 Copied to clipboard', 'success'); }
  catch (e) { toast('Copy failed', 'warn'); }
  ta.remove();
}

/* ---------------- SHARED RENDER HELPERS ---------------- */
const diffBadge = d => `<span class="badge b-${d === 'Easy' ? 'easy' : d === 'Medium' ? 'med' : d === 'Hard' ? 'hard' : 'exp'}">${d}</span>`;
const diffClass = d => d === 'Easy' ? 'b-easy' : d === 'Medium' ? 'b-med' : d === 'Hard' ? 'b-hard' : 'b-exp';
const chip = (label, href) => href ? `<a class="chip" href="${href}">${label}</a>` : `<span class="chip">${label}</span>`;
function codeBlock(code, lang) {
  const id = 'c' + (++codeSeq); CodeReg[id] = code;
  return `<div class="codebox"><div class="codebox-h"><span>${esc(lang)}</span><button class="icon-btn sm" data-action="copy-code" data-code="${id}" aria-label="Copy code">${I.copy}</button></div><pre><code>${esc(code)}</code></pre></div>`;
}
function statCard(k, v, s, ic) {
  return `<div class="stat-card reveal"><div class="k">${I[ic] || I.zap}<span>${k}</span></div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ''}</div>`;
}
function probRow(p) {
  const solved = Solved.has(p.id), bm = state.bookmarks.includes(p.id);
  return `<a class="prob-row reveal" href="#/problem/${p.id}">
    <span class="p-status ${solved ? 'done' : ''}" aria-label="${solved ? 'Solved' : 'Unsolved'}">${I.check}</span>
    <div class="p-info">
      <div class="p-title">${p.t}${bm ? `<span class="bm" aria-label="Bookmarked">${I.bookmark}</span>` : ''}</div>
      <div class="p-meta">${p.topics.join(' · ')} &nbsp;|&nbsp; ${p.comps.slice(0, 3).join(', ')}</div>
    </div>
    ${diffBadge(p.diff)}
    <span class="p-xp">+${DIFF_XP[p.diff]} XP</span></a>`;
}
const skeletonRows = (n = 6) => `<div class="prob-list">${Array.from({length: n}, () => '<div class="sk" style="height:66px"></div>').join('')}</div>`;
const skeletonCards = (n = 8) => `<div class="algo-grid">${Array.from({length: n}, () => '<div class="sk sk-card"></div>').join('')}</div>`;
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold: .08});
  $$('.reveal:not(.in)').forEach((el, i) => {
    el.style.animationDelay = Math.min((i % 9) * 60, 480) + 'ms';   /* staggered cascade */
    io.observe(el);
  });
}
const afterRender = () => {
  initReveal();
  if (typeof Anim !== 'undefined') {
    Anim.tiltify(document.getElementById('view'));
    Anim.numbers(document.getElementById('view'));
  }
};

function vHome() {
  const daily = dailyProblem();
  const recent = [...state.recent].slice(0, 5).map(id => P_BY_ID[id]).filter(Boolean);
  const recommended = PROBLEMS.filter(problem => problem.diff === recommend() && !Solved.has(problem.id)).slice(0, 4);
  return `
    <section class="hero reveal">
      <h1>Build stronger <span>algorithmic thinking</span></h1>
      <p>Practice deliberately, learn the patterns, and track your progress across ${PROBLEMS.length} problems.</p>
      <div class="hero-cta"><a class="btn primary" href="#/problems">Browse problems ${I.arrR}</a><a class="btn ghost" href="#/daily">Daily practice</a></div>
      <div class="hero-term" aria-hidden="true"><div class="dots"><i></i><i></i><i></i></div><div>function solve(input) {</div><div class="typed">reason carefully; test edge cases;</div><div>}</div></div>
    </section>
    <div class="stat-grid">
      ${statCard('Problems solved', Solved.count(), `${PROBLEMS.length} available`, 'check')}
      ${statCard('Experience', `${state.xp} XP`, `Level ${level()} · ${200 - levelProg()} to next`, 'zap')}
      ${statCard('Current streak', `${state.streak.count} days`, `Best: ${state.streak.best} days`, 'flame')}
      ${statCard('Daily quiz', state.daily.quizBest ? `${state.daily.quizBest.score}/${state.daily.quizBest.total}` : 'Not attempted', 'Fresh questions every day', 'award')}
    </div>
    <div class="home-cols">
      <section class="daily-card reveal">
        <div class="daily-head"><h2>Today’s challenge</h2><span class="countdown" id="countdown"></span></div>
        <a class="prob-row" href="#/problem/${daily.id}" style="margin-top:14px">${probRow(daily).replace(/^<a[^>]*>|<\/a>$/g, '')}</a>
        <div class="reco"><span>${I.target}</span><span>Your suggested level: <b>${recommend()}</b></span><a class="btn ghost sm" href="#/problems">Practice</a></div>
      </section>
      <section class="card reveal"><h2 style="font-size:1rem;margin-bottom:12px">Recommended next</h2><div class="prob-list">${recommended.length ? recommended.map(probRow).join('') : '<p class="dim">You have completed every problem at this level. Try a harder difficulty.</p>'}</div></section>
    </div>
    ${recent.length ? `<section style="margin-top:20px"><h2 class="section-h">Recently practiced</h2><div class="prob-list">${recent.map(probRow).join('')}</div></section>` : ''}`;
}

function vLibrary(category) {
  const categories = ['All', ...new Set(ALGOS.map(algo => algo.cat))];
  const selected = categories.includes(category) ? category : 'All';
  const items = ALGOS.filter(algo => selected === 'All' || algo.cat === selected);
  return `
    <h1 class="page-title">Algorithm Library</h1>
    <p class="page-sub">Explore core techniques with complexity notes, walkthroughs, and implementations.</p>
    <nav class="catbar" aria-label="Algorithm categories">${categories.map(cat => `<a class="cat-pill ${selected === cat ? 'active' : ''}" href="${cat === 'All' ? '#/library' : '#/library/' + encodeURIComponent(cat)}">${esc(cat)}</a>`).join('')}</nav>
    <div class="algo-grid">${items.map(algo => `<a class="algo-card reveal" href="#/algo/${algo.id}">
      <div class="ac-top"><h3>${esc(algo.name)}</h3><span class="ac-cat">${esc(algo.cat)}</span></div>
      <p>${esc(algo.desc)}</p><div class="ac-cx"><span class="cx-tag">Time ${esc(algo.time)}</span><span class="cx-tag">Space ${esc(algo.space)}</span></div>
    </a>`).join('')}</div>`;
}

function vProblem(id) {
  const problem = P_BY_ID[id];
  if (!problem) return `<div class="empty">Problem not found. <a href="#/problems">Back to problems</a></div>`;
  Session.lang = 'js';
  Session.start = Date.now();
  Session.solvedAt = null;
  Session.lastVerdict = false;
  Session.lastVerdictFor = null;
  Session.running = true;
  if (!Session.buf[id]) Session.buf[id] = {};
  if (Session.buf[id][Session.lang] == null) Session.buf[id][Session.lang] = starter(problem, Session.lang);
  state.recent = [id, ...state.recent.filter(recentId => recentId !== id)].slice(0, 8);
  save();
  const related = (problem.rel || []).map(relatedId => P_BY_ID[relatedId]).filter(Boolean);
  const attempts = state.attempts.filter(attempt => attempt.p === id).slice(0, 5);
  const solved = Solved.has(id);
  const externalUrl = EXTERNAL_EQUIVALENTS[id];
  return `<a class="back-link" href="#/problems">${I.arrL} All problems</a>
    <header class="prob-head"><div><h1>${esc(problem.t)}</h1><div class="row">${diffBadge(problem.diff)}${problem.topics.map(topic => chip(esc(topic))).join('')}${problem.comps.map(company => chip(esc(company))).join('')}</div></div>
      <button class="icon-btn ${state.bookmarks.includes(id) ? 'active' : ''}" data-action="bookmark" data-id="${id}" aria-label="Toggle bookmark" title="Toggle bookmark">${I.bookmark}</button></header>
    ${externalUrl ? `<p class="external-source">Exact external equivalent: <a href="${externalUrl}" target="_blank" rel="noopener noreferrer">${esc(problem.t)} on LeetCode ${I.arrR}</a></p>` : ''}
    <div class="prob-grid">
      <div class="prob-left">
        <p class="stmt">${esc(problem.stmt)}</p>
        ${problem.cons?.length ? `<h3 class="section-h">Constraints</h3><ul class="cons">${problem.cons.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
        ${problem.ex.map((example, index) => `<div class="exbox"><div class="lbl">Example ${index + 1}</div><pre><b>Input:</b> ${esc(example.i)}\n<b>Output:</b> ${esc(example.o)}\n<b>Explanation:</b> ${esc(example.e)}</pre></div>`).join('')}
        <h3 class="section-h">Hints</h3>${problem.hints.map((hint, index) => `<div class="hint-item"><div class="h-txt">${esc(hint)}</div><button class="h-btn" data-action="hint">Reveal hint ${index + 1}</button></div>`).join('')}
        <h3 class="section-h">Solution</h3><div id="solLock" class="lock-banner" ${solved ? 'hidden' : ''}>${I.lock}<p>Try the problem before revealing the walkthrough.</p><button class="btn ghost sm" data-action="sol-reveal">Reveal solution</button></div>
        <div id="solBody" ${solved ? '' : 'hidden'}>${problem.sols.map(solution => `<article class="sol-card"><h4>${esc(solution.a)}</h4><div class="sol-cx"><span class="cx-tag">Time ${esc(solution.tc)}</span><span class="cx-tag">Space ${esc(solution.sc)}</span></div>${codeBlock(solution.js, 'JavaScript')}${codeBlock(solution.py, 'Python')}</article>`).join('')}</div>
        <label for="problemNote" class="section-h">Personal notes <span id="noteSaved" class="save-ind">Saved</span></label><textarea id="problemNote" class="note-area" data-note-for="${id}" placeholder="Write down an insight or a question…">${esc(state.notes[id] || '')}</textarea>
        ${attempts.length ? `<h3 class="section-h">Recent attempts</h3>${attempts.map(attempt => `<details class="hist-item"><summary>${attempt.ok ? 'Passed' : 'Failed'} · ${fmtDate(attempt.ts)} · ${esc(attempt.lang)}</summary><pre>${esc(attempt.code)}</pre></details>`).join('')}` : ''}
      </div>
      <section class="prob-work">
        <div class="work-head"><div><b>Code workspace</b><div class="dim" style="font-size:.76rem">JavaScript runs locally. Other languages use the external judge.</div></div><span class="timer-chip ${Session.running ? 'live' : ''}">${I.clock}<span id="sessTime">00:00</span></span></div>
        <select id="langSel" class="lang-sel" aria-label="Editor language"><option value="js" ${Session.lang === 'js' ? 'selected' : ''}>JavaScript · run here</option><option value="py" ${Session.lang === 'py' ? 'selected' : ''}>Python · external judge</option><option value="cpp" ${Session.lang === 'cpp' ? 'selected' : ''}>C++ · external judge</option><option value="csharp" ${Session.lang === 'csharp' ? 'selected' : ''}>C# · external judge</option><option value="java" ${Session.lang === 'java' ? 'selected' : ''}>Java · external judge</option><option value="go" ${Session.lang === 'go' ? 'selected' : ''}>Go · external judge</option></select>
        <textarea id="editor" class="editor" spellcheck="false" aria-label="Code editor">${esc(Session.buf[id][Session.lang])}</textarea>
        <div class="work-actions"><button class="btn primary sm" data-action="run-tests" data-id="${id}" ${Session.lang !== 'js' ? 'disabled' : ''}>${I.play} Run sample tests</button><a class="btn ghost sm external-language" href="${externalUrl || EXTERNAL_CATALOG_FALLBACKS[Session.lang] || '#'}" target="_blank" rel="noopener noreferrer" data-external-language ${Session.lang !== 'js' ? '' : 'hidden'}>${externalUrl ? `Continue ${esc(problem.t)} on LeetCode` : `Browse ${esc(Session.lang.toUpperCase())} problem sets`} ${I.arrR}</a><button class="btn ghost sm" data-action="reset-code" data-id="${id}">Reset</button><button class="btn ${solved ? 'ok' : 'ghost'} sm" data-action="mark-solved" data-id="${id}" ${solved ? 'disabled' : ''}>${solved ? 'Solved' : 'Mark solved'}</button></div>
        <div id="testOut" class="test-out" role="status" aria-live="polite"></div>
      </section>
    </div>
    ${related.length ? `<section style="margin-top:20px"><h2 class="section-h">Related problems</h2><div class="rel-list">${related.map(item => `<a href="#/problem/${item.id}"><span>${esc(item.t)}</span>${diffBadge(item.diff)}</a>`).join('')}</div></section>` : ''}`;
}

function vAlgo(id) {
  const algo = ALGOS.find(item => item.id === id) || ALGOS[0];
  const related = PROBLEMS.filter(problem => problem.topics.includes(algo.cat) || problem.topics.includes(algo.name));
  return `<article>
    <a class="back-link" href="#/library">${I.arrL} Library</a>
    <h1 class="page-title">${esc(algo.name)}</h1>
    <p class="page-sub">${esc(algo.desc)}</p>
    <div class="stat-grid" style="margin-bottom:16px">
      <div class="stat-box"><span class="label">Time</span><strong>${esc(algo.time)}</strong></div>
      <div class="stat-box"><span class="label">Space</span><strong>${esc(algo.space)}</strong></div>
      <div class="stat-box"><span class="label">Category</span><strong>${esc(algo.cat)}</strong></div>
    </div>
    ${algo.steps ? `<section class="card reveal" style="margin-bottom:16px"><h2 style="font-size:1.05rem;margin-bottom:8px">How it works</h2><ol class="steps">${algo.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol></section>` : ''}
    <section class="card reveal"><h2 style="font-size:1.05rem;margin-bottom:8px">Implementation</h2>${algo.code.py ? codeBlock(algo.code.py, 'Python') : ''}${algo.code.js ? codeBlock(algo.code.js, 'JavaScript') : ''}</section>
    ${related.length ? `<section style="margin-top:18px"><h2 class="section-h">Practice this pattern</h2><div class="prob-list">${related.map(probRow).join('')}</div></section>` : ''}
  </article>`;
}

/* =====================================================================
   ROUTER
===================================================================== */
let renderToken = 0;
function route() {
  // decodeURIComponent fixes category pills that contain spaces or '&'
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  return h.split('/').filter(Boolean);
}
function navActive(seg) { $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.nav === (seg || ''))); }
function closeDrawer() { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); }

function render() {
  if (location.hash && !location.hash.startsWith('#/')) return;  // #main etc. are anchors, not routes
  const [page, param] = route();
  const token = ++renderToken;
  Timers.clear(); closeDrawer(); rollDaily(); navActive(page);
  Session.running = false;
  const view = $('#view');
  const enter = () => { view.classList.remove('view-enter'); void view.offsetWidth; view.classList.add('view-enter'); };
  const set = (html, fn) => { view.innerHTML = html; enter(); if (fn) fn(); afterRender(); };
  switch (page) {
    case undefined: set(vHome()); break;
    case 'library':
      view.innerHTML = skeletonCards(9); enter();
      setTimeout(() => { if (token === renderToken) set(vLibrary(param)); }, 280); break;
    case 'algo': set(vAlgo(param)); break;
    case 'problems':
      view.innerHTML = skeletonRows(7); enter();
      setTimeout(() => { if (token === renderToken) set(...vProblems()); }, 280); break;
    case 'problem': set(vProblem(param)); break;
    case 'daily': set(vDaily()); break;
    case 'paths': set(vPaths()); break;
    case 'stats': set(...vStats()); break;
    case 'leaderboard': set(vBoard()); break;
    default:
      view.innerHTML = `<div class="empty">Page not found. <a href="#/" style="color:var(--acc)">Go home</a></div>`; enter();
      break;
  }
}
/* ---- Problems list + filters ---- */
const F = {q:'', diff:'All', topic:'All', comp:'All', status:'All', sort:'pop'};
function vProblems() {
  const topics = [...new Set(PROBLEMS.flatMap(p => p.topics))].sort();
  const comps = [...new Set(PROBLEMS.flatMap(p => p.comps))].sort();
  const filtered = PROBLEMS.filter(p =>
    (F.diff === 'All' || p.diff === F.diff) &&
    (F.topic === 'All' || p.topics.includes(F.topic)) &&
    (F.comp === 'All' || p.comps.includes(F.comp)) &&
    (F.status === 'All' || (F.status === 'Solved' && Solved.has(p.id)) || (F.status === 'Todo' && !Solved.has(p.id)) || (F.status === 'Bookmarked' && state.bookmarks.includes(p.id))) &&
    (!F.q || (p.t + ' ' + p.topics.join(' ') + ' ' + p.comps.join(' ')).toLowerCase().includes(F.q.toLowerCase()))
  ).sort((a, b) => {
    if (F.sort === 'diff') return DIFFS.indexOf(a.diff) - DIFFS.indexOf(b.diff);
    if (F.sort === 'title') return a.t.localeCompare(b.t);
    if (F.sort === 'solved') return (Solved.has(b.id) ? 1 : 0) - (Solved.has(a.id) ? 1 : 0);
    return b.pop - a.pop;
  });
  const html = `
  <h1 class="page-title">Problems</h1>
  <p class="page-sub">${PROBLEMS.length} problems across arrays, strings, trees, graphs, DP and more — tagged by topic and company.</p>
  <div class="toolbar">
    <input type="search" placeholder="Search title, topic, company…" value="${esc(F.q)}" data-filter="q" aria-label="Search problems">
    <select data-filter="diff" aria-label="Filter by difficulty">${['All', ...DIFFS].map(d => `<option ${F.diff === d ? 'selected' : ''}>${d}</option>`).join('')}</select>
    <select data-filter="topic" aria-label="Filter by topic"><option ${F.topic === 'All' ? 'selected' : ''}>All</option>${topics.map(t => `<option ${F.topic === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
    <select data-filter="comp" aria-label="Filter by company"><option ${F.comp === 'All' ? 'selected' : ''}>All</option>${comps.map(c => `<option ${F.comp === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
    <select data-filter="status" aria-label="Filter by status">${['All','Solved','Todo','Bookmarked'].map(s => `<option ${F.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
    <select data-filter="sort" aria-label="Sort by"><option value="pop" ${F.sort === 'pop' ? 'selected' : ''}>Most popular</option><option value="diff" ${F.sort === 'diff' ? 'selected' : ''}>Difficulty</option><option value="title" ${F.sort === 'title' ? 'selected' : ''}>Title A–Z</option><option value="solved" ${F.sort === 'solved' ? 'selected' : ''}>Solved first</option></select>
  </div>
  <div class="mut" style="margin-bottom:10px;font-size:.8rem">${filtered.length} problem${filtered.length !== 1 ? 's' : ''} · solved ${filtered.filter(Solved.has).length}</div>
  ${filtered.length ? `<div class="prob-list">${filtered.map(probRow).join('')}</div>` : `<div class="empty">No problems match those filters. <button class="btn ghost sm" style="margin-top:12px" data-action="clear-filters">Clear filters</button></div>`}
  <details class="platform-directory"><summary>Explore official problem libraries <span>${EXTERNAL_PLATFORMS.length} platforms</span></summary>
    <div class="platform-links">${EXTERNAL_PLATFORMS.map(platform => `<a href="${platform.url}" target="_blank" rel="noopener noreferrer">${esc(platform.name)} ${I.arrR}</a>`).join('')}</div>
  </details>`;
  return [html, null];
}
/* ---- Problem detail + workspace ---- */
const Session = {lang:'js', buf:{}, start:0, solvedAt:null, running:false, lastVerdict:false, lastVerdictFor:null};
function starter(p, lang) {
  if (p.id === 'lru-cache' && lang === 'py') return 'class LRUCache:\n    def __init__(self, capacity):\n        # your code here\n        pass\n';
  if (p.id === 'lru-cache' && lang === 'js') return 'class LRUCache {\n  constructor(capacity) {\n    // your code here\n  }\n}\n';
  const ps = p.params.join(', ');
  if (lang === 'py') return `def ${snake(p.fn)}(${ps}):\n    # your code here\n    pass\n`;
  if (lang === 'js') return `var ${p.fn} = function(${ps}) {\n  // your code here\n};\n`;
  if (lang === 'java') return `class Solution {\n    // implement ${p.fn}(${ps})\n    // your code here\n}\n`;
    return `// implement ${p.fn}(${ps})
// your code here
`;
}

function vDaily() {
  const quizDone = !!state.daily.quizBest;
  const best = state.daily.quizBest || { score: 0, total: 0 };
  return `
    <h1 class="page-title">Daily Challenge</h1>
    <p class="page-sub">Train with a rotating practice set and sharpen your fundamentals.</p>
    <div class="card reveal" style="padding:16px">
      <div class="stat-grid">
        <div class="stat-box"><span class="label">Today</span><strong>${quizDone ? best.score : 0}/${quizDone ? best.total : 0}</strong></div>
        <div class="stat-box"><span class="label">Streak</span><strong>${state.streak.count}</strong></div>
        <div class="stat-box"><span class="label">Solved</span><strong>${Solved.count()}</strong></div>
      </div>
    </div>
    <div class="quiz-wrap card reveal" id="quizArea">${quizIntro(quizDone)}</div>`;
}
function quizIntro(done) {
  const best = state.daily.quizBest;
  return `<div class="q-result">
    <h3 style="font-size:1.15rem">Test your DSA fundamentals</h3>
    <p class="dim" style="margin:8px 0 4px;font-size:.9rem">Fresh questions every day, from easy definitions to hard analysis. +5 XP per correct answer.</p>
    ${done ? `<p style="margin:12px 0;color:var(--ok);font-weight:600">Today\u2019s best: ${best.score}/${best.total} — come back tomorrow for a new set 🌙</p>` : ''}
    <button class="btn primary" data-action="quiz-start" style="margin-top:12px">${done ? 'Retake (practice)' : 'Start quiz'} ${I.play}</button>
  </div>`;
}
/* ---- Paths ---- */
function vPaths() {
  return `
  <h1 class="page-title">Learning Paths</h1>
  <p class="page-sub">Structured sequences from beginner to advanced. Each step unlocks the next concept — complete them in order or jump to what you need.</p>
  ${PATHS.map(p => {
    const done = state.paths[p.id] || [];
    const pct = Math.round(done.length / p.steps.length * 100);
    const nextIdx = p.steps.findIndex(st => !done.includes(st.id));
    return `<div class="path-card reveal" id="path-${p.id}">
      <div class="path-hero" data-action="path-toggle" data-id="${p.id}" role="button" tabindex="0" aria-expanded="false">
        <div class="path-ico" style="background:${p.color}22;color:${p.color};border:1px solid ${p.color}55">${I[p.icon] || I.code}</div>
        <div class="path-info">
          <h3>${p.t} <span class="chip">${p.lvl}</span> <span class="chip">${p.time}</span></h3>
          <p>${p.desc}</p>
          <div class="path-prog"><div class="pbar"><i style="width:${pct}%"></i></div><span class="pct">${pct}%</span></div>
        </div>
        <span style="align-self:center">${I.chevD}</span>
      </div>
      <div class="path-steps">
        ${p.steps.map((st, i) => `
          <div class="step-row ${i === nextIdx ? 'current' : ''}">
            <button class="step-check ${done.includes(st.id) ? 'done' : ''}" data-action="step-done" data-path="${p.id}" data-step="${st.id}" aria-label="Mark step complete">${I.check}</button>
            <div class="step-body">
              <a class="st" href="${st.type === 'problem' ? '#/problem/' + st.ref : st.type === 'algo' ? '#/algo/' + st.ref : '#/daily'}">${st.t}</a>
              <div class="sd">${st.d}</div>
            </div>
            <span class="step-kind">${st.type}</span>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('')}`;
}
function performanceMetrics(profile) {
  const attempts = Array.isArray(profile.attempts) ? profile.attempts : [];
  let passedTests = 0;
  let totalTests = 0;
  for (const attempt of attempts) {
    if (Number.isFinite(attempt.passedTests) && Number.isFinite(attempt.totalTests)) {
      passedTests += attempt.passedTests;
      totalTests += attempt.totalTests;
      continue;
    }
    const match = String(attempt.tests || '').match(/^(all|\d+)\/(\d+)$/);
    if (match) {
      totalTests += Number(match[2]);
      passedTests += match[1] === 'all' ? Number(match[2]) : Number(match[1]);
    }
  }
  return {
    attempts,
    successfulAttempts: attempts.filter(attempt => attempt.ok).length,
    totalAttempts: attempts.length,
    passedTests,
    totalTests,
    accuracy: totalTests ? Math.round(passedTests / totalTests * 100) : null
  };
}
function attemptTestCounts(attempt) {
  if (Number.isFinite(attempt.passedTests) && Number.isFinite(attempt.totalTests)) {
    return {passed: attempt.passedTests, total: attempt.totalTests};
  }
  const match = String(attempt.tests || '').match(/^(all|\d+)\/(\d+)$/);
  if (!match) return {passed: 0, total: 0};
  const total = Number(match[2]);
  return {passed: match[1] === 'all' ? total : Number(match[1]), total};
}

/* ---- Stats ---- */
function vStats() {
  const donut = Solved.count() > 0 ? (() => {
    const e = Solved.byDiff('Easy'), m = Solved.byDiff('Medium'), h = Solved.byDiff('Hard'), x = Solved.byDiff('Expert'), t = Math.max(e + m + h + x, 1);
    const a = Math.round(e / t * 100), b = a + Math.round(m / t * 100), c = b + Math.round(h / t * 100);
    return `conic-gradient(var(--easy) 0 ${a}%,var(--med) ${a}% ${b}%,var(--hard) ${b}% ${c}%,var(--exp) ${c}% 100%)`;
  })() : 'var(--card3)';
  const topicMap = {};
  Object.keys(state.solved).forEach(id => { const p = P_BY_ID[id]; if (p) p.topics.forEach(t => topicMap[t] = (topicMap[t] || 0) + 1); });
  const topics = Object.entries(topicMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxT = Math.max(1, ...topics.map(t => t[1]));
  const avg = state.quiz.length ? Math.round(state.quiz.reduce((a, b) => a + b.score / Math.max(b.total, 1), 0) / state.quiz.length * 100) : null;
  const performance = performanceMetrics(state);
  const recentAttempts = performance.attempts.slice(0, 8);
  const html = `
  <h1 class="page-title">Progress &amp; Stats</h1>
  <p class="page-sub">Your complete practice picture — computed locally, shareable in one click.</p>
  <div class="stats-grid">
    <div class="stat-card reveal"><div class="k">${I.zap}<span>Experience</span></div><div class="v">${state.xp} XP</div>
      <div class="pbar" style="margin-top:8px"><i style="width:${levelProg() / 2}%"></i></div><div class="s">Level ${level()} · ${200 - levelProg()} XP to level ${level() + 1}</div></div>
    ${statCard('Problems solved', Solved.count(), `Easy ${Solved.byDiff('Easy')} · Medium ${Solved.byDiff('Medium')} · Hard ${Solved.byDiff('Hard')} · Expert ${Solved.byDiff('Expert')}`, 'check')}
    ${statCard('Quiz average', avg === null ? '—' : avg + '%', `${state.quiz.length} quiz${state.quiz.length !== 1 ? 'zes' : ''} taken`, 'award')}
    ${statCard('Test accuracy', performance.accuracy === null ? '—' : performance.accuracy + '%', `${performance.passedTests}/${performance.totalTests} checks passed`, 'target')}
    ${statCard('Coding attempts', performance.totalAttempts, `${performance.successfulAttempts} fully passed`, 'code')}
    ${statCard('Focus sessions', state.pomoTotal, `${state.pomoToday.count} today`, 'clock')}
  </div>
  <div class="viz-grid">
    <div class="card reveal"><h2 style="font-size:1rem;margin-bottom:14px">Difficulty mix</h2>
      <div class="donut-wrap">
        <div class="donut" style="background:${donut}"><div class="dc"><b>${Solved.count()}</b><span>solved</span></div></div>
        <div class="legend">
          <span><i style="background:var(--easy)"></i>Easy · ${Solved.byDiff('Easy')}</span>
          <span><i style="background:var(--med)"></i>Medium · ${Solved.byDiff('Medium')}</span>
          <span><i style="background:var(--hard)"></i>Hard · ${Solved.byDiff('Hard')}</span>
          <span><i style="background:var(--exp)"></i>Expert · ${Solved.byDiff('Expert')}</span>
        </div>
      </div></div>
    <div class="card reveal"><h2 style="font-size:1rem;margin-bottom:14px">Activity — last 7 days</h2>
      <canvas class="chart" id="weekChart" role="img" aria-label="Bar chart of activities in the last seven days"></canvas></div>
    <div class="card reveal" style="grid-column:1/-1"><h2 style="font-size:1rem;margin-bottom:6px">Topic mastery</h2>
      ${topics.length ? topics.map(([t, n]) => `<div class="tbar-row"><div class="tb-top"><b>${t}</b><span class="dim">${n} solved</span></div><div class="pbar"><i style="width:${n / maxT * 100}%"></i></div></div>`).join('') : `<div class="empty" style="margin-top:10px">Solve problems to reveal your strongest topics.</div>`}</div>
    ${state.quiz.length ? `<div class="card reveal" style="grid-column:1/-1"><h2 style="font-size:1rem;margin-bottom:10px">Quiz history</h2>
      <table class="quiz-hist"><tr><th>Date</th><th>Score</th><th>Result</th></tr>
      ${state.quiz.slice(-8).reverse().map(q => `<tr><td>${fmtDate(q.ts)}</td><td>${q.score}/${q.total}</td><td><span class="badge ${q.score / q.total >= .7 ? 'b-easy' : q.score / q.total >= .4 ? 'b-med' : 'b-hard'}">${Math.round(q.score / q.total * 100)}%</span></td></tr>`).join('')}</table></div>` : ''}
    <div class="card reveal" style="grid-column:1/-1"><h2 style="font-size:1rem;margin-bottom:10px">Recent coding attempts</h2>
      ${recentAttempts.length ? `<table class="quiz-hist"><tr><th>Problem</th><th>Date</th><th>Language</th><th>Checks</th><th>Result</th></tr>
      ${recentAttempts.map(attempt => {
        const problem = P_BY_ID[attempt.p];
        const counts = attemptTestCounts(attempt);
        return `<tr><td>${problem ? `<a href="#/problem/${problem.id}">${esc(problem.t)}</a>` : esc(attempt.p)}</td><td>${fmtDate(attempt.ts)}</td><td>${esc(attempt.lang || 'js')}</td><td>${counts.passed}/${counts.total}</td><td><span class="badge ${attempt.ok ? 'b-easy' : 'b-hard'}">${attempt.ok ? 'Passed' : 'Needs work'}</span></td></tr>`;
      }).join('')}</table>` : `<div class="empty">Run a problem’s tests to start tracking your coding performance.</div>`}
    </div>
  </div>
  <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
    <button class="btn primary" data-action="share-progress">${I.share} Share my progress</button>
    <a class="btn ghost" href="#/leaderboard">See leaderboard &amp; badges</a>
  </div>`;
  return [html, () => { requestAnimationFrame(() => drawWeekChart($('#weekChart'))); }];
}
function drawWeekChart(cv) {
  if (!cv) return;
  const ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth || 600, H = 190;
  cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  const days = Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {label: d.toLocaleDateString(undefined, {weekday: 'short'}), v: state.activity[dayKeyOf(d)] || 0};
  });
  const max = Math.max(1, ...days.map(d => d.v));
  const padL = 26, padR = 40, padB = 30, padT = 24;
  ctx.clearRect(0, 0, W, H);
  const gridColor = getComputedStyle(document.body).getPropertyValue('--bd').trim() || '#23304f';
  ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
  [0, Math.max(1, Math.round(max / 2)), max].forEach(g => {
    const y = H - padB - (g / max) * (H - padB - padT);
    ctx.beginPath(); ctx.setLineDash([4, 4]); ctx.moveTo(padL, y); ctx.lineTo(W - padR + 14, y); ctx.stroke(); ctx.setLineDash([]);
  });
  const slot = (W - padL - padR) / 7;
  const bw = Math.min(44, slot - 14);
  days.forEach((d, i) => {
    const x = padL + i * slot + (slot - bw) / 2;
    const bh = (d.v / max) * (H - padB - padT);
    const y = H - padB - bh;
    const grad = ctx.createLinearGradient(0, y, 0, H - padB);
    grad.addColorStop(0, '#22d3ee'); grad.addColorStop(1, '#6d8bff');
    ctx.fillStyle = grad;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, bw, Math.max(bh, 2), [6, 6, 0, 0]);
    else ctx.rect(x, y, bw, Math.max(bh, 2));
    ctx.fill();
    ctx.fillStyle = 'rgba(140,155,190,.95)'; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(d.label, x + bw / 2, H - 10);
    if (d.v > 0) { ctx.fillStyle = '#22d3ee'; ctx.font = '700 11px Inter,sans-serif'; ctx.fillText(d.v, x + bw / 2, y - 6); }
  });
}
/* ---- Leaderboard ---- */
function vBoard() {
  const currentUser = (typeof AFAuth !== 'undefined' && AFAuth.currentUser()) || null;
  const accounts = (typeof AFAuth !== 'undefined' && AFAuth.localAccounts) ? AFAuth.localAccounts() : [];
  const rows = accounts.map(account => {
    const profile = account.key === currentUser ? state : Object.assign(cloneState(DEFAULT_STATE), AFData.load(account.key));
    const metrics = performanceMetrics(profile);
    const xp = Number(profile.xp) || 0;
    return {
      name: account.username,
      xp,
      level: Math.floor(xp / 200) + 1,
      solved: Object.keys(profile.solved || {}).length,
      accuracy: metrics.accuracy,
      me: account.key === currentUser
    };
  });
  if (!currentUser) {
    const metrics = performanceMetrics(state);
    rows.push({name: 'Guest profile', xp: state.xp, level: level(), solved: Solved.count(), accuracy: metrics.accuracy, me: true});
  } else if (!rows.some(row => row.me)) {
    const metrics = performanceMetrics(state);
    rows.push({name: currentUser, xp: state.xp, level: level(), solved: Solved.count(), accuracy: metrics.accuracy, me: true});
  }
  rows.sort((a, b) => b.xp - a.xp || b.solved - a.solved || (b.accuracy ?? -1) - (a.accuracy ?? -1) || a.name.localeCompare(b.name));
  return `
  <h1 class="page-title">Leaderboard &amp; Badges</h1>
  <p class="page-sub">Rankings use saved XP, solved problems, and test accuracy for accounts on this browser. Collect all ${ACH.length} badges.</p>
  <div class="card reveal" style="padding:8px 4px;overflow-x:auto">
  <table class="lb-table"><tr><th>Rank</th><th>Player</th><th>Solved</th><th>Test accuracy</th><th>XP</th></tr>
  ${rows.map((r, i) => `<tr class="lb-row ${r.me ? 'me' : ''}">
    <td class="lb-rank ${i < 3 ? 'top' : ''}">${i < 3 ? ['🥇','🥈','🥉'][i] : '#' + (i + 1)}</td>
    <td><b>${esc(r.name)}${r.me ? ' (you)' : ''}</b> <span class="chip" style="margin-left:6px">Level ${r.level}</span></td>
    <td class="dim">${r.solved}</td><td class="dim">${r.accuracy === null ? 'No runs' : `${r.accuracy}%`}</td><td><b>${r.xp}</b></td></tr>`).join('')}
  </table></div>
  <h2 class="section-h">${I.trophy}Achievements <span class="chip">${state.achievements.length}/${ACH.length}</span></h2>
  <div class="ach-grid">
    ${ACH.map(a => {
      const un = state.achievements.includes(a.id);
      return `<div class="ach-card reveal ${un ? '' : 'locked'}">
      <div class="ach-ico">${un ? (I[a.ic] || I.award) : I.lock}</div>
      <div><h4>${a.t}</h4><p>${a.d}</p></div></div>`;
    }).join('')}
  </div>`;
}

/* =====================================================================
   WIDGETS — countdown, session timer, quiz engine, pomodoro, search
===================================================================== */
function startCountdowns() {
  $$('#countdown').forEach(el => {
    const tick = () => {
      const now = new Date(), mid = new Date(now); mid.setHours(24, 0, 0, 0);
      const s = Math.max(0, Math.floor((mid - now) / 1000));
      el.textContent = 'resets in ' + pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
    };
    tick(); Timers.add(setInterval(tick, 1000));
  });
}
function startSessionTimer() {
  if (!Session.running) return;
  const start = Session.start, solvedAt = Session.solvedAt;
  const tick = () => {
    const cur = document.getElementById('sessTime');
    if (!cur) return;
    const t = solvedAt != null ? Math.floor((solvedAt - start) / 1000) : Math.floor((Date.now() - start) / 1000);
    cur.textContent = pad(Math.floor(t / 60)) + ':' + pad(t % 60);
  };
  tick(); Timers.add(setInterval(tick, 1000));
}
/* quiz engine */
let QZ = null;
function renderQuizArea() {
  const area = $('#quizArea'); if (!area) return;
  if (!QZ) { area.innerHTML = quizIntro(state.daily.quizBest !== null); return; }
  const {qs, i, correct, answered} = QZ;
  if (i >= qs.length) {
    const score = correct, total = qs.length, pct = Math.round(score / total * 100);
    const first = !state.daily.quizBest || score > state.daily.quizBest.score;
    area.innerHTML = `<div class="q-result">
      <div class="score-ring" style="background:conic-gradient(var(--acc) 0 ${pct * 3.6}deg,var(--card3) ${pct * 3.6}deg 360deg)"><div class="dc" style="position:relative"><b>${pct}%</b><span style="font-size:.68rem">${score}/${total}</span></div></div>
      <h3>${pct === 100 ? 'Flawless! 🏆' : pct >= 70 ? 'Great work! 👏' : pct >= 40 ? 'Solid progress 💪' : 'Keep at it — review and retry 📚'}</h3>
      <p class="dim" style="margin-top:6px">+${score * 5} XP earned${first ? ' · new personal best today' : ''}</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:16px">
        <button class="btn primary sm" data-action="quiz-retake">Retake</button>
        <a class="btn ghost sm" href="#/problem/${dailyProblem().id}">Today\u2019s challenge</a>
      </div></div>`;
    return;
  }
  const q = qs[i];
  area.innerHTML = `
    <div class="qbar-wrap"><i style="width:${i / qs.length * 100}%"></i></div>
    <div class="q-meta"><span>Question ${i + 1} of ${qs.length}</span><span>${diffBadge(q.d)}</span></div>
    <h3 class="q-text">${q.q}</h3>
    <div class="q-opts" role="group" aria-label="Answer options">
      ${q.o.map((o, j) => {
        let cls = '';
        if (answered !== null) {
          if (j === q.a) cls = 'correct';
          else if (j === answered) cls = 'wrong';
          else cls = 'dimmed';
        }
        return `<button class="q-opt ${cls}" data-action="quiz-opt" data-i="${j}" ${answered !== null ? 'disabled' : ''}>
          <span class="q-letter">${'ABCD'[j]}</span><span>${o}</span></button>`;
      }).join('')}
    </div>
    ${answered !== null ? `<div class="q-feed ${answered === q.a ? 'ok' : 'no'}">
      <b>${answered === q.a ? 'Correct!' : 'Not quite.'}</b> ${q.w}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:14px">
        <button class="btn primary sm" data-action="quiz-next">${i + 1 === qs.length ? 'See results' : 'Next'} ${I.arrR}</button></div>` : ''}`;
}
function quizStart() { QZ = {qs: dailyQuiz(), i: 0, correct: 0, answered: null}; renderQuizArea(); }
function quizAnswer(j) { if (!QZ || QZ.answered !== null) return; QZ.answered = j; if (j === QZ.qs[QZ.i].a) QZ.correct++; renderQuizArea(); }
function quizNext() {
  if (!QZ || QZ.answered === null) return;
  QZ.i++; QZ.answered = null;
  if (QZ.i >= QZ.qs.length) {
    const total = QZ.qs.length, score = QZ.correct;
    const prevBest = state.daily.quizBest;
    if (!prevBest || score > prevBest.score) state.daily.quizBest = {score, total};
    state.quiz.push({ts: Date.now(), score, total});
    touchActivity(1);
    addXP(score * 5);
    save(); checkAch();
    if (score === total) Confetti.burst(150);
  }
  renderQuizArea();
}
/* pomodoro */
const Pomo = {
  WORK: 25 * 60, BRK: 5 * 60, left: 25 * 60, mode: 'work', int: null,
  start() {
    if (this.int) return;
    this.int = setInterval(() => this.tick(), 1000);
    const b = document.getElementById('pomoStartBtn'); if (b) b.textContent = 'Pause';
  },
  pause() {
    clearInterval(this.int); this.int = null;
    const b = document.getElementById('pomoStartBtn'); if (b) b.textContent = 'Start';
  },
  reset() { this.pause(); this.left = this.mode === 'work' ? this.WORK : this.BRK; this.paint(); },
  tick() {
    this.left--;
    if (this.left <= 0) {
      this.pause();
      if (this.mode === 'work') {
        state.pomoTotal++; state.pomoToday.count++;
        save(); addXP(10);
        toast('🍅 Focus session complete! Take a 5-minute break.', 'ach');
        this.mode = 'brk'; this.left = this.BRK;
        checkAch();
      } else {
        toast('☕ Break\u2019s over — ready for another session?', 'info');
        this.mode = 'work'; this.left = this.WORK;
      }
    }
    this.paint();
  },
  paint() {
    const t = document.getElementById('pomoTime');
    if (!t) return;
    t.textContent = pad(Math.floor(this.left / 60)) + ':' + pad(this.left % 60);
    t.classList.toggle('break', this.mode === 'brk');
    const m = document.getElementById('pomoMode');
    if (m) m.textContent = this.mode === 'work' ? 'Work session · 25 min' : 'Break time · 5 min';
    const c = document.getElementById('pomoCount');
    if (c) c.textContent = `${state.pomoToday.count} session${state.pomoToday.count !== 1 ? 's' : ''} today · ${state.pomoTotal} total`;
  }
};
/* global search */
const doSearch = debounce(q => {
  const dd = $('#searchDD');
  if (!q || q.length < 2) { dd.classList.remove('open'); $('#globalSearch').setAttribute('aria-expanded', 'false'); return; }
  const L = q.toLowerCase();
  const probs = PROBLEMS.filter(p => (p.t + ' ' + p.topics.join(' ') + ' ' + p.diff).toLowerCase().includes(L)).slice(0, 5);
  const algos = ALGOS.filter(a => (a.name + ' ' + a.cat).toLowerCase().includes(L)).slice(0, 4);
  const paths = PATHS.filter(p => p.t.toLowerCase().includes(L)).slice(0, 2);
  if (!probs.length && !algos.length && !paths.length) {
    dd.innerHTML = `<div class="sr-item dim">No matches for "${esc(q)}"</div>`;
  } else dd.innerHTML =
    (probs.length ? `<div class="sr-group">Problems</div>` + probs.map(p => `<a class="sr-item" href="#/problem/${p.id}">${I.code}<span>${p.t}</span><span class="b badge ${diffClass(p.diff)}">${p.diff}</span></a>`).join('') : '') +
    (algos.length ? `<div class="sr-group">Algorithms</div>` + algos.map(a => `<a class="sr-item" href="#/algo/${a.id}">${I.book}<span>${a.name}</span><span class="chip">${a.cat}</span></a>`).join('') : '') +
    (paths.length ? `<div class="sr-group">Paths</div>` + paths.map(p => `<a class="sr-item" href="#/paths">${I.target}<span>${p.t}</span></a>`).join('') : '');
  dd.classList.add('open'); $('#globalSearch').setAttribute('aria-expanded', 'true');
}, 180);

/* ---------------- CHROME (topbar + sidebar profile) ---------------- */
function renderChrome() {
  const user = (typeof AFAuth !== 'undefined') ? AFAuth.currentUser() : null;
  const authTrigger = document.getElementById('authTrigger');
  if (authTrigger) {
    authTrigger.textContent = user ? 'Switch account' : 'Log in / Sign up';
    authTrigger.setAttribute('aria-label', user ? `Switch account (signed in as ${user})` : 'Log in or sign up');
  }
  const accountNav = document.getElementById('accountNav');
  if (accountNav) {
    accountNav.textContent = user ? 'Switch account' : 'Log in / Sign up';
    accountNav.setAttribute('aria-label', user ? `Switch account (signed in as ${user})` : 'Log in or sign up');
  }
  const sn = document.getElementById('streakN');
  if (sn) sn.textContent = state.streak.count;
  const pill = document.getElementById('streakPill');
  if (pill) pill.classList.toggle('hot', state.streak.count >= 3);
  const sp = document.getElementById('sideProfile');
  if (sp) sp.innerHTML = `
    <div class="sp-row">
      <span class="sp-name" title="${esc(user || 'Local Learner')}">${esc(user || 'Local Learner')}</span>
      ${user ? `<button class="icon-btn sm" data-action="logout" aria-label="Log out" title="Log out">${I.x}</button>` : ''}
    </div>`;
}

/* =====================================================================
   EVENTS
===================================================================== */
function splitTopLevelComma(str) {
  const out = []; let buf = ''; let depth = 0; let quote = null;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (quote) {
      buf += ch;
      if (ch === quote && str[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '\'' || ch === '"') { quote = ch; buf += ch; continue; }
    if ('([{'.includes(ch)) depth++;
    if (')]}'.includes(ch)) depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) { out.push(buf.trim()); buf = ''; continue; }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter(Boolean);
}
function parseExpectedValue(raw) {
  const text = String(raw || '').trim();
  if (!text) return '';
  if (text === 'true' || text === 'false') return text === 'true';
  if (/^-?\d+$/.test(text)) return Number(text);
  if ((text.startsWith('[') && text.endsWith(']')) || (text.startsWith('{') && text.endsWith('}'))) {
    try { return (0, eval)('(' + text + ')'); } catch (e) { return text; }
  }
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    try { return (0, eval)('(' + text + ')'); } catch (e) { return text.slice(1, -1); }
  }
  return text;
}
function parseExampleInput(problem, raw) {
  const text = String(raw || '').trim();
  if (!text.includes('=')) return [parseExpectedValue(text)];
  const parts = splitTopLevelComma(text);
  const args = [];
  parts.forEach(part => {
    const match = part.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) {
      args.push(parseExpectedValue(part));
      return;
    }
    args.push(parseExpectedValue(match[2]));
  });
  if (args.length === 1 && problem.params.length > 1) {
    const single = args[0];
    if (Array.isArray(single) && problem.params.length > 1) return [single];
  }
  return args;
}
function normalizeResult(value) {
  if (value instanceof Set) return [...value].map(normalizeResult);
  if (Array.isArray(value)) return value.map(normalizeResult);
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).forEach(k => { out[k] = normalizeResult(value[k]); });
    return out;
  }
  return value;
}
function compareResult(actual, expected) {
  const a = normalizeResult(actual);
  const e = normalizeResult(expected);
  return JSON.stringify(a) === JSON.stringify(e);
}
function evaluateUserAttempt(problem, code, lang) {
  const source = String(code || '').trim();
  if (!source) return {ok: false, detail: 'Write some code first.'};
  if (lang !== 'js') return {ok: false, detail: 'Automatic execution currently supports JavaScript only. Switch the editor language to JavaScript to run sample tests.'};

  if (lang === 'js') {
    try {
      const fn = (0, eval)(`(function(){ ${source}; return typeof ${problem.fn} === 'function' ? ${problem.fn} : null; })()`);
      if (typeof fn !== 'function') {
        return {ok: false, detail: `The code must define ${problem.fn}().`};
      }

      const tests = [
        ...problem.ex.map(ex => ({args: parseExampleInput(problem, ex.i), expected: parseExpectedValue(ex.o)})),
        ...(HIDDEN_TESTS[problem.id] || [])
      ].map(test => {
        let actual;
        if (problem.id === 'lru-cache') {
          const [capacity, operations] = test.args;
          const cache = new fn(capacity);
          actual = operations.map(([operation, ...args]) => operation === 'put' ? (cache.put(...args), null) : cache.get(...args));
        } else actual = fn(...test.args);
        return {actual, expected: test.expected ?? test.output, passed: compareResult(actual, test.expected ?? test.output)};
      });

      const ok = tests.every(t => t.passed);
      return {ok, detail: ok ? 'All sample and hidden checks passed.' : 'At least one sample or hidden check failed.', tests};
    } catch (e) {
      return {ok: false, detail: e && e.message ? e.message : 'The code could not be executed.'};
    }
  }

  const lower = source.toLowerCase();
  const fnCandidates = [problem.fn, problem.fn.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase(), problem.fn.toLowerCase()];
  const hasFnDef = fnCandidates.some(name => new RegExp(`def\\s+${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(`, 'i').test(source) || new RegExp(`(?:const|let|var)\\s+${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*=`).test(source) || new RegExp(`function\\s+${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(`).test(source));
  const hasLoop = /(for\s+|while\s+|if\s+|return\s+|yield\s+)/i.test(source);
  const hasDataRefs = /(seen|stack|queue|visited|mid|lo|hi|left|right|target|nums|grid|s\b|dict|map)/i.test(source);
  const placeholder = /(pass\s*$|your code here|todo|placeholder)/i.test(source);

  if (!hasFnDef || !hasLoop || !hasDataRefs || placeholder) {
    return {ok: false, detail: 'The code does not yet implement the function logic for this problem.'};
  }

  if (/(return\s+(?:0|1|true|false|None|-?\d+)\s*$)/i.test(source) && !/return\s+\[|return\s+\(|return\s+\{|return\s+.*(nums|target|grid|s|stack|seen)/i.test(source)) {
    return {ok: false, detail: 'The function is returning a placeholder value instead of computing the result.'};
  }

  return {ok: false, detail: 'Python code is validated by checking the actual algorithm shape and sample cases in-browser; use the real function logic instead of placeholders.'};
}

const Actions = {
  'theme': () => {
    document.body.classList.add('theme-fade');
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = state.theme; save();
    toast(state.theme === 'dark' ? '🌙 Dark theme' : '☀️ Light theme', 'info');
    setTimeout(() => document.body.classList.remove('theme-fade'), 600);
  },
  'contrast': () => {
    state.contrast = !state.contrast;
    document.body.dataset.contrast = state.contrast ? 'high' : ''; save();
    toast(state.contrast ? 'High contrast on' : 'High contrast off', 'info');
  },
  'menu': () => {
    $('#sidebar').classList.add('open'); $('#scrim').classList.add('show');
    const first = $('#sidebar').querySelector('.nav-link'); if (first) first.focus();
  },
  'menu-close': closeDrawer,
  'skip': () => {
    const m = document.getElementById('main');
    if (m) { m.focus(); m.scrollIntoView({behavior: 'smooth'}); }
  },
  'logout': () => { if (typeof AFAuth !== 'undefined') AFAuth.logout(); },
  'auth-open': () => {
    if (typeof AFAuth === 'undefined') return;
    AFAuth.showLogin(() => {
      loadUserState();
      initApp();
      renderChrome();
    });
  },
  'goto-daily': () => { location.hash = '#/daily'; },
  'pomo-toggle': () => { const p = $('#pomo'); p.hidden = !p.hidden; if (!p.hidden) Pomo.paint(); },
  'pomo-close': () => { $('#pomo').hidden = true; },
  'pomo-start': () => { Pomo.int ? Pomo.pause() : Pomo.start(); },
  'pomo-reset': () => Pomo.reset(),
  'bookmark': el => {
    const id = el.dataset.id;
    if (state.bookmarks.includes(id)) {
      state.bookmarks = state.bookmarks.filter(x => x !== id); el.style.color = ''; toast('Bookmark removed', 'info');
    } else {
      state.bookmarks.push(id); el.style.color = 'var(--acc)'; toast('🔖 Bookmarked', 'success');
    }
    save(); checkAch();
  },
  'hint': el => el.closest('.hint-item').classList.add('revealed'),
  'sol-reveal': () => {
    const lock = $('#solLock'), body = $('#solBody');
    if (lock) lock.hidden = true;
    if (body) { body.hidden = false; initReveal(); }
  },
  'ptab': el => {
    const tab = el.dataset.tab;
    el.parentElement.querySelectorAll('.tab').forEach(t => { t.classList.toggle('active', t === el); t.setAttribute('aria-selected', t === el); });
    const p = P_BY_ID[route()[1]];
    if (p) $('#ptabBody').innerHTML = ptabBody(p, tab);
  },
  'lang-tab': el => {
    const lang = el.dataset.lang;
    el.parentElement.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === el));
    $$('[data-langbox]').forEach(b => b.hidden = b.dataset.langbox !== lang);
  },
  'copy-code': el => copyText(CodeReg[el.dataset.code]),
  'run-tests': async el => {
    const id = el.dataset.id, p = P_BY_ID[id];
    const out = $('#testOut'), code = $('#editor').value;
    if (!code.trim()) { toast('Write some code first ✍️', 'warn'); return; }
    if (Session.lang !== 'js') {
      out.innerHTML = `<div class="external-fallback"><span>${esc(Session.lang.toUpperCase())} is not executable in this browser workspace.</span>${EXTERNAL_EQUIVALENTS[id] ? `<a href="${EXTERNAL_EQUIVALENTS[id]}" target="_blank" rel="noopener noreferrer">Continue this problem on LeetCode ${I.arrR}</a>` : '<span>No verified exact external equivalent is available for this problem yet.</span>'}</div>`;
      return;
    }
    el.disabled = true;
    const hiddenCount = (HIDDEN_TESTS[id] || []).length;
    out.innerHTML = `<div class="test-row"><span class="ti">Running ${p.ex.length} sample and ${hiddenCount} hidden test${hiddenCount === 1 ? '' : 's'}…</span></div>`;

    const verdict = evaluateUserAttempt(p, code, Session.lang || 'py');
    Session.lastVerdict = verdict.ok;
    Session.lastVerdictFor = id;

    p.ex.forEach((t, i) => {
      Timers.add(setTimeout(() => {
        const ok = !!(verdict.tests || [])[i] && verdict.tests[i].passed;
        out.insertAdjacentHTML('beforeend', `<div class="test-row ${ok ? 't-pass' : 't-fail'}">
          <span class="t-ico">${ok ? I.check : I.x}</span>
          <span class="ti">Case ${i + 1} — ${esc(t.i)}</span>
          <span class="t-expected">expected ${esc(t.o)}${verdict.tests && verdict.tests[i] ? ` · got ${esc(JSON.stringify(verdict.tests[i].actual))}` : ''}</span></div>`);
        if (i === p.ex.length - 1) {
          const hidden = (verdict.tests || []).slice(p.ex.length);
          if (hidden.length) {
            const hiddenPassed = hidden.filter(test => test.passed).length;
            out.insertAdjacentHTML('beforeend', `<div class="test-row ${hiddenPassed === hidden.length ? 't-pass' : 't-fail'}"><span class="t-ico">${hiddenPassed === hidden.length ? I.check : I.x}</span><span class="ti">Hidden checks</span><span class="t-expected">${hiddenPassed}/${hidden.length} passed</span></div>`);
          }
          if (!verdict.ok && EXTERNAL_EQUIVALENTS[id]) {
            out.insertAdjacentHTML('beforeend', `<div class="external-fallback"><span>Need another judge for this problem?</span><a href="${EXTERNAL_EQUIVALENTS[id]}" target="_blank" rel="noopener noreferrer">Continue this problem on LeetCode ${I.arrR}</a></div>`);
          }
          el.disabled = false;
          const passedTests = (verdict.tests || []).filter(test => test.passed).length;
          recordAttempt(id, verdict.ok, code, passedTests);
          if (verdict.ok) toast(`✅ All ${p.ex.length + hidden.length} tests passed — mark it solved!`, 'success');
          else toast(verdict.detail || 'Tests failed — check the failing cases and refine.', 'warn');
        }
      }, 420 * (i + 1)));
    });
  },
  'reset-code': el => {
    const id = el.dataset.id, p = P_BY_ID[id];
    if (!p) return;
    Session.buf[id] = Session.buf[id] || {};
    Session.buf[id][Session.lang] = starter(p, Session.lang);
    const ed = $('#editor');
    if (ed) { ed.value = Session.buf[id][Session.lang]; ed.focus(); }
    Session.lastVerdict = false;
    Session.lastVerdictFor = null;
  },
  'mark-solved': el => {
    const id = el.dataset.id;
    if (Session.lastVerdictFor !== id || !Session.lastVerdict) { toast('Run and pass every JavaScript test before marking this problem solved.', 'warn'); return; }
    if (!Solved.has(id)) {
      solveProblem(id);
      Session.running = false; Session.solvedAt = Date.now();
      el.className = 'btn ok sm'; el.textContent = '✓ Solved';
    } else toast('Already solved — nice!', 'info');
  },
  'quiz-start': () => quizStart(),
  'quiz-opt': el => quizAnswer(+el.dataset.i),
  'quiz-next': () => quizNext(),
  'quiz-retake': () => { QZ = null; quizStart(); },
  'path-toggle': el => {
    const card = el.closest('.path-card');
    card.classList.toggle('open');
    el.setAttribute('aria-expanded', card.classList.contains('open'));
  },
  'step-done': el => {
    const {path, step} = el.dataset;
    const arr = state.paths[path] || (state.paths[path] = []);
    if (arr.includes(step)) { state.paths[path] = arr.filter(x => x !== step); el.classList.remove('done'); }
    else { arr.push(step); el.classList.add('done'); addXP(5); toast('✓ Step complete (+5 XP)', 'success'); }
    save(); checkAch();
    const done = PATHS.find(p => p.id === path);
    if (done && done.steps.every(st => arr.includes(st.id))) { toast(`🏁 Path complete: ${done.t}!`, 'ach'); Confetti.burst(160); }
  },
  'share-progress': () => {
    const who = (typeof AFAuth !== 'undefined' && AFAuth.currentUser()) || 'A student';
    const txt = `⚡ ${who}'s AlgoForge progress\nLevel ${level()} · ${state.xp} XP\nProblems solved: ${Solved.count()}/${PROBLEMS.length} (Easy ${Solved.byDiff('Easy')} · Medium ${Solved.byDiff('Medium')} · Hard ${Solved.byDiff('Hard')} · Expert ${Solved.byDiff('Expert')})\nStreak: ${state.streak.count} days (best ${state.streak.best})\nBadges: ${state.achievements.length}/${ACH.length}\nFocus sessions: ${state.pomoTotal}`;
    if (navigator.share) { navigator.share({title: 'My DSA progress', text: txt}).catch(() => {}); }
    else modal(`<h3>Share your progress</h3><p class="dim" style="font-size:.86rem;margin-bottom:10px">Copy this summary and post it anywhere.</p>
      <textarea class="note-area" readonly style="min-height:150px">${esc(txt)}</textarea>
      <div style="display:flex;gap:10px;margin-top:12px"><button class="btn primary sm" data-action="copy-share">Copy</button>
      <button class="btn ghost sm" data-action="modal-close">Close</button></div>`);
  },
  'copy-share': () => { const ta = $('#modalRoot textarea'); copyText(ta.value, '📋 Progress copied — go flex it!'); },
  'modal-close': closeModal,
  'clear-filters': () => { F.q = ''; F.diff = F.topic = F.comp = F.status = 'All'; F.sort = 'pop'; render(); }
};
function recordAttempt(id, ok, code, passedTests = 0) {
  const total = P_BY_ID[id].ex.length + (HIDDEN_TESTS[id] || []).length;
  state.attempts.unshift({p: id, ts: Date.now(), lang: Session.lang, ok, passedTests, totalTests: total, tests: `${passedTests}/${total}`, code: code.slice(0, 1200)});
  state.attempts = state.attempts.slice(0, 60);
  touchActivity(1); save();
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (el) {
    const fn = Actions[el.dataset.action];
    if (fn) {
      if (el.tagName === 'A') e.preventDefault();
      if (el.classList.contains('btn') && typeof Anim !== 'undefined' && !prefersReduced()) Anim.ripple(el, e);
      fn(el, e); return;
    }
  }
  if (!e.target.closest('.search-wrap')) { $('#searchDD').classList.remove('open'); $('#globalSearch').setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeDrawer(); $('#searchDD').classList.remove('open'); }
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $('#globalSearch').focus(); }
  if (e.key === 'Enter' && e.target.closest && e.target.closest('.path-hero')) {
    e.target.closest('.path-hero').dispatchEvent(new MouseEvent('click', {bubbles: true}));
  }
});
/* debounced helpers for filter + notes wiring */
const refocusProbSearch = () => {
  const inp = document.querySelector('[data-filter="q"]');
  if (inp) { inp.focus(); try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) {} }
};
const applyQFilter = debounce(() => { render(); setTimeout(refocusProbSearch, 320); }, 240);
const noteSavers = {};
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset && t.dataset.filter === 'q') { F.q = t.value; applyQFilter(); }
  if (t.id === 'editor' && Session.lang) {
    const id = route()[1];
    if (id) (Session.buf[id] || (Session.buf[id] = {}))[Session.lang] = t.value;
    Session.lastVerdict = false;
    Session.lastVerdictFor = null;
  }
  if (t.dataset && t.dataset.noteFor) {
    const id = t.dataset.noteFor;
    const saver = noteSavers[id] || (noteSavers[id] = debounce(val => {
      state.notes[id] = val; save();
      const ind = document.getElementById('noteSaved');
      if (ind) { ind.classList.add('show'); setTimeout(() => ind.classList.remove('show'), 1400); }
      checkAch();
    }, 600));
    saver(t.value);
  }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset && t.dataset.filter && t.dataset.filter !== 'q') { F[t.dataset.filter] = t.value; render(); }
  if (t.id === 'langSel') {
    const id = route()[1];
    const editor = $('#editor');
    if (id && editor) (Session.buf[id] || (Session.buf[id] = {}))[Session.lang] = editor.value;
    Session.lang = t.value;
    Session.lastVerdict = false;
    Session.lastVerdictFor = null;
    const p = P_BY_ID[id];
    if (editor && p) editor.value = Session.buf[id]?.[Session.lang] ?? starter(p, Session.lang);
    const runButton = document.querySelector('[data-action="run-tests"]');
    const externalLink = document.querySelector('[data-external-language]');
    if (runButton) runButton.disabled = Session.lang !== 'js';
    if (externalLink) {
      const exactUrl = EXTERNAL_EQUIVALENTS[id];
      externalLink.hidden = Session.lang === 'js';
      externalLink.innerHTML = `${exactUrl ? `Continue ${esc(P_BY_ID[id]?.t || 'this problem')} on LeetCode` : `Browse ${esc(Session.lang.toUpperCase())} problem sets`} ${I.arrR}`;
      externalLink.href = exactUrl || EXTERNAL_CATALOG_FALLBACKS[Session.lang] || EXTERNAL_PLATFORMS[0].url;
    }
  }
});
document.addEventListener('keydown', e => {  /* Tab inside editor inserts spaces */
  if (e.key === 'Tab' && e.target.id === 'editor') {
    e.preventDefault();
    const ed = e.target, s = ed.selectionStart;
    ed.value = ed.value.slice(0, s) + '  ' + ed.value.slice(ed.selectionEnd);
    ed.selectionStart = ed.selectionEnd = s + 2;
  }
});
 $('#globalSearch').addEventListener('input', e => doSearch(e.target.value.trim()));
 $('#searchDD').addEventListener('click', () => { $('#searchDD').classList.remove('open'); $('#globalSearch').value = ''; });
addEventListener('hashchange', () => {
  if (!location.hash || location.hash.startsWith('#/')) render();   // #main etc. = anchors, not routes
});
addEventListener('resize', debounce(() => { if (route()[0] === 'stats') drawWeekChart($('#weekChart')); }, 250));

/* ---------------- HERO TYPEWRITER ---------------- */
function typeHero() {
  const el = document.getElementById('typed'); if (!el) return;
  const lines = [
    'def quick_sort(a): ...',
    'const dist = dijkstra(g, src);',
    'dp[i] = min(dp[i-1], dp[i-c]) + 1',
    'while lo <= hi: mid = (lo + hi) >> 1',
    'if not valid(c, path): continue  # prune'
  ];
  let li = 0, ci = 0, del = false;
  const step = () => {
    if (!document.contains(el)) return;
    const line = lines[li];
    if (!del) {
      ci++; el.textContent = line.slice(0, ci);
      if (ci === line.length) { del = true; setTimeout(step, 1600); return; }
    } else {
      ci--; el.textContent = line.slice(0, ci);
      if (ci === 0) { del = false; li = (li + 1) % lines.length; }
    }
    setTimeout(step, del ? 26 : 52);
  };
  step();
}

/* =====================================================================
   ANIMATION PACK — counters, ripples, 3D tilt
===================================================================== */
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const Anim = {
  countUp(el, to, dur = 900) {
    if (prefersReduced()) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);            // ease-out cubic
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
  ripple(el, e) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const r = document.createElement('span');
    r.className = 'ripple';
    r.style.width = r.style.height = size + 'px';
    r.style.left = (e.clientX - rect.left - size / 2) + 'px';
    r.style.top = (e.clientY - rect.top - size / 2) + 'px';
    el.appendChild(r);
    setTimeout(() => r.remove(), 650);
  },
  tiltify(root) {
    if (!root || prefersReduced()) return;
    root.querySelectorAll('.algo-card, .stat-card, .ach-card').forEach(card => {
      if (card.dataset.tilt) return;
      card.dataset.tilt = '1';
      card.classList.add('tilt');
      const shine = document.createElement('span');
      shine.className = 'tilt-shine';
      card.appendChild(shine);
      card.addEventListener('pointermove', ev => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width;
        const y = (ev.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        card.style.transform = 'perspective(700px) rotateX(' + ((0.5 - y) * 5).toFixed(2) +
          'deg) rotateY(' + ((x - 0.5) * 7).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  },
  numbers(root) {
    if (!root) return;
    root.querySelectorAll('.stat-card .v').forEach(el => {
      const txt = el.textContent.trim();
      if (/^\d+$/.test(txt)) {
        el.classList.add('pop');
        Anim.countUp(el, parseInt(txt, 10));
      }
    });
  }
};

/* =====================================================================
   BOOT — auth-gated: login screen first, then per-user state
===================================================================== */
let __booted = false;

function hideSplash() {
  const s = document.getElementById('splash');
  if (s) {
    s.classList.add('hide');
    setTimeout(() => { if (s.parentNode) s.parentNode.removeChild(s); }, 500);
  }
}
function showFatal(err) {
  const v = document.getElementById('view');
  if (!v) return;
  v.innerHTML =
    '<div class="card" style="margin:20px 0;border-color:var(--bad)">' +
    '<h2 style="color:var(--bad);margin-bottom:8px">AlgoForge hit an error while starting</h2>' +
    '<p class="dim" style="margin-bottom:10px">The page is loaded, but part of the app failed. Details:</p>' +
    '<pre class="mono" style="background:var(--codebg);color:#fda4af;padding:12px;border-radius:10px;overflow:auto;font-size:.8rem;white-space:pre-wrap">' +
    esc(String((err && err.stack) || (err && err.message) || err)) +
    '</pre>' +
    '<p class="dim" style="font-size:.85rem;margin-top:10px">Press F12 → Console for the line number.</p></div>';
}

function loadUserState() {
  if (typeof AFAuth === 'undefined') return;
  const user = AFAuth.currentUser();
  if (user && typeof AFData !== 'undefined')
    state = Object.assign(cloneState(DEFAULT_STATE), AFData.load(user));
}
function initApp() {
  /* clean a stray in-page anchor (#main) out of the URL so the router starts clean */
  if (location.hash && !location.hash.startsWith('#/'))
    history.replaceState(null, '', location.pathname + location.search);
  document.documentElement.dataset.theme = state.theme;
  document.body.dataset.contrast = state.contrast ? 'high' : '';
  /* detect a missing stylesheet and say so in plain words */
  const bg = getComputedStyle(document.body).backgroundColor;
  if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
    if (window.__afCssFail) window.__afCssFail();
  }
  rollDaily();
  render();
  renderChrome();
  Pomo.paint();
  typeHero();
}
function boot() {
  if (__booted) return;
  __booted = true;
  const proceed = () => {
    try { loadUserState(); initApp(); }
    catch (err) { console.error('[AlgoForge] boot failed:', err); showFatal(err); }
    setTimeout(hideSplash, 450);
  };
  try {
    if (typeof AFAuth === 'undefined') { proceed(); return; }
    AFAuth.init().then(() => proceed()).catch(() => proceed());
  } catch (err) {
    console.error('[AlgoForge] boot failed:', err);
    showFatal(err);
    setTimeout(hideSplash, 450);
  }
}
document.addEventListener('DOMContentLoaded', boot);
if (document.readyState !== 'loading') boot();