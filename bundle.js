(function () {
  'use strict';

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

  function interopDefault(ex) {
  	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var twiddle = createCommonjsModule(function (module, exports) {
  /**
   * Bit twiddling hacks for JavaScript.
   *
   * Author: Mikola Lysenko
   *
   * Ported from Stanford bit twiddling hack library:
   *    http://graphics.stanford.edu/~seander/bithacks.html
   */

  "use strict"; "use restrict";

  //Number of bits in an integer
  var INT_BITS = 32;

  //Constants
  exports.INT_BITS  = INT_BITS;
  exports.INT_MAX   =  0x7fffffff;
  exports.INT_MIN   = -1<<(INT_BITS-1);

  //Returns -1, 0, +1 depending on sign of x
  exports.sign = function(v) {
    return (v > 0) - (v < 0);
  }

  //Computes absolute value of integer
  exports.abs = function(v) {
    var mask = v >> (INT_BITS-1);
    return (v ^ mask) - mask;
  }

  //Computes minimum of integers x and y
  exports.min = function(x, y) {
    return y ^ ((x ^ y) & -(x < y));
  }

  //Computes maximum of integers x and y
  exports.max = function(x, y) {
    return x ^ ((x ^ y) & -(x < y));
  }

  //Checks if a number is a power of two
  exports.isPow2 = function(v) {
    return !(v & (v-1)) && (!!v);
  }

  //Computes log base 2 of v
  exports.log2 = function(v) {
    var r, shift;
    r =     (v > 0xFFFF) << 4; v >>>= r;
    shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
    shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
    shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
    return r | (v >> 1);
  }

  //Computes log base 10 of v
  exports.log10 = function(v) {
    return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
            (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
            (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
  }

  //Counts number of bits
  exports.popCount = function(v) {
    v = v - ((v >>> 1) & 0x55555555);
    v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
    return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
  }

  //Counts number of trailing zeros
  function countTrailingZeros(v) {
    var c = 32;
    v &= -v;
    if (v) c--;
    if (v & 0x0000FFFF) c -= 16;
    if (v & 0x00FF00FF) c -= 8;
    if (v & 0x0F0F0F0F) c -= 4;
    if (v & 0x33333333) c -= 2;
    if (v & 0x55555555) c -= 1;
    return c;
  }
  exports.countTrailingZeros = countTrailingZeros;

  //Rounds to next power of 2
  exports.nextPow2 = function(v) {
    v += v === 0;
    --v;
    v |= v >>> 1;
    v |= v >>> 2;
    v |= v >>> 4;
    v |= v >>> 8;
    v |= v >>> 16;
    return v + 1;
  }

  //Rounds down to previous power of 2
  exports.prevPow2 = function(v) {
    v |= v >>> 1;
    v |= v >>> 2;
    v |= v >>> 4;
    v |= v >>> 8;
    v |= v >>> 16;
    return v - (v>>>1);
  }

  //Computes parity of word
  exports.parity = function(v) {
    v ^= v >>> 16;
    v ^= v >>> 8;
    v ^= v >>> 4;
    v &= 0xf;
    return (0x6996 >>> v) & 1;
  }

  var REVERSE_TABLE = new Array(256);

  (function(tab) {
    for(var i=0; i<256; ++i) {
      var v = i, r = i, s = 7;
      for (v >>>= 1; v; v >>>= 1) {
        r <<= 1;
        r |= v & 1;
        --s;
      }
      tab[i] = (r << s) & 0xff;
    }
  })(REVERSE_TABLE);

  //Reverse bits in a 32 bit word
  exports.reverse = function(v) {
    return  (REVERSE_TABLE[ v         & 0xff] << 24) |
            (REVERSE_TABLE[(v >>> 8)  & 0xff] << 16) |
            (REVERSE_TABLE[(v >>> 16) & 0xff] << 8)  |
             REVERSE_TABLE[(v >>> 24) & 0xff];
  }

  //Interleave bits of 2 coordinates with 16 bits.  Useful for fast quadtree codes
  exports.interleave2 = function(x, y) {
    x &= 0xFFFF;
    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y &= 0xFFFF;
    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
  }

  //Extracts the nth interleaved component
  exports.deinterleave2 = function(v, n) {
    v = (v >>> n) & 0x55555555;
    v = (v | (v >>> 1))  & 0x33333333;
    v = (v | (v >>> 2))  & 0x0F0F0F0F;
    v = (v | (v >>> 4))  & 0x00FF00FF;
    v = (v | (v >>> 16)) & 0x000FFFF;
    return (v << 16) >> 16;
  }


  //Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
  exports.interleave3 = function(x, y, z) {
    x &= 0x3FF;
    x  = (x | (x<<16)) & 4278190335;
    x  = (x | (x<<8))  & 251719695;
    x  = (x | (x<<4))  & 3272356035;
    x  = (x | (x<<2))  & 1227133513;

    y &= 0x3FF;
    y  = (y | (y<<16)) & 4278190335;
    y  = (y | (y<<8))  & 251719695;
    y  = (y | (y<<4))  & 3272356035;
    y  = (y | (y<<2))  & 1227133513;
    x |= (y << 1);
    
    z &= 0x3FF;
    z  = (z | (z<<16)) & 4278190335;
    z  = (z | (z<<8))  & 251719695;
    z  = (z | (z<<4))  & 3272356035;
    z  = (z | (z<<2))  & 1227133513;
    
    return x | (z << 2);
  }

  //Extracts nth interleaved component of a 3-tuple
  exports.deinterleave3 = function(v, n) {
    v = (v >>> n)       & 1227133513;
    v = (v | (v>>>2))   & 3272356035;
    v = (v | (v>>>4))   & 251719695;
    v = (v | (v>>>8))   & 4278190335;
    v = (v | (v>>>16))  & 0x3FF;
    return (v<<22)>>22;
  }

  //Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
  exports.nextCombination = function(v) {
    var t = v | (v - 1);
    return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
  }
  });

  var twiddle$1 = interopDefault(twiddle);
  var nextCombination = twiddle.nextCombination;
  var deinterleave3 = twiddle.deinterleave3;
  var interleave3 = twiddle.interleave3;
  var deinterleave2 = twiddle.deinterleave2;
  var interleave2 = twiddle.interleave2;
  var reverse = twiddle.reverse;
  var parity = twiddle.parity;
  var prevPow2 = twiddle.prevPow2;
  var nextPow2 = twiddle.nextPow2;
  var countTrailingZeros = twiddle.countTrailingZeros;
  var popCount = twiddle.popCount;
  var log10 = twiddle.log10;
  var log2 = twiddle.log2;
  var isPow2 = twiddle.isPow2;
  var max = twiddle.max;
  var min = twiddle.min;
  var abs = twiddle.abs;
  var sign = twiddle.sign;
  var INT_MIN = twiddle.INT_MIN;
  var INT_MAX = twiddle.INT_MAX;
  var INT_BITS = twiddle.INT_BITS;

var require$$1$1 = Object.freeze({
    default: twiddle$1,
    nextCombination: nextCombination,
    deinterleave3: deinterleave3,
    interleave3: interleave3,
    deinterleave2: deinterleave2,
    interleave2: interleave2,
    reverse: reverse,
    parity: parity,
    prevPow2: prevPow2,
    nextPow2: nextPow2,
    countTrailingZeros: countTrailingZeros,
    popCount: popCount,
    log10: log10,
    log2: log2,
    isPow2: isPow2,
    max: max,
    min: min,
    abs: abs,
    sign: sign,
    INT_MIN: INT_MIN,
    INT_MAX: INT_MAX,
    INT_BITS: INT_BITS
  });

  var dup = createCommonjsModule(function (module) {
  "use strict"

  function dupe_array(count, value, i) {
    var c = count[i]|0
    if(c <= 0) {
      return []
    }
    var result = new Array(c), j
    if(i === count.length-1) {
      for(j=0; j<c; ++j) {
        result[j] = value
      }
    } else {
      for(j=0; j<c; ++j) {
        result[j] = dupe_array(count, value, i+1)
      }
    }
    return result
  }

  function dupe_number(count, value) {
    var result, i
    result = new Array(count)
    for(i=0; i<count; ++i) {
      result[i] = value
    }
    return result
  }

  function dupe(count, value) {
    if(typeof value === "undefined") {
      value = 0
    }
    switch(typeof count) {
      case "number":
        if(count > 0) {
          return dupe_number(count|0, value)
        }
      break
      case "object":
        if(typeof (count.length) === "number") {
          return dupe_array(count, value, 0)
        }
      break
    }
    return []
  }

  module.exports = dupe
  });

  var dup$1 = interopDefault(dup);


  var require$$0 = Object.freeze({
    default: dup$1
  });

  var pool = createCommonjsModule(function (module, exports) {
  'use strict'

  var bits = interopDefault(require$$1$1)
  var dup = interopDefault(require$$0)

  //Legacy pool support
  if(!commonjsGlobal.__TYPEDARRAY_POOL) {
    commonjsGlobal.__TYPEDARRAY_POOL = {
        UINT8   : dup([32, 0])
      , UINT16  : dup([32, 0])
      , UINT32  : dup([32, 0])
      , INT8    : dup([32, 0])
      , INT16   : dup([32, 0])
      , INT32   : dup([32, 0])
      , FLOAT   : dup([32, 0])
      , DOUBLE  : dup([32, 0])
      , DATA    : dup([32, 0])
      , UINT8C  : dup([32, 0])
      , BUFFER  : dup([32, 0])
    }
  }

  var hasUint8C = (typeof Uint8ClampedArray) !== 'undefined'
  var POOL = commonjsGlobal.__TYPEDARRAY_POOL

  //Upgrade pool
  if(!POOL.UINT8C) {
    POOL.UINT8C = dup([32, 0])
  }
  if(!POOL.BUFFER) {
    POOL.BUFFER = dup([32, 0])
  }

  //New technique: Only allocate from ArrayBufferView and Buffer
  var DATA    = POOL.DATA
    , BUFFER  = POOL.BUFFER

  exports.free = function free(array) {
    if(Buffer.isBuffer(array)) {
      BUFFER[bits.log2(array.length)].push(array)
    } else {
      if(Object.prototype.toString.call(array) !== '[object ArrayBuffer]') {
        array = array.buffer
      }
      if(!array) {
        return
      }
      var n = array.length || array.byteLength
      var log_n = bits.log2(n)|0
      DATA[log_n].push(array)
    }
  }

  function freeArrayBuffer(buffer) {
    if(!buffer) {
      return
    }
    var n = buffer.length || buffer.byteLength
    var log_n = bits.log2(n)
    DATA[log_n].push(buffer)
  }

  function freeTypedArray(array) {
    freeArrayBuffer(array.buffer)
  }

  exports.freeUint8 =
  exports.freeUint16 =
  exports.freeUint32 =
  exports.freeInt8 =
  exports.freeInt16 =
  exports.freeInt32 =
  exports.freeFloat32 = 
  exports.freeFloat =
  exports.freeFloat64 = 
  exports.freeDouble = 
  exports.freeUint8Clamped = 
  exports.freeDataView = freeTypedArray

  exports.freeArrayBuffer = freeArrayBuffer

  exports.freeBuffer = function freeBuffer(array) {
    BUFFER[bits.log2(array.length)].push(array)
  }

  exports.malloc = function malloc(n, dtype) {
    if(dtype === undefined || dtype === 'arraybuffer') {
      return mallocArrayBuffer(n)
    } else {
      switch(dtype) {
        case 'uint8':
          return mallocUint8(n)
        case 'uint16':
          return mallocUint16(n)
        case 'uint32':
          return mallocUint32(n)
        case 'int8':
          return mallocInt8(n)
        case 'int16':
          return mallocInt16(n)
        case 'int32':
          return mallocInt32(n)
        case 'float':
        case 'float32':
          return mallocFloat(n)
        case 'double':
        case 'float64':
          return mallocDouble(n)
        case 'uint8_clamped':
          return mallocUint8Clamped(n)
        case 'buffer':
          return mallocBuffer(n)
        case 'data':
        case 'dataview':
          return mallocDataView(n)

        default:
          return null
      }
    }
    return null
  }

  function mallocArrayBuffer(n) {
    var n = bits.nextPow2(n)
    var log_n = bits.log2(n)
    var d = DATA[log_n]
    if(d.length > 0) {
      return d.pop()
    }
    return new ArrayBuffer(n)
  }
  exports.mallocArrayBuffer = mallocArrayBuffer

  function mallocUint8(n) {
    return new Uint8Array(mallocArrayBuffer(n), 0, n)
  }
  exports.mallocUint8 = mallocUint8

  function mallocUint16(n) {
    return new Uint16Array(mallocArrayBuffer(2*n), 0, n)
  }
  exports.mallocUint16 = mallocUint16

  function mallocUint32(n) {
    return new Uint32Array(mallocArrayBuffer(4*n), 0, n)
  }
  exports.mallocUint32 = mallocUint32

  function mallocInt8(n) {
    return new Int8Array(mallocArrayBuffer(n), 0, n)
  }
  exports.mallocInt8 = mallocInt8

  function mallocInt16(n) {
    return new Int16Array(mallocArrayBuffer(2*n), 0, n)
  }
  exports.mallocInt16 = mallocInt16

  function mallocInt32(n) {
    return new Int32Array(mallocArrayBuffer(4*n), 0, n)
  }
  exports.mallocInt32 = mallocInt32

  function mallocFloat(n) {
    return new Float32Array(mallocArrayBuffer(4*n), 0, n)
  }
  exports.mallocFloat32 = exports.mallocFloat = mallocFloat

  function mallocDouble(n) {
    return new Float64Array(mallocArrayBuffer(8*n), 0, n)
  }
  exports.mallocFloat64 = exports.mallocDouble = mallocDouble

  function mallocUint8Clamped(n) {
    if(hasUint8C) {
      return new Uint8ClampedArray(mallocArrayBuffer(n), 0, n)
    } else {
      return mallocUint8(n)
    }
  }
  exports.mallocUint8Clamped = mallocUint8Clamped

  function mallocDataView(n) {
    return new DataView(mallocArrayBuffer(n), 0, n)
  }
  exports.mallocDataView = mallocDataView

  function mallocBuffer(n) {
    n = bits.nextPow2(n)
    var log_n = bits.log2(n)
    var cache = BUFFER[log_n]
    if(cache.length > 0) {
      return cache.pop()
    }
    return new Buffer(n)
  }
  exports.mallocBuffer = mallocBuffer

  exports.clearCache = function clearCache() {
    for(var i=0; i<32; ++i) {
      POOL.UINT8[i].length = 0
      POOL.UINT16[i].length = 0
      POOL.UINT32[i].length = 0
      POOL.INT8[i].length = 0
      POOL.INT16[i].length = 0
      POOL.INT32[i].length = 0
      POOL.FLOAT[i].length = 0
      POOL.DOUBLE[i].length = 0
      POOL.UINT8C[i].length = 0
      DATA[i].length = 0
      BUFFER[i].length = 0
    }
  }
  });

  var pool$1 = interopDefault(pool);
  var clearCache = pool.clearCache;
  var mallocBuffer = pool.mallocBuffer;
  var mallocDataView = pool.mallocDataView;
  var mallocUint8Clamped = pool.mallocUint8Clamped;
  var mallocFloat64 = pool.mallocFloat64;
  var mallocDouble = pool.mallocDouble;
  var mallocFloat32 = pool.mallocFloat32;
  var mallocFloat = pool.mallocFloat;
  var mallocInt32 = pool.mallocInt32;
  var mallocInt16 = pool.mallocInt16;
  var mallocInt8 = pool.mallocInt8;
  var mallocUint32 = pool.mallocUint32;
  var mallocUint16 = pool.mallocUint16;
  var mallocUint8 = pool.mallocUint8;
  var mallocArrayBuffer = pool.mallocArrayBuffer;
  var malloc = pool.malloc;
  var freeBuffer = pool.freeBuffer;
  var freeArrayBuffer = pool.freeArrayBuffer;
  var freeUint8 = pool.freeUint8;
  var freeUint16 = pool.freeUint16;
  var freeUint32 = pool.freeUint32;
  var freeInt8 = pool.freeInt8;
  var freeInt16 = pool.freeInt16;
  var freeInt32 = pool.freeInt32;
  var freeFloat32 = pool.freeFloat32;
  var freeFloat = pool.freeFloat;
  var freeFloat64 = pool.freeFloat64;
  var freeDouble = pool.freeDouble;
  var freeUint8Clamped = pool.freeUint8Clamped;
  var freeDataView = pool.freeDataView;
  var free = pool.free;

var require$$2 = Object.freeze({
    default: pool$1,
    clearCache: clearCache,
    mallocBuffer: mallocBuffer,
    mallocDataView: mallocDataView,
    mallocUint8Clamped: mallocUint8Clamped,
    mallocFloat64: mallocFloat64,
    mallocDouble: mallocDouble,
    mallocFloat32: mallocFloat32,
    mallocFloat: mallocFloat,
    mallocInt32: mallocInt32,
    mallocInt16: mallocInt16,
    mallocInt8: mallocInt8,
    mallocUint32: mallocUint32,
    mallocUint16: mallocUint16,
    mallocUint8: mallocUint8,
    mallocArrayBuffer: mallocArrayBuffer,
    malloc: malloc,
    freeBuffer: freeBuffer,
    freeArrayBuffer: freeArrayBuffer,
    freeUint8: freeUint8,
    freeUint16: freeUint16,
    freeUint32: freeUint32,
    freeInt8: freeInt8,
    freeInt16: freeInt16,
    freeInt32: freeInt32,
    freeFloat32: freeFloat32,
    freeFloat: freeFloat,
    freeFloat64: freeFloat64,
    freeDouble: freeDouble,
    freeUint8Clamped: freeUint8Clamped,
    freeDataView: freeDataView,
    free: free
  });

  var uniq = createCommonjsModule(function (module) {
  "use strict"

  function unique_pred(list, compare) {
    var ptr = 1
      , len = list.length
      , a=list[0], b=list[0]
    for(var i=1; i<len; ++i) {
      b = a
      a = list[i]
      if(compare(a, b)) {
        if(i === ptr) {
          ptr++
          continue
        }
        list[ptr++] = a
      }
    }
    list.length = ptr
    return list
  }

  function unique_eq(list) {
    var ptr = 1
      , len = list.length
      , a=list[0], b = list[0]
    for(var i=1; i<len; ++i, b=a) {
      b = a
      a = list[i]
      if(a !== b) {
        if(i === ptr) {
          ptr++
          continue
        }
        list[ptr++] = a
      }
    }
    list.length = ptr
    return list
  }

  function unique(list, compare, sorted) {
    if(list.length === 0) {
      return list
    }
    if(compare) {
      if(!sorted) {
        list.sort(compare)
      }
      return unique_pred(list, compare)
    }
    if(!sorted) {
      list.sort()
    }
    return unique_eq(list)
  }

  module.exports = unique
  });

  var uniq$1 = interopDefault(uniq);


  var require$$0$4 = Object.freeze({
    default: uniq$1
  });

  var compile = createCommonjsModule(function (module) {
  "use strict"

  var uniq = interopDefault(require$$0$4)

  // This function generates very simple loops analogous to how you typically traverse arrays (the outermost loop corresponds to the slowest changing index, the innermost loop to the fastest changing index)
  // TODO: If two arrays have the same strides (and offsets) there is potential for decreasing the number of "pointers" and related variables. The drawback is that the type signature would become more specific and that there would thus be less potential for caching, but it might still be worth it, especially when dealing with large numbers of arguments.
  function innerFill(order, proc, body) {
    var dimension = order.length
      , nargs = proc.arrayArgs.length
      , has_index = proc.indexArgs.length>0
      , code = []
      , vars = []
      , idx=0, pidx=0, i, j
    for(i=0; i<dimension; ++i) { // Iteration variables
      vars.push(["i",i,"=0"].join(""))
    }
    //Compute scan deltas
    for(j=0; j<nargs; ++j) {
      for(i=0; i<dimension; ++i) {
        pidx = idx
        idx = order[i]
        if(i === 0) { // The innermost/fastest dimension's delta is simply its stride
          vars.push(["d",j,"s",i,"=t",j,"p",idx].join(""))
        } else { // For other dimensions the delta is basically the stride minus something which essentially "rewinds" the previous (more inner) dimension
          vars.push(["d",j,"s",i,"=(t",j,"p",idx,"-s",pidx,"*t",j,"p",pidx,")"].join(""))
        }
      }
    }
    code.push("var " + vars.join(","))
    //Scan loop
    for(i=dimension-1; i>=0; --i) { // Start at largest stride and work your way inwards
      idx = order[i]
      code.push(["for(i",i,"=0;i",i,"<s",idx,";++i",i,"){"].join(""))
    }
    //Push body of inner loop
    code.push(body)
    //Advance scan pointers
    for(i=0; i<dimension; ++i) {
      pidx = idx
      idx = order[i]
      for(j=0; j<nargs; ++j) {
        code.push(["p",j,"+=d",j,"s",i].join(""))
      }
      if(has_index) {
        if(i > 0) {
          code.push(["index[",pidx,"]-=s",pidx].join(""))
        }
        code.push(["++index[",idx,"]"].join(""))
      }
      code.push("}")
    }
    return code.join("\n")
  }

  // Generate "outer" loops that loop over blocks of data, applying "inner" loops to the blocks by manipulating the local variables in such a way that the inner loop only "sees" the current block.
  // TODO: If this is used, then the previous declaration (done by generateCwiseOp) of s* is essentially unnecessary.
  //       I believe the s* are not used elsewhere (in particular, I don't think they're used in the pre/post parts and "shape" is defined independently), so it would be possible to make defining the s* dependent on what loop method is being used.
  function outerFill(matched, order, proc, body) {
    var dimension = order.length
      , nargs = proc.arrayArgs.length
      , blockSize = proc.blockSize
      , has_index = proc.indexArgs.length > 0
      , code = []
    for(var i=0; i<nargs; ++i) {
      code.push(["var offset",i,"=p",i].join(""))
    }
    //Generate loops for unmatched dimensions
    // The order in which these dimensions are traversed is fairly arbitrary (from small stride to large stride, for the first argument)
    // TODO: It would be nice if the order in which these loops are placed would also be somehow "optimal" (at the very least we should check that it really doesn't hurt us if they're not).
    for(var i=matched; i<dimension; ++i) {
      code.push(["for(var j"+i+"=SS[", order[i], "]|0;j", i, ">0;){"].join("")) // Iterate back to front
      code.push(["if(j",i,"<",blockSize,"){"].join("")) // Either decrease j by blockSize (s = blockSize), or set it to zero (after setting s = j).
      code.push(["s",order[i],"=j",i].join(""))
      code.push(["j",i,"=0"].join(""))
      code.push(["}else{s",order[i],"=",blockSize].join(""))
      code.push(["j",i,"-=",blockSize,"}"].join(""))
      if(has_index) {
        code.push(["index[",order[i],"]=j",i].join(""))
      }
    }
    for(var i=0; i<nargs; ++i) {
      var indexStr = ["offset"+i]
      for(var j=matched; j<dimension; ++j) {
        indexStr.push(["j",j,"*t",i,"p",order[j]].join(""))
      }
      code.push(["p",i,"=(",indexStr.join("+"),")"].join(""))
    }
    code.push(innerFill(order, proc, body))
    for(var i=matched; i<dimension; ++i) {
      code.push("}")
    }
    return code.join("\n")
  }

  //Count the number of compatible inner orders
  // This is the length of the longest common prefix of the arrays in orders.
  // Each array in orders lists the dimensions of the correspond ndarray in order of increasing stride.
  // This is thus the maximum number of dimensions that can be efficiently traversed by simple nested loops for all arrays.
  function countMatches(orders) {
    var matched = 0, dimension = orders[0].length
    while(matched < dimension) {
      for(var j=1; j<orders.length; ++j) {
        if(orders[j][matched] !== orders[0][matched]) {
          return matched
        }
      }
      ++matched
    }
    return matched
  }

  //Processes a block according to the given data types
  // Replaces variable names by different ones, either "local" ones (that are then ferried in and out of the given array) or ones matching the arguments that the function performing the ultimate loop will accept.
  function processBlock(block, proc, dtypes) {
    var code = block.body
    var pre = []
    var post = []
    for(var i=0; i<block.args.length; ++i) {
      var carg = block.args[i]
      if(carg.count <= 0) {
        continue
      }
      var re = new RegExp(carg.name, "g")
      var ptrStr = ""
      var arrNum = proc.arrayArgs.indexOf(i)
      switch(proc.argTypes[i]) {
        case "offset":
          var offArgIndex = proc.offsetArgIndex.indexOf(i)
          var offArg = proc.offsetArgs[offArgIndex]
          arrNum = offArg.array
          ptrStr = "+q" + offArgIndex // Adds offset to the "pointer" in the array
        case "array":
          ptrStr = "p" + arrNum + ptrStr
          var localStr = "l" + i
          var arrStr = "a" + arrNum
          if (proc.arrayBlockIndices[arrNum] === 0) { // Argument to body is just a single value from this array
            if(carg.count === 1) { // Argument/array used only once(?)
              if(dtypes[arrNum] === "generic") {
                if(carg.lvalue) {
                  pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join("")) // Is this necessary if the argument is ONLY used as an lvalue? (keep in mind that we can have a += something, so we would actually need to check carg.rvalue)
                  code = code.replace(re, localStr)
                  post.push([arrStr, ".set(", ptrStr, ",", localStr,")"].join(""))
                } else {
                  code = code.replace(re, [arrStr, ".get(", ptrStr, ")"].join(""))
                }
              } else {
                code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""))
              }
            } else if(dtypes[arrNum] === "generic") {
              pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join("")) // TODO: Could we optimize by checking for carg.rvalue?
              code = code.replace(re, localStr)
              if(carg.lvalue) {
                post.push([arrStr, ".set(", ptrStr, ",", localStr,")"].join(""))
              }
            } else {
              pre.push(["var ", localStr, "=", arrStr, "[", ptrStr, "]"].join("")) // TODO: Could we optimize by checking for carg.rvalue?
              code = code.replace(re, localStr)
              if(carg.lvalue) {
                post.push([arrStr, "[", ptrStr, "]=", localStr].join(""))
              }
            }
          } else { // Argument to body is a "block"
            var reStrArr = [carg.name], ptrStrArr = [ptrStr]
            for(var j=0; j<Math.abs(proc.arrayBlockIndices[arrNum]); j++) {
              reStrArr.push("\\s*\\[([^\\]]+)\\]")
              ptrStrArr.push("$" + (j+1) + "*t" + arrNum + "b" + j) // Matched index times stride
            }
            re = new RegExp(reStrArr.join(""), "g")
            ptrStr = ptrStrArr.join("+")
            if(dtypes[arrNum] === "generic") {
              /*if(carg.lvalue) {
                pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join("")) // Is this necessary if the argument is ONLY used as an lvalue? (keep in mind that we can have a += something, so we would actually need to check carg.rvalue)
                code = code.replace(re, localStr)
                post.push([arrStr, ".set(", ptrStr, ",", localStr,")"].join(""))
              } else {
                code = code.replace(re, [arrStr, ".get(", ptrStr, ")"].join(""))
              }*/
              throw new Error("cwise: Generic arrays not supported in combination with blocks!")
            } else {
              // This does not produce any local variables, even if variables are used multiple times. It would be possible to do so, but it would complicate things quite a bit.
              code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""))
            }
          }
        break
        case "scalar":
          code = code.replace(re, "Y" + proc.scalarArgs.indexOf(i))
        break
        case "index":
          code = code.replace(re, "index")
        break
        case "shape":
          code = code.replace(re, "shape")
        break
      }
    }
    return [pre.join("\n"), code, post.join("\n")].join("\n").trim()
  }

  function typeSummary(dtypes) {
    var summary = new Array(dtypes.length)
    var allEqual = true
    for(var i=0; i<dtypes.length; ++i) {
      var t = dtypes[i]
      var digits = t.match(/\d+/)
      if(!digits) {
        digits = ""
      } else {
        digits = digits[0]
      }
      if(t.charAt(0) === 0) {
        summary[i] = "u" + t.charAt(1) + digits
      } else {
        summary[i] = t.charAt(0) + digits
      }
      if(i > 0) {
        allEqual = allEqual && summary[i] === summary[i-1]
      }
    }
    if(allEqual) {
      return summary[0]
    }
    return summary.join("")
  }

  //Generates a cwise operator
  function generateCWiseOp(proc, typesig) {

    //Compute dimension
    // Arrays get put first in typesig, and there are two entries per array (dtype and order), so this gets the number of dimensions in the first array arg.
    var dimension = (typesig[1].length - Math.abs(proc.arrayBlockIndices[0]))|0
    var orders = new Array(proc.arrayArgs.length)
    var dtypes = new Array(proc.arrayArgs.length)
    for(var i=0; i<proc.arrayArgs.length; ++i) {
      dtypes[i] = typesig[2*i]
      orders[i] = typesig[2*i+1]
    }
    
    //Determine where block and loop indices start and end
    var blockBegin = [], blockEnd = [] // These indices are exposed as blocks
    var loopBegin = [], loopEnd = [] // These indices are iterated over
    var loopOrders = [] // orders restricted to the loop indices
    for(var i=0; i<proc.arrayArgs.length; ++i) {
      if (proc.arrayBlockIndices[i]<0) {
        loopBegin.push(0)
        loopEnd.push(dimension)
        blockBegin.push(dimension)
        blockEnd.push(dimension+proc.arrayBlockIndices[i])
      } else {
        loopBegin.push(proc.arrayBlockIndices[i]) // Non-negative
        loopEnd.push(proc.arrayBlockIndices[i]+dimension)
        blockBegin.push(0)
        blockEnd.push(proc.arrayBlockIndices[i])
      }
      var newOrder = []
      for(var j=0; j<orders[i].length; j++) {
        if (loopBegin[i]<=orders[i][j] && orders[i][j]<loopEnd[i]) {
          newOrder.push(orders[i][j]-loopBegin[i]) // If this is a loop index, put it in newOrder, subtracting loopBegin, to make sure that all loopOrders are using a common set of indices.
        }
      }
      loopOrders.push(newOrder)
    }

    //First create arguments for procedure
    var arglist = ["SS"] // SS is the overall shape over which we iterate
    var code = ["'use strict'"]
    var vars = []
    
    for(var j=0; j<dimension; ++j) {
      vars.push(["s", j, "=SS[", j, "]"].join("")) // The limits for each dimension.
    }
    for(var i=0; i<proc.arrayArgs.length; ++i) {
      arglist.push("a"+i) // Actual data array
      arglist.push("t"+i) // Strides
      arglist.push("p"+i) // Offset in the array at which the data starts (also used for iterating over the data)
      
      for(var j=0; j<dimension; ++j) { // Unpack the strides into vars for looping
        vars.push(["t",i,"p",j,"=t",i,"[",loopBegin[i]+j,"]"].join(""))
      }
      
      for(var j=0; j<Math.abs(proc.arrayBlockIndices[i]); ++j) { // Unpack the strides into vars for block iteration
        vars.push(["t",i,"b",j,"=t",i,"[",blockBegin[i]+j,"]"].join(""))
      }
    }
    for(var i=0; i<proc.scalarArgs.length; ++i) {
      arglist.push("Y" + i)
    }
    if(proc.shapeArgs.length > 0) {
      vars.push("shape=SS.slice(0)") // Makes the shape over which we iterate available to the user defined functions (so you can use width/height for example)
    }
    if(proc.indexArgs.length > 0) {
      // Prepare an array to keep track of the (logical) indices, initialized to dimension zeroes.
      var zeros = new Array(dimension)
      for(var i=0; i<dimension; ++i) {
        zeros[i] = "0"
      }
      vars.push(["index=[", zeros.join(","), "]"].join(""))
    }
    for(var i=0; i<proc.offsetArgs.length; ++i) { // Offset arguments used for stencil operations
      var off_arg = proc.offsetArgs[i]
      var init_string = []
      for(var j=0; j<off_arg.offset.length; ++j) {
        if(off_arg.offset[j] === 0) {
          continue
        } else if(off_arg.offset[j] === 1) {
          init_string.push(["t", off_arg.array, "p", j].join(""))      
        } else {
          init_string.push([off_arg.offset[j], "*t", off_arg.array, "p", j].join(""))
        }
      }
      if(init_string.length === 0) {
        vars.push("q" + i + "=0")
      } else {
        vars.push(["q", i, "=", init_string.join("+")].join(""))
      }
    }

    //Prepare this variables
    var thisVars = uniq([].concat(proc.pre.thisVars)
                        .concat(proc.body.thisVars)
                        .concat(proc.post.thisVars))
    vars = vars.concat(thisVars)
    code.push("var " + vars.join(","))
    for(var i=0; i<proc.arrayArgs.length; ++i) {
      code.push("p"+i+"|=0")
    }
    
    //Inline prelude
    if(proc.pre.body.length > 3) {
      code.push(processBlock(proc.pre, proc, dtypes))
    }

    //Process body
    var body = processBlock(proc.body, proc, dtypes)
    var matched = countMatches(loopOrders)
    if(matched < dimension) {
      code.push(outerFill(matched, loopOrders[0], proc, body)) // TODO: Rather than passing loopOrders[0], it might be interesting to look at passing an order that represents the majority of the arguments for example.
    } else {
      code.push(innerFill(loopOrders[0], proc, body))
    }

    //Inline epilog
    if(proc.post.body.length > 3) {
      code.push(processBlock(proc.post, proc, dtypes))
    }
    
    if(proc.debug) {
      console.log("-----Generated cwise routine for ", typesig, ":\n" + code.join("\n") + "\n----------")
    }
    
    var loopName = [(proc.funcName||"unnamed"), "_cwise_loop_", orders[0].join("s"),"m",matched,typeSummary(dtypes)].join("")
    var f = new Function(["function ",loopName,"(", arglist.join(","),"){", code.join("\n"),"} return ", loopName].join(""))
    return f()
  }
  module.exports = generateCWiseOp
  });

  var compile$1 = interopDefault(compile);


  var require$$0$3 = Object.freeze({
    default: compile$1
  });

  var thunk = createCommonjsModule(function (module) {
  "use strict"

  // The function below is called when constructing a cwise function object, and does the following:
  // A function object is constructed which accepts as argument a compilation function and returns another function.
  // It is this other function that is eventually returned by createThunk, and this function is the one that actually
  // checks whether a certain pattern of arguments has already been used before and compiles new loops as needed.
  // The compilation passed to the first function object is used for compiling new functions.
  // Once this function object is created, it is called with compile as argument, where the first argument of compile
  // is bound to "proc" (essentially containing a preprocessed version of the user arguments to cwise).
  // So createThunk roughly works like this:
  // function createThunk(proc) {
  //   var thunk = function(compileBound) {
  //     var CACHED = {}
  //     return function(arrays and scalars) {
  //       if (dtype and order of arrays in CACHED) {
  //         var func = CACHED[dtype and order of arrays]
  //       } else {
  //         var func = CACHED[dtype and order of arrays] = compileBound(dtype and order of arrays)
  //       }
  //       return func(arrays and scalars)
  //     }
  //   }
  //   return thunk(compile.bind1(proc))
  // }

  var compile = interopDefault(require$$0$3)

  function createThunk(proc) {
    var code = ["'use strict'", "var CACHED={}"]
    var vars = []
    var thunkName = proc.funcName + "_cwise_thunk"
    
    //Build thunk
    code.push(["return function ", thunkName, "(", proc.shimArgs.join(","), "){"].join(""))
    var typesig = []
    var string_typesig = []
    var proc_args = [["array",proc.arrayArgs[0],".shape.slice(", // Slice shape so that we only retain the shape over which we iterate (which gets passed to the cwise operator as SS).
                      Math.max(0,proc.arrayBlockIndices[0]),proc.arrayBlockIndices[0]<0?(","+proc.arrayBlockIndices[0]+")"):")"].join("")]
    var shapeLengthConditions = [], shapeConditions = []
    // Process array arguments
    for(var i=0; i<proc.arrayArgs.length; ++i) {
      var j = proc.arrayArgs[i]
      vars.push(["t", j, "=array", j, ".dtype,",
                 "r", j, "=array", j, ".order"].join(""))
      typesig.push("t" + j)
      typesig.push("r" + j)
      string_typesig.push("t"+j)
      string_typesig.push("r"+j+".join()")
      proc_args.push("array" + j + ".data")
      proc_args.push("array" + j + ".stride")
      proc_args.push("array" + j + ".offset|0")
      if (i>0) { // Gather conditions to check for shape equality (ignoring block indices)
        shapeLengthConditions.push("array" + proc.arrayArgs[0] + ".shape.length===array" + j + ".shape.length+" + (Math.abs(proc.arrayBlockIndices[0])-Math.abs(proc.arrayBlockIndices[i])))
        shapeConditions.push("array" + proc.arrayArgs[0] + ".shape[shapeIndex+" + Math.max(0,proc.arrayBlockIndices[0]) + "]===array" + j + ".shape[shapeIndex+" + Math.max(0,proc.arrayBlockIndices[i]) + "]")
      }
    }
    // Check for shape equality
    if (proc.arrayArgs.length > 1) {
      code.push("if (!(" + shapeLengthConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same dimensionality!')")
      code.push("for(var shapeIndex=array" + proc.arrayArgs[0] + ".shape.length-" + Math.abs(proc.arrayBlockIndices[0]) + "; shapeIndex-->0;) {")
      code.push("if (!(" + shapeConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same shape!')")
      code.push("}")
    }
    // Process scalar arguments
    for(var i=0; i<proc.scalarArgs.length; ++i) {
      proc_args.push("scalar" + proc.scalarArgs[i])
    }
    // Check for cached function (and if not present, generate it)
    vars.push(["type=[", string_typesig.join(","), "].join()"].join(""))
    vars.push("proc=CACHED[type]")
    code.push("var " + vars.join(","))
    
    code.push(["if(!proc){",
               "CACHED[type]=proc=compile([", typesig.join(","), "])}",
               "return proc(", proc_args.join(","), ")}"].join(""))

    if(proc.debug) {
      console.log("-----Generated thunk:\n" + code.join("\n") + "\n----------")
    }
    
    //Compile thunk
    var thunk = new Function("compile", code.join("\n"))
    return thunk(compile.bind(undefined, proc))
  }

  module.exports = createThunk
  });

  var thunk$1 = interopDefault(thunk);


  var require$$0$2 = Object.freeze({
    default: thunk$1
  });

  var compiler = createCommonjsModule(function (module) {
  "use strict"

  var createThunk = interopDefault(require$$0$2)

  function Procedure() {
    this.argTypes = []
    this.shimArgs = []
    this.arrayArgs = []
    this.arrayBlockIndices = []
    this.scalarArgs = []
    this.offsetArgs = []
    this.offsetArgIndex = []
    this.indexArgs = []
    this.shapeArgs = []
    this.funcName = ""
    this.pre = null
    this.body = null
    this.post = null
    this.debug = false
  }

  function compileCwise(user_args) {
    //Create procedure
    var proc = new Procedure()
    
    //Parse blocks
    proc.pre    = user_args.pre
    proc.body   = user_args.body
    proc.post   = user_args.post

    //Parse arguments
    var proc_args = user_args.args.slice(0)
    proc.argTypes = proc_args
    for(var i=0; i<proc_args.length; ++i) {
      var arg_type = proc_args[i]
      if(arg_type === "array" || (typeof arg_type === "object" && arg_type.blockIndices)) {
        proc.argTypes[i] = "array"
        proc.arrayArgs.push(i)
        proc.arrayBlockIndices.push(arg_type.blockIndices ? arg_type.blockIndices : 0)
        proc.shimArgs.push("array" + i)
        if(i < proc.pre.args.length && proc.pre.args[i].count>0) {
          throw new Error("cwise: pre() block may not reference array args")
        }
        if(i < proc.post.args.length && proc.post.args[i].count>0) {
          throw new Error("cwise: post() block may not reference array args")
        }
      } else if(arg_type === "scalar") {
        proc.scalarArgs.push(i)
        proc.shimArgs.push("scalar" + i)
      } else if(arg_type === "index") {
        proc.indexArgs.push(i)
        if(i < proc.pre.args.length && proc.pre.args[i].count > 0) {
          throw new Error("cwise: pre() block may not reference array index")
        }
        if(i < proc.body.args.length && proc.body.args[i].lvalue) {
          throw new Error("cwise: body() block may not write to array index")
        }
        if(i < proc.post.args.length && proc.post.args[i].count > 0) {
          throw new Error("cwise: post() block may not reference array index")
        }
      } else if(arg_type === "shape") {
        proc.shapeArgs.push(i)
        if(i < proc.pre.args.length && proc.pre.args[i].lvalue) {
          throw new Error("cwise: pre() block may not write to array shape")
        }
        if(i < proc.body.args.length && proc.body.args[i].lvalue) {
          throw new Error("cwise: body() block may not write to array shape")
        }
        if(i < proc.post.args.length && proc.post.args[i].lvalue) {
          throw new Error("cwise: post() block may not write to array shape")
        }
      } else if(typeof arg_type === "object" && arg_type.offset) {
        proc.argTypes[i] = "offset"
        proc.offsetArgs.push({ array: arg_type.array, offset:arg_type.offset })
        proc.offsetArgIndex.push(i)
      } else {
        throw new Error("cwise: Unknown argument type " + proc_args[i])
      }
    }
    
    //Make sure at least one array argument was specified
    if(proc.arrayArgs.length <= 0) {
      throw new Error("cwise: No array arguments specified")
    }
    
    //Make sure arguments are correct
    if(proc.pre.args.length > proc_args.length) {
      throw new Error("cwise: Too many arguments in pre() block")
    }
    if(proc.body.args.length > proc_args.length) {
      throw new Error("cwise: Too many arguments in body() block")
    }
    if(proc.post.args.length > proc_args.length) {
      throw new Error("cwise: Too many arguments in post() block")
    }

    //Check debug flag
    proc.debug = !!user_args.printCode || !!user_args.debug
    
    //Retrieve name
    proc.funcName = user_args.funcName || "cwise"
    
    //Read in block size
    proc.blockSize = user_args.blockSize || 64

    return createThunk(proc)
  }

  module.exports = compileCwise
  });

  var compiler$1 = interopDefault(compiler);


  var require$$0$1 = Object.freeze({
    default: compiler$1
  });

  var ndarrayOps = createCommonjsModule(function (module, exports) {
  "use strict"

  var compile = interopDefault(require$$0$1)

  var EmptyProc = {
    body: "",
    args: [],
    thisVars: [],
    localVars: []
  }

  function fixup(x) {
    if(!x) {
      return EmptyProc
    }
    for(var i=0; i<x.args.length; ++i) {
      var a = x.args[i]
      if(i === 0) {
        x.args[i] = {name: a, lvalue:true, rvalue: !!x.rvalue, count:x.count||1 }
      } else {
        x.args[i] = {name: a, lvalue:false, rvalue:true, count: 1}
      }
    }
    if(!x.thisVars) {
      x.thisVars = []
    }
    if(!x.localVars) {
      x.localVars = []
    }
    return x
  }

  function pcompile(user_args) {
    return compile({
      args:     user_args.args,
      pre:      fixup(user_args.pre),
      body:     fixup(user_args.body),
      post:     fixup(user_args.proc),
      funcName: user_args.funcName
    })
  }

  function makeOp(user_args) {
    var args = []
    for(var i=0; i<user_args.args.length; ++i) {
      args.push("a"+i)
    }
    var wrapper = new Function("P", [
      "return function ", user_args.funcName, "_ndarrayops(", args.join(","), ") {P(", args.join(","), ");return a0}"
    ].join(""))
    return wrapper(pcompile(user_args))
  }

  var assign_ops = {
    add:  "+",
    sub:  "-",
    mul:  "*",
    div:  "/",
    mod:  "%",
    band: "&",
    bor:  "|",
    bxor: "^",
    lshift: "<<",
    rshift: ">>",
    rrshift: ">>>"
  }
  ;(function(){
    for(var id in assign_ops) {
      var op = assign_ops[id]
      exports[id] = makeOp({
        args: ["array","array","array"],
        body: {args:["a","b","c"],
               body: "a=b"+op+"c"},
        funcName: id
      })
      exports[id+"eq"] = makeOp({
        args: ["array","array"],
        body: {args:["a","b"],
               body:"a"+op+"=b"},
        rvalue: true,
        funcName: id+"eq"
      })
      exports[id+"s"] = makeOp({
        args: ["array", "array", "scalar"],
        body: {args:["a","b","s"],
               body:"a=b"+op+"s"},
        funcName: id+"s"
      })
      exports[id+"seq"] = makeOp({
        args: ["array","scalar"],
        body: {args:["a","s"],
               body:"a"+op+"=s"},
        rvalue: true,
        funcName: id+"seq"
      })
    }
  })();

  var unary_ops = {
    not: "!",
    bnot: "~",
    neg: "-",
    recip: "1.0/"
  }
  ;(function(){
    for(var id in unary_ops) {
      var op = unary_ops[id]
      exports[id] = makeOp({
        args: ["array", "array"],
        body: {args:["a","b"],
               body:"a="+op+"b"},
        funcName: id
      })
      exports[id+"eq"] = makeOp({
        args: ["array"],
        body: {args:["a"],
               body:"a="+op+"a"},
        rvalue: true,
        count: 2,
        funcName: id+"eq"
      })
    }
  })();

  var binary_ops = {
    and: "&&",
    or: "||",
    eq: "===",
    neq: "!==",
    lt: "<",
    gt: ">",
    leq: "<=",
    geq: ">="
  }
  ;(function() {
    for(var id in binary_ops) {
      var op = binary_ops[id]
      exports[id] = makeOp({
        args: ["array","array","array"],
        body: {args:["a", "b", "c"],
               body:"a=b"+op+"c"},
        funcName: id
      })
      exports[id+"s"] = makeOp({
        args: ["array","array","scalar"],
        body: {args:["a", "b", "s"],
               body:"a=b"+op+"s"},
        funcName: id+"s"
      })
      exports[id+"eq"] = makeOp({
        args: ["array", "array"],
        body: {args:["a", "b"],
               body:"a=a"+op+"b"},
        rvalue:true,
        count:2,
        funcName: id+"eq"
      })
      exports[id+"seq"] = makeOp({
        args: ["array", "scalar"],
        body: {args:["a","s"],
               body:"a=a"+op+"s"},
        rvalue:true,
        count:2,
        funcName: id+"seq"
      })
    }
  })();

  var math_unary = [
    "abs",
    "acos",
    "asin",
    "atan",
    "ceil",
    "cos",
    "exp",
    "floor",
    "log",
    "round",
    "sin",
    "sqrt",
    "tan"
  ]
  ;(function() {
    for(var i=0; i<math_unary.length; ++i) {
      var f = math_unary[i]
      exports[f] = makeOp({
                      args: ["array", "array"],
                      pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                      body: {args:["a","b"], body:"a=this_f(b)", thisVars:["this_f"]},
                      funcName: f
                    })
      exports[f+"eq"] = makeOp({
                        args: ["array"],
                        pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                        body: {args: ["a"], body:"a=this_f(a)", thisVars:["this_f"]},
                        rvalue: true,
                        count: 2,
                        funcName: f+"eq"
                      })
    }
  })();

  var math_comm = [
    "max",
    "min",
    "atan2",
    "pow"
  ]
  ;(function(){
    for(var i=0; i<math_comm.length; ++i) {
      var f= math_comm[i]
      exports[f] = makeOp({
                    args:["array", "array", "array"],
                    pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                    body: {args:["a","b","c"], body:"a=this_f(b,c)", thisVars:["this_f"]},
                    funcName: f
                  })
      exports[f+"s"] = makeOp({
                    args:["array", "array", "scalar"],
                    pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                    body: {args:["a","b","c"], body:"a=this_f(b,c)", thisVars:["this_f"]},
                    funcName: f+"s"
                    })
      exports[f+"eq"] = makeOp({ args:["array", "array"],
                    pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                    body: {args:["a","b"], body:"a=this_f(a,b)", thisVars:["this_f"]},
                    rvalue: true,
                    count: 2,
                    funcName: f+"eq"
                    })
      exports[f+"seq"] = makeOp({ args:["array", "scalar"],
                    pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                    body: {args:["a","b"], body:"a=this_f(a,b)", thisVars:["this_f"]},
                    rvalue:true,
                    count:2,
                    funcName: f+"seq"
                    })
    }
  })();

  var math_noncomm = [
    "atan2",
    "pow"
  ]
  ;(function(){
    for(var i=0; i<math_noncomm.length; ++i) {
      var f= math_noncomm[i]
      exports[f+"op"] = makeOp({
                    args:["array", "array", "array"],
                    pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                    body: {args:["a","b","c"], body:"a=this_f(c,b)", thisVars:["this_f"]},
                    funcName: f+"op"
                  })
      exports[f+"ops"] = makeOp({
                    args:["array", "array", "scalar"],
                    pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                    body: {args:["a","b","c"], body:"a=this_f(c,b)", thisVars:["this_f"]},
                    funcName: f+"ops"
                    })
      exports[f+"opeq"] = makeOp({ args:["array", "array"],
                    pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                    body: {args:["a","b"], body:"a=this_f(b,a)", thisVars:["this_f"]},
                    rvalue: true,
                    count: 2,
                    funcName: f+"opeq"
                    })
      exports[f+"opseq"] = makeOp({ args:["array", "scalar"],
                    pre: {args:[], body:"this_f=Math."+f, thisVars:["this_f"]},
                    body: {args:["a","b"], body:"a=this_f(b,a)", thisVars:["this_f"]},
                    rvalue:true,
                    count:2,
                    funcName: f+"opseq"
                    })
    }
  })();

  exports.any = compile({
    args:["array"],
    pre: EmptyProc,
    body: {args:[{name:"a", lvalue:false, rvalue:true, count:1}], body: "if(a){return true}", localVars: [], thisVars: []},
    post: {args:[], localVars:[], thisVars:[], body:"return false"},
    funcName: "any"
  })

  exports.all = compile({
    args:["array"],
    pre: EmptyProc,
    body: {args:[{name:"x", lvalue:false, rvalue:true, count:1}], body: "if(!x){return false}", localVars: [], thisVars: []},
    post: {args:[], localVars:[], thisVars:[], body:"return true"},
    funcName: "all"
  })

  exports.sum = compile({
    args:["array"],
    pre: {args:[], localVars:[], thisVars:["this_s"], body:"this_s=0"},
    body: {args:[{name:"a", lvalue:false, rvalue:true, count:1}], body: "this_s+=a", localVars: [], thisVars: ["this_s"]},
    post: {args:[], localVars:[], thisVars:["this_s"], body:"return this_s"},
    funcName: "sum"
  })

  exports.prod = compile({
    args:["array"],
    pre: {args:[], localVars:[], thisVars:["this_s"], body:"this_s=1"},
    body: {args:[{name:"a", lvalue:false, rvalue:true, count:1}], body: "this_s*=a", localVars: [], thisVars: ["this_s"]},
    post: {args:[], localVars:[], thisVars:["this_s"], body:"return this_s"},
    funcName: "prod"
  })

  exports.norm2squared = compile({
    args:["array"],
    pre: {args:[], localVars:[], thisVars:["this_s"], body:"this_s=0"},
    body: {args:[{name:"a", lvalue:false, rvalue:true, count:2}], body: "this_s+=a*a", localVars: [], thisVars: ["this_s"]},
    post: {args:[], localVars:[], thisVars:["this_s"], body:"return this_s"},
    funcName: "norm2squared"
  })
    
  exports.norm2 = compile({
    args:["array"],
    pre: {args:[], localVars:[], thisVars:["this_s"], body:"this_s=0"},
    body: {args:[{name:"a", lvalue:false, rvalue:true, count:2}], body: "this_s+=a*a", localVars: [], thisVars: ["this_s"]},
    post: {args:[], localVars:[], thisVars:["this_s"], body:"return Math.sqrt(this_s)"},
    funcName: "norm2"
  })
    

  exports.norminf = compile({
    args:["array"],
    pre: {args:[], localVars:[], thisVars:["this_s"], body:"this_s=0"},
    body: {args:[{name:"a", lvalue:false, rvalue:true, count:4}], body:"if(-a>this_s){this_s=-a}else if(a>this_s){this_s=a}", localVars: [], thisVars: ["this_s"]},
    post: {args:[], localVars:[], thisVars:["this_s"], body:"return this_s"},
    funcName: "norminf"
  })

  exports.norm1 = compile({
    args:["array"],
    pre: {args:[], localVars:[], thisVars:["this_s"], body:"this_s=0"},
    body: {args:[{name:"a", lvalue:false, rvalue:true, count:3}], body: "this_s+=a<0?-a:a", localVars: [], thisVars: ["this_s"]},
    post: {args:[], localVars:[], thisVars:["this_s"], body:"return this_s"},
    funcName: "norm1"
  })

  exports.sup = compile({
    args: [ "array" ],
    pre:
     { body: "this_h=-Infinity",
       args: [],
       thisVars: [ "this_h" ],
       localVars: [] },
    body:
     { body: "if(_inline_1_arg0_>this_h)this_h=_inline_1_arg0_",
       args: [{"name":"_inline_1_arg0_","lvalue":false,"rvalue":true,"count":2} ],
       thisVars: [ "this_h" ],
       localVars: [] },
    post:
     { body: "return this_h",
       args: [],
       thisVars: [ "this_h" ],
       localVars: [] }
   })

  exports.inf = compile({
    args: [ "array" ],
    pre:
     { body: "this_h=Infinity",
       args: [],
       thisVars: [ "this_h" ],
       localVars: [] },
    body:
     { body: "if(_inline_1_arg0_<this_h)this_h=_inline_1_arg0_",
       args: [{"name":"_inline_1_arg0_","lvalue":false,"rvalue":true,"count":2} ],
       thisVars: [ "this_h" ],
       localVars: [] },
    post:
     { body: "return this_h",
       args: [],
       thisVars: [ "this_h" ],
       localVars: [] }
   })

  exports.argmin = compile({
    args:["index","array","shape"],
    pre:{
      body:"{this_v=Infinity;this_i=_inline_0_arg2_.slice(0)}",
      args:[
        {name:"_inline_0_arg0_",lvalue:false,rvalue:false,count:0},
        {name:"_inline_0_arg1_",lvalue:false,rvalue:false,count:0},
        {name:"_inline_0_arg2_",lvalue:false,rvalue:true,count:1}
        ],
      thisVars:["this_i","this_v"],
      localVars:[]},
    body:{
      body:"{if(_inline_1_arg1_<this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
      args:[
        {name:"_inline_1_arg0_",lvalue:false,rvalue:true,count:2},
        {name:"_inline_1_arg1_",lvalue:false,rvalue:true,count:2}],
      thisVars:["this_i","this_v"],
      localVars:["_inline_1_k"]},
    post:{
      body:"{return this_i}",
      args:[],
      thisVars:["this_i"],
      localVars:[]}
  })

  exports.argmax = compile({
    args:["index","array","shape"],
    pre:{
      body:"{this_v=-Infinity;this_i=_inline_0_arg2_.slice(0)}",
      args:[
        {name:"_inline_0_arg0_",lvalue:false,rvalue:false,count:0},
        {name:"_inline_0_arg1_",lvalue:false,rvalue:false,count:0},
        {name:"_inline_0_arg2_",lvalue:false,rvalue:true,count:1}
        ],
      thisVars:["this_i","this_v"],
      localVars:[]},
    body:{
      body:"{if(_inline_1_arg1_>this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
      args:[
        {name:"_inline_1_arg0_",lvalue:false,rvalue:true,count:2},
        {name:"_inline_1_arg1_",lvalue:false,rvalue:true,count:2}],
      thisVars:["this_i","this_v"],
      localVars:["_inline_1_k"]},
    post:{
      body:"{return this_i}",
      args:[],
      thisVars:["this_i"],
      localVars:[]}
  })  

  exports.random = makeOp({
    args: ["array"],
    pre: {args:[], body:"this_f=Math.random", thisVars:["this_f"]},
    body: {args: ["a"], body:"a=this_f()", thisVars:["this_f"]},
    funcName: "random"
  })

  exports.assign = makeOp({
    args:["array", "array"],
    body: {args:["a", "b"], body:"a=b"},
    funcName: "assign" })

  exports.assigns = makeOp({
    args:["array", "scalar"],
    body: {args:["a", "b"], body:"a=b"},
    funcName: "assigns" })


  exports.equals = compile({
    args:["array", "array"],
    pre: EmptyProc,
    body: {args:[{name:"x", lvalue:false, rvalue:true, count:1},
                 {name:"y", lvalue:false, rvalue:true, count:1}], 
          body: "if(x!==y){return false}", 
          localVars: [], 
          thisVars: []},
    post: {args:[], localVars:[], thisVars:[], body:"return true"},
    funcName: "equals"
  })
  });

  var ndarrayOps$1 = interopDefault(ndarrayOps);
  var equals = ndarrayOps.equals;
  var assigns = ndarrayOps.assigns;
  var assign = ndarrayOps.assign;
  var random = ndarrayOps.random;
  var argmax = ndarrayOps.argmax;
  var argmin = ndarrayOps.argmin;
  var inf = ndarrayOps.inf;
  var sup = ndarrayOps.sup;
  var norm1 = ndarrayOps.norm1;
  var norminf = ndarrayOps.norminf;
  var norm2 = ndarrayOps.norm2;
  var norm2squared = ndarrayOps.norm2squared;
  var prod = ndarrayOps.prod;
  var sum = ndarrayOps.sum;
  var all = ndarrayOps.all;
  var any = ndarrayOps.any;

var require$$1$2 = Object.freeze({
    default: ndarrayOps$1,
    equals: equals,
    assigns: assigns,
    assign: assign,
    random: random,
    argmax: argmax,
    argmin: argmin,
    inf: inf,
    sup: sup,
    norm1: norm1,
    norminf: norminf,
    norm2: norm2,
    norm2squared: norm2squared,
    prod: prod,
    sum: sum,
    all: all,
    any: any
  });

  var iota = createCommonjsModule(function (module) {
  "use strict"

  function iota(n) {
    var result = new Array(n)
    for(var i=0; i<n; ++i) {
      result[i] = i
    }
    return result
  }

  module.exports = iota
  });

  var iota$1 = interopDefault(iota);


  var require$$1$3 = Object.freeze({
    default: iota$1
  });

  var index$1 = createCommonjsModule(function (module) {
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */

  // The _isBuffer check is for Safari 5-7 support, because it's missing
  // Object.prototype.constructor. Remove this eventually
  module.exports = function (obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
  }

  function isBuffer (obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  }

  // For Node v0.10 support. Remove this eventually.
  function isSlowBuffer (obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
  }
  });

  var index$2 = interopDefault(index$1);


  var require$$0$6 = Object.freeze({
    default: index$2
  });

  var ndarray = createCommonjsModule(function (module) {
  var iota = interopDefault(require$$1$3)
  var isBuffer = interopDefault(require$$0$6)

  var hasTypedArrays  = ((typeof Float64Array) !== "undefined")

  function compare1st(a, b) {
    return a[0] - b[0]
  }

  function order() {
    var stride = this.stride
    var terms = new Array(stride.length)
    var i
    for(i=0; i<terms.length; ++i) {
      terms[i] = [Math.abs(stride[i]), i]
    }
    terms.sort(compare1st)
    var result = new Array(terms.length)
    for(i=0; i<result.length; ++i) {
      result[i] = terms[i][1]
    }
    return result
  }

  function compileConstructor(dtype, dimension) {
    var className = ["View", dimension, "d", dtype].join("")
    if(dimension < 0) {
      className = "View_Nil" + dtype
    }
    var useGetters = (dtype === "generic")

    if(dimension === -1) {
      //Special case for trivial arrays
      var code =
        "function "+className+"(a){this.data=a;};\
var proto="+className+".prototype;\
proto.dtype='"+dtype+"';\
proto.index=function(){return -1};\
proto.size=0;\
proto.dimension=-1;\
proto.shape=proto.stride=proto.order=[];\
proto.lo=proto.hi=proto.transpose=proto.step=\
function(){return new "+className+"(this.data);};\
proto.get=proto.set=function(){};\
proto.pick=function(){return null};\
return function construct_"+className+"(a){return new "+className+"(a);}"
      var procedure = new Function(code)
      return procedure()
    } else if(dimension === 0) {
      //Special case for 0d arrays
      var code =
        "function "+className+"(a,d) {\
this.data = a;\
this.offset = d\
};\
var proto="+className+".prototype;\
proto.dtype='"+dtype+"';\
proto.index=function(){return this.offset};\
proto.dimension=0;\
proto.size=1;\
proto.shape=\
proto.stride=\
proto.order=[];\
proto.lo=\
proto.hi=\
proto.transpose=\
proto.step=function "+className+"_copy() {\
return new "+className+"(this.data,this.offset)\
};\
proto.pick=function "+className+"_pick(){\
return TrivialArray(this.data);\
};\
proto.valueOf=proto.get=function "+className+"_get(){\
return "+(useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]")+
  "};\
proto.set=function "+className+"_set(v){\
return "+(useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v")+"\
};\
return function construct_"+className+"(a,b,c,d){return new "+className+"(a,d)}"
      var procedure = new Function("TrivialArray", code)
      return procedure(CACHED_CONSTRUCTORS[dtype][0])
    }

    var code = ["'use strict'"]

    //Create constructor for view
    var indices = iota(dimension)
    var args = indices.map(function(i) { return "i"+i })
    var index_str = "this.offset+" + indices.map(function(i) {
          return "this.stride[" + i + "]*i" + i
        }).join("+")
    var shapeArg = indices.map(function(i) {
        return "b"+i
      }).join(",")
    var strideArg = indices.map(function(i) {
        return "c"+i
      }).join(",")
    code.push(
      "function "+className+"(a," + shapeArg + "," + strideArg + ",d){this.data=a",
        "this.shape=[" + shapeArg + "]",
        "this.stride=[" + strideArg + "]",
        "this.offset=d|0}",
      "var proto="+className+".prototype",
      "proto.dtype='"+dtype+"'",
      "proto.dimension="+dimension)

    //view.size:
    code.push("Object.defineProperty(proto,'size',{get:function "+className+"_size(){\
return "+indices.map(function(i) { return "this.shape["+i+"]" }).join("*"),
  "}})")

    //view.order:
    if(dimension === 1) {
      code.push("proto.order=[0]")
    } else {
      code.push("Object.defineProperty(proto,'order',{get:")
      if(dimension < 4) {
        code.push("function "+className+"_order(){")
        if(dimension === 2) {
          code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})")
        } else if(dimension === 3) {
          code.push(
  "var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);\
if(s0>s1){\
if(s1>s2){\
return [2,1,0];\
}else if(s0>s2){\
return [1,2,0];\
}else{\
return [1,0,2];\
}\
}else if(s0>s2){\
return [2,0,1];\
}else if(s2>s1){\
return [0,1,2];\
}else{\
return [0,2,1];\
}}})")
        }
      } else {
        code.push("ORDER})")
      }
    }

    //view.set(i0, ..., v):
    code.push(
  "proto.set=function "+className+"_set("+args.join(",")+",v){")
    if(useGetters) {
      code.push("return this.data.set("+index_str+",v)}")
    } else {
      code.push("return this.data["+index_str+"]=v}")
    }

    //view.get(i0, ...):
    code.push("proto.get=function "+className+"_get("+args.join(",")+"){")
    if(useGetters) {
      code.push("return this.data.get("+index_str+")}")
    } else {
      code.push("return this.data["+index_str+"]}")
    }

    //view.index:
    code.push(
      "proto.index=function "+className+"_index(", args.join(), "){return "+index_str+"}")

    //view.hi():
    code.push("proto.hi=function "+className+"_hi("+args.join(",")+"){return new "+className+"(this.data,"+
      indices.map(function(i) {
        return ["(typeof i",i,"!=='number'||i",i,"<0)?this.shape[", i, "]:i", i,"|0"].join("")
      }).join(",")+","+
      indices.map(function(i) {
        return "this.stride["+i + "]"
      }).join(",")+",this.offset)}")

    //view.lo():
    var a_vars = indices.map(function(i) { return "a"+i+"=this.shape["+i+"]" })
    var c_vars = indices.map(function(i) { return "c"+i+"=this.stride["+i+"]" })
    code.push("proto.lo=function "+className+"_lo("+args.join(",")+"){var b=this.offset,d=0,"+a_vars.join(",")+","+c_vars.join(","))
    for(var i=0; i<dimension; ++i) {
      code.push(
  "if(typeof i"+i+"==='number'&&i"+i+">=0){\
d=i"+i+"|0;\
b+=c"+i+"*d;\
a"+i+"-=d}")
    }
    code.push("return new "+className+"(this.data,"+
      indices.map(function(i) {
        return "a"+i
      }).join(",")+","+
      indices.map(function(i) {
        return "c"+i
      }).join(",")+",b)}")

    //view.step():
    code.push("proto.step=function "+className+"_step("+args.join(",")+"){var "+
      indices.map(function(i) {
        return "a"+i+"=this.shape["+i+"]"
      }).join(",")+","+
      indices.map(function(i) {
        return "b"+i+"=this.stride["+i+"]"
      }).join(",")+",c=this.offset,d=0,ceil=Math.ceil")
    for(var i=0; i<dimension; ++i) {
      code.push(
  "if(typeof i"+i+"==='number'){\
d=i"+i+"|0;\
if(d<0){\
c+=b"+i+"*(a"+i+"-1);\
a"+i+"=ceil(-a"+i+"/d)\
}else{\
a"+i+"=ceil(a"+i+"/d)\
}\
b"+i+"*=d\
}")
    }
    code.push("return new "+className+"(this.data,"+
      indices.map(function(i) {
        return "a" + i
      }).join(",")+","+
      indices.map(function(i) {
        return "b" + i
      }).join(",")+",c)}")

    //view.transpose():
    var tShape = new Array(dimension)
    var tStride = new Array(dimension)
    for(var i=0; i<dimension; ++i) {
      tShape[i] = "a[i"+i+"]"
      tStride[i] = "b[i"+i+"]"
    }
    code.push("proto.transpose=function "+className+"_transpose("+args+"){"+
      args.map(function(n,idx) { return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)"}).join(";"),
      "var a=this.shape,b=this.stride;return new "+className+"(this.data,"+tShape.join(",")+","+tStride.join(",")+",this.offset)}")

    //view.pick():
    code.push("proto.pick=function "+className+"_pick("+args+"){var a=[],b=[],c=this.offset")
    for(var i=0; i<dimension; ++i) {
      code.push("if(typeof i"+i+"==='number'&&i"+i+">=0){c=(c+this.stride["+i+"]*i"+i+")|0}else{a.push(this.shape["+i+"]);b.push(this.stride["+i+"])}")
    }
    code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}")

    //Add return statement
    code.push("return function construct_"+className+"(data,shape,stride,offset){return new "+className+"(data,"+
      indices.map(function(i) {
        return "shape["+i+"]"
      }).join(",")+","+
      indices.map(function(i) {
        return "stride["+i+"]"
      }).join(",")+",offset)}")

    //Compile procedure
    var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"))
    return procedure(CACHED_CONSTRUCTORS[dtype], order)
  }

  function arrayDType(data) {
    if(isBuffer(data)) {
      return "buffer"
    }
    if(hasTypedArrays) {
      switch(Object.prototype.toString.call(data)) {
        case "[object Float64Array]":
          return "float64"
        case "[object Float32Array]":
          return "float32"
        case "[object Int8Array]":
          return "int8"
        case "[object Int16Array]":
          return "int16"
        case "[object Int32Array]":
          return "int32"
        case "[object Uint8Array]":
          return "uint8"
        case "[object Uint16Array]":
          return "uint16"
        case "[object Uint32Array]":
          return "uint32"
        case "[object Uint8ClampedArray]":
          return "uint8_clamped"
      }
    }
    if(Array.isArray(data)) {
      return "array"
    }
    return "generic"
  }

  var CACHED_CONSTRUCTORS = {
    "float32":[],
    "float64":[],
    "int8":[],
    "int16":[],
    "int32":[],
    "uint8":[],
    "uint16":[],
    "uint32":[],
    "array":[],
    "uint8_clamped":[],
    "buffer":[],
    "generic":[]
  }

  ;(function() {
    for(var id in CACHED_CONSTRUCTORS) {
      CACHED_CONSTRUCTORS[id].push(compileConstructor(id, -1))
    }
  });

  function wrappedNDArrayCtor(data, shape, stride, offset) {
    if(data === undefined) {
      var ctor = CACHED_CONSTRUCTORS.array[0]
      return ctor([])
    } else if(typeof data === "number") {
      data = [data]
    }
    if(shape === undefined) {
      shape = [ data.length ]
    }
    var d = shape.length
    if(stride === undefined) {
      stride = new Array(d)
      for(var i=d-1, sz=1; i>=0; --i) {
        stride[i] = sz
        sz *= shape[i]
      }
    }
    if(offset === undefined) {
      offset = 0
      for(var i=0; i<d; ++i) {
        if(stride[i] < 0) {
          offset -= (shape[i]-1)*stride[i]
        }
      }
    }
    var dtype = arrayDType(data)
    var ctor_list = CACHED_CONSTRUCTORS[dtype]
    while(ctor_list.length <= d+1) {
      ctor_list.push(compileConstructor(dtype, ctor_list.length-1))
    }
    var ctor = ctor_list[d+1]
    return ctor(data, shape, stride, offset)
  }

  module.exports = wrappedNDArrayCtor
  });

  var ndarray$1 = interopDefault(ndarray);


  var require$$0$5 = Object.freeze({
    default: ndarray$1
  });

  var buffer = createCommonjsModule(function (module) {
  "use strict"

  var pool = interopDefault(require$$2)
  var ops = interopDefault(require$$1$2)
  var ndarray = interopDefault(require$$0$5)

  var SUPPORTED_TYPES = [
    "uint8",
    "uint8_clamped",
    "uint16",
    "uint32",
    "int8",
    "int16",
    "int32",
    "float32" ]

  function GLBuffer(gl, type, handle, length, usage) {
    this.gl = gl
    this.type = type
    this.handle = handle
    this.length = length
    this.usage = usage
  }

  var proto = GLBuffer.prototype

  proto.bind = function() {
    this.gl.bindBuffer(this.type, this.handle)
  }

  proto.unbind = function() {
    this.gl.bindBuffer(this.type, null)
  }

  proto.dispose = function() {
    this.gl.deleteBuffer(this.handle)
  }

  function updateTypeArray(gl, type, len, usage, data, offset) {
    var dataLen = data.length * data.BYTES_PER_ELEMENT
    if(offset < 0) {
      gl.bufferData(type, data, usage)
      return dataLen
    }
    if(dataLen + offset > len) {
      throw new Error("gl-buffer: If resizing buffer, must not specify offset")
    }
    gl.bufferSubData(type, offset, data)
    return len
  }

  function makeScratchTypeArray(array, dtype) {
    var res = pool.malloc(array.length, dtype)
    var n = array.length
    for(var i=0; i<n; ++i) {
      res[i] = array[i]
    }
    return res
  }

  function isPacked(shape, stride) {
    var n = 1
    for(var i=stride.length-1; i>=0; --i) {
      if(stride[i] !== n) {
        return false
      }
      n *= shape[i]
    }
    return true
  }

  proto.update = function(array, offset) {
    if(typeof offset !== "number") {
      offset = -1
    }
    this.bind()
    if(typeof array === "object" && typeof array.shape !== "undefined") { //ndarray
      var dtype = array.dtype
      if(SUPPORTED_TYPES.indexOf(dtype) < 0) {
        dtype = "float32"
      }
      if(this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
        var ext = gl.getExtension('OES_element_index_uint')
        if(ext && dtype !== "uint16") {
          dtype = "uint32"
        } else {
          dtype = "uint16"
        }
      }
      if(dtype === array.dtype && isPacked(array.shape, array.stride)) {
        if(array.offset === 0 && array.data.length === array.shape[0]) {
          this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array.data, offset)
        } else {
          this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array.data.subarray(array.offset, array.shape[0]), offset)
        }
      } else {
        var tmp = pool.malloc(array.size, dtype)
        var ndt = ndarray(tmp, array.shape)
        ops.assign(ndt, array)
        if(offset < 0) {
          this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, tmp, offset)
        } else {
          this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, tmp.subarray(0, array.size), offset)
        }
        pool.free(tmp)
      }
    } else if(Array.isArray(array)) { //Vanilla array
      var t
      if(this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
        t = makeScratchTypeArray(array, "uint16")
      } else {
        t = makeScratchTypeArray(array, "float32")
      }
      if(offset < 0) {
        this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, t, offset)
      } else {
        this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, t.subarray(0, array.length), offset)
      }
      pool.free(t)
    } else if(typeof array === "object" && typeof array.length === "number") { //Typed array
      this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array, offset)
    } else if(typeof array === "number" || array === undefined) { //Number/default
      if(offset >= 0) {
        throw new Error("gl-buffer: Cannot specify offset when resizing buffer")
      }
      array = array | 0
      if(array <= 0) {
        array = 1
      }
      this.gl.bufferData(this.type, array|0, this.usage)
      this.length = array
    } else { //Error, case should not happen
      throw new Error("gl-buffer: Invalid data type")
    }
  }

  function createBuffer(gl, data, type, usage) {
    type = type || gl.ARRAY_BUFFER
    usage = usage || gl.DYNAMIC_DRAW
    if(type !== gl.ARRAY_BUFFER && type !== gl.ELEMENT_ARRAY_BUFFER) {
      throw new Error("gl-buffer: Invalid type for webgl buffer, must be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER")
    }
    if(usage !== gl.DYNAMIC_DRAW && usage !== gl.STATIC_DRAW && usage !== gl.STREAM_DRAW) {
      throw new Error("gl-buffer: Invalid usage for buffer, must be either gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW")
    }
    var handle = gl.createBuffer()
    var result = new GLBuffer(gl, type, handle, 0, usage)
    result.update(data)
    return result
  }

  module.exports = createBuffer
  });

  var buffer$1 = interopDefault(buffer);


  var require$$1 = Object.freeze({
    default: buffer$1
  });

  var doBind = createCommonjsModule(function (module) {
  "use strict"

  function doBind(gl, elements, attributes) {
    if(elements) {
      elements.bind()
    } else {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }
    var nattribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS)|0
    if(attributes) {
      if(attributes.length > nattribs) {
        throw new Error("gl-vao: Too many vertex attributes")
      }
      for(var i=0; i<attributes.length; ++i) {
        var attrib = attributes[i]
        if(attrib.buffer) {
          var buffer = attrib.buffer
          var size = attrib.size || 4
          var type = attrib.type || gl.FLOAT
          var normalized = !!attrib.normalized
          var stride = attrib.stride || 0
          var offset = attrib.offset || 0
          buffer.bind()
          gl.enableVertexAttribArray(i)
          gl.vertexAttribPointer(i, size, type, normalized, stride, offset)
        } else {
          if(typeof attrib === "number") {
            gl.vertexAttrib1f(i, attrib)
          } else if(attrib.length === 1) {
            gl.vertexAttrib1f(i, attrib[0])
          } else if(attrib.length === 2) {
            gl.vertexAttrib2f(i, attrib[0], attrib[1])
          } else if(attrib.length === 3) {
            gl.vertexAttrib3f(i, attrib[0], attrib[1], attrib[2])
          } else if(attrib.length === 4) {
            gl.vertexAttrib4f(i, attrib[0], attrib[1], attrib[2], attrib[3])
          } else {
            throw new Error("gl-vao: Invalid vertex attribute")
          }
          gl.disableVertexAttribArray(i)
        }
      }
      for(; i<nattribs; ++i) {
        gl.disableVertexAttribArray(i)
      }
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
      for(var i=0; i<nattribs; ++i) {
        gl.disableVertexAttribArray(i)
      }
    }
  }

  module.exports = doBind
  });

  var doBind$1 = interopDefault(doBind);


  var require$$0$8 = Object.freeze({
    default: doBind$1
  });

  var vaoNative = createCommonjsModule(function (module) {
  "use strict"

  var bindAttribs = interopDefault(require$$0$8)

  function VertexAttribute(location, dimension, a, b, c, d) {
    this.location = location
    this.dimension = dimension
    this.a = a
    this.b = b
    this.c = c
    this.d = d
  }

  VertexAttribute.prototype.bind = function(gl) {
    switch(this.dimension) {
      case 1:
        gl.vertexAttrib1f(this.location, this.a)
      break
      case 2:
        gl.vertexAttrib2f(this.location, this.a, this.b)
      break
      case 3:
        gl.vertexAttrib3f(this.location, this.a, this.b, this.c)
      break
      case 4:
        gl.vertexAttrib4f(this.location, this.a, this.b, this.c, this.d)
      break
    }
  }

  function VAONative(gl, ext, handle) {
    this.gl = gl
    this._ext = ext
    this.handle = handle
    this._attribs = []
    this._useElements = false
    this._elementsType = gl.UNSIGNED_SHORT
  }

  VAONative.prototype.bind = function() {
    this._ext.bindVertexArrayOES(this.handle)
    for(var i=0; i<this._attribs.length; ++i) {
      this._attribs[i].bind(this.gl)
    }
  }

  VAONative.prototype.unbind = function() {
    this._ext.bindVertexArrayOES(null)
  }

  VAONative.prototype.dispose = function() {
    this._ext.deleteVertexArrayOES(this.handle)
  }

  VAONative.prototype.update = function(attributes, elements, elementsType) {
    this.bind()
    bindAttribs(this.gl, elements, attributes)
    this.unbind()
    this._attribs.length = 0
    if(attributes)
    for(var i=0; i<attributes.length; ++i) {
      var a = attributes[i]
      if(typeof a === "number") {
        this._attribs.push(new VertexAttribute(i, 1, a))
      } else if(Array.isArray(a)) {
        this._attribs.push(new VertexAttribute(i, a.length, a[0], a[1], a[2], a[3]))
      }
    }
    this._useElements = !!elements
    this._elementsType = elementsType || this.gl.UNSIGNED_SHORT
  }

  VAONative.prototype.draw = function(mode, count, offset) {
    offset = offset || 0
    var gl = this.gl
    if(this._useElements) {
      gl.drawElements(mode, count, this._elementsType, offset)
    } else {
      gl.drawArrays(mode, offset, count)
    }
  }

  function createVAONative(gl, ext) {
    return new VAONative(gl, ext, ext.createVertexArrayOES())
  }

  module.exports = createVAONative
  });

  var vaoNative$1 = interopDefault(vaoNative);


  var require$$1$4 = Object.freeze({
    default: vaoNative$1
  });

  var vaoEmulated = createCommonjsModule(function (module) {
  "use strict"

  var bindAttribs = interopDefault(require$$0$8)

  function VAOEmulated(gl) {
    this.gl = gl
    this._elements = null
    this._attributes = null
    this._elementsType = gl.UNSIGNED_SHORT
  }

  VAOEmulated.prototype.bind = function() {
    bindAttribs(this.gl, this._elements, this._attributes)
  }

  VAOEmulated.prototype.update = function(attributes, elements, elementsType) {
    this._elements = elements
    this._attributes = attributes
    this._elementsType = elementsType || this.gl.UNSIGNED_SHORT
  }

  VAOEmulated.prototype.dispose = function() { }
  VAOEmulated.prototype.unbind = function() { }

  VAOEmulated.prototype.draw = function(mode, count, offset) {
    offset = offset || 0
    var gl = this.gl
    if(this._elements) {
      gl.drawElements(mode, count, this._elementsType, offset)
    } else {
      gl.drawArrays(mode, offset, count)
    }
  }

  function createVAOEmulated(gl) {
    return new VAOEmulated(gl)
  }

  module.exports = createVAOEmulated
  });

  var vaoEmulated$1 = interopDefault(vaoEmulated);


  var require$$0$9 = Object.freeze({
    default: vaoEmulated$1
  });

  var vao = createCommonjsModule(function (module) {
  "use strict"

  var createVAONative = interopDefault(require$$1$4)
  var createVAOEmulated = interopDefault(require$$0$9)

  function ExtensionShim (gl) {
    this.bindVertexArrayOES = gl.bindVertexArray.bind(gl)
    this.createVertexArrayOES = gl.createVertexArray.bind(gl)
    this.deleteVertexArrayOES = gl.deleteVertexArray.bind(gl)
  }

  function createVAO(gl, attributes, elements, elementsType) {
    var ext = gl.createVertexArray
      ? new ExtensionShim(gl)
      : gl.getExtension('OES_vertex_array_object')
    var vao

    if(ext) {
      vao = createVAONative(gl, ext)
    } else {
      vao = createVAOEmulated(gl)
    }
    vao.update(attributes, elements, elementsType)
    return vao
  }

  module.exports = createVAO
  });

  var vao$1 = interopDefault(vao);


  var require$$0$7 = Object.freeze({
    default: vao$1
  });

  var index = createCommonjsModule(function (module) {
  var createBuffer = interopDefault(require$$1)
  var createVAO = interopDefault(require$$0$7)

  module.exports = GLBigTriangle

  function GLBigTriangle (gl) {
    if (!(this instanceof GLBigTriangle)) {
      return new GLBigTriangle(gl)
    }

    this.gl = gl
    this.vao = createVAO(gl, [{
      size: 2,
      type: gl.FLOAT,
      buffer: createBuffer(gl, new Float32Array([
        -1, -1, -1,
        +4, +4, -1
      ]))
    }])
  }

  GLBigTriangle.prototype.bind = function () {
    this.vao.bind()
  }

  GLBigTriangle.prototype.draw = function () {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
  }

  GLBigTriangle.prototype.unbind = function () {
    this.vao.unbind()
  }
  });

  var GLBigTriangle = interopDefault(index);

  var reflect = createCommonjsModule(function (module) {
  'use strict'

  module.exports = makeReflectTypes

  //Construct type info for reflection.
  //
  // This iterates over the flattened list of uniform type values and smashes them into a JSON object.
  //
  // The leaves of the resulting object are either indices or type strings representing primitive glslify types
  function makeReflectTypes(uniforms, useIndex) {
    var obj = {}
    for(var i=0; i<uniforms.length; ++i) {
      var n = uniforms[i].name
      var parts = n.split(".")
      var o = obj
      for(var j=0; j<parts.length; ++j) {
        var x = parts[j].split("[")
        if(x.length > 1) {
          if(!(x[0] in o)) {
            o[x[0]] = []
          }
          o = o[x[0]]
          for(var k=1; k<x.length; ++k) {
            var y = parseInt(x[k])
            if(k<x.length-1 || j<parts.length-1) {
              if(!(y in o)) {
                if(k < x.length-1) {
                  o[y] = []
                } else {
                  o[y] = {}
                }
              }
              o = o[y]
            } else {
              if(useIndex) {
                o[y] = i
              } else {
                o[y] = uniforms[i].type
              }
            }
          }
        } else if(j < parts.length-1) {
          if(!(x[0] in o)) {
            o[x[0]] = {}
          }
          o = o[x[0]]
        } else {
          if(useIndex) {
            o[x[0]] = i
          } else {
            o[x[0]] = uniforms[i].type
          }
        }
      }
    }
    return obj
  }
  });

  var reflect$1 = interopDefault(reflect);


  var require$$1$5 = Object.freeze({
    default: reflect$1
  });

  var GLError = createCommonjsModule(function (module) {
  function GLError (rawError, shortMessage, longMessage) {
      this.shortMessage = shortMessage || ''
      this.longMessage = longMessage || ''
      this.rawError = rawError || ''
      this.message =
        'gl-shader: ' + (shortMessage || rawError || '') +
        (longMessage ? '\n'+longMessage : '')
      this.stack = (new Error()).stack
  }
  GLError.prototype = new Error
  GLError.prototype.name = 'GLError'
  GLError.prototype.constructor = GLError
  module.exports = GLError
  });

  var GLError$1 = interopDefault(GLError);


  var require$$2$1 = Object.freeze({
      default: GLError$1
  });

  var createUniforms = createCommonjsModule(function (module) {
  'use strict'

  var coallesceUniforms = interopDefault(require$$1$5)
  var GLError = interopDefault(require$$2$1)

  module.exports = createUniformWrapper

  //Binds a function and returns a value
  function identity(x) {
    var c = new Function('y', 'return function(){return y}')
    return c(x)
  }

  function makeVector(length, fill) {
    var result = new Array(length)
    for(var i=0; i<length; ++i) {
      result[i] = fill
    }
    return result
  }

  //Create shims for uniforms
  function createUniformWrapper(gl, wrapper, uniforms, locations) {

    function makeGetter(index) {
      var proc = new Function(
          'gl'
        , 'wrapper'
        , 'locations'
        , 'return function(){return gl.getUniform(wrapper.program,locations[' + index + '])}')
      return proc(gl, wrapper, locations)
    }

    function makePropSetter(path, index, type) {
      switch(type) {
        case 'bool':
        case 'int':
        case 'sampler2D':
        case 'samplerCube':
          return 'gl.uniform1i(locations[' + index + '],obj' + path + ')'
        case 'float':
          return 'gl.uniform1f(locations[' + index + '],obj' + path + ')'
        default:
          var vidx = type.indexOf('vec')
          if(0 <= vidx && vidx <= 1 && type.length === 4 + vidx) {
            var d = type.charCodeAt(type.length-1) - 48
            if(d < 2 || d > 4) {
              throw new GLError('', 'Invalid data type')
            }
            switch(type.charAt(0)) {
              case 'b':
              case 'i':
                return 'gl.uniform' + d + 'iv(locations[' + index + '],obj' + path + ')'
              case 'v':
                return 'gl.uniform' + d + 'fv(locations[' + index + '],obj' + path + ')'
              default:
                throw new GLError('', 'Unrecognized data type for vector ' + name + ': ' + type)
            }
          } else if(type.indexOf('mat') === 0 && type.length === 4) {
            var d = type.charCodeAt(type.length-1) - 48
            if(d < 2 || d > 4) {
              throw new GLError('', 'Invalid uniform dimension type for matrix ' + name + ': ' + type)
            }
            return 'gl.uniformMatrix' + d + 'fv(locations[' + index + '],false,obj' + path + ')'
          } else {
            throw new GLError('', 'Unknown uniform data type for ' + name + ': ' + type)
          }
        break
      }
    }

    function enumerateIndices(prefix, type) {
      if(typeof type !== 'object') {
        return [ [prefix, type] ]
      }
      var indices = []
      for(var id in type) {
        var prop = type[id]
        var tprefix = prefix
        if(parseInt(id) + '' === id) {
          tprefix += '[' + id + ']'
        } else {
          tprefix += '.' + id
        }
        if(typeof prop === 'object') {
          indices.push.apply(indices, enumerateIndices(tprefix, prop))
        } else {
          indices.push([tprefix, prop])
        }
      }
      return indices
    }

    function makeSetter(type) {
      var code = [ 'return function updateProperty(obj){' ]
      var indices = enumerateIndices('', type)
      for(var i=0; i<indices.length; ++i) {
        var item = indices[i]
        var path = item[0]
        var idx  = item[1]
        if(locations[idx]) {
          code.push(makePropSetter(path, idx, uniforms[idx].type))
        }
      }
      code.push('return obj}')
      var proc = new Function('gl', 'locations', code.join('\n'))
      return proc(gl, locations)
    }

    function defaultValue(type) {
      switch(type) {
        case 'bool':
          return false
        case 'int':
        case 'sampler2D':
        case 'samplerCube':
          return 0
        case 'float':
          return 0.0
        default:
          var vidx = type.indexOf('vec')
          if(0 <= vidx && vidx <= 1 && type.length === 4 + vidx) {
            var d = type.charCodeAt(type.length-1) - 48
            if(d < 2 || d > 4) {
              throw new GLError('', 'Invalid data type')
            }
            if(type.charAt(0) === 'b') {
              return makeVector(d, false)
            }
            return makeVector(d, 0)
          } else if(type.indexOf('mat') === 0 && type.length === 4) {
            var d = type.charCodeAt(type.length-1) - 48
            if(d < 2 || d > 4) {
              throw new GLError('', 'Invalid uniform dimension type for matrix ' + name + ': ' + type)
            }
            return makeVector(d*d, 0)
          } else {
            throw new GLError('', 'Unknown uniform data type for ' + name + ': ' + type)
          }
        break
      }
    }

    function storeProperty(obj, prop, type) {
      if(typeof type === 'object') {
        var child = processObject(type)
        Object.defineProperty(obj, prop, {
          get: identity(child),
          set: makeSetter(type),
          enumerable: true,
          configurable: false
        })
      } else {
        if(locations[type]) {
          Object.defineProperty(obj, prop, {
            get: makeGetter(type),
            set: makeSetter(type),
            enumerable: true,
            configurable: false
          })
        } else {
          obj[prop] = defaultValue(uniforms[type].type)
        }
      }
    }

    function processObject(obj) {
      var result
      if(Array.isArray(obj)) {
        result = new Array(obj.length)
        for(var i=0; i<obj.length; ++i) {
          storeProperty(result, i, obj[i])
        }
      } else {
        result = {}
        for(var id in obj) {
          storeProperty(result, id, obj[id])
        }
      }
      return result
    }

    //Return data
    var coallesced = coallesceUniforms(uniforms, true)
    return {
      get: identity(processObject(coallesced)),
      set: makeSetter(coallesced),
      enumerable: true,
      configurable: true
    }
  }
  });

  var createUniforms$1 = interopDefault(createUniforms);


  var require$$5 = Object.freeze({
    default: createUniforms$1
  });

  var createAttributes = createCommonjsModule(function (module) {
  'use strict'

  module.exports = createAttributeWrapper

  var GLError = interopDefault(require$$2$1)

  function ShaderAttribute(
      gl
    , wrapper
    , index
    , locations
    , dimension
    , constFunc) {
    this._gl        = gl
    this._wrapper   = wrapper
    this._index     = index
    this._locations = locations
    this._dimension = dimension
    this._constFunc = constFunc
  }

  var proto = ShaderAttribute.prototype

  proto.pointer = function setAttribPointer(
      type
    , normalized
    , stride
    , offset) {

    var self      = this
    var gl        = self._gl
    var location  = self._locations[self._index]

    gl.vertexAttribPointer(
        location
      , self._dimension
      , type || gl.FLOAT
      , !!normalized
      , stride || 0
      , offset || 0)
    gl.enableVertexAttribArray(location)
  }

  proto.set = function(x0, x1, x2, x3) {
    return this._constFunc(this._locations[this._index], x0, x1, x2, x3)
  }

  Object.defineProperty(proto, 'location', {
    get: function() {
      return this._locations[this._index]
    }
    , set: function(v) {
      if(v !== this._locations[this._index]) {
        this._locations[this._index] = v|0
        this._wrapper.program = null
      }
      return v|0
    }
  })

  //Adds a vector attribute to obj
  function addVectorAttribute(
      gl
    , wrapper
    , index
    , locations
    , dimension
    , obj
    , name) {

    //Construct constant function
    var constFuncArgs = [ 'gl', 'v' ]
    var varNames = []
    for(var i=0; i<dimension; ++i) {
      constFuncArgs.push('x'+i)
      varNames.push('x'+i)
    }
    constFuncArgs.push(
      'if(x0.length===void 0){return gl.vertexAttrib' +
      dimension + 'f(v,' +
      varNames.join() +
      ')}else{return gl.vertexAttrib' +
      dimension +
      'fv(v,x0)}')
    var constFunc = Function.apply(null, constFuncArgs)

    //Create attribute wrapper
    var attr = new ShaderAttribute(
        gl
      , wrapper
      , index
      , locations
      , dimension
      , constFunc)

    //Create accessor
    Object.defineProperty(obj, name, {
      set: function(x) {
        gl.disableVertexAttribArray(locations[index])
        constFunc(gl, locations[index], x)
        return x
      }
      , get: function() {
        return attr
      }
      , enumerable: true
    })
  }

  function addMatrixAttribute(
      gl
    , wrapper
    , index
    , locations
    , dimension
    , obj
    , name) {

    var parts = new Array(dimension)
    var attrs = new Array(dimension)
    for(var i=0; i<dimension; ++i) {
      addVectorAttribute(
          gl
        , wrapper
        , index[i]
        , locations
        , dimension
        , parts
        , i)
      attrs[i] = parts[i]
    }

    Object.defineProperty(parts, 'location', {
      set: function(v) {
        if(Array.isArray(v)) {
          for(var i=0; i<dimension; ++i) {
            attrs[i].location = v[i]
          }
        } else {
          for(var i=0; i<dimension; ++i) {
            attrs[i].location = v + i
          }
        }
        return v
      }
      , get: function() {
        var result = new Array(dimension)
        for(var i=0; i<dimension; ++i) {
          result[i] = locations[index[i]]
        }
        return result
      }
      , enumerable: true
    })

    parts.pointer = function(type, normalized, stride, offset) {
      type       = type || gl.FLOAT
      normalized = !!normalized
      stride     = stride || (dimension * dimension)
      offset     = offset || 0
      for(var i=0; i<dimension; ++i) {
        var location = locations[index[i]]
        gl.vertexAttribPointer(
              location
            , dimension
            , type
            , normalized
            , stride
            , offset + i * dimension)
        gl.enableVertexAttribArray(location)
      }
    }

    var scratch = new Array(dimension)
    var vertexAttrib = gl['vertexAttrib' + dimension + 'fv']

    Object.defineProperty(obj, name, {
      set: function(x) {
        for(var i=0; i<dimension; ++i) {
          var loc = locations[index[i]]
          gl.disableVertexAttribArray(loc)
          if(Array.isArray(x[0])) {
            vertexAttrib.call(gl, loc, x[i])
          } else {
            for(var j=0; j<dimension; ++j) {
              scratch[j] = x[dimension*i + j]
            }
            vertexAttrib.call(gl, loc, scratch)
          }
        }
        return x
      }
      , get: function() {
        return parts
      }
      , enumerable: true
    })
  }

  //Create shims for attributes
  function createAttributeWrapper(
      gl
    , wrapper
    , attributes
    , locations) {

    var obj = {}
    for(var i=0, n=attributes.length; i<n; ++i) {

      var a = attributes[i]
      var name = a.name
      var type = a.type
      var locs = a.locations

      switch(type) {
        case 'bool':
        case 'int':
        case 'float':
          addVectorAttribute(
              gl
            , wrapper
            , locs[0]
            , locations
            , 1
            , obj
            , name)
        break

        default:
          if(type.indexOf('vec') >= 0) {
            var d = type.charCodeAt(type.length-1) - 48
            if(d < 2 || d > 4) {
              throw new GLError('', 'Invalid data type for attribute ' + name + ': ' + type)
            }
            addVectorAttribute(
                gl
              , wrapper
              , locs[0]
              , locations
              , d
              , obj
              , name)
          } else if(type.indexOf('mat') >= 0) {
            var d = type.charCodeAt(type.length-1) - 48
            if(d < 2 || d > 4) {
              throw new GLError('', 'Invalid data type for attribute ' + name + ': ' + type)
            }
            addMatrixAttribute(
                gl
              , wrapper
              , locs
              , locations
              , d
              , obj
              , name)
          } else {
            throw new GLError('', 'Unknown data type for attribute ' + name + ': ' + type)
          }
        break
      }
    }
    return obj
  }
  });

  var createAttributes$1 = interopDefault(createAttributes);


  var require$$4 = Object.freeze({
    default: createAttributes$1
  });

  var sprintf = createCommonjsModule(function (module, exports) {
  (function(window) {
      var re = {
          not_string: /[^s]/,
          number: /[diefg]/,
          json: /[j]/,
          not_json: /[^j]/,
          text: /^[^\x25]+/,
          modulo: /^\x25{2}/,
          placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
          key: /^([a-z_][a-z_\d]*)/i,
          key_access: /^\.([a-z_][a-z_\d]*)/i,
          index_access: /^\[(\d+)\]/,
          sign: /^[\+\-]/
      }

      function sprintf() {
          var key = arguments[0], cache = sprintf.cache
          if (!(cache[key] && cache.hasOwnProperty(key))) {
              cache[key] = sprintf.parse(key)
          }
          return sprintf.format.call(null, cache[key], arguments)
      }

      sprintf.format = function(parse_tree, argv) {
          var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
          for (i = 0; i < tree_length; i++) {
              node_type = get_type(parse_tree[i])
              if (node_type === "string") {
                  output[output.length] = parse_tree[i]
              }
              else if (node_type === "array") {
                  match = parse_tree[i] // convenience purposes only
                  if (match[2]) { // keyword argument
                      arg = argv[cursor]
                      for (k = 0; k < match[2].length; k++) {
                          if (!arg.hasOwnProperty(match[2][k])) {
                              throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
                          }
                          arg = arg[match[2][k]]
                      }
                  }
                  else if (match[1]) { // positional argument (explicit)
                      arg = argv[match[1]]
                  }
                  else { // positional argument (implicit)
                      arg = argv[cursor++]
                  }

                  if (get_type(arg) == "function") {
                      arg = arg()
                  }

                  if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                      throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
                  }

                  if (re.number.test(match[8])) {
                      is_positive = arg >= 0
                  }

                  switch (match[8]) {
                      case "b":
                          arg = arg.toString(2)
                      break
                      case "c":
                          arg = String.fromCharCode(arg)
                      break
                      case "d":
                      case "i":
                          arg = parseInt(arg, 10)
                      break
                      case "j":
                          arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)
                      break
                      case "e":
                          arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
                      break
                      case "f":
                          arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
                      break
                      case "g":
                          arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)
                      break
                      case "o":
                          arg = arg.toString(8)
                      break
                      case "s":
                          arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
                      break
                      case "u":
                          arg = arg >>> 0
                      break
                      case "x":
                          arg = arg.toString(16)
                      break
                      case "X":
                          arg = arg.toString(16).toUpperCase()
                      break
                  }
                  if (re.json.test(match[8])) {
                      output[output.length] = arg
                  }
                  else {
                      if (re.number.test(match[8]) && (!is_positive || match[3])) {
                          sign = is_positive ? "+" : "-"
                          arg = arg.toString().replace(re.sign, "")
                      }
                      else {
                          sign = ""
                      }
                      pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
                      pad_length = match[6] - (sign + arg).length
                      pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
                      output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
                  }
              }
          }
          return output.join("")
      }

      sprintf.cache = {}

      sprintf.parse = function(fmt) {
          var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
          while (_fmt) {
              if ((match = re.text.exec(_fmt)) !== null) {
                  parse_tree[parse_tree.length] = match[0]
              }
              else if ((match = re.modulo.exec(_fmt)) !== null) {
                  parse_tree[parse_tree.length] = "%"
              }
              else if ((match = re.placeholder.exec(_fmt)) !== null) {
                  if (match[2]) {
                      arg_names |= 1
                      var field_list = [], replacement_field = match[2], field_match = []
                      if ((field_match = re.key.exec(replacement_field)) !== null) {
                          field_list[field_list.length] = field_match[1]
                          while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                              if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                  field_list[field_list.length] = field_match[1]
                              }
                              else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                  field_list[field_list.length] = field_match[1]
                              }
                              else {
                                  throw new SyntaxError("[sprintf] failed to parse named argument key")
                              }
                          }
                      }
                      else {
                          throw new SyntaxError("[sprintf] failed to parse named argument key")
                      }
                      match[2] = field_list
                  }
                  else {
                      arg_names |= 2
                  }
                  if (arg_names === 3) {
                      throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
                  }
                  parse_tree[parse_tree.length] = match
              }
              else {
                  throw new SyntaxError("[sprintf] unexpected placeholder")
              }
              _fmt = _fmt.substring(match[0].length)
          }
          return parse_tree
      }

      var vsprintf = function(fmt, argv, _argv) {
          _argv = (argv || []).slice(0)
          _argv.splice(0, 0, fmt)
          return sprintf.apply(null, _argv)
      }

      /**
       * helpers
       */
      function get_type(variable) {
          return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
      }

      function str_repeat(input, multiplier) {
          return Array(multiplier + 1).join(input)
      }

      /**
       * export to either browser or node.js
       */
      if (typeof exports !== "undefined") {
          exports.sprintf = sprintf
          exports.vsprintf = vsprintf
      }
      else {
          window.sprintf = sprintf
          window.vsprintf = vsprintf

          if (typeof define === "function" && define.amd) {
              define(function() {
                  return {
                      sprintf: sprintf,
                      vsprintf: vsprintf
                  }
              })
          }
      }
  })(typeof window === "undefined" ? commonjsGlobal : window);
  });

  var sprintf$1 = interopDefault(sprintf);
  var vsprintf = sprintf.vsprintf;
  var sprintf$$1 = sprintf.sprintf;


  var require$$3 = Object.freeze({
      default: sprintf$1,
      vsprintf: vsprintf,
      sprintf: sprintf$$1
  });

  var numbers = createCommonjsModule(function (module) {
  module.exports = {
    0: 'NONE',
    1: 'ONE',
    2: 'LINE_LOOP',
    3: 'LINE_STRIP',
    4: 'TRIANGLES',
    5: 'TRIANGLE_STRIP',
    6: 'TRIANGLE_FAN',
    256: 'DEPTH_BUFFER_BIT',
    512: 'NEVER',
    513: 'LESS',
    514: 'EQUAL',
    515: 'LEQUAL',
    516: 'GREATER',
    517: 'NOTEQUAL',
    518: 'GEQUAL',
    519: 'ALWAYS',
    768: 'SRC_COLOR',
    769: 'ONE_MINUS_SRC_COLOR',
    770: 'SRC_ALPHA',
    771: 'ONE_MINUS_SRC_ALPHA',
    772: 'DST_ALPHA',
    773: 'ONE_MINUS_DST_ALPHA',
    774: 'DST_COLOR',
    775: 'ONE_MINUS_DST_COLOR',
    776: 'SRC_ALPHA_SATURATE',
    1024: 'STENCIL_BUFFER_BIT',
    1028: 'FRONT',
    1029: 'BACK',
    1032: 'FRONT_AND_BACK',
    1280: 'INVALID_ENUM',
    1281: 'INVALID_VALUE',
    1282: 'INVALID_OPERATION',
    1285: 'OUT_OF_MEMORY',
    1286: 'INVALID_FRAMEBUFFER_OPERATION',
    2304: 'CW',
    2305: 'CCW',
    2849: 'LINE_WIDTH',
    2884: 'CULL_FACE',
    2885: 'CULL_FACE_MODE',
    2886: 'FRONT_FACE',
    2928: 'DEPTH_RANGE',
    2929: 'DEPTH_TEST',
    2930: 'DEPTH_WRITEMASK',
    2931: 'DEPTH_CLEAR_VALUE',
    2932: 'DEPTH_FUNC',
    2960: 'STENCIL_TEST',
    2961: 'STENCIL_CLEAR_VALUE',
    2962: 'STENCIL_FUNC',
    2963: 'STENCIL_VALUE_MASK',
    2964: 'STENCIL_FAIL',
    2965: 'STENCIL_PASS_DEPTH_FAIL',
    2966: 'STENCIL_PASS_DEPTH_PASS',
    2967: 'STENCIL_REF',
    2968: 'STENCIL_WRITEMASK',
    2978: 'VIEWPORT',
    3024: 'DITHER',
    3042: 'BLEND',
    3088: 'SCISSOR_BOX',
    3089: 'SCISSOR_TEST',
    3106: 'COLOR_CLEAR_VALUE',
    3107: 'COLOR_WRITEMASK',
    3317: 'UNPACK_ALIGNMENT',
    3333: 'PACK_ALIGNMENT',
    3379: 'MAX_TEXTURE_SIZE',
    3386: 'MAX_VIEWPORT_DIMS',
    3408: 'SUBPIXEL_BITS',
    3410: 'RED_BITS',
    3411: 'GREEN_BITS',
    3412: 'BLUE_BITS',
    3413: 'ALPHA_BITS',
    3414: 'DEPTH_BITS',
    3415: 'STENCIL_BITS',
    3553: 'TEXTURE_2D',
    4352: 'DONT_CARE',
    4353: 'FASTEST',
    4354: 'NICEST',
    5120: 'BYTE',
    5121: 'UNSIGNED_BYTE',
    5122: 'SHORT',
    5123: 'UNSIGNED_SHORT',
    5124: 'INT',
    5125: 'UNSIGNED_INT',
    5126: 'FLOAT',
    5386: 'INVERT',
    5890: 'TEXTURE',
    6401: 'STENCIL_INDEX',
    6402: 'DEPTH_COMPONENT',
    6406: 'ALPHA',
    6407: 'RGB',
    6408: 'RGBA',
    6409: 'LUMINANCE',
    6410: 'LUMINANCE_ALPHA',
    7680: 'KEEP',
    7681: 'REPLACE',
    7682: 'INCR',
    7683: 'DECR',
    7936: 'VENDOR',
    7937: 'RENDERER',
    7938: 'VERSION',
    9728: 'NEAREST',
    9729: 'LINEAR',
    9984: 'NEAREST_MIPMAP_NEAREST',
    9985: 'LINEAR_MIPMAP_NEAREST',
    9986: 'NEAREST_MIPMAP_LINEAR',
    9987: 'LINEAR_MIPMAP_LINEAR',
    10240: 'TEXTURE_MAG_FILTER',
    10241: 'TEXTURE_MIN_FILTER',
    10242: 'TEXTURE_WRAP_S',
    10243: 'TEXTURE_WRAP_T',
    10497: 'REPEAT',
    10752: 'POLYGON_OFFSET_UNITS',
    16384: 'COLOR_BUFFER_BIT',
    32769: 'CONSTANT_COLOR',
    32770: 'ONE_MINUS_CONSTANT_COLOR',
    32771: 'CONSTANT_ALPHA',
    32772: 'ONE_MINUS_CONSTANT_ALPHA',
    32773: 'BLEND_COLOR',
    32774: 'FUNC_ADD',
    32777: 'BLEND_EQUATION_RGB',
    32778: 'FUNC_SUBTRACT',
    32779: 'FUNC_REVERSE_SUBTRACT',
    32819: 'UNSIGNED_SHORT_4_4_4_4',
    32820: 'UNSIGNED_SHORT_5_5_5_1',
    32823: 'POLYGON_OFFSET_FILL',
    32824: 'POLYGON_OFFSET_FACTOR',
    32854: 'RGBA4',
    32855: 'RGB5_A1',
    32873: 'TEXTURE_BINDING_2D',
    32926: 'SAMPLE_ALPHA_TO_COVERAGE',
    32928: 'SAMPLE_COVERAGE',
    32936: 'SAMPLE_BUFFERS',
    32937: 'SAMPLES',
    32938: 'SAMPLE_COVERAGE_VALUE',
    32939: 'SAMPLE_COVERAGE_INVERT',
    32968: 'BLEND_DST_RGB',
    32969: 'BLEND_SRC_RGB',
    32970: 'BLEND_DST_ALPHA',
    32971: 'BLEND_SRC_ALPHA',
    33071: 'CLAMP_TO_EDGE',
    33170: 'GENERATE_MIPMAP_HINT',
    33189: 'DEPTH_COMPONENT16',
    33306: 'DEPTH_STENCIL_ATTACHMENT',
    33635: 'UNSIGNED_SHORT_5_6_5',
    33648: 'MIRRORED_REPEAT',
    33901: 'ALIASED_POINT_SIZE_RANGE',
    33902: 'ALIASED_LINE_WIDTH_RANGE',
    33984: 'TEXTURE0',
    33985: 'TEXTURE1',
    33986: 'TEXTURE2',
    33987: 'TEXTURE3',
    33988: 'TEXTURE4',
    33989: 'TEXTURE5',
    33990: 'TEXTURE6',
    33991: 'TEXTURE7',
    33992: 'TEXTURE8',
    33993: 'TEXTURE9',
    33994: 'TEXTURE10',
    33995: 'TEXTURE11',
    33996: 'TEXTURE12',
    33997: 'TEXTURE13',
    33998: 'TEXTURE14',
    33999: 'TEXTURE15',
    34000: 'TEXTURE16',
    34001: 'TEXTURE17',
    34002: 'TEXTURE18',
    34003: 'TEXTURE19',
    34004: 'TEXTURE20',
    34005: 'TEXTURE21',
    34006: 'TEXTURE22',
    34007: 'TEXTURE23',
    34008: 'TEXTURE24',
    34009: 'TEXTURE25',
    34010: 'TEXTURE26',
    34011: 'TEXTURE27',
    34012: 'TEXTURE28',
    34013: 'TEXTURE29',
    34014: 'TEXTURE30',
    34015: 'TEXTURE31',
    34016: 'ACTIVE_TEXTURE',
    34024: 'MAX_RENDERBUFFER_SIZE',
    34041: 'DEPTH_STENCIL',
    34055: 'INCR_WRAP',
    34056: 'DECR_WRAP',
    34067: 'TEXTURE_CUBE_MAP',
    34068: 'TEXTURE_BINDING_CUBE_MAP',
    34069: 'TEXTURE_CUBE_MAP_POSITIVE_X',
    34070: 'TEXTURE_CUBE_MAP_NEGATIVE_X',
    34071: 'TEXTURE_CUBE_MAP_POSITIVE_Y',
    34072: 'TEXTURE_CUBE_MAP_NEGATIVE_Y',
    34073: 'TEXTURE_CUBE_MAP_POSITIVE_Z',
    34074: 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
    34076: 'MAX_CUBE_MAP_TEXTURE_SIZE',
    34338: 'VERTEX_ATTRIB_ARRAY_ENABLED',
    34339: 'VERTEX_ATTRIB_ARRAY_SIZE',
    34340: 'VERTEX_ATTRIB_ARRAY_STRIDE',
    34341: 'VERTEX_ATTRIB_ARRAY_TYPE',
    34342: 'CURRENT_VERTEX_ATTRIB',
    34373: 'VERTEX_ATTRIB_ARRAY_POINTER',
    34466: 'NUM_COMPRESSED_TEXTURE_FORMATS',
    34467: 'COMPRESSED_TEXTURE_FORMATS',
    34660: 'BUFFER_SIZE',
    34661: 'BUFFER_USAGE',
    34816: 'STENCIL_BACK_FUNC',
    34817: 'STENCIL_BACK_FAIL',
    34818: 'STENCIL_BACK_PASS_DEPTH_FAIL',
    34819: 'STENCIL_BACK_PASS_DEPTH_PASS',
    34877: 'BLEND_EQUATION_ALPHA',
    34921: 'MAX_VERTEX_ATTRIBS',
    34922: 'VERTEX_ATTRIB_ARRAY_NORMALIZED',
    34930: 'MAX_TEXTURE_IMAGE_UNITS',
    34962: 'ARRAY_BUFFER',
    34963: 'ELEMENT_ARRAY_BUFFER',
    34964: 'ARRAY_BUFFER_BINDING',
    34965: 'ELEMENT_ARRAY_BUFFER_BINDING',
    34975: 'VERTEX_ATTRIB_ARRAY_BUFFER_BINDING',
    35040: 'STREAM_DRAW',
    35044: 'STATIC_DRAW',
    35048: 'DYNAMIC_DRAW',
    35632: 'FRAGMENT_SHADER',
    35633: 'VERTEX_SHADER',
    35660: 'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
    35661: 'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
    35663: 'SHADER_TYPE',
    35664: 'FLOAT_VEC2',
    35665: 'FLOAT_VEC3',
    35666: 'FLOAT_VEC4',
    35667: 'INT_VEC2',
    35668: 'INT_VEC3',
    35669: 'INT_VEC4',
    35670: 'BOOL',
    35671: 'BOOL_VEC2',
    35672: 'BOOL_VEC3',
    35673: 'BOOL_VEC4',
    35674: 'FLOAT_MAT2',
    35675: 'FLOAT_MAT3',
    35676: 'FLOAT_MAT4',
    35678: 'SAMPLER_2D',
    35680: 'SAMPLER_CUBE',
    35712: 'DELETE_STATUS',
    35713: 'COMPILE_STATUS',
    35714: 'LINK_STATUS',
    35715: 'VALIDATE_STATUS',
    35716: 'INFO_LOG_LENGTH',
    35717: 'ATTACHED_SHADERS',
    35718: 'ACTIVE_UNIFORMS',
    35719: 'ACTIVE_UNIFORM_MAX_LENGTH',
    35720: 'SHADER_SOURCE_LENGTH',
    35721: 'ACTIVE_ATTRIBUTES',
    35722: 'ACTIVE_ATTRIBUTE_MAX_LENGTH',
    35724: 'SHADING_LANGUAGE_VERSION',
    35725: 'CURRENT_PROGRAM',
    36003: 'STENCIL_BACK_REF',
    36004: 'STENCIL_BACK_VALUE_MASK',
    36005: 'STENCIL_BACK_WRITEMASK',
    36006: 'FRAMEBUFFER_BINDING',
    36007: 'RENDERBUFFER_BINDING',
    36048: 'FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE',
    36049: 'FRAMEBUFFER_ATTACHMENT_OBJECT_NAME',
    36050: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL',
    36051: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE',
    36053: 'FRAMEBUFFER_COMPLETE',
    36054: 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
    36055: 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
    36057: 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
    36061: 'FRAMEBUFFER_UNSUPPORTED',
    36064: 'COLOR_ATTACHMENT0',
    36096: 'DEPTH_ATTACHMENT',
    36128: 'STENCIL_ATTACHMENT',
    36160: 'FRAMEBUFFER',
    36161: 'RENDERBUFFER',
    36162: 'RENDERBUFFER_WIDTH',
    36163: 'RENDERBUFFER_HEIGHT',
    36164: 'RENDERBUFFER_INTERNAL_FORMAT',
    36168: 'STENCIL_INDEX8',
    36176: 'RENDERBUFFER_RED_SIZE',
    36177: 'RENDERBUFFER_GREEN_SIZE',
    36178: 'RENDERBUFFER_BLUE_SIZE',
    36179: 'RENDERBUFFER_ALPHA_SIZE',
    36180: 'RENDERBUFFER_DEPTH_SIZE',
    36181: 'RENDERBUFFER_STENCIL_SIZE',
    36194: 'RGB565',
    36336: 'LOW_FLOAT',
    36337: 'MEDIUM_FLOAT',
    36338: 'HIGH_FLOAT',
    36339: 'LOW_INT',
    36340: 'MEDIUM_INT',
    36341: 'HIGH_INT',
    36346: 'SHADER_COMPILER',
    36347: 'MAX_VERTEX_UNIFORM_VECTORS',
    36348: 'MAX_VARYING_VECTORS',
    36349: 'MAX_FRAGMENT_UNIFORM_VECTORS',
    37440: 'UNPACK_FLIP_Y_WEBGL',
    37441: 'UNPACK_PREMULTIPLY_ALPHA_WEBGL',
    37442: 'CONTEXT_LOST_WEBGL',
    37443: 'UNPACK_COLORSPACE_CONVERSION_WEBGL',
    37444: 'BROWSER_DEFAULT_WEBGL'
  }
  });

  var numbers$1 = interopDefault(numbers);


  var require$$0$10 = Object.freeze({
    default: numbers$1
  });

  var lookup = createCommonjsModule(function (module) {
  var gl10 = interopDefault(require$$0$10)

  module.exports = function lookupConstant (number) {
    return gl10[number]
  }
  });

  var lookup$1 = interopDefault(lookup);


  var require$$2$3 = Object.freeze({
    default: lookup$1
  });

  var literals = createCommonjsModule(function (module) {
  module.exports = [
    // current
      'precision'
    , 'highp'
    , 'mediump'
    , 'lowp'
    , 'attribute'
    , 'const'
    , 'uniform'
    , 'varying'
    , 'break'
    , 'continue'
    , 'do'
    , 'for'
    , 'while'
    , 'if'
    , 'else'
    , 'in'
    , 'out'
    , 'inout'
    , 'float'
    , 'int'
    , 'void'
    , 'bool'
    , 'true'
    , 'false'
    , 'discard'
    , 'return'
    , 'mat2'
    , 'mat3'
    , 'mat4'
    , 'vec2'
    , 'vec3'
    , 'vec4'
    , 'ivec2'
    , 'ivec3'
    , 'ivec4'
    , 'bvec2'
    , 'bvec3'
    , 'bvec4'
    , 'sampler1D'
    , 'sampler2D'
    , 'sampler3D'
    , 'samplerCube'
    , 'sampler1DShadow'
    , 'sampler2DShadow'
    , 'struct'

    // future
    , 'asm'
    , 'class'
    , 'union'
    , 'enum'
    , 'typedef'
    , 'template'
    , 'this'
    , 'packed'
    , 'goto'
    , 'switch'
    , 'default'
    , 'inline'
    , 'noinline'
    , 'volatile'
    , 'public'
    , 'static'
    , 'extern'
    , 'external'
    , 'interface'
    , 'long'
    , 'short'
    , 'double'
    , 'half'
    , 'fixed'
    , 'unsigned'
    , 'input'
    , 'output'
    , 'hvec2'
    , 'hvec3'
    , 'hvec4'
    , 'dvec2'
    , 'dvec3'
    , 'dvec4'
    , 'fvec2'
    , 'fvec3'
    , 'fvec4'
    , 'sampler2DRect'
    , 'sampler3DRect'
    , 'sampler2DRectShadow'
    , 'sizeof'
    , 'cast'
    , 'namespace'
    , 'using'
  ]
  });

  var literals$1 = interopDefault(literals);


  var require$$0$12 = Object.freeze({
    default: literals$1
  });

  var operators = createCommonjsModule(function (module) {
  module.exports = [
      '<<='
    , '>>='
    , '++'
    , '--'
    , '<<'
    , '>>'
    , '<='
    , '>='
    , '=='
    , '!='
    , '&&'
    , '||'
    , '+='
    , '-='
    , '*='
    , '/='
    , '%='
    , '&='
    , '^^'
    , '^='
    , '|='
    , '('
    , ')'
    , '['
    , ']'
    , '.'
    , '!'
    , '~'
    , '*'
    , '/'
    , '%'
    , '+'
    , '-'
    , '<'
    , '>'
    , '&'
    , '^'
    , '|'
    , '?'
    , ':'
    , '='
    , ','
    , ';'
    , '{'
    , '}'
  ]
  });

  var operators$1 = interopDefault(operators);


  var require$$3$1 = Object.freeze({
    default: operators$1
  });

  var builtins = createCommonjsModule(function (module) {
  module.exports = [
    // Keep this list sorted
    'abs'
    , 'acos'
    , 'all'
    , 'any'
    , 'asin'
    , 'atan'
    , 'ceil'
    , 'clamp'
    , 'cos'
    , 'cross'
    , 'dFdx'
    , 'dFdy'
    , 'degrees'
    , 'distance'
    , 'dot'
    , 'equal'
    , 'exp'
    , 'exp2'
    , 'faceforward'
    , 'floor'
    , 'fract'
    , 'gl_BackColor'
    , 'gl_BackLightModelProduct'
    , 'gl_BackLightProduct'
    , 'gl_BackMaterial'
    , 'gl_BackSecondaryColor'
    , 'gl_ClipPlane'
    , 'gl_ClipVertex'
    , 'gl_Color'
    , 'gl_DepthRange'
    , 'gl_DepthRangeParameters'
    , 'gl_EyePlaneQ'
    , 'gl_EyePlaneR'
    , 'gl_EyePlaneS'
    , 'gl_EyePlaneT'
    , 'gl_Fog'
    , 'gl_FogCoord'
    , 'gl_FogFragCoord'
    , 'gl_FogParameters'
    , 'gl_FragColor'
    , 'gl_FragCoord'
    , 'gl_FragData'
    , 'gl_FragDepth'
    , 'gl_FragDepthEXT'
    , 'gl_FrontColor'
    , 'gl_FrontFacing'
    , 'gl_FrontLightModelProduct'
    , 'gl_FrontLightProduct'
    , 'gl_FrontMaterial'
    , 'gl_FrontSecondaryColor'
    , 'gl_LightModel'
    , 'gl_LightModelParameters'
    , 'gl_LightModelProducts'
    , 'gl_LightProducts'
    , 'gl_LightSource'
    , 'gl_LightSourceParameters'
    , 'gl_MaterialParameters'
    , 'gl_MaxClipPlanes'
    , 'gl_MaxCombinedTextureImageUnits'
    , 'gl_MaxDrawBuffers'
    , 'gl_MaxFragmentUniformComponents'
    , 'gl_MaxLights'
    , 'gl_MaxTextureCoords'
    , 'gl_MaxTextureImageUnits'
    , 'gl_MaxTextureUnits'
    , 'gl_MaxVaryingFloats'
    , 'gl_MaxVertexAttribs'
    , 'gl_MaxVertexTextureImageUnits'
    , 'gl_MaxVertexUniformComponents'
    , 'gl_ModelViewMatrix'
    , 'gl_ModelViewMatrixInverse'
    , 'gl_ModelViewMatrixInverseTranspose'
    , 'gl_ModelViewMatrixTranspose'
    , 'gl_ModelViewProjectionMatrix'
    , 'gl_ModelViewProjectionMatrixInverse'
    , 'gl_ModelViewProjectionMatrixInverseTranspose'
    , 'gl_ModelViewProjectionMatrixTranspose'
    , 'gl_MultiTexCoord0'
    , 'gl_MultiTexCoord1'
    , 'gl_MultiTexCoord2'
    , 'gl_MultiTexCoord3'
    , 'gl_MultiTexCoord4'
    , 'gl_MultiTexCoord5'
    , 'gl_MultiTexCoord6'
    , 'gl_MultiTexCoord7'
    , 'gl_Normal'
    , 'gl_NormalMatrix'
    , 'gl_NormalScale'
    , 'gl_ObjectPlaneQ'
    , 'gl_ObjectPlaneR'
    , 'gl_ObjectPlaneS'
    , 'gl_ObjectPlaneT'
    , 'gl_Point'
    , 'gl_PointCoord'
    , 'gl_PointParameters'
    , 'gl_PointSize'
    , 'gl_Position'
    , 'gl_ProjectionMatrix'
    , 'gl_ProjectionMatrixInverse'
    , 'gl_ProjectionMatrixInverseTranspose'
    , 'gl_ProjectionMatrixTranspose'
    , 'gl_SecondaryColor'
    , 'gl_TexCoord'
    , 'gl_TextureEnvColor'
    , 'gl_TextureMatrix'
    , 'gl_TextureMatrixInverse'
    , 'gl_TextureMatrixInverseTranspose'
    , 'gl_TextureMatrixTranspose'
    , 'gl_Vertex'
    , 'greaterThan'
    , 'greaterThanEqual'
    , 'inversesqrt'
    , 'length'
    , 'lessThan'
    , 'lessThanEqual'
    , 'log'
    , 'log2'
    , 'matrixCompMult'
    , 'max'
    , 'min'
    , 'mix'
    , 'mod'
    , 'normalize'
    , 'not'
    , 'notEqual'
    , 'pow'
    , 'radians'
    , 'reflect'
    , 'refract'
    , 'sign'
    , 'sin'
    , 'smoothstep'
    , 'sqrt'
    , 'step'
    , 'tan'
    , 'texture2D'
    , 'texture2DLod'
    , 'texture2DProj'
    , 'texture2DProjLod'
    , 'textureCube'
    , 'textureCubeLod'
    , 'texture2DLodEXT'
    , 'texture2DProjLodEXT'
    , 'textureCubeLodEXT'
    , 'texture2DGradEXT'
    , 'texture2DProjGradEXT'
    , 'textureCubeGradEXT'
  ]
  });

  var builtins$1 = interopDefault(builtins);


  var require$$0$13 = Object.freeze({
    default: builtins$1
  });

  var literals300es = createCommonjsModule(function (module) {
  var v100 = interopDefault(require$$0$12)

  module.exports = v100.slice().concat([
     'layout'
    , 'centroid'
    , 'smooth'
    , 'case'
    , 'mat2x2'
    , 'mat2x3'
    , 'mat2x4'
    , 'mat3x2'
    , 'mat3x3'
    , 'mat3x4'
    , 'mat4x2'
    , 'mat4x3'
    , 'mat4x4'
    , 'uint'
    , 'uvec2'
    , 'uvec3'
    , 'uvec4'
    , 'samplerCubeShadow'
    , 'sampler2DArray'
    , 'sampler2DArrayShadow'
    , 'isampler2D'
    , 'isampler3D'
    , 'isamplerCube'
    , 'isampler2DArray'
    , 'usampler2D'
    , 'usampler3D'
    , 'usamplerCube'
    , 'usampler2DArray'
    , 'coherent'
    , 'restrict'
    , 'readonly'
    , 'writeonly'
    , 'resource'
    , 'atomic_uint'
    , 'noperspective'
    , 'patch'
    , 'sample'
    , 'subroutine'
    , 'common'
    , 'partition'
    , 'active'
    , 'filter'
    , 'image1D'
    , 'image2D'
    , 'image3D'
    , 'imageCube'
    , 'iimage1D'
    , 'iimage2D'
    , 'iimage3D'
    , 'iimageCube'
    , 'uimage1D'
    , 'uimage2D'
    , 'uimage3D'
    , 'uimageCube'
    , 'image1DArray'
    , 'image2DArray'
    , 'iimage1DArray'
    , 'iimage2DArray'
    , 'uimage1DArray'
    , 'uimage2DArray'
    , 'image1DShadow'
    , 'image2DShadow'
    , 'image1DArrayShadow'
    , 'image2DArrayShadow'
    , 'imageBuffer'
    , 'iimageBuffer'
    , 'uimageBuffer'
    , 'sampler1DArray'
    , 'sampler1DArrayShadow'
    , 'isampler1D'
    , 'isampler1DArray'
    , 'usampler1D'
    , 'usampler1DArray'
    , 'isampler2DRect'
    , 'usampler2DRect'
    , 'samplerBuffer'
    , 'isamplerBuffer'
    , 'usamplerBuffer'
    , 'sampler2DMS'
    , 'isampler2DMS'
    , 'usampler2DMS'
    , 'sampler2DMSArray'
    , 'isampler2DMSArray'
    , 'usampler2DMSArray'
  ])
  });

  var literals300es$1 = interopDefault(literals300es);


  var require$$1$9 = Object.freeze({
    default: literals300es$1
  });

  var builtins300es = createCommonjsModule(function (module) {
  // 300es builtins/reserved words that were previously valid in v100
  var v100 = interopDefault(require$$0$13)

  // The texture2D|Cube functions have been removed
  // And the gl_ features are updated
  v100 = v100.slice().filter(function (b) {
    return !/^(gl\_|texture)/.test(b)
  })

  module.exports = v100.concat([
    // the updated gl_ constants
      'gl_VertexID'
    , 'gl_InstanceID'
    , 'gl_Position'
    , 'gl_PointSize'
    , 'gl_FragCoord'
    , 'gl_FrontFacing'
    , 'gl_FragDepth'
    , 'gl_PointCoord'
    , 'gl_MaxVertexAttribs'
    , 'gl_MaxVertexUniformVectors'
    , 'gl_MaxVertexOutputVectors'
    , 'gl_MaxFragmentInputVectors'
    , 'gl_MaxVertexTextureImageUnits'
    , 'gl_MaxCombinedTextureImageUnits'
    , 'gl_MaxTextureImageUnits'
    , 'gl_MaxFragmentUniformVectors'
    , 'gl_MaxDrawBuffers'
    , 'gl_MinProgramTexelOffset'
    , 'gl_MaxProgramTexelOffset'
    , 'gl_DepthRangeParameters'
    , 'gl_DepthRange'

    // other builtins
    , 'trunc'
    , 'round'
    , 'roundEven'
    , 'isnan'
    , 'isinf'
    , 'floatBitsToInt'
    , 'floatBitsToUint'
    , 'intBitsToFloat'
    , 'uintBitsToFloat'
    , 'packSnorm2x16'
    , 'unpackSnorm2x16'
    , 'packUnorm2x16'
    , 'unpackUnorm2x16'
    , 'packHalf2x16'
    , 'unpackHalf2x16'
    , 'outerProduct'
    , 'transpose'
    , 'determinant'
    , 'inverse'
    , 'texture'
    , 'textureSize'
    , 'textureProj'
    , 'textureLod'
    , 'textureOffset'
    , 'texelFetch'
    , 'texelFetchOffset'
    , 'textureProjOffset'
    , 'textureLodOffset'
    , 'textureProjLod'
    , 'textureProjLodOffset'
    , 'textureGrad'
    , 'textureGradOffset'
    , 'textureProjGrad'
    , 'textureProjGradOffset'
  ])
  });

  var builtins300es$1 = interopDefault(builtins300es);


  var require$$0$14 = Object.freeze({
    default: builtins300es$1
  });

  var index$8 = createCommonjsModule(function (module) {
  module.exports = tokenize

  var literals100 = interopDefault(require$$0$12)
    , operators = interopDefault(require$$3$1)
    , builtins100 = interopDefault(require$$0$13)
    , literals300es = interopDefault(require$$1$9)
    , builtins300es = interopDefault(require$$0$14)

  var NORMAL = 999          // <-- never emitted
    , TOKEN = 9999          // <-- never emitted
    , BLOCK_COMMENT = 0
    , LINE_COMMENT = 1
    , PREPROCESSOR = 2
    , OPERATOR = 3
    , INTEGER = 4
    , FLOAT = 5
    , IDENT = 6
    , BUILTIN = 7
    , KEYWORD = 8
    , WHITESPACE = 9
    , EOF = 10
    , HEX = 11

  var map = [
      'block-comment'
    , 'line-comment'
    , 'preprocessor'
    , 'operator'
    , 'integer'
    , 'float'
    , 'ident'
    , 'builtin'
    , 'keyword'
    , 'whitespace'
    , 'eof'
    , 'integer'
  ]

  function tokenize(opt) {
    var i = 0
      , total = 0
      , mode = NORMAL
      , c
      , last
      , content = []
      , tokens = []
      , token_idx = 0
      , token_offs = 0
      , line = 1
      , col = 0
      , start = 0
      , isnum = false
      , isoperator = false
      , input = ''
      , len

    opt = opt || {}
    var allBuiltins = builtins100
    var allLiterals = literals100
    if (opt.version === '300 es') {
      allBuiltins = builtins300es
      allLiterals = literals300es
    }

    return function(data) {
      tokens = []
      if (data !== null) return write(data.replace ? data.replace(/\r\n/g, '\n') : data)
      return end()
    }

    function token(data) {
      if (data.length) {
        tokens.push({
          type: map[mode]
        , data: data
        , position: start
        , line: line
        , column: col
        })
      }
    }

    function write(chunk) {
      i = 0
      input += chunk
      len = input.length

      var last

      while(c = input[i], i < len) {
        last = i

        switch(mode) {
          case BLOCK_COMMENT: i = block_comment(); break
          case LINE_COMMENT: i = line_comment(); break
          case PREPROCESSOR: i = preprocessor(); break
          case OPERATOR: i = operator(); break
          case INTEGER: i = integer(); break
          case HEX: i = hex(); break
          case FLOAT: i = decimal(); break
          case TOKEN: i = readtoken(); break
          case WHITESPACE: i = whitespace(); break
          case NORMAL: i = normal(); break
        }

        if(last !== i) {
          switch(input[last]) {
            case '\n': col = 0; ++line; break
            default: ++col; break
          }
        }
      }

      total += i
      input = input.slice(i)
      return tokens
    }

    function end(chunk) {
      if(content.length) {
        token(content.join(''))
      }

      mode = EOF
      token('(eof)')
      return tokens
    }

    function normal() {
      content = content.length ? [] : content

      if(last === '/' && c === '*') {
        start = total + i - 1
        mode = BLOCK_COMMENT
        last = c
        return i + 1
      }

      if(last === '/' && c === '/') {
        start = total + i - 1
        mode = LINE_COMMENT
        last = c
        return i + 1
      }

      if(c === '#') {
        mode = PREPROCESSOR
        start = total + i
        return i
      }

      if(/\s/.test(c)) {
        mode = WHITESPACE
        start = total + i
        return i
      }

      isnum = /\d/.test(c)
      isoperator = /[^\w_]/.test(c)

      start = total + i
      mode = isnum ? INTEGER : isoperator ? OPERATOR : TOKEN
      return i
    }

    function whitespace() {
      if(/[^\s]/g.test(c)) {
        token(content.join(''))
        mode = NORMAL
        return i
      }
      content.push(c)
      last = c
      return i + 1
    }

    function preprocessor() {
      if((c === '\r' || c === '\n') && last !== '\\') {
        token(content.join(''))
        mode = NORMAL
        return i
      }
      content.push(c)
      last = c
      return i + 1
    }

    function line_comment() {
      return preprocessor()
    }

    function block_comment() {
      if(c === '/' && last === '*') {
        content.push(c)
        token(content.join(''))
        mode = NORMAL
        return i + 1
      }

      content.push(c)
      last = c
      return i + 1
    }

    function operator() {
      if(last === '.' && /\d/.test(c)) {
        mode = FLOAT
        return i
      }

      if(last === '/' && c === '*') {
        mode = BLOCK_COMMENT
        return i
      }

      if(last === '/' && c === '/') {
        mode = LINE_COMMENT
        return i
      }

      if(c === '.' && content.length) {
        while(determine_operator(content));

        mode = FLOAT
        return i
      }

      if(c === ';' || c === ')' || c === '(') {
        if(content.length) while(determine_operator(content));
        token(c)
        mode = NORMAL
        return i + 1
      }

      var is_composite_operator = content.length === 2 && c !== '='
      if(/[\w_\d\s]/.test(c) || is_composite_operator) {
        while(determine_operator(content));
        mode = NORMAL
        return i
      }

      content.push(c)
      last = c
      return i + 1
    }

    function determine_operator(buf) {
      var j = 0
        , idx
        , res

      do {
        idx = operators.indexOf(buf.slice(0, buf.length + j).join(''))
        res = operators[idx]

        if(idx === -1) {
          if(j-- + buf.length > 0) continue
          res = buf.slice(0, 1).join('')
        }

        token(res)

        start += res.length
        content = content.slice(res.length)
        return content.length
      } while(1)
    }

    function hex() {
      if(/[^a-fA-F0-9]/.test(c)) {
        token(content.join(''))
        mode = NORMAL
        return i
      }

      content.push(c)
      last = c
      return i + 1
    }

    function integer() {
      if(c === '.') {
        content.push(c)
        mode = FLOAT
        last = c
        return i + 1
      }

      if(/[eE]/.test(c)) {
        content.push(c)
        mode = FLOAT
        last = c
        return i + 1
      }

      if(c === 'x' && content.length === 1 && content[0] === '0') {
        mode = HEX
        content.push(c)
        last = c
        return i + 1
      }

      if(/[^\d]/.test(c)) {
        token(content.join(''))
        mode = NORMAL
        return i
      }

      content.push(c)
      last = c
      return i + 1
    }

    function decimal() {
      if(c === 'f') {
        content.push(c)
        last = c
        i += 1
      }

      if(/[eE]/.test(c)) {
        content.push(c)
        last = c
        return i + 1
      }

      if (c === '-' && /[eE]/.test(last)) {
        content.push(c)
        last = c
        return i + 1
      }

      if(/[^\d]/.test(c)) {
        token(content.join(''))
        mode = NORMAL
        return i
      }

      content.push(c)
      last = c
      return i + 1
    }

    function readtoken() {
      if(/[^\d\w_]/.test(c)) {
        var contentstr = content.join('')
        if(allLiterals.indexOf(contentstr) > -1) {
          mode = KEYWORD
        } else if(allBuiltins.indexOf(contentstr) > -1) {
          mode = BUILTIN
        } else {
          mode = IDENT
        }
        token(content.join(''))
        mode = NORMAL
        return i
      }
      content.push(c)
      last = c
      return i + 1
    }
  }
  });

  var index$9 = interopDefault(index$8);


  var require$$0$11 = Object.freeze({
    default: index$9
  });

  var string = createCommonjsModule(function (module) {
  var tokenize = interopDefault(require$$0$11)

  module.exports = tokenizeString

  function tokenizeString(str, opt) {
    var generator = tokenize(opt)
    var tokens = []

    tokens = tokens.concat(generator(str))
    tokens = tokens.concat(generator(null))

    return tokens
  }
  });

  var string$1 = interopDefault(string);


  var require$$1$8 = Object.freeze({
    default: string$1
  });

  var atobBrowser = createCommonjsModule(function (module) {
  module.exports = function _atob(str) {
    return atob(str)
  }
  });

  var atobBrowser$1 = interopDefault(atobBrowser);


  var require$$0$15 = Object.freeze({
    default: atobBrowser$1
  });

  var index$6 = createCommonjsModule(function (module) {
  var tokenize = interopDefault(require$$1$8)
  var atob     = interopDefault(require$$0$15)

  module.exports = getName

  function getName(src) {
    var tokens = Array.isArray(src)
      ? src
      : tokenize(src)

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]
      if (token.type !== 'preprocessor') continue
      var match = token.data.match(/\#define\s+SHADER_NAME(_B64)?\s+(.+)$/)
      if (!match) continue
      if (!match[2]) continue

      var b64  = match[1]
      var name = match[2]

      return (b64 ? atob(name) : name).trim()
    }
  }
  });

  var index$7 = interopDefault(index$6);


  var require$$1$7 = Object.freeze({
    default: index$7
  });

  var index$14 = createCommonjsModule(function (module) {
  /*!
   * repeat-string <https://github.com/jonschlinkert/repeat-string>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT License.
   */

  'use strict';

  /**
   * Results cache
   */

  var res = '';
  var cache;

  /**
   * Expose `repeat`
   */

  module.exports = repeat;

  /**
   * Repeat the given `string` the specified `number`
   * of times.
   *
   * **Example:**
   *
   * ```js
   * var repeat = require('repeat-string');
   * repeat('A', 5);
   * //=> AAAAA
   * ```
   *
   * @param {String} `string` The string to repeat
   * @param {Number} `number` The number of times to repeat the string
   * @return {String} Repeated string
   * @api public
   */

  function repeat(str, num) {
    if (typeof str !== 'string') {
      throw new TypeError('repeat-string expects a string.');
    }

    // cover common, quick use cases
    if (num === 1) return str;
    if (num === 2) return str + str;

    var max = str.length * num;
    if (cache !== str || typeof cache === 'undefined') {
      cache = str;
      res = '';
    }

    while (max > res.length && num > 0) {
      if (num & 1) {
        res += str;
      }

      num >>= 1;
      if (!num) break;
      str += str;
    }

    return res.substr(0, max);
  }
  });

  var index$15 = interopDefault(index$14);


  var require$$0$18 = Object.freeze({
    default: index$15
  });

  var index$12 = createCommonjsModule(function (module) {
  /*!
   * pad-left <https://github.com/jonschlinkert/pad-left>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT license.
   */

  'use strict';

  var repeat = interopDefault(require$$0$18);

  module.exports = function padLeft(str, num, ch) {
    ch = typeof ch !== 'undefined' ? (ch + '') : ' ';
    return repeat(ch, num) + str;
  };
  });

  var index$13 = interopDefault(index$12);


  var require$$0$17 = Object.freeze({
    default: index$13
  });

  var index$10 = createCommonjsModule(function (module) {
  var padLeft = interopDefault(require$$0$17)

  module.exports = addLineNumbers
  function addLineNumbers (string, start, delim) {
    start = typeof start === 'number' ? start : 1
    delim = delim || ': '

    var lines = string.split(/\r?\n/)
    var totalDigits = String(lines.length + start - 1).length
    return lines.map(function (line, i) {
      var c = i + start
      var digits = String(c).length
      var prefix = padLeft(c, totalDigits - digits)
      return prefix + delim + line
    }).join('\n')
  }
  });

  var index$11 = interopDefault(index$10);


  var require$$0$16 = Object.freeze({
    default: index$11
  });

  var index$4 = createCommonjsModule(function (module) {
  var sprintf = interopDefault(require$$3).sprintf;
  var glConstants = interopDefault(require$$2$3);
  var shaderName = interopDefault(require$$1$7);
  var addLineNumbers = interopDefault(require$$0$16);

  module.exports = formatCompilerError;

  function formatCompilerError(errLog, src, type) {
      "use strict";

      var name = shaderName(src) || 'of unknown name (see npm glsl-shader-name)';

      var typeName = 'unknown type';
      if (type !== undefined) {
          typeName = type === glConstants.FRAGMENT_SHADER ? 'fragment' : 'vertex'
      }

      var longForm = sprintf('Error compiling %s shader %s:\n', typeName, name);
      var shortForm = sprintf("%s%s", longForm, errLog);

      var errorStrings = errLog.split('\n');
      var errors = {};

      for (var i = 0; i < errorStrings.length; i++) {
          var errorString = errorStrings[i];
          if (errorString === '') continue;
          var lineNo = parseInt(errorString.split(':')[2]);
          if (isNaN(lineNo)) {
              throw new Error(sprintf('Could not parse error: %s', errorString));
          }
          errors[lineNo] = errorString;
      }

      var lines = addLineNumbers(src).split('\n');

      for (var i = 0; i < lines.length; i++) {
          if (!errors[i+3] && !errors[i+2] && !errors[i+1]) continue;
          var line = lines[i];
          longForm += line + '\n';
          if (errors[i+1]) {
              var e = errors[i+1];
              e = e.substr(e.split(':', 3).join(':').length + 1).trim();
              longForm += sprintf('^^^ %s\n\n', e);
          }
      }

      return {
          long: longForm.trim(),
          short: shortForm.trim()
      };
  }
  });

  var index$5 = interopDefault(index$4);


  var require$$1$6 = Object.freeze({
      default: index$5
  });

  var hiddenStore = createCommonjsModule(function (module) {
  module.exports = hiddenStore;

  function hiddenStore(obj, key) {
      var store = { identity: key };
      var valueOf = obj.valueOf;

      Object.defineProperty(obj, "valueOf", {
          value: function (value) {
              return value !== key ?
                  valueOf.apply(this, arguments) : store;
          },
          writable: true
      });

      return store;
  }
  });

  var hiddenStore$1 = interopDefault(hiddenStore);


  var require$$0$21 = Object.freeze({
      default: hiddenStore$1
  });

  var createStore = createCommonjsModule(function (module) {
  var hiddenStore = interopDefault(require$$0$21);

  module.exports = createStore;

  function createStore() {
      var key = {};

      return function (obj) {
          if ((typeof obj !== 'object' || obj === null) &&
              typeof obj !== 'function'
          ) {
              throw new Error('Weakmap-shim: Key must be object')
          }

          var store = obj.valueOf(key);
          return store && store.identity === key ?
              store : hiddenStore(obj, key);
      };
  }
  });

  var createStore$1 = interopDefault(createStore);


  var require$$0$20 = Object.freeze({
      default: createStore$1
  });

  var index$16 = createCommonjsModule(function (module) {
  // Original - @Gozola. 
  // https://gist.github.com/Gozala/1269991
  // This is a reimplemented version (with a few bug fixes).

  var createStore = interopDefault(require$$0$20);

  module.exports = weakMap;

  function weakMap() {
      var privates = createStore();

      return {
          'get': function (key, fallback) {
              var store = privates(key)
              return store.hasOwnProperty('value') ?
                  store.value : fallback
          },
          'set': function (key, value) {
              privates(key).value = value;
          },
          'has': function(key) {
              return 'value' in privates(key);
          },
          'delete': function (key) {
              return delete privates(key).value;
          }
      }
  }
  });

  var index$17 = interopDefault(index$16);


  var require$$0$19 = Object.freeze({
      default: index$17
  });

  var shaderCache = createCommonjsModule(function (module, exports) {
  'use strict'

  exports.shader   = getShaderReference
  exports.program  = createProgram

  var GLError = interopDefault(require$$2$1)
  var formatCompilerError = interopDefault(require$$1$6);

  var weakMap = typeof WeakMap === 'undefined' ? interopDefault(require$$0$19) : WeakMap
  var CACHE = new weakMap()

  var SHADER_COUNTER = 0

  function ShaderReference(id, src, type, shader, programs, count, cache) {
    this.id       = id
    this.src      = src
    this.type     = type
    this.shader   = shader
    this.count    = count
    this.programs = []
    this.cache    = cache
  }

  ShaderReference.prototype.dispose = function() {
    if(--this.count === 0) {
      var cache    = this.cache
      var gl       = cache.gl

      //Remove program references
      var programs = this.programs
      for(var i=0, n=programs.length; i<n; ++i) {
        var p = cache.programs[programs[i]]
        if(p) {
          delete cache.programs[i]
          gl.deleteProgram(p)
        }
      }

      //Remove shader reference
      gl.deleteShader(this.shader)
      delete cache.shaders[(this.type === gl.FRAGMENT_SHADER)|0][this.src]
    }
  }

  function ContextCache(gl) {
    this.gl       = gl
    this.shaders  = [{}, {}]
    this.programs = {}
  }

  var proto = ContextCache.prototype

  function compileShader(gl, type, src) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var errLog = gl.getShaderInfoLog(shader)
      try {
          var fmt = formatCompilerError(errLog, src, type);
      } catch (e){
          console.warn('Failed to format compiler error: ' + e);
          throw new GLError(errLog, 'Error compiling shader:\n' + errLog)
      }
      throw new GLError(errLog, fmt.short, fmt.long)
    }
    return shader
  }

  proto.getShaderReference = function(type, src) {
    var gl      = this.gl
    var shaders = this.shaders[(type === gl.FRAGMENT_SHADER)|0]
    var shader  = shaders[src]
    if(!shader || !gl.isShader(shader.shader)) {
      var shaderObj = compileShader(gl, type, src)
      shader = shaders[src] = new ShaderReference(
        SHADER_COUNTER++,
        src,
        type,
        shaderObj,
        [],
        1,
        this)
    } else {
      shader.count += 1
    }
    return shader
  }

  function linkProgram(gl, vshader, fshader, attribs, locations) {
    var program = gl.createProgram()
    gl.attachShader(program, vshader)
    gl.attachShader(program, fshader)
    for(var i=0; i<attribs.length; ++i) {
      gl.bindAttribLocation(program, locations[i], attribs[i])
    }
    gl.linkProgram(program)
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var errLog = gl.getProgramInfoLog(program)
      throw new GLError(errLog, 'Error linking program: ' + errLog)
    }
    return program
  }

  proto.getProgram = function(vref, fref, attribs, locations) {
    var token = [vref.id, fref.id, attribs.join(':'), locations.join(':')].join('@')
    var prog  = this.programs[token]
    if(!prog || !this.gl.isProgram(prog)) {
      this.programs[token] = prog = linkProgram(
        this.gl,
        vref.shader,
        fref.shader,
        attribs,
        locations)
      vref.programs.push(token)
      fref.programs.push(token)
    }
    return prog
  }

  function getCache(gl) {
    var ctxCache = CACHE.get(gl)
    if(!ctxCache) {
      ctxCache = new ContextCache(gl)
      CACHE.set(gl, ctxCache)
    }
    return ctxCache
  }

  function getShaderReference(gl, type, src) {
    return getCache(gl).getShaderReference(type, src)
  }

  function createProgram(gl, vref, fref, attribs, locations) {
    return getCache(gl).getProgram(vref, fref, attribs, locations)
  }
  });

  var shaderCache$1 = interopDefault(shaderCache);
  var program = shaderCache.program;
  var shader = shaderCache.shader;

