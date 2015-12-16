import json
import collections as col
from pprint import pprint

with open('test.json') as f:
    data = json.load(f)

def flatten_list(data):
    for val in data:
        if isinstance(val, col.Iterable):
            for subval in flatten(val):
                yield subval
        else:
            yield val

def flatten_dict(data):
    for key, val in data.iteritems():
        if isinstance(val, col.Mapping):
            for subkey, subval in flatten(val):
                yield subkey, subval
        else:
            yield key, val

def flatten(data):
    if isinstance(data, dict):
        return flatten_dict(data)
    elif isinstance(data, list):
        return flatten_list(data)

print(data)
print()
print(list(flatten(data)))
