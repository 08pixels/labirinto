
class Player {

  constructor (xpos=0, ypos=0) {
    this.position = {x:xpos, y:ypos}
  }
}

class Structure {

  constructor ( height, width, player ) {
    this.height = height
    this.width  = width
    this.grid   = this.createGrid()
    this.grid   = this.putPlayerOnGrid( this.grid, player )
  }

  createGrid () {
    const grid = []

    for(let i=0; i<this.height; ++i) {
      const row = new Array( this.width ).fill( 0 )
      grid.push( row )
    }

    return grid
  }

  putPlayerOnGrid ( grid, player ) {
    grid[player.position.x][player.position.y] = -1

    return grid
  }

}


class Scene {

  constructor ( structure,  player ) {
    this.structure = structure
    this.player    = player
  }

  movePlayer ( direction ) {

    const getElement = ( x, y ) => {
      const position = x * this.structure.width + y
      return document.getElementById(position)
    }

    const emptyClassName = ( element ) => {
      element.classList.remove( "player" )
      element.classList.add("empty")
    }

    const addClassName = ( element ) => {
      element.classList.remove( "empty" )
      element.classList.add( "player" )
    }

    const isValid = ( x, y ) => {
      if ( x < 0 || x >= this.structure.height )
        return false
      if ( y < 0 || y >= this.structure.width )
        return false
      if ( getElement( x, y ).className != "empty" )
        return false

      return true
    }


    const x = this.player.position.x
    const y = this.player.position.y

    const moviment = {
      "left" : { x: 0, y:-1 },
      "right": { x: 0, y: 1 },
      "up"   : { x:-1, y: 0 },
      "down" : { x: 1, y: 0 }
    }

    let playerElement = document.querySelector ( ".player" )
    const displace = moviment[direction]

    if ( isValid ( x + displace.x, y + displace.y ) ) {
      emptyClassName ( playerElement )
      addClassName ( getElement ( x + displace.x, y + displace.y ) )

      this.player.position.x = x + displace.x
      this.player.position.y = y + displace.y
    }
  }

}

const handleCell = ( cell ) => {

  if ( cell.classList != "empty")
    return

  cell.innerHTML = ""
  cell.classList.remove( "empty" )
  cell.classList.add   ( "obstable" )
}

const renderGrid = ( scene ) => {
  let htmlContent = ""
  let gridElement = document.querySelector( "#grid" )

  htmlContent += "<table>"

  for ( let i=0; i<scene.structure.height; ++i ) {
    htmlContent += "<tr>"

    for ( let j=0; j<scene.structure.width; ++j ) {
      const element = scene.structure.grid[i][j]
      const id      = scene.structure.width * i + j

      if ( element == -1 ) // PLAYER
        htmlContent += `<td id=${id} class="player"> </td>`
      else if ( element == -2 ) // OBSTACLE
        htmlContent += `<td id=${id} class="obstacle"> </td>`
      else
        htmlContent += `<td id=${id} class="empty" onclick="handleCell(this)"></td>`
    }

    htmlContent += "</tr>"
  }

  htmlContent += "</table>"

  gridElement.innerHTML = htmlContent
}

document.addEventListener ( 'keydown', ( event ) => {

  const LEFT  = 37
  const UP    = 38
  const RIGHT = 39
  const DOWN  = 40

  switch ( event.keyCode ) {
    case  LEFT:
      scene.movePlayer( "left"  )
      break
    case RIGHT:
      scene.movePlayer( "right" )
      break
    case    UP:
      scene.movePlayer( "up"    )
      break
    case  DOWN:
      scene.movePlayer( "down"  )
      break
  }
});


const player    = new Player    ( );
const structure = new Structure ( 20, 30, player );
const scene     = new Scene     ( structure, player );

renderGrid( scene );