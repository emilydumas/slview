# SL(View)

![screenshot](images/disc14screenshot.png?raw=true "Arith k=Q d=14")

[Open SL(View) at https://dumas.io/slview/](https://dumas.io/slview/)

SL(View) is a WebGL application for visualizing point clouds in the unit tangent bundle of the hyperbolic plane (which can be identified with the Lie group PSL(2,R)).  In particular this app can be used to visualize Fuchsian groups.

Sample data sets are provided, including PSL(2,Z) and other Fuchsian groups, as well as data sets related to cubic algebraic numbers and their Galois conjugates.

## Structure

* [slview/](slview/) - main HTML/javascript app
* [datagen/](datagen/) - programs to generate data files
* [doc/](doc/) - file format documentation
* [util/](util/) - utilites for manipulating data files and manifests

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
* Optionally, to regenerate quaternion algebra data included in the repo:
   * Magma >= 2.24 (?)
   * Mathematica >=12 (?)

These tables list the tested versions; (?) means that older versions
are likely to work as there is no known use of recent language
changes.

## Release history

* 2020-08-11 - v0.4 - New dataset format, support for unit tangent bundle
* 2019-12-12 - v0.3 - Asynchronous loading of datasets, status indicator modal
* 2019-11-17 - v0.2 - First public version

## Acknowledgement

This material is based upon work supported by the US National Science Foundation under Grants DMS-1709877 and DMS-1439786.  Initial development was conducted while the author was in residence at the Institute for Computational and Experimental Research in Mathematics in Providence, RI, during the Fall 2019 semester program "Illustrating Mathematics".

## Author

* David Dumas <david@dumas.io>

