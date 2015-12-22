import re
from random import shuffle

replacements = []
gen = set()
input = ""
with open('input.txt', 'r') as f:
    for i, line in enumerate(f.readlines()):
        split = line.split(' => ')
        try:
            replacements.append( (split[0], split[1].strip()) )
        except IndexError:
            input = split[0].strip()

for old,new in replacements:
    p = re.compile(old)
    itr = p.finditer(input)
    for match in itr:
        s = match.span()
        gen.add( input[:s[0]] + new + input[s[1]:] )

count = 0
target = input
while target != 'e':
    temp = target
    for old, new in replacements:
        while new in target:
            count += target.count(new)
            target = target.replace(new, old)

    if temp == target: # start over
        shuffle(replacements)
        target = input
        count = 0

print("count: " + str(count))
