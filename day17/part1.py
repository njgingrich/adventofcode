import itertools as it

containers = []
with open('input.txt', 'r') as f:
    for line in f.readlines():
        containers.append(int(line.strip()))

combinations = []
for prod in it.product(range(2), repeat=len(containers)):
    sum = 0
    for i,c in enumerate(prod):
        if c == 1:
            sum += containers[i]
    if sum == 150:
        combinations.append(prod)

print(len(combinations))
