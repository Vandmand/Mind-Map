let rd;
let nm;

function setup() {
  // Canvas
  createCanvas(windowWidth, windowHeight);

  // Modules with p5
  rd = new Renderer();
  // nm = createNodeModule();

  // Miscs
  misc();
}

function draw() {
  // nm.moveNodes();
  // nm.calcForces();
  rd.render();
}

function misc() {
  rd.add('background', () => background(220));
}

/*
let draggedNode
function mouseDragged() {
  if (draggedNode) {
    draggedNode.pos.x = mouseX;
    draggedNode.pos.y = mouseY;
  } else if (nm.collided()) {
    draggedNode = nm.getNode();
    draggedNode.freeze = true;
    yeet("Node frozen: ")
    yeet(draggedNode)
  } else {
    nm.spawnNode(mouseX,mouseY,70,1,true)
    draggedNode = nm.getNode();
  };
}

function mouseReleased() {
  if (draggedNode) {
    draggedNode.freeze = false;
    draggedNode = undefined;
  }
}
*/
