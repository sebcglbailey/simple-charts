let testArr = [
  {
    month: 10,
    year: 1
  },
  {
    month: 11,
    year: 1
  },
  {
    month: 12,
    year: 1
  },
  {
    month: 1,
    year: 2
  },
  {
    month: 2,
    year: 4
  },
  {
    month: 3,
    year: 4
  },
  {
    month: 4,
    year: 4
  }
]

let newData = []
let newDataIndex;

testArr.forEach((entry, index) => {

  let thisMonth = entry.month
  let thisYear = entry.year

  let nextMonth = index < testArr.length - 1 ? testArr[index+1].month : undefined
  let nextYear = index < testArr.length - 1 ? testArr[index+1].year : undefined

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
        year: newYear
      })
    }

  }

})

testArr.splice(newDataIndex, 0, ...newData)

console.log(testArr)