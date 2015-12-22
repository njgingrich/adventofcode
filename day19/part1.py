import re

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

for r in replacements:
    p = re.compile(r[0])
    itr = p.finditer(input)
    for match in itr:
        s = match.span()
        gen.add( input[:s[0]] + r[1] + input[s[1]:] )

print(len(gen))
