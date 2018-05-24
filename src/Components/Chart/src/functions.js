
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
      if (value < smallestValue) {
        smallestValue = value
      }
    })

    return smallestValue
  },

  getLargest: (array) => {
    let largestValue = array[0]

    array.forEach((value) => {
      if (value > largestValue) {
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