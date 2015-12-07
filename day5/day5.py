import re

vowels  = re.compile("(.*[aeiou].*){3,}")
doubles = re.compile("([a-z])\\1")
banned  = re.compile("ab|cd|pq|xy")
pairs   = re.compile("([a-z]{2}).*\\1")
mirror  = re.compile("([a-z]).\\1")

with open('input.txt', 'r') as f:
    count = 0
    for line in f:
        if pairs.search(line) and mirror.search(line):
            count += 1

    print("final count: %d" % count)
