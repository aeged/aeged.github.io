---
layout: post
title: "My Favorite Python Tricks"
comments: true
description: "Some of my favorite tricks in Python for interviews and competitive programming."
keywords: "Python3, Python, Interview Prep, Leetcode, Competitive Programming"
---

*Lately, I've been doing a lot of interview prep with Python. I thought I'd compile some of my favorite useful tricks with Python to help out those in the same boat.*

*For those of you in that boat, keep swimmin'* 🏊‍♀️ 🚣‍♀️ ✌️

## General Tricks

General tips:

* Always import specifically using `from x import y`
  * Using the dot operator e.g. `import x; x.y` is a dictionary lookup each time, unnecessary slowdown
* Use the standard library as much as possible 
  * Comprehensions for quickly building lists/dicts with a one-liner
  * Map function for iterating and transforming **finite** lists
    * Generators for iterating **infinite** lists (memory efficient, doesn't need to store whole thing.. just generates it)
      * Itertools for combinatorics stuff 
* Write your code in functions (underlying Cpython implementation makes globals outside of functions costs more time)

## Comprehensions

These are amazing space savers in Python. Creating lists or dictionaries in a one-liner is definitely a win.

```python

>>> s = 'hello world'
>>> n = [i for i in range(len(s))]  # list comprehension
>>> n
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
>>> d = {s[i]:n[i] for i in range(len(s))}  # dict comprehension
>>> d
{'h': 0, 'e': 1, 'l': 9, 'o': 7, ' ': 5, 'w': 6, 'r': 8, 'd': 10}
```

## Stacks

[lists as stacks](https://docs.python.org/3.8/tutorial/datastructures.html#using-lists-as-stacks)

```python
# STACK
st = list()
st.extend(['a','b','c'])
st.append('d')  # stack.push(x)
print(st)  # prints ['a','b','c','d']
print(st.pop())  # prints 'd'
print(st)  # prints ['a','b','c']
st[-1]  # stack.peek() 
```

## Queues

[Queue docs](https://docs.python.org/3.8/library/queue.html)

```python
import queue

# TYPES OF QUEUES
queue.Queue()  # FIFO queue
queue.LifoQueue()  # LIFO queue
queue.PriorityQueue()  # Min Heap

# METHODS
queue.get()  # removes and returns highest priority item
queue.put(item)  # insert item
queue.qsize()  # size of queue
queue.empty()  # True/False
queue.full()  # True if queue is full (internal thing)
```

#### Min Heap (Priority Queue)

Use `queue.PriorityQueue`

Lowest value entry is first (min heap) e.g. `sorted(list(entries))[0]` 

### Max Heap 

Just use priority queue but reverse the key

```python
from Queue import PriorityQueue
pq = PriorityQueue()
for i in range(10): # add 0-9 with priority = -key
    pq.put((-i,i))
print(pq.get()[1]) # 9
```

## Deqeue (collections)

Use the `collections` module

[docs](https://docs.python.org/3.8/library/collections.html#collections.deque)

```python
from collections import deque

# METHODS
## (Crucial)
deque(iterable_object)  # init
deque.append(x) 
deque.appendleft(x) 
deque.pop()  # remove and return right-most element
deque.popleft()  # remove and return left-most element 
deque[0]  # peek at first element
deque[-1]  # peek at last element

## (Nice-haves)
deque.clear()  # empty queue to len 0
deque.count(x)  # num of elements equal to x
deque.extend(iterable_object)
deque.extendleft(iterable_object)
deque.remove(x)  # remove first occurence of x 
deque.index(x)  # return index location of first occurence of x (WARN: ValueError exception if not found)
```

```python
from collections import defaultdict

# EXAMPLE: check if s1 and s2 are anagrams of each other
s1 = 'abba'
s2 = 'zaba'
counter = defaultdict(int)  # default type initialized for each entry is an int initialized to default value
# default int value is initialized to 0, so all counters start from 0
for i in range(len(s1)):
	counter[s1[i]] += 1
	counter[s2[i]] -= 1
is_anagram = True
for k,v in counter.items():
	if 0 != v:
		is_anagram = False
return counter, is_anagram
# {a: 0, b: 1, z: 1}, False
	
# EXAMPLE: adding to a list (from Python docs)
s = [('yellow', 1), ('blue', 2), ('yellow', 3), ('blue', 4), ('red', 1)]
d = defaultdict(list)
for k, v in s:
    d[k].append(v)
return d
# {'blue': [2, 4], 'red': [1], 'yellow': [1, 3]}
```

## Add items to a dictionary on the fly

When an item isn't present in a dictionary, we can get exceptions :( 

`defaultdict` from `collections` allows us to automatically initialize dictionary values on the fly (like a default value).

```python
from collections import defaultdict
# EXAMPLE: check if s1 and s2 are anagrams of each other
s1 = 'abba'
s2 = 'zaba'
counter = defaultdict(int) # default type initialized for each entry is an int initialized to default value
# default int value is initialized to 0, so all counters start from 0
for i in range(len(s1)):
 counter[s1[i]] += 1
 counter[s2[i]] -= 1
is_anagram = True
for k,v in counter.items():
 if 0 != v:
 is_anagram = False
return counter, is_anagram
# {a: 0, b: 1, z: 1}, False
 
# EXAMPLE: adding to a list (from Python docs)
s = [('yellow', 1), ('blue', 2), ('yellow', 3), ('blue', 4), ('red', 1)]
d = defaultdict(list)
for k, v in s:
 d[k].append(v)
return d
# {'blue': [2, 4], 'red': [1], 'yellow': [1, 3]}
```

[DefaultDict docs](https://docs.python.org/3.8/library/collections.html#collections.defaultdict)


## Counting Element Frequency using `Counter`

We saw that we could count items in an iterable string using `defaultdict`, however most of the time `Counter` is a better method.

Counter is an interesting data structure in python that acts as a multi-set (or bag). It is a set that allows duplicate elements by counting them.

```python
>>> from collections import Counter
>>> s = 'hello world' 
>>> dict(Counter(s))
{'h': 1, 'e': 1, 'l': 3, 'o': 2, ' ': 1, 'w': 1, 'r': 1, 'd': 1}

```

## Binary Search with `bisect`

Python's `bisect` library is awesome for inserting new items into an already sorted list.

Under the hood, it's implemented with a **binary search**.

```python
from bisect import * 

bisect_right(sorted_list, element)  # return rightmost index to insert at
bisect_left(sorted_list, element)  # return leftmost index to insert at
insort_right(sorted_list, element)  # inserts at index returned by bisect_right
insort_left(sorted_list, element)  # inserts at index returned by bisect_left
```

See more at [Codespeedy](https://www.codespeedy.com/bisect-module-array-bisecting-algorithms-in-python/)

### String Concatenation

```python
# optimal runtime for string concatenation
list_of_strs = list('hello world!')
## ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', '!']
''.join(list_of_strs)
## 'hello world!'
```

## Pairing elements of objects as tuples (with `zip`)

`zip` takes any number of iterables as arguments and returns an iterator over tuples of their corresponding elements.

```python
list(zip([1,2,3], ('a','b','c'), {'*','^','_'}))
## [(1, 'a', '*'), (2, 'b', '^'), (3, 'c', '_')]
```

## Transforming Iterable Objects (with `map`)

Great for transforming iterable objects.

`map(function, iterable_object, ...)  # subsequent iterable objects optional`

Map iterates over the iterable object, passing each iteration as input to the function.

Returns a `map` object that can be **converted** to another type such as a `list` or `set`.

Example:

```python
powers = list(map(lambda x: x, range(4)))  # output: [0, 1, 2, 3] 
pow_of_two = list(map(lambda p: 2**p, powers))  # output: [1, 2, 4, 8] 
set(map(lambda x,p: p-x, powers, pow_of_two))  # {1, 2, 5} 
```

## Itertools 

[itertools docs](https://docs.python.org/3/library/itertools.html)

Great for combinatorics questions.

```python
# simple cartestian product (i.e. possible combinations of inputs)
>>> import itertools as it
>>> list(it.product(['x','y'],[0,1]))
[('x', 0), ('x', 1), ('y', 0), ('y', 1)]
# merge two iterables into one
>>> list(it.chain([1, 2, 3], [4, 5, 6]))
[1, 2, 3, 4, 5, 6]
# flatten a 2d array
>>> list(it.chain.from_iterable([ [1, 2, 3], [4, 5, 6] ]))
[1, 2, 3, 4, 5, 6]
```

Examples borrowed from [Real Python](https://realpython.com/python-itertools/), which has a great in-depth article on Itertools with more examples.

## Generators

[generators on Python wiki](https://wiki.python.org/moin/Generators)

Generators are very memory efficient ([see for more info](https://medium.com/learning-better-ways-of-interpretting-and-using/python-generators-memory-efficient-programming-tool-41f09077353c)).

You'll occassionally encounter these as returned by certain methods in Python.

However, you can also create your own functions that return generators by using the `yield` keyword in place of a `return`.

Typically, iterate over the returned generator until you find the entries you need using `next()`.

```python
# Fibonacci sequence example
def fib_seq():
  a,b=0,1
  while True:
    yield a
    a,b=b,a+b
Running this in the python console produces this:
>>> fib_seq()
<generator object fib_seq at 0x1020edbd0>
>>> f = fib_seq()
>>> next(f)
0
>>> next(f)
1
>>> next(f)
1
>>> next(f)
2
>>> next(f)
3
>>> next(f)
5
>>> next(f)
8
```

The ability to iterate over the generator theoretically infinite amount of times makes it really good for things such as a stream.
For more info, [Real Python](https://realpython.com/introduction-to-python-generators/) has a great article going in-depth on generators.

## References

* https://www.tutorialspoint.com/python-tricks-for-competitive-coding
