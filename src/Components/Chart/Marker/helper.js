let globalHeight;

class Helper {

  // Init the helper line
  build(snap, height) {

    globalHeight = height

    this.path = `M0,0 0,${height}`
    this.line = snap.path(this.path)
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

  // Get the intersection points of the helper line and passed in path
  getIntersection(snap, line) {

    return snap.path.intersection(line, this.line)[0]

  }

}

export default Helper