var require$$2$2 = Object.freeze({
    default: shaderCache$1,
    program: program,
    shader: shader
  });

  var runtimeReflect = createCommonjsModule(function (module, exports) {
  'use strict'

  exports.uniforms    = runtimeUniforms
  exports.attributes  = runtimeAttributes

  var GL_TO_GLSL_TYPES = {
    'FLOAT':       'float',
    'FLOAT_VEC2':  'vec2',
    'FLOAT_VEC3':  'vec3',
    'FLOAT_VEC4':  'vec4',
    'INT':         'int',
    'INT_VEC2':    'ivec2',
    'INT_VEC3':    'ivec3',
    'INT_VEC4':    'ivec4',
    'BOOL':        'bool',
    'BOOL_VEC2':   'bvec2',
    'BOOL_VEC3':   'bvec3',
    'BOOL_VEC4':   'bvec4',
    'FLOAT_MAT2':  'mat2',
    'FLOAT_MAT3':  'mat3',
    'FLOAT_MAT4':  'mat4',
    'SAMPLER_2D':  'sampler2D',
    'SAMPLER_CUBE':'samplerCube'
  }

  var GL_TABLE = null

  function getType(gl, type) {
    if(!GL_TABLE) {
      var typeNames = Object.keys(GL_TO_GLSL_TYPES)
      GL_TABLE = {}
      for(var i=0; i<typeNames.length; ++i) {
        var tn = typeNames[i]
        GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn]
      }
    }
    return GL_TABLE[type]
  }

  function runtimeUniforms(gl, program) {
    var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    var result = []
    for(var i=0; i<numUniforms; ++i) {
      var info = gl.getActiveUniform(program, i)
      if(info) {
        var type = getType(gl, info.type)
        if(info.size > 1) {
          for(var j=0; j<info.size; ++j) {
            result.push({
              name: info.name.replace('[0]', '[' + j + ']'),
              type: type
            })
          }
        } else {
          result.push({
            name: info.name,
            type: type
          })
        }
      }
    }
    return result
  }

  function runtimeAttributes(gl, program) {
    var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
    var result = []
    for(var i=0; i<numAttributes; ++i) {
      var info = gl.getActiveAttrib(program, i)
      if(info) {
        result.push({
          name: info.name,
          type: getType(gl, info.type)
        })
      }
    }
    return result
  }
  });

  var runtimeReflect$1 = interopDefault(runtimeReflect);
  var attributes = runtimeReflect.attributes;
  var uniforms = runtimeReflect.uniforms;

