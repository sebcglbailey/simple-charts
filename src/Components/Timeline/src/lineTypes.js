import Func from './functions';

const allow = 1

const Plot = {

  addClose: (string, data, min, height, xWidth, margin) => {

    let startIndex;
    data.forEach((value, index) => {
      if (value && value !== NaN && startIndex == undefined) {
        startIndex = index
      }
    })

    let canvasBottom = margin ? height + margin : height;

    let bgAdd = ` V${canvasBottom} H${startIndex * xWidth} Z`

    return string + bgAdd

  },

  start: (data, height, xWidth, margin) => {

    let started = false;

    let bottom = margin ? height + margin : height;

    let string = (data.map((value, index) => {

      if (value && value !== NaN && !started) {

        started = true
        return `M${xWidth * index},${bottom} L`

      } else if ((value || value == 0) && value !== NaN && started) {

        return `${xWidth * index},${bottom} `

      } else {
        return
      }

    }))

    string = string.join("")

    return string

  },

  straight: (data, min, max, height, xWidth, margin) => {

    let started = false;

    let string = data.map((value, index) => {

      value = Func.convert(value, min, max, height)

      if (margin) {
        value += margin
      }

      if ((value || value == 0) && value !== NaN && !started) {

        started = true
        return `M${xWidth * index},${value},${value} L`

      } else if ((value || value == 0) && value !== NaN && started) {

        return `${xWidth * index},${value} `

      } else {
        return
      }

    })
    string = string.join("")

    return string

  },

  simpleCurve: (data, min, max, height, xWidth, margin) => {
    
    let started = false;

    let string = data.map((value, index) => {

      let prevVal = index > 0 ? data[index-1] : undefined

      value = Func.convert(value, min, max, height)
      prevVal = index > 0 ? Func.convert(prevVal, min, max, height) : 0

      if (margin) {
        value += margin
        prevVal += margin
      }

      let diff, prevHandle;

      if ((value || value == 0) && value !== NaN && !started) {

        started = true;
        return `M${xWidth * index},${value},${value} S`

      } else if ((value || value == 0) && value !== NaN) {

        diff = value - prevVal
        prevHandle = value - (diff/2)

        return `${xWidth * index - xWidth/2},${prevHandle} ${xWidth * index},${value} `

      } else {
        return
      }

    })

    string = string.join("")

    return string

  },

  strictCurve: (data, min, max, height, xWidth, margin) => {

    let started = false;

    let string = data.map((value, index) => {

      let diff;

      let nextVal = index < data.length - 1 ? data[index + 1] : undefined;
      let prevVal = index > 0 ? data[index - 1] : undefined;

      value = value !== NaN ? Func.convert(value, min, max, height) : undefined;
      nextVal = value !== NaN && index < data.length - 1 ? Func.convert(nextVal, min, max, height) : undefined;
      prevVal = value !== NaN && index > 0 ? Func.convert(prevVal, min, max, height) : undefined;

      if (margin) {
        value += margin
        nextVal += margin
        prevVal += margin
      }

      if ((value || value == 0) && !started && value !== NaN) {
        started = true
        
        diff = nextVal - value
        return `M${xWidth * index},${value} C${(xWidth * index) + xWidth/2},${value + diff/2} `

      } else if (index < data.length - 1 && (value || value == 0) && value !== NaN) {

        // Getting the handles
        let x1 = index * xWidth - xWidth / 2
        let x2 = index * xWidth + xWidth / 2

        let nextDiff = nextVal - value
        let prevDiff = value - prevVal

        let y1 = value - nextDiff / 2
        let y2 = value + nextDiff / 2

        if ((prevDiff < 0 && nextDiff < 0) || (prevDiff > 0 && nextDiff > 0)) {

          let handleDiff = ((prevDiff / 2) * nextDiff - ((nextDiff / 2) * nextDiff)) / (nextDiff + prevDiff)

          y1 -= handleDiff
          y2 += handleDiff

          if ((nextVal - allow < y2) && (nextVal + allow > y2)) {
            x2 -= xWidth/4
            y2 -= (y2 - value) / 2
          }
          if ((prevVal - allow < y1) && (prevVal + allow > y1)) {
            x1 += xWidth/4
            y1 += (y1 - value) / 2
          }

        } else {
          y1 = value
          y2 = value
        }

        // Return the string to add a point with handles in between the end points
        return `${x1},${y1} ${index * xWidth},${value} ${x2},${y2} `

      } else if ((value || value == 0) && value !== NaN) {

        diff = value - prevVal
        return `${index * xWidth - xWidth/2},${value - diff/2} ${index * xWidth},${value} `

      } else {
        return
      }

    })

    string = string.join("")

    return string

  }


}

export default Plot