#!/usr/bin/python3
import json
import argparse
import datetime
import os

parser = argparse.ArgumentParser(description='Convert old datasets to new format')
parser.add_argument('old_manifest_file')
parser.add_argument('indir')
parser.add_argument('outdir')
args = parser.parse_args()

with open(args.old_manifest_file) as f:
    m = json.load(f)

for k in m:
    infn = os.path.join(args.indir,m[k]['url'])
    outfn = os.path.join(args.outdir,os.path.basename(infn))
    with open(infn) as f:
        vecs = json.load(f)
    d = dict()
    d['format'] = 'slview_v1'
    d['mode'] = 'sl2'
    d['layout'] = ['a','b','c','d']
    d['title'] = k
    d['shortdesc'] = k
    d['longdesc'] = m[k]['longdesc']
    d['creator'] = 'convert-old-datasets.py'
    d['timestamp'] = datetime.datetime.utcnow().isoformat()+'Z'
    d['vectors'] = vecs
    with open(outfn,'w') as f:
        f.write(json.dumps(d, separators=(',', ':')))
    print(outfn)