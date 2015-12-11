import itertools as it

input = "1113222113"
# next input should be 3113322113

def conway_sequence(input):
    output = [] 
    for k, g in it.groupby(input):
        output.append(str(len(list(g))))
        output.append(str(k))
    return "".join(output)

def run_conway(input, i):
    if i == 0:
        return input
    else: 
        return run_conway(conway_sequence(input), i-1)

final = run_conway(input, 40)
print(len(final))
