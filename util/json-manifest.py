#!/usr/bin/env python3

# pass list of datasubdirectories
# it builds a JSON manifest of data files

import sys
import json
import glob

n = 0
manifest = dict()
for sub in sys.argv[1:]:
    submanifest = dict()
    flist = list(glob.glob(sub+'/*.json'))
    for f in sorted(flist):
        with open(f) as infile:
            d = json.load(infile)
        if 'title' in d:
            submanifest[d['title']] = f
        else:
            n = n+1
            submanifest['Untitled {}'.format(n)] = f
    manifest[sub] = submanifest

print(json.dumps(manifest))
