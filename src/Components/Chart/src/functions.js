
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t + b;
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
};

const Functions = {

  convert: (value, min, max, height) => {
    return Functions.modulate(value, [min, max], [height, 0])
  },

  median: (array) => {

    let copy = array.slice(0)
    let lastIndex;

    copy.sort((a, b) => {
      return a[1] - b[1]
    })

    copy.forEach((val, index) => {
      if (val === undefined && !lastIndex) {
        lastIndex = index
      }
    })

    if (lastIndex) {
      copy.splice(lastIndex)
    }

    const half = Math.floor(copy.length / 2)

    let median;

    if (copy.length % 2) {
      median = copy[half]
    } else {
      median = (copy[half-1] + copy[half]) / 2
    }

    return median

  },

  hexToRgb: (hex, alpha) => {

     // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
      });

      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      let r = parseInt(result[1], 16);
      let g = parseInt(result[2], 16);
      let b = parseInt(result[3], 16);
      return result ? `rgba(${r}, ${g}, ${b}, ${alpha})` : null;

  },

  roundToNearest: (value, nearest) => {

    let rem = value%nearest

    if (rem < nearest/2) {
      return value - rem
    } else {
      return value + (nearest - rem)
    }

  },

  getSmallest: (array) => {
    let smallestValue = array[0]

    array.forEach((value) => {
      if (!smallestValue && smallestValue !== 0) {
        smallestValue = value
      }
      if (typeof(value) == "number" && value !== NaN && value < smallestValue) {
        smallestValue = value
      }
    })

    return smallestValue
  },

  getLargest: (array) => {
    let largestValue = array[0]

    array.forEach((value) => {
      if (!largestValue && largestValue !== 0) {
        largestValue = value
      }
      if (typeof(value) == "number" && value !== NaN && value > largestValue) {
        largestValue = value
      }
    })

    return largestValue
  },

  modulate: (value, rangeA, rangeB, limit) => {

    if (limit === null) {
      limit = false;
    }

    const [fromLow, fromHigh] = rangeA;
    const [toLow, toHigh] = rangeB;

    const result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));

    if (limit === true) {
      if (toLow < toHigh) {
        if (result < toLow) return toLow;
        if (result > toHigh) return toHigh;
      } else {
        if (result > toLow) return toLow;
        if (result < toHigh) return toHigh;
      }
    }

    return result;
  },

  scrollTo: (element, to, duration) => {
    let start = element.scrollLeft,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    let animateScroll = () => {        
        currentTime += increment;
        let val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollLeft = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
  }

}

export default Functions