# Brute force element generators

We use an inefficient approach for finding elements of PSL(2,Z) and
other arithmetic lattices over Q:  We just enumerate integer vectors
(p,q,r,s) up to a certain norm, then see which ones give rise to
elements of the order of reduced norm 1.

There are more efficient methods, but this one carries the (small)
advantage of making it easy to ensure that all elements with
coefficient vectors up to a given norm have been found.  It also
avoids the need to remove duplicate elements from a list obtained from
a generating set.