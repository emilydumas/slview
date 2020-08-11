# Data format for SL(View)

This is the documentation for the data file format used by SL(View).

## Quick start

Minimal example showing how to represent a collection of 2x2 matrices:
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

* `creator` : The source of the dataset
* `timestamp` : ISO 8601 formatted datetime of dataset creation

### Layouts

Each entry in the list `vectors` is interpreted as a row of data.  Each mode has certain required elements (columns) that must appear in each row, and may also have optional columns.  The columns can appear in any order, and the attribute `layout` specifies the order.

In `sl2` mode, the recognized columns are `a`, `b`, `c`, and `d`, representing (respectively) the upper-left, upper-right, lower-left, and lower-right entries of the matrix.  All are required.  It is recommended to use the layout `["a","b","c","d"]`.

In `t1h2_disk` mode, the following columns are recognized:

* `x`, `y` : Required. Coordinates of the point in the unit disk
* `cx`, `cy` : Required.  Coordinates of the point in the unit circle
* `size` : Optional.  A positive real parameter indicating the size of the point that should be shown at this location.

It is recommended to use the layout `["x","y","cx","cy"]` or  `["x","y","cx","cy","size"]`.
