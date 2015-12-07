import re

vowels  = re.compile("(.*[aeiou].*){3,}")
doubles = re.compile("([a-z])\\1")
banned  = re.compile("ab|cd|pq|xy")

with open('input.txt', 'r') as f:
    count = 0
    for line in f:
        if vowels.search(line) and doubles.search(line) and not banned.search(line):
            count += 1

    print("final count: %d" % count)
