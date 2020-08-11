/*********************************************************************
 * Filename:      genpsl2z.c
 *
 * Description: Generate elements of PSL(2,Z) in the most brute-force
 * time-wasting manner possible.
 * 
 * Author:        David Dumas <david@dumas.io>
 *                
 * This program is free software distributed under the MIT license.
 * See the file LICENSE for details.
 ********************************************************************/

#define VERSION "0.1"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv)
{
  int eltmax = 50;
  if (argc > 1) {
    eltmax = atoi(argv[1]);
    fprintf(stderr,"Using eltmax=%d\n",eltmax);
  }
  
  int a,b,c,d, first=1;
  printf("[\n");
  for (a=0;a<=eltmax;a++) {
    for (b=(a==0?0:-eltmax); b<=eltmax; b++) {
      for (c=((a==0&&b==0)?0:-eltmax); c<=eltmax; c++) {
	for (d=((a==0&&b==0&&c==0)?0:-eltmax); d<=eltmax; d++) {
	  if ((a*d - b*c == 1) && (a*a+b*b+c*c+d*d <= (eltmax*eltmax))) {
	    if (first) {
	      first = 0;
	    } else {
	      printf(",\n");
	    }
	    printf("[ %d, %d, %d, %d ]",a,b,c,d);
	  }
	}
      }
    }
  }
  printf("\n]");
}
