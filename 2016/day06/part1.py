from collections import Counter

lines = []

with open('input.txt', 'r') as f:
    for line in f:
        lines.append(list(line.strip()))

i = 0
chars = []
freq = []

while i < len(lines[0]):
    for item in lines:
        chars.append(item[i])

    l = Counter(chars)
    print("appending {}".format(l.most_common(1)[0]))
    freq.append(l.most_common(1)[0][0])
    chars = []
    i += 1

print("result: {}".format(''.join(freq)))
