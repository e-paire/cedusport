/**
 * Vector
 */

function Vector(x, y) {
  this.x = x
  this.y = y
}

Vector.fromAngle = function(angle, magnitude) {
  if (typeof magnitude !== "number") {
    magnitude = 1
  }
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle))
}

$.extend(Vector.prototype, {
  add: function(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  },
  subtract: function(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  },
  multiply: function(s) {
    return new Vector(this.x * s, this.y * s)
  },
  divide: function(s) {
    return new Vector(this.x / s, this.y / s)
  },
  magnitude: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  },
  unit: function() {
    return this.divide(this.magnitude())
  },
  angle: function() {
    return Math.atan2(this.y, this.x)
  },
  toString: function() {
    return "(" + x + ", " + y + ")"
  },
})

/**
 * Path
 */

function Path(commands) {
  this.commands = commands
}

Path.prototype.toString = function() {
  return this.commands.join("")
}

Path.M = function(point) {
  this.point = point
}

Path.M.prototype.toString = function() {
  return "M" + this.point.x + " " + this.point.y
}

Path.L = function(to) {
  this.to = to
}

Path.L.prototype.toString = function() {
  return "L" + this.to.x + " " + this.to.y
}

Path.Q = function(control, to) {
  this.control = control
  this.to = to
}

Path.Q.prototype.toString = function() {
  return (
    "Q" +
    this.control.x +
    " " +
    this.control.y +
    " " +
    this.to.x +
    " " +
    this.to.y
  )
}

Path.Z = function() {}

Path.Z.prototype.toString = function() {
  return "Z"
}

/**
 * Hex
 */

function Hex() {
  this.$svg = $('<svg version="1.1" xmlns="http://www.w3.org/2000/svg">')
  this.$path = $(svg("path"))

  this.$svg.append(this.$path)

  this.orientation = Hex.POINTY_TOP
  this.length = Hex.DEFAULT_LENGTH
  this.radius = Hex.DEFAULT_RADIUS
  this.setColor(Hex.DEFAULT_COLOR)
  this.setShadow(Hex.DEFAULT_SHADOW)

  this.update()
}

Hex.DEFAULT_LENGTH = 100
Hex.DEFAULT_RADIUS = 0
Hex.DEFAULT_COLOR = "#fff"
Hex.DEFAULT_SHADOW = "0 0 10px rgba(255, 255, 255, 0.5)"

Hex.FLAT_TOP = "flat"
Hex.POINTY_TOP = "pointy"

$.extend(Hex.prototype, {
  setOrientation: function(orientation) {
    this.orientation = orientation
    this.update()
  },
  setLength: function(length) {
    this.length = Math.max(0, length)
    this.update()
  },
  setRadius: function(radius) {
    this.radius = Math.max(0, Math.min(this.length / 2, radius))
    this.update()
  },
  setColor: function(color) {
    this.color = color
    this.$path.attr("fill", color)
  },
  setShadow: function(shadow) {
    this.shadow = shadow
    var css = "drop-shadow(" + shadow + ")"
    this.$svg.css({
      filter: css,
      webkitFilter: css,
    })
  },
  getPath: function() {
    var height = this.height
    var width = this.width
    var a, b, c, d, e, f

    if (this.orientation === Hex.POINTY_TOP) {
      a = new Vector(width / 2, 0)
      b = new Vector(width, height / 4)
      c = new Vector(width, (height * 3) / 4)
      d = new Vector(width / 2, height)
      e = new Vector(0, (height * 3) / 4)
      f = new Vector(0, height / 4)
    } else {
      a = new Vector(0, height / 2)
      b = new Vector(width / 4, 0)
      c = new Vector((width * 3) / 4, 0)
      d = new Vector(width, height / 2)
      e = new Vector((width * 3) / 4, height)
      f = new Vector(width / 4, height)
    }

    if (this.radius === 0) {
      return new Path([
        new Path.M(a),
        new Path.L(b),
        new Path.L(c),
        new Path.L(d),
        new Path.L(e),
        new Path.L(f),
        new Path.Z(),
      ])
    }

    var right = Vector.fromAngle(b.subtract(a).angle(), this.radius)
    var left = Vector.fromAngle(f.subtract(a).angle(), this.radius)
    var level =
      this.orientation === Hex.POINTY_TOP
        ? new Vector(0, this.radius)
        : new Vector(this.radius, 0)

    return new Path([
      new Path.M(a.add(left)),
      new Path.Q(a, a.add(right)),
      new Path.L(b.subtract(right)),
      new Path.Q(b, b.add(level)),
      new Path.L(c.subtract(level)),
      new Path.Q(c, c.add(left)),
      new Path.L(d.subtract(left)),
      new Path.Q(d, d.subtract(right)),
      new Path.L(e.add(right)),
      new Path.Q(e, e.subtract(level)),
      new Path.L(f.add(level)),
      new Path.Q(f, f.subtract(left)),
      new Path.Z(),
    ])
  },
  update: function() {
    if (this.orientation === Hex.POINTY_TOP) {
      this.height = this.length * 2
      this.width = (this.height * Math.sqrt(3)) / 2
    } else {
      this.width = this.length * 2
      this.height = (this.width * Math.sqrt(3)) / 2
    }

    this.$svg.attr("width", Math.ceil(this.width))
    this.$svg.attr("height", Math.ceil(this.height))
    this.$svg.attr("viewbox", "0 0 " + this.width + " " + this.height)
    this.$path.attr("d", this.getPath().toString())

    showCode(this)
  },
})

function svg(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag)
}

/**
 * Main
 */

var $container = $(".container")
var $length = $("input[name=length]")
var $radius = $("input[name=radius]")
var $color = $("input[name=color]")
var $shadow = $("input[name=shadow]")
var $orientation = $("input[name=orientation]")
var $theme = $("input[name=theme]")
var $code = $("textarea")
var $hex = $(".hex")

var hex = new Hex()

$length.on("change", function() {
  hex.setLength($length.val())
})

$radius.on("change", function() {
  hex.setRadius($radius.val())
})

$color.on("change", function() {
  hex.setColor($color.val())
})

$shadow.on("change", function() {
  hex.setShadow($shadow.val())
})

$orientation.on("change", function() {
  hex.setOrientation($(this).val())
})

$theme.on("change", function() {
  if ($theme.is(":checked")) {
    $container.addClass($theme.val())
  } else {
    $container.removeClass($theme.val())
  }
})

$length.val(hex.length)
$radius.val(hex.radius)
$color.val(hex.color)
$shadow.val(hex.shadow)
$orientation.filter("[value=" + hex.orientation + "]").prop("checked", true)

$hex.append(hex.$svg)

function showCode(hex) {
  $code.html(hex.$svg[0].outerHTML)
}
