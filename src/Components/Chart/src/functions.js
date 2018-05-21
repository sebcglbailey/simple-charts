const Functions = {

  convert: (value, min, max, height) => {
    return Functions.modulate(value, [min, max], [height, 0])
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
  }

}

export default Functions