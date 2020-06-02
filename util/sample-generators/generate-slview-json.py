#!/usr/bin/env python
'''Write a JSON file compatible with SL(View)'''

import json
import os
import sys
import math
import datetime

outfn = 'torus-example.json'

if len(sys.argv) >= 2:
    if sys.argv[1] in ['-h','--help'] or len(sys.argv) > 2:
        sys.stderr.write('Usage: {} [OUTPUT_FILENAME]\n'.format(sys.argv[0]))
        sys.exit(0)
    outfn = sys.argv[1]

if os.path.exists(outfn):
    sys.stderr.write('File "{}" exist.  Not overwriting.\n'.format(outfn))
    sys.exit(1)

d = dict()
# Required elements
d['format'] = 'slview_v1'
d['mode'] = 't1h2_disk'
d['layout'] = ['x','y','cx','cy','size']

# Optional but recommended
d['title'] = 'Torus example'
d['shortdesc'] = 'Unit tangent bundle over a circle in H^2'
d['creator'] = sys.argv[0]
d['timestamp'] = datetime.datetime.utcnow().isoformat()+'Z'

# Generate the vectors
vecs = []
for i in range(30):
    for j in range(30):
        vecs.append([
            0.9*math.cos(2.0*math.pi*i/30),
            0.9*math.sin(2.0*math.pi*i/30),
            math.cos(2.0*math.pi*j/30),
            math.sin(2.0*math.pi*j/30),
            0.5 + 0.5*((i+j) % 2)
            ])
d['vectors'] = vecs

# Write output
with open(outfn,'w') as outfile:
    json.dump(d,outfile)
print('Wrote "{}".'.format(outfn))

