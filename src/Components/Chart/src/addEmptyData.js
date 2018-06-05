const addEmptyData = (series, info) => {

  let firstDataPoint = series.data[0]
  let firstYear = firstDataPoint.year
  let firstMonth = firstDataPoint.month

  let yearDiff = firstYear - info.minYear
  let monthDiff = firstMonth - info.minMonth

  if (monthDiff < 0) {
    yearDiff -= 1
    monthDiff = 12 + monthDiff
  }

  let noOfEmpties = yearDiff * 12 + monthDiff

  if (noOfEmpties) {
    for (let i = 0; i < noOfEmpties; i++) {
      series.data.unshift({})
    }
  }

  let newData = []
  let newDataIndex;

  series.data.forEach((entry, index) => {

    let thisMonth = entry.month
    let thisYear = entry.year

    let nextMonth = index < series.data.length - 1 ? series.data[index+1].month : undefined
    let nextYear = index < series.data.length - 1 ? series.data[index+1].year : undefined

    if (nextMonth && nextYear
      && (
        (nextMonth == thisMonth + 1 && nextYear == thisYear)
        || (thisMonth == 12 && nextMonth == 1 && nextYear == thisYear + 1)
      )
    ) {
      return
    } else if (nextMonth && nextYear) {
      newDataIndex = index + 1
      
      let monthDiff = nextMonth - thisMonth
      let yearDiff = nextYear - thisYear
      let monthsToAdd = yearDiff * 12 + monthDiff - 1

      for (let i = 0; i < monthsToAdd; i++) {

        let newMonth = thisMonth + (i%12 + 1) <= 12 ? thisMonth + (i%12 + 1) : 1
        let newYear = thisMonth + (i%12 + 1) <= 12 ? thisYear + Math.floor(i/12) : thisYear + Math.floor(i/12) + 1

        newData.push({
          month: newMonth,
          year: newYear,
          balance: typeof(entry.balance) == "number" ? entry.balance : undefined,
          score: typeof(entry.score) == "number" ? entry.score : undefined
        })
      }

    }

  })

  series.data.splice(newDataIndex, 0, ...newData)

}

export default addEmptyData