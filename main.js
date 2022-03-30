let rd;
let nm;

function setup() {
  // Canvas
  createCanvas(windowWidth, windowHeight);

  // Modules with p5
  rd = new Renderer();
  nm = new NodeModule();

  // Miscs
  misc();
}

function draw() {
  nm.moveNodes();
  nm.calcForces();
  rd.render();
}

function misc() {
  rd.add('background', () => background(220));
  nm.spawnNode(100,100,70)
  nm.spawnNode(400,400,70)
  nm.link(nm.nodes[0],nm.nodes[1])
}

let draggedNode
function mouseDragged() {
  if (draggedNode) {
    draggedNode.pos.x = mouseX;
    draggedNode.pos.y = mouseY;
  } else if(nm.collided()) {
      draggedNode = nm.getNode();
      draggedNode.freeze = true;
      yeet("Node frozen: " + draggedNode)
  };
}

function mouseReleased() {
  draggedNode.freeze = false;
  draggedNode = undefined;
}
