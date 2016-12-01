import itertools as it
import math

weapons = {
    # "name": (cost, dmg, armor)
    "Dagger": (8, 4, 0),
    "Shortsword": (10, 5, 0),
    "Warhammer": (25, 6, 0),
    "Longsword": (40, 7, 0),
    "Greataxe": (74, 8, 0)
}
armors = {
    # "name": (cost, dmg, armor)
    "Dummy": (0, 0, 0),
    "Leather": (13, 0, 1),
    "Chainmail": (31, 0, 2),
    "Splintmail": (53, 0, 3),
    "Bandedmail": (75, 0, 4),
    "Platemail": (102, 0, 5)
}
rings = {
    # "name": (cost, dmg, armor)
    "Dummy 1": (0, 0, 0),
    "Dummy 2": (0, 0, 0),
    "Dmg +1": (25, 1, 0),
    "Dmg +2": (50, 2, 0),
    "Dmg +3": (100, 3, 0),
    "Def +1": (20, 0, 1),
    "Def +2": (40, 0, 2),
    "Def +3": (80, 0, 3)
}

#      (hp, armor, dmg)
char = (100, 0, 0)
boss = (104, 1, 8)

def fight(char, boss):
    (c_hp, c_amr, c_dmg) = char
    (b_hp, b_amr, b_dmg) = boss
    boss_hits = math.ceil(float(b_hp)/max((c_dmg - b_amr), 1))
    char_hits = math.ceil(float(c_hp)/max((b_dmg - c_amr), 1))
    return (boss_hits > char_hits)

costs = []
for (w, a, r1, r2) in it.product(weapons, armors, rings, rings):
    weapon = weapons[w]
    armor  = armors[a]
    ring1  = rings[r1]
    ring2  = rings[r2]
    c_damage = char[1] + weapon[1] + armor[1] + ring1[1] + ring2[1]
    c_armor  = char[2] + weapon[2] + armor[2] + ring1[2] + ring2[2]
    cost = weapon[0] + ring1[0] + ring2[0] + armor[0]
    newchar = (char[0], c_armor, c_damage)
    if fight(newchar, boss):
        costs.append(cost)
    
print(max(costs))
