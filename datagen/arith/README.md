# Arithmetic group elements

NOTE: The dataset format was changed from v0.3 to v0.4.  In v0.3, the `app.js` script contained a fixed manifest of datasets with metadata, and each data file contained a raw list of vectors.  In v0.4, the manifest is a separate JSON file which only contains categories and the mapping from titles to dataset URLs.  Each dataset JSON file contains the metadata (description, etc.).

These programs generate datasets for arithmetic groups in the older format, i.e. as a raw list of 4-vectors.  They can be converted to the new format using `../../util/data-updater/convert-old-datasets.py` if an old-style manifest is given as a JSON file.

These programs should be updated to simply produce the new format.

* [elementgen/](elementgen/) - C program to find elements of arithmetic groups starting from data about an associated quaternion algebra
* `gen-alglist.magma` - Find Hilbert symbols and maximal orders in quaternion algebras over Q
* `qalglist.csv` - Output from magma program above
* `enhance-qalglist.m` - Mathematica script to compute the reduced norm quadratic form in terms of maximal order coefficient vectors and add this to the quaternion algebra data.
* `qalglist-enhanced.csv` - Output from mathematica program above
* `qalg-elements.py` - Python program to take a desired discriminant, retrieve associated data from `qalglist-enhanced.csv`, and compose a suitable command line for `elementgen/genarith`



