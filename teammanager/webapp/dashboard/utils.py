from collections import OrderedDict

def table_cmp(i,j):
    if i['wins'] > j['wins']:
        return -1
    if i['losses'] > j['losses']:
        return 1
    if i['ps'] > j['ps']:
        return -1
    if i['pl'] > j['pl']:
        return 1
    return 0

def generate_group_table(group):
    table = OrderedDict()
    for squad in group.squads.all():
        table[squad.id] = {'name': squad.team.name,
                           'games': 0,
                           'wins': 0,
                           'losses': 0,
                           'ps': 0,
                           'pl': 0,
                           'pd': 0}
    
    games = group.games.all()
    for game in games:
        if game.state.name != 'ended':
            continue
        table[game.squad1.id]['games'] += 1
        table[game.squad2.id]['games'] += 1
        if game.points1 > game.points2:
            table[game.squad1.id]['wins'] += 1
            table[game.squad2.id]['losses'] += 1
        else: 
            table[game.squad2.id]['wins'] += 1
            table[game.squad1.id]['losses'] += 1
        table[game.squad1.id]['ps'] += game.points1
        table[game.squad1.id]['ps'] += game.points2
        table[game.squad2.id]['pl'] += game.points2
        table[game.squad2.id]['pl'] += game.points1
   

    table2 = []
    for i in table:
        t = table[i]
        t['pd'] = t['ps']-t['pl']
        table2.append(t)
    table2.sort(cmp=table_cmp)
    n = 1
    for i in table2:
        i['num'] = n
        n+=1
    return table2