var require$$1$10 = Object.freeze({
    default: runtimeReflect$1,
    attributes: attributes,
    uniforms: uniforms
  });

  var index$3 = createCommonjsModule(function (module) {
  'use strict'

  var createUniformWrapper   = interopDefault(require$$5)
  var createAttributeWrapper = interopDefault(require$$4)
  var makeReflect            = interopDefault(require$$1$5)
  var shaderCache            = interopDefault(require$$2$2)
  var runtime                = interopDefault(require$$1$10)
  var GLError                = interopDefault(require$$2$1)

  //Shader object
  function Shader(gl) {
    this.gl         = gl

    //Default initialize these to null
    this._vref      =
    this._fref      =
    this._relink    =
    this.vertShader =
    this.fragShader =
    this.program    =
    this.attributes =
    this.uniforms   =
    this.types      = null
  }

  var proto = Shader.prototype

  proto.bind = function() {
    if(!this.program) {
      this._relink()
    }
    this.gl.useProgram(this.program)
  }

  proto.dispose = function() {
    if(this._fref) {
      this._fref.dispose()
    }
    if(this._vref) {
      this._vref.dispose()
    }
    this.attributes =
    this.types      =
    this.vertShader =
    this.fragShader =
    this.program    =
    this._relink    =
    this._fref      =
    this._vref      = null
  }

  function compareAttributes(a, b) {
    if(a.name < b.name) {
      return -1
    }
    return 1
  }

  //Update export hook for glslify-live
  proto.update = function(
      vertSource
    , fragSource
    , uniforms
    , attributes) {

    //If only one object passed, assume glslify style output
    if(!fragSource || arguments.length === 1) {
      var obj = vertSource
      vertSource = obj.vertex
      fragSource = obj.fragment
      uniforms   = obj.uniforms
      attributes = obj.attributes
    }

    var wrapper = this
    var gl      = wrapper.gl

    //Compile vertex and fragment shaders
    var pvref = wrapper._vref
    wrapper._vref = shaderCache.shader(gl, gl.VERTEX_SHADER, vertSource)
    if(pvref) {
      pvref.dispose()
    }
    wrapper.vertShader = wrapper._vref.shader
    var pfref = this._fref
    wrapper._fref = shaderCache.shader(gl, gl.FRAGMENT_SHADER, fragSource)
    if(pfref) {
      pfref.dispose()
    }
    wrapper.fragShader = wrapper._fref.shader

    //If uniforms/attributes is not specified, use RT reflection
    if(!uniforms || !attributes) {

      //Create initial test program
      var testProgram = gl.createProgram()
      gl.attachShader(testProgram, wrapper.fragShader)
      gl.attachShader(testProgram, wrapper.vertShader)
      gl.linkProgram(testProgram)
      if(!gl.getProgramParameter(testProgram, gl.LINK_STATUS)) {
        var errLog = gl.getProgramInfoLog(testProgram)
        throw new GLError(errLog, 'Error linking program:' + errLog)
      }

      //Load data from runtime
      uniforms   = uniforms   || runtime.uniforms(gl, testProgram)
      attributes = attributes || runtime.attributes(gl, testProgram)

      //Release test program
      gl.deleteProgram(testProgram)
    }

    //Sort attributes lexicographically
    // overrides undefined WebGL behavior for attribute locations
    attributes = attributes.slice()
    attributes.sort(compareAttributes)

    //Convert attribute types, read out locations
    var attributeUnpacked  = []
    var attributeNames     = []
    var attributeLocations = []
    for(var i=0; i<attributes.length; ++i) {
      var attr = attributes[i]
      if(attr.type.indexOf('mat') >= 0) {
        var size = attr.type.charAt(attr.type.length-1)|0
        var locVector = new Array(size)
        for(var j=0; j<size; ++j) {
          locVector[j] = attributeLocations.length
          attributeNames.push(attr.name + '[' + j + ']')
          if(typeof attr.location === 'number') {
            attributeLocations.push(attr.location + j)
          } else if(Array.isArray(attr.location) &&
                    attr.location.length === size &&
                    typeof attr.location[j] === 'number') {
            attributeLocations.push(attr.location[j]|0)
          } else {
            attributeLocations.push(-1)
          }
        }
        attributeUnpacked.push({
          name: attr.name,
          type: attr.type,
          locations: locVector
        })
      } else {
        attributeUnpacked.push({
          name: attr.name,
          type: attr.type,
          locations: [ attributeLocations.length ]
        })
        attributeNames.push(attr.name)
        if(typeof attr.location === 'number') {
          attributeLocations.push(attr.location|0)
        } else {
          attributeLocations.push(-1)
        }
      }
    }

    //For all unspecified attributes, assign them lexicographically min attribute
    var curLocation = 0
    for(var i=0; i<attributeLocations.length; ++i) {
      if(attributeLocations[i] < 0) {
        while(attributeLocations.indexOf(curLocation) >= 0) {
          curLocation += 1
        }
        attributeLocations[i] = curLocation
      }
    }

    //Rebuild program and recompute all uniform locations
    var uniformLocations = new Array(uniforms.length)
    function relink() {
      wrapper.program = shaderCache.program(
          gl
        , wrapper._vref
        , wrapper._fref
        , attributeNames
        , attributeLocations)

      for(var i=0; i<uniforms.length; ++i) {
        uniformLocations[i] = gl.getUniformLocation(
            wrapper.program
          , uniforms[i].name)
      }
    }

    //Perform initial linking, reuse program used for reflection
    relink()

    //Save relinking procedure, defer until runtime
    wrapper._relink = relink

    //Generate type info
    wrapper.types = {
      uniforms:   makeReflect(uniforms),
      attributes: makeReflect(attributes)
    }

    //Generate attribute wrappers
    wrapper.attributes = createAttributeWrapper(
        gl
      , wrapper
      , attributeUnpacked
      , attributeLocations)

    //Generate uniform wrappers
    Object.defineProperty(wrapper, 'uniforms', createUniformWrapper(
        gl
      , wrapper
      , uniforms
      , uniformLocations))
  }

  //Compiles and links a shader program with the given attribute and vertex list
  function createShader(
      gl
    , vertSource
    , fragSource
    , uniforms
    , attributes) {

    var shader = new Shader(gl)

    shader.update(
        vertSource
      , fragSource
      , uniforms
      , attributes)

    return shader
  }

  module.exports = createShader
  });

  var createShader = interopDefault(index$3);

  var shader_v = "precision mediump float;\n\nattribute vec2 position;\nvarying vec2 uv;\n\nvoid main() {\n  uv = position;\n  gl_Position = vec4(position, 1, 1);\n}\n";

  var shader_f = "precision mediump float;\n\nvarying vec2 uv;\n\nvoid main() {\n  gl_FragColor = vec4(uv * 0.5 + 0.5, 1, 1);\n}\n";

  function plantTextureCanvas(plant, canvas = document.createElement('canvas')) {
    /* eslint no-console: [0] */
    var gl = getGL(canvas);
    if (!gl) {
      console.log('Cannot find WebGL context.');
      return;
    }

    render(gl);

    return canvas;
  }

  function getGL(canvas) {
    var gl = (
      canvas.getContext('webgl') ||
      canvas.getContext('webgl-experimental') ||
      canvas.getContext('experimental-webgl')
    );

    if (!gl) {
      console.log('Cannot find WebGL context.');
      return false;
    }
    return gl;
  }

  function render(gl) {
    // TODO: render plant
    var triangle = GLBigTriangle(gl);
    var shader = createShader(gl, shader_v, shader_f);
    shader.bind();
    triangle.bind();
    triangle.draw();

    shader.dispose();
    triangle.unbind();
  }

  var canvas = plantTextureCanvas();
  document.body.appendChild(canvas);

}());