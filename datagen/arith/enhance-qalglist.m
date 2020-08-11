(* Mathematica script to read CSV file of

"discriminant", "a", "b", "m11", "m12", "m13", "m14", "m21", "m22",
"m23", "m24", "m31", "m32", "m33", "m34", "m41", "m42", "m43", "m44"

 and add quadratic form coefficient data, output tuples

 "discriminant", "a", "b", "m11", "m12", "m13", "m14", "m21", "m22",
"m23", "m24", "m31", "m32", "m33", "m34", "m41", "m42", "m43", "m44",
"pp", "pq", "pr", "ps", "qq", "qr", "qs", "rr", "rs", "ss"

 *)

DATADIR=Module[{ev = Environment["QALGDIR"]},
	       If[ev===$Failed,"./",ev]
	       ]

If[StringTake[DATADIR,-1] != "/",DATADIR=DATADIR<>"/"];

rawdat = Import[DATADIR<>"qalglist.csv","CSV"]
repgens[{a_, b_}] := {{{Sqrt[a], 0}, {0, -Sqrt[a]}}, {{0, Sqrt[Abs[b]]}, {Sign[b] Sqrt[Abs[b]], 0}}}

ordgens[{d_, a_, b_, M_}] := Module[{A, B},{A, B} = repgens[{a, b}]; (# . {{{1, 0}, {0, 1}}, A, B, A.B}) & /@ M]

Datum[row_] := {#[[1]], #[[2]], #[[3]], 
    Partition[ToExpression /@ Drop[#, 3], 4]} &[row]

FormCoef[row_] := Module[{datum, og, qf, p, q, r, s},
  datum = Datum[row];
  og = ordgens[datum];
  qf = Expand[Simplify[Det[{p, q, r, s}.og]]];
  Coefficient[qf, #] & /@ {p^2, p q, p r, p s, q^2, q r, q s, r^2, 
    r s, s^2}
  ]

EnhancedRow[row_] := 
 Join[Join[{#[[1]], #[[2]], #[[3]]}, N[ToExpression /@ Drop[#, 3]]] &[
   row], FormCoef[row]]

newheaders = {"discriminant", "a", "b", "m11", "m12", "m13", 
  "m14", "m21", "m22", "m23", "m24", "m31", "m32", "m33", "m34", 
  "m41", "m42", "m43", "m44", "pp", "pq", "pr", "ps", "qq", "qr", 
  "qs", "rr", "rs", "ss"}

Export[DATADIR<>"qalglist-enhanced.csv",
    Join[{newheaders}, EnhancedRow /@ Drop[rawdat, 1]]]

