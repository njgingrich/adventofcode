import re

input = "hepxxyzz"

letters  = re.compile(".*[iol].*")
pairs    = re.compile("((.)\\2).*((.)\\4)")

def increment_str(string):
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    if string[-1] == 'z':
        return increment_str(string[:-1]) + 'a'
    else:
        return string[:-1] + alphabet[alphabet.index(string[-1])+1]

def next_char(char):
    return chr(ord(char)+1)

def straight(s):
    for i, c in enumerate(s):
        try:
            if (next_char(c) == s[i+1]) and (next_char(s[i+1]) == s[i+2]):
                return True
        except IndexError:
            pass

    return False

def valid_pass(string):
    if letters.search(string):
        return False
    elif pairs.search(string) and straight(string):
        return True

while True:
    input = increment_str(input)
    if valid_pass(input):
        print("new pass: " + input)
        break
