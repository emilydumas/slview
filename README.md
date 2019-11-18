# SL(View)

![screenshot](images/disc14screenshot.png?raw=true "Arith k=Q d=14")

Visualize subsets of PSL(2,R) in the exterior solid torus model using
three.js.

Includes sample data sets for PSL(2,Z) and some other Fuchsian groups,
as well as some simple C & Python programs to generate elements of
arithmetic Fuchsian groups.

## Structure

* [slview/](slview/) - Main HTML/javascript app
* [arith/](arith/) - programs to generate arithmetic Fuchsian groups

## Requirements

For the main app:

* HTTP server
* Browser supporting ES6 modules (javascript "import" statement), e.g.
  * Chrome >= 61
  * Edge >= 16
  * Firefox >= 60
  * Safari >= 10.1

For the arithmetic group element generator:

* Python >=3.4 (?)
* C99 (tested with GCC 9.2.1)

To regenerate quaternion algebra tables that are included in the repository:

* Magma >= 2.24 (?)
* Mathematica >=12 (?)

These tables list the tested versions; (?) means that older versions
are likely to work as there is no known use of recent language
changes.

## Acknowledgement

This material is based upon work supported by the US National Science Foundation under Grants DMS-1709877 and DMS-1439786.  Development began while the author was in residence at the Institute for Computational and Experimental Research in Mathematics in Providence, RI, during the Fall 2019 semester program "Illustrating Mathematics".

## Author

* David Dumas <david@dumas.io>

