import re

#keys = ["children", "cats", "samoyeds", "pomeranians", 
#        "akitas", "vizslas", "goldfish", "trees", "cars", "perfumes"]

keys = [("children", 3), ("cats", 7), ("samoyeds", 2),
        ("pomeranians", 3), ("akitas", 0), ("vizslas", 0),
        ("goldfish", 5), ("trees", 3), ("cars", 2), ("perfumes", 1)]
sues = {}

def aunts_with_item(item, amount, sues):
    new_sues = {}
    for sue in sues:
        try:
            if sues[sue][item] != str(amount):
                pass
            else:
                new_sues[sue] = sues[sue]
        except:
            new_sues[sue] = sues[sue]
    return new_sues

with open('input.txt', 'r') as f:
    for line in f.readlines():
        split = re.findall(r"[\w']+", line)
        info = {}
        info[split[2]] = split[3]
        info[split[4]] = split[5]
        info[split[6]] = split[7]
        sues[str(split[1])] = info

aunts = aunts_with_item(keys[0][0], keys[0][1], sues)
for k in keys[1:]:
    aunts = aunts_with_item(k[0], k[1], aunts)

for aunt in aunts:
    print aunt
