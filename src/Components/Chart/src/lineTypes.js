import Func from './functions';

const Plot = {

  straight: (data, min, max, height, xWidth, margin) => {

    let string = data.map((value, index) => {

      value = Func.convert(value, min, max, height)

      if (margin) {
        value += margin
      }

      if (index == 0) {
        return `M0,${value} L`
      } else {
        return `${xWidth * index},${value} `
      }

    })
    string = string.join("")

    return string

  },

  simpleCurve: (data, min, max, height, xWidth, margin) => {
    
    let string = data.map((value, index) => {

      let prevVal = index > 0 ? data[index-1] : undefined

      value = Func.convert(value, min, max, height)
      prevVal = index > 0 ? Func.convert(prevVal, min, max, height) : 0

      if (margin) {
        value += margin
        prevVal += margin
      }

      let diff, prevHandle;
      
      // if (index == 0) {
      //   diff = data[1] - data[0];
      //   nextHandle = data[0] - (diff/2)
      //   return `M0,${data[0]} S${xWidth/2},${nextHandle} `
      // } else if (index !== data.length - 1) {
      //   diff = data[index+1] - data[index]
      //   nextHandle = data[index] - (diff/2)
      //   return `${xWidth * index},${value} ${xWidth * index + xWidth/2},${nextHandle} `
      // } else {
      //   return `${xWidth * index},${value}`
      // }

      if (index == 0) {
        return `M0,${value} S`
      } else {
        diff = value - prevVal
        prevHandle = value - (diff/2)

        return `${xWidth * index - xWidth/2},${prevHandle} ${xWidth * index},${value} `
      }

    })

    string = string.join("")

    return string

  }


}

export default Plot