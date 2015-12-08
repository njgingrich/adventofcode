graph   = {}
results = {}

def eq(x):
    return x

def bitAnd(x, y):
    return x & y

def bitOr(x, y):
    return x | y

def bitNot(x):
    return ~x & 0xffff 

def lshift(x, y):
    return x << y

def rshift(x, y):
    return x >> y

operations = {
            '=': eq,
            'AND': bitAnd,
            'OR': bitOr,
            'NOT': bitNot,
            'LSHIFT': lshift,
            'RSHIFT': rshift
        }

def read_input(file):
    graph = {}
    with open(file, 'r') as f:
        for line in f.readlines():
            (operands, result) = line.split('->')
            graph[result.strip()] = operands.strip().split(' ')
    return graph

def read_wire(wire):
    try:
        return int(wire)
    except ValueError:
        pass

    if wire not in results:
        values = graph[wire]
        if len(values) == 1:
            result = read_wire(values[0])
        elif len(values) == 2:
            op = values[-2]
            result = operations[op](read_wire(values[1]))
        elif len(values) == 3:
            op = values[-2]
            result = operations[op](read_wire(values[0]), read_wire(values[2]))
        results[wire] = result
    return results[wire]

graph = read_input('input.txt')
print(read_wire('a'))




