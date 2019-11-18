'''Make command line for genarith to make elements of a quaternion algebra of given discriminant'''

import csv
import os
import argparse
import sys

parser = argparse.ArgumentParser()
parser.add_argument('--maxcoef',type=int,default=200)
parser.add_argument('--maxnorm',type=float,default=200.0)
parser.add_argument('discriminant',type=int)
parser.add_argument('--qalgdata',help='Quaternion algebra database file (CSV); default is to look in $QALGDIR/qalglist-enhanced.csv')
parser.add_argument('--binary',help='Executable program for genarith',default='./elementgen/genarith')
parser.add_argument('--print',action='store_true',help='Do not run genarith; just print the command')
args = parser.parse_args()


if not args.qalgdata:
    if 'QALGDIR' in os.environ:
        datadir = os.environ['QALGDIR']
    else:
        datadir = '.'
    args.qalgdata = os.path.join(datadir,'qalglist-enhanced.csv')

qadata = None
with open(args.qalgdata) as qalgdatabase:
    reader = csv.reader(qalgdatabase)
    for row in reader:
        try:
            if int(row[0]) == args.discriminant:
                qadata = row[1:]
                a = qadata[0]
                b = qadata[1]
                if int(a) < 0:
                    qadata[0] = b
                    qadata[1] = a
        except ValueError:
            pass

if not qadata:
    sys.stderr.write('Did not find data about discriminant {} in {}.\n'.format(args.discriminant, args.qalgdata))
    sys.exit(1)

qadata.append(str(args.maxcoef))
qadata.append(str(args.maxnorm))

if args.print:
    print(args.binary + ' ' +  ' '.join(qadata))
else:
    from subprocess import call
    call([args.binary] + qadata)
