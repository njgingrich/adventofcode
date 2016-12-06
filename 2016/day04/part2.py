from collections import OrderedDict

input = []

with open('input.txt', 'r') as f:
    for line in f:
        input.append(line.strip())

total = 0
valid = []

def validate(sector, checksum):
    counts = {}
    for c in sector:
        if c not in counts:
            counts[c] = 1
        else:
            counts[c] = counts[c] + 1

    sorted_items = sorted(counts.items(), key=lambda x: [-x[1], x[0]], reverse=True)
    sorted_items.reverse()
    real_checksum = ''
    for i in sorted_items[0:5]:
        real_checksum += (i[0])
    return real_checksum == checksum

def get_new_phrase(phrase, num):
    mod_num = num % 26
    s = ""
    for c in phrase:
        if c == '-':
            s += ' '
        else:
            new_ord = ord(c) + mod_num
            while (new_ord > 122): #ord(z)
                new_ord -= 26

            s += chr(new_ord)
    return s



for line in input:
    split = line.strip().split('[')
    checksum = split[-1][:-1]
    sector_split = split[0].split('-')
    sector_id = sector_split[-1]
    sector = sector_split[:-1]
    sector = ''.join(sector)

    if (validate(sector, checksum)):
        total += int(sector_id)
        valid.append((sector, int(sector_id)))

print("total: {}".format(total))

for item in valid:
    s = get_new_phrase(item[0], item[1])
    if 'north' in s:
        print(item[1])
