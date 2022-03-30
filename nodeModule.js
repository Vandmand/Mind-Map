class NodeModule {
    constructor() {
        // Node class 
        this.Node = class Node {
            constructor(x, y, size = 10, magneticForce = 1) {
                this.pos = createVector(x, y);
                this.size = size;
                this.forceMag = 0.3 * magneticForce;
                this.force = createVector(0, 0);
                this.freeze = false;
            }
        }

        // Link class
        this.Link = class Link {
            constructor(nodeA,nodeB) {
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
    spawnNode(x, y, size, magForce) {
        let temp = new this.Node(x, y, size, magForce);
        rd.add('node', () => circle(temp.pos.x, temp.pos.y, temp.size));
        this.nodes.push(temp);
    }
    moveNodes() {
        this.nodes.forEach(node => {
            if (!node.force.equals(0, 0)) {
                if(node.force.mag() <= 5) {
                    node.pos.add(node.force);   
                } else {
                    node.force.setMag(5)
                }
                node.force.mag() <= 0.05 ? node.force.sub(node.force) : node.force.mult(0.965);
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
    link(nodeA,nodeB) {
        this.links.push(new this.Link(nodeA,nodeB))
    }
    calcForces() {
        this.links.forEach(link => {
            let a = link.nodeA;
            let b = link.nodeB;
            let vecDist = dist(a.pos.x,a.pos.y,b.pos.x,b.pos.x);
            if( vecDist > 150) {
                if(a.force.mag() < 5 && !a.freeze) {
                    a.force = b.pos.copy().sub(a.pos).mult(this.linkForce*vecDist);
                }
                if(b.force.mag() < 5 && !b.freeze) {
                    b.force = a.pos.copy().sub(b.pos).mult(this.linkForce*vecDist);
                }
            }
        })
        for (let i = 0; i < this.nodes.length; i++) {
            const a = this.nodes[i];
            const b = this.nodes[i+1];
            if(b) {
                let vecDist = dist(a.pos.x,a.pos.y,b.pos.x,b.pos.x);
                if(vecDist < 100) {
                    a.force = a.pos.copy().sub(b.pos).mult(a.forceMag/vecDist);
                    b.force = b.pos.copy().sub(a.pos).mult(b.forceMag/vecDist);
                }
            }
        }
    }
}