Plant Texture Generator
=======================

Input: plant object with growth, and other traits
Output: an image asset as a canvas or base64 string or a promise that resolves
to one of the above.

Plant Data
----------

- plant types (ex. grass, etc.)
- growth levels (ex. number of stems, roots, leaves, etc.)
- other traits: wood, bulb, bolls, tuber (some can be assumed from plant types)
- colors (specific to stems, roots, leaves, etc. or accentuate in certain areas)

Later:
- health levels

Size:
  - grass, herb, shrub, grain, stalk: 16 x 32
  - tree: 32 x 32

Rendering roots:
  - no appearance unless bulb or tuber or tree

Rendering leaves:
  - must appear on a stem
  - increases number and length for monocots
  - increases number for dicots
  - pointing upward for stalks

Rendering flowers:
  - must appear on a stem near a leaf

Rendering seeds:
  - show bolls if the plant has the bolls trait

Rendering stems: (1)
  - no appearance for monocots
  - mainly increase length and width for stalks
  - mostly length for trees until a certain height, keep a spread
  - mostly spread for shrubs
  - equal spread and height otherwise
  - for wood trait the count also increases width
  - trait vs growth: use trait to determine how the stem grows and growth to determine
  how far along it is
  - trait stem > 3: grow upwards mainly
  - trait stem = 0: make mostly branching