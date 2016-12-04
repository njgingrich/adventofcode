from collections import OrderedDict

input = []

with open('input.txt', 'r') as f:
    for line in f:
        input.append(line.strip())

total = 0

def validate(sector, checksum):
    counts = {}
    for c in sector:
        if c not in counts:
            counts[c] = 1
        else:
            counts[c] = counts[c] + 1

    sorted_items = sorted(counts.items(), key=lambda x: [-x[1], x[0]], reverse=True)
    sorted_items.reverse()
    print(sorted_items)
    real_checksum = ''
    for i in sorted_items[0:5]:
        real_checksum += (i[0])
    print(real_checksum)
    return real_checksum == checksum


for line in input:
    split = line.strip().split('[')
    checksum = split[-1][:-1]
    sector_split = split[0].split('-')
    sector_id = sector_split[-1]
    sector = sector_split[:-1]
    sector = ''.join(sector)

    print("sector: {} (with id {} - checksum {})".format(sector, sector_id, checksum))
    if (validate(sector, checksum)):
        total += int(sector_id)

print("total: {}".format(total))
