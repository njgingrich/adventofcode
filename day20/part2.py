elf = 0
input = 36000000
presents = 0

def factor(n):
    result = set()
    for i in range(1, int(n ** 0.5) + 1):
        div, mod = divmod(n, i)
        if mod == 0:
            result |= {i, div}
    return result

def num_presents(factor):
    if elf > factor * 50:
        return 0
    else:
        return 11*factor

while presents < input:
    factors = sorted(factor(elf))
    presents = sum(map(num_presents, factors))
    elf += 1

print elf-1
