// ===========================================================
// = Renderer Module = Elias Kulmbak = v 0.2.0
// ===========================================================
/*
    This module collects all "renders" from p5.
    All p5 functions like fill(), stroke and other visual 
    only changes in scope of key
*/
'use strict';
class Renderer {
    constructor() {
        // The variable that actually holds the rendering:
        this.renderList = new Map();
        this.defaultPriority = 0;

        //Custom error message
        this.error = class RenderError extends Error {
            constructor(message) {
                super(message);
                this.name = "RenderError";
            }
        }

        // Debugging functions
        this.debug = {
            debugNamingNumber: 1,
            getName: () => {
                return 'debug' + this.debug.debugNamingNumber++;
            },
            createSimpleObject: (x = width / 2, y = height / 2, s = height / 4) => {
                this.add(this.debug.getName(), () => { circle(x, y, s) });
            },
            createInteractable: (s = height / 4) => {
                this.add(this.debug.getName(), () => { circle(mouseX, mouseY, s) });
            },
            getFunctions: key => {
                let returnArray = [];
                this.get(key).functions.forEach(func => {
                    returnArray.push(func.toString());
                });
                return returnArray;
            }
        }
    }
    // Clear entire renderer
    clear() {
        this.renderList.clear();
    }
    // Returns the specefied key if such key exist. Else returns false
    get(key) {
        return this.renderList.has(key) ? this.renderList.get(key) : undefined;
    }
    // Add function(s) to renderKey
    // Param drawFuntion takes both array or function
    // If a non-existant key is supplied, creates key, then runs function
    add(key, drawFunction) {
        if (this.get(key)) {
            switch (drawFunction.constructor) {
                case Function:
                    this.renderList.get(key).functions.push(drawFunction);
                    break;
                case Array:
                    drawFunction.forEach(i => {
                        this.add(key, i);
                    });
                    break;
                case Object:
                    if (drawFunction.toUpperCase() == 'FOLDER') {

                    } else {
                        throw new this.error('Invalid datatype');
                    }
                    break;
                default:
                    throw new this.error('Invalid datatype');
            }
        } else {
            this.createKey(key);
            this.add(key, drawFunction);
        }
    }
    // Create renderKey
    createKey(key, priority = this.defaultPriority) {
        if (key) {
            if (this.get(key)) {
                throw new this.error('Key already exists');
            } else {
                let oldMap = [...this.renderList];
                let left = oldMap.filter(entry => { if (entry[1].priority <= priority) { return true } });
                let right = oldMap.filter(entry => { if (entry[1].priority > priority) { return true } });
                this.renderList = new Map(left.concat([[key, { priority: priority, functions: [] }]], right));
            }
        } else {
            throw new this.error('No key specefied');
        }
    }

    //Unused code block. Ill come back to. Hopefully
    createFolder(key, path, priority = this.defaultPriority) {
        if (this.get(path)) {
            let oldMap = [...this.renderList];
            let left = oldMap.filter(entry => { if (entry[1].priority <= priority) { return true } });
            let right = oldMap.filter(entry => { if (entry[1].priority > priority) { return true } });
            this.renderList = new Map(left.concat([[key, { priority: priority, folder: [] }]], right));

        } else {
            throw new this.error('Invalid key')
        }
    }
    // Remove renderKey
    removeKey(key) {
        if (key) {
            if (this.get(key)) {
                this.renderList.delete(key);
            } else {
                throw new this.error('Key does not exist');
            }
        } else {
            throw new this.error('No key specefied');
        }
    }
    // Render all keys
    render(entry = this.renderList) {
        entry.forEach(renderGroup => {
            if (renderGroup.functions) {
                push();
                renderGroup.functions.forEach(drawFunction => {
                    drawFunction();
                })
                pop();   
            } else if (renderGroup.folder){
                this.render(renderGroup.folder)
            }
        });
    }

    // Unused function previously using the quicksort algorithm
    sortKeys() {
        const unSorted = [...this.renderList];
        this.renderList = new Map(unSorted.sort((entry1, entry2) => {
            let entry1Value = entry1[1].priority;
            let entry2Value = entry2[1].priority;
            if (entry1Value > entry2Value) {
                return 1;
            } else {
                return -1;
            }
        }))
    }
}