import Func from './functions';

const Plot = {

  straight: (data, min, max, height, xWidth, margin) => {

    let string = data.map((value, index) => {

      value = Func.convert(value, min, max, height)

      if (margin) {
        value += margin
      }

      if (index == 0) {
        return `M0,${data[0]}`
      }

    })

  }


}

export default Plot