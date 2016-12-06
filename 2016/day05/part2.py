import hashlib

code = 'ugkcyxxp'

ix = 0
hex_s = hashlib.md5((code+str(ix)).encode('utf-8')).hexdigest()

digits = '01234567'
letters = 'abcdefghijklmnopqrstuvwxyz'
letters_digits = letters+digits+'89'
passwd = ['#','#','#','#','#','#','#','#']
i = 0

while i < 8:
    ix += 1
    hex_s = hashlib.md5((code+str(ix)).encode('utf-8')).hexdigest()
    if (hex_s[0:5] == '00000') and (hex_s[5] in digits) \
                               and (hex_s[6] in letters_digits) \
                               and (passwd[int(hex_s[5])] == '#'):
        print("{}: {}".format(ix, hex_s))
        index = int(hex_s[5])
        passwd[index] = hex_s[6]
        i += 1

print("pass: " + ''.join(passwd))
