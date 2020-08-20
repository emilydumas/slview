# Data format for SL(View)

This is the documentation for the data file format used by SL(View).

## Quick start

Minimal example showing how to represent a collection of 2x2 matrices starting with [[1,0],[0,1]] and [[1,2],[0,1]]:
```
{
    "format":"slview_v1",
    "mode":"sl2",
    "layout":["a","b","c","d"],
    "vectors":[
        [1,0,0,1],
        [1,2,0,1],
        [1,0,2,1]
        ]
}
```
This example could be used as a template by just altering the contents of the array `vectors`.

Minimal example showing how to represent a collection of points in the unit tangent bundle of the disk model of H^2.  Each is given as a point (x,y) in the disk and a point (cx,cy) on the unit circle.
```
{
    "format":"slview_v1",
    "mode":"t1h2_disk",
    "layout":["x","y","cx","cy"],
    "vectors":[
        [0.2,0.3,1.0,0.0],
        [0.0,0.0,-1.0,0.0],
        [0.0,-0.5,0.0,1.0],
        [-0.9,0.0,0.0,-1.0]
        ]
}
```

## Format reference

### Overview

A data file contains a list of points; these modes are supported:

* `sl2` : A list of 2x2 matrices of real numbers
* `t1h2_disk` : A list of points in the unit tangent bundle of the disk model of the hyperbolic plane

A data set is stored in a JSON file representing an object.  The following attributes are required:

* `format` : Must be the string `slview_v1`
* `mode` : Either `sl2` or `t1h2_disk`
* `layout` : A list of strings specifying the order of components in the vectors (see below)
* `vectors` : The actual data; a list of vectors specifying the points or matrices

The following attributes are optional but used by SL(View) if present:

* `title` : The name of the dataset
* `shortdesc` : A one-line description of the dataset to show on the status line when it is open in SL(View)
* `longdesc` : A description paragraph to display when the info button is pressed

The following attributes are optional and not currently used by SL(View), but their meanings are fixed for possible future use:

* `creator` : The source of the dataset (e.g. the program, notebook, etc., that wrote the data to this file)
* `timestamp` : ISO 8601 formatted datetime of dataset creation

### Layouts

Each entry in the list `vectors` is interpreted as a row of data.  The order of entries in a row (i.e. the column order) is not fixed and must be specified by the `layout` attribute.  In particular the order must be the same for each row.  Each mode has certain required columns and may also have optional columns.

#### In `sl2` mode

The recognized columns are `a`, `b`, `c`, and `d`, representing (respectively) the upper-left, upper-right, lower-left, and lower-right entries of the matrix.  All are required.  It is recommended to use the layout `["a","b","c","d"]`.

Note that sizes of points cannot be specified manually; instead they are computed based on the distance from the origin in the disk model to its image by the isometry.  Here, the disk model and the upper half plane model are identified by a map which takes the origin to the imaginary unit.

#### In `t1h2_disk` mode

The following columns are supported:
* `x`, `y` : Required. Coordinates of the point in the unit disk
* `cx`, `cy` : Required.  Coordinates of the point in the unit circle
* `size` : Optional.  A positive real parameter indicating the size of the point that should be shown at this location.  If not present, a size is computed based on the distance from the origin in the disk model.

It is recommended to use the layout `["x","y","cx","cy"]` or  `["x","y","cx","cy","size"]`.
