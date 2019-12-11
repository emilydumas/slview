'''Read JSON list of lists of floats.  Write back with a limited number of decimal digits precision.'''

import os
import argparse
import sys
import json

parser = argparse.ArgumentParser()
parser.add_argument('-n','--digits',type=int,default=3)
parser.add_argument('-o','--output',help='Output filename')
parser.add_argument('input',nargs='?',help='Input filename (STDIN if omitted)')
args = parser.parse_args()

if args.input:
    with open(args.input,'r') as infile:
        data = json.load(infile)
else:
    data = json.load(sys.stdin)

if args.output:
    outfile = open(args.output,'wt')
else:
    outfile = sys.stdout

outfile.write('[')
first = True
for row in data:
    if first:
        prefix = ''
    else:
        prefix = ','
    first = False
    outfile.write(prefix + '[' + ','.join([ '%.3f' % x  for x in row]) + ']')
outfile.write(']')
