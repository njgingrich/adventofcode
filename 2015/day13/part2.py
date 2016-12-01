import itertools as it
import re
import collections as col

def read_input(name):
    people = col.defaultdict()
    with open(name, 'r') as f:
        for line in f.readlines():
            split = re.findall(r"[\w']+", line)
            if split[2] == "lose":
                split[3] = -1 * int(split[3])
            try:
                people[split[0]][split[10]] = split[3]
            except:
                people[split[0]] = {}
                people[split[0]][split[10]] = split[3]

        people['Me'] = {}
        return people

people = read_input('input.txt')
max_happiness = 0
for perm in it.permutations(people):
    total_happiness = 0
    for ix, person in enumerate(perm):
        # get people next to them
        left  = perm[ix-1]
        if left == 'Me' or person == 'Me':
            left_pair = 0
        else:
            left_pair  = int(people[left][person]) + int(people[person][left])
        total_happiness = total_happiness + left_pair
    max_happiness = max(total_happiness, max_happiness)

print("maximum happiness: " + str(max_happiness))
