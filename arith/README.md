# Arithmetic group elements

* [elementgen/](elementgen/) - C program to find elements of arithmetic groups starting from data about an associated quaternion algebra
* `gen-alglist.magma` - Find Hilbert symbols and maximal orders in quaternion algebras over Q
* `qalglist.csv` - Output from magma program above
* `enhance-qalglist.m` - Mathematica script to compute the reduced norm quadratic form in terms of maximal order coefficient vectors and add this to the quaternion algebra data.
* `qalglist-enhanced.csv` - Output from mathematica program above
* `qalg-elements.py` - Python program to take a desired discriminant, retrieve associated data from `qalglist-enhanced.csv`, and compose a suitable command line for `elementgen/genarith`



