class NodeModule {
    constructor() {
        // Node class 
        this.Node = class Node {
            constructor(x, y, size = 10, magneticForce = 1, freeze) {
                this.pos = createVector(x, y);
                this.size = size;
                this.forceMag = 1 * magneticForce;
                this.force = createVector(0, 0);
                this.freeze = freeze;
            }
        }

        // Link class
        this.Link = class Link {
            constructor(nodeA, nodeB) {
                this.nodeA = nodeA
                this.nodeB = nodeB
            }
        }

        // Contains all nodes
        this.nodes = [];

        // Contains links
        this.links = [];

        this.linkForce = 0.00006
    }

    // Initial scripts
    start() {
        rd.createKey('node', 2)
        rd.createKey('links', 1)
        this.spawnNode(width/2,height/2,100,3,true)
    }

    // Make a new node
    spawnNode(x, y, size, magForce, freeze = false) {
        let temp = new this.Node(x, y, size, magForce, freeze);
        rd.add('node', () => circle(temp.pos.x, temp.pos.y, temp.size));
        this.nodes.push(temp);
    }
    moveNodes() {
        this.nodes.forEach(node => {
            if(!node.freeze) {
                if (!node.force.equals(0, 0)) {
                    node.pos.add(node.force);
                    node.force.mag() >= 0.5 ? node.force.sub(node.force) : node.force.mult(0.995);
                }
            }
        })
    }
    getNode(x = mouseX, y = mouseY) {
        return this.nodes.reduce((a, b) => dist(x, y, a.pos.x, a.pos.y) < dist(x, y, b.pos.x, b.pos.y) ? a : b)
    }
    collided(x = mouseX, y = mouseY, node) {
        if (node) {
            return dist(x, y, node.pos.x, node.pos.y) < node.size / 2 ? true : false;
        } else {
            let closest = this.getNode();
            return dist(x, y, closest.pos.x, closest.pos.y) < closest.size / 2 ? true : false;
        }
    }
    link(nodeA, nodeB) {
        this.links.push(new this.Link(nodeA, nodeB))
        rd.add('links', () => line(nodeA.pos.x, nodeA.pos.y, nodeB.pos.x, nodeB.pos.y))
    }
    calcForces() {
        // Calc link forces
        this.links.forEach(link => {
            const a = link.nodeA;
            const b = link.nodeB;
            let vecDist = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.x);
            if (vecDist > 150) {
                a.force = b.pos.copy().sub(a.pos).mult(this.linkForce * vecDist);
                b.force = a.pos.copy().sub(b.pos).mult(this.linkForce * vecDist);
            }
        })

        // Calc Mag forces
        for (let i = 0; i < this.nodes.length; i++) {
            const a = this.nodes[i];
            const b = this.nodes[i + 1];
            if (b) {
                let vecDist = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
                if (vecDist < 80*a.forceMag) {
                    a.force = a.pos.copy().sub(b.pos).mult(a.forceMag / vecDist);
                    b.force = b.pos.copy().sub(a.pos).mult(b.forceMag / vecDist);
                }
            } 
        }
    }
}

function createNodeModule() {
    let temp = new NodeModule()
    temp.start()
    return temp
}