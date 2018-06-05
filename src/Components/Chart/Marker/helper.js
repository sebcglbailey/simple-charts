let globalHeight;

class Helper {

  // Init the helper line
  build(snap, height) {

    globalHeight = height

    this.path = `M0,0 0,${height}`
    this.pathClick = `M0,0 0,${height}`
    this.line = snap.path(this.path)
    this.clickLine = snap.path(this.path)
    this.clickLine.attr({
      stroke: "none"
    })
    this.line.attr({
      stroke: "none"
    })

    return this

  }

  // Update the x position of the helper line
  update(posX) {

    this.path = `M${posX},0 ${posX},${globalHeight}`
    this.line.attr({
      d: this.path
    })

  }

  updateClick(posX) {

    this.pathClick = `M${posX},0 ${posX},${globalHeight}`
    this.clickLine.attr({
      d: this.pathClick
    })

  }

  // Get the intersection points of the helper line and passed in path
  getIntersection(snap, line, click) {
  
    return snap.path.intersection(line, this.line)[0]

  }

  getAllIntersections(snap, lines, click) {

    let intersections = []

    lines.forEach((line) => {
      let intersection = snap.path.intersection(line.line, this.clickLine)[0]
      intersections.push(intersection)
    })

    return intersections

  }

}

export default Helper