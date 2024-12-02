import os.path
import copy

INPUT = os.path.join(os.path.dirname(__file__), 'input.txt')
with open(INPUT) as f:
    data = f.read()

def parse(data):
    bricks = []
    for line in data.splitlines():
        start, end = line.split("~")
        start = [int(x) for x in start.split(",")]
        end = [int(x) for x in end.split(",")]
        bricks.append({'start': start, 'end': end})

    occupied_tiles = set()
    for brick in bricks:
        x1, y1, z1 = brick['start']
        x2, y2, z2 = brick['end']
        assert x1 <= x2
        assert y1 <= y2
        assert z1 <= z2
        for x in range(x1, x2+1):
            for y in range(y1, y2+1):
                for z in range(z1, z2+1):
                    occupied_tiles.add((x,y,z))
    return bricks, occupied_tiles

def drop(start, end, occupied_tiles):
    x1, y1, z1 = start
    x2, y2, _ = end
    z = z1
    while True:
        z = z - 1
        if z == 0:
            z = 1
            break
        occupied = False
        for x in range(x1, x2+1):
            for y in range(y1, y2+1):
                tile = (x, y, z)
                if tile in occupied_tiles:
                    occupied = True
                    break
            if occupied:
                break
        if occupied:
            z += 1
            break
    return z

def tetris(bricks, occupied_tiles):
    changed_tiles = set()
    while True:
        changed = False
        for i, brick in enumerate(bricks):
            x1, y1, z1 = start = brick['start']
            x2, y2, z2 = end = brick['end']

            z = drop(start, end, occupied_tiles)
            if z != z1:
                shift = z1 - z  # positive
                for x in range(x1, x2+1):
                    for y in range(y1, y2+1):
                        for z in range(z1, z2+1):
                            occupied_tiles.remove((x,y,z))
                        for z in range(z1 - shift, z2+1 - shift):
                            occupied_tiles.add((x,y,z))
                bricks[i] = {
                    'start': (x1, y1, z1 - shift),
                    'end': (x2, y2, z2 - shift), 
                }
                changed_tiles.add(i)
                changed = True
        if not changed:
            break
    return changed_tiles

def remove_brick(brick, occupied_tiles):
    x1, y1, z1 = brick['start']
    x2, y2, z2 = brick['end']
    occupied_tiles = occupied_tiles.copy()
    for x in range(x1, x2+1):
        for y in range(y1, y2+1):
            for z in range(z1, z2+1):
                occupied_tiles.remove((x,y,z))
    return occupied_tiles

def part1(data):
    bricks, occupied_tiles = parse(data)

    # Tetris: make the bricks fall into initial position.
    tetris(bricks, occupied_tiles)
    
    s = 0
    # What tiles are supporting?
    for brick in bricks:
        occupied_tiles_copy = remove_brick(brick, occupied_tiles)

        any_falls = False
        for brick in bricks:
            # It doesn't matter if we test the brick we already removed.
            # It can't make itself fall by being disintegrated.
            _, _, z1 = start = brick['start']
            end = brick['end']
            z = drop(start, end, occupied_tiles_copy)
            if z != z1:
                any_falls = True
        if not any_falls:
            s += 1
    return s

test = """1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9"""
print(part1(test), 5)
print(part1(data), 437)

def part2(data):
    bricks, occupied_tiles = parse(data)

    # Tetris: make the bricks fall into initial position.
    tetris(bricks, occupied_tiles)

    s = 0
    # How many bricks would come down if a brick disintegrated?
    for i, brick in enumerate(bricks):
        occupied_tiles_copy = remove_brick(brick, occupied_tiles)

        bricks_copy = copy.copy(bricks)
        # TODO: commenting out this line doesn't change the result
        # But is it always a safe assumption?
        del bricks_copy[i]  
        
        fallen = tetris(bricks_copy, occupied_tiles_copy)
        s += len(fallen)
    return s

print(part2(test), 7)
print(part2(data), 42561)