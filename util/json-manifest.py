#!/usr/bin/env python3

import sys
import json

n = 0
manifest = dict()
for f in sys.argv[1:]:
    with open(f,'r') as infile:
        sys.stderr.write(f+'\n')
        d = json.load(infile)
        if 'title' in d:
            manifest[d['title']] = f
        else:
            n = n+1
            manifest['Untitled {}'.format(n)] = f
print(json.dumps(manifest))
