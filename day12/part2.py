import json

def sum_json(data):
    if type(data) == type(dict()):
        if "red" in data.values():
            return 0
        return sum(map(sum_json, data.values()))
    if type(data) == type(list()):
        return sum(map(sum_json, data))
    if type(data) == type(0):
        return data

    return 0

data = json.loads(open('input.json', 'r').read())
print(sum_json(data))
