from collections import defaultdict
from itertools   import permutations

places = set()
routes = defaultdict(dict)
with open('input.txt', 'r') as f:
    for line in f.readlines():
        (original, _, new, _, distance) = line.split()
        places.add(original)
        places.add(new)
        routes[original][new] = int(distance)
        routes[new][original] = int(distance)
    
distances = []
for p in permutations(places):
    distances.append(sum(map(lambda x, y: routes[x][y], p[:-1], p[1:])))

print(min(distances))
