import itertools as it

containers = []
with open('input.txt', 'r') as f:
    for line in f.readlines():
        containers.append(int(line.strip()))

combos = []
for combo in it.combinations(containers, 4):
    if sum(combo) == 150:
        combos.append(combo)

print(len(combos))
