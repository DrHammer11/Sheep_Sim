class Grass {
    constructor() {
        this.energygiven = parseInt(document.getElementById("InputGrassEnergy").value);
        this.eaten = false;
        this.coords = ['x','y'];
      }
      UpdateEaten(gr, gp) {
          if (this.eaten === true) {
            GrassElements[gr][gp].style.backgroundColor = "saddlebrown";
          }
      }
      UpdateGrow(gr, gp) {
        gr = parseInt(gr)
        gp = parseInt(gp)
        let ChanceOfRegrow = 0;
        if (gp !== 0 && GrassGrid[gr][gp-1].eaten === false) {
            ChanceOfRegrow += parseInt(document.getElementById("InputGrassRegrow").value)/400;
        }
        if (gp !== 119 && GrassGrid[gr][gp+1].eaten === false) {
            ChanceOfRegrow += parseInt(document.getElementById("InputGrassRegrow").value)/400;
        }
        if (gr !== 0 && GrassGrid[gr-1][gp].eaten === false) {
            ChanceOfRegrow += parseInt(document.getElementById("InputGrassRegrow").value)/400;
        }
        if (gr !== 119 && GrassGrid[gr+1][gp].eaten === false) {
            ChanceOfRegrow += parseInt(document.getElementById("InputGrassRegrow").value)/400;
        }
        if (Math.random() <= ChanceOfRegrow) {
            this.eaten = false;
            GrassElements[gr][gp].style.backgroundColor = "green";
          }
      }
}
class Sheep {
    constructor() {
        this.x = 5*randomint(1, GrassAreaSize)+428;
        this.y = 5*randomint(1, GrassAreaSize)+4;
        this.id = "Sheep"+SheepCreated;
        this.element = document.createElement('div');
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('class', 'sheepObj');
        this.element.setAttribute('style', "position: absolute; left: 432px; top: 8px;");
        document.getElementById("SheepContainer").appendChild(this.element);
        this.energy = 20;
        this.energygiven = this.energy;
        this.age = 0;
        this.fighter = false;
        if (Math.random() < parseInt(document.getElementById("InputFightPerc").value)/100) {
            this.fighter = true;
        }
        this.colour = ['white','gray','tan','lightpink','black'][randomint(0, 4)];
        SheepCreated += 1;
    }
    Update() {
        for (let wolf in WolfArray) {
            wolf = WolfArray[wolf];
            if (wolf.target === this) {
                let distance = GetDistance(wolf, this);
                if (distance[0] > 0) {
                    this.x += randomint(0, 5.5);
                }
                else {
                    this.x -= randomint(0, 5.5);
                }
                if (distance[1] > 0) {
                    this.y += randomint(0, 5.5);
                }
                else {
                    this.y -= randomint(0, 5.5);
                }
            }
        }
        if (Math.random() > 0.5) {
            this.x += randomint(2, 5);
        }
        else {
            this.x -= randomint(2, 5);
        }
        if (Math.random() > 0.5) {
            this.y += randomint(2, 5);
        }
        else {
            this.y -= randomint(2, 5);
        }
        if (this.x > 5*GrassAreaSize+423) {
            this.x = 5*GrassAreaSize+423;
        }
        if (this.y > 5*GrassAreaSize+4) {
            this.y = 5*GrassAreaSize-1;
        }
        if (this.x < 428) {
            this.x = 428;
        }
        if (this.y < 4) {
            this.y = 4;
        }
        let sheephys = document.getElementById(this.id);
        sheephys.style.left = this.x.toString()+"px"
        sheephys.style.top = this.y.toString()+"px"
        sheephys.style.backgroundColor = this.colour;
        CheckForGrass(SheepArray[SheepIdArray.indexOf(this.id)]);
        if (this.energy >= 50) {
            sheep = new Sheep();
            this.energy -= 20;
            this.energygiven -= 20;
            sheep.x = this.x;
            sheep.y = this.y;
            sheep.colour = this.colour;
            if (this.fighter === true) {
                if (Math.random() < 0.18) {
                    sheep.fighter = true;
                }
            }
            SheepArray.push(sheep);
            SheepIdArray.push(sheep.id);
            if (this.colour === "white") {
                this.energy -= 3;
                this.energygiven -= 3;
                sheep = new Sheep();
                sheep.x = this.x;
                sheep.y = this.y;
                sheep.colour = this.colour;
                if (this.fighter === true) {
                    if (Math.random() < 0.18) {
                        sheep.fighter = true;
                    }
                }
                SheepArray.push(sheep);
                SheepIdArray.push(sheep.id);
            }
        }
        if (this.colour === "black") {
            this.age += 5/8;
        }
        else {
            this.age += 1;
        }
        this.energy -= 1;
        this.energygiven -= 1;
        if (this.age >= 250 || this.energy <= 0) {       
            removeElement(this.id);  
            var index = SheepIdArray.indexOf(this.id);
            if (index > -1) {
                SheepIdArray.splice(index, 1);
                SheepArray.splice(index, 1)
            }          
        }
    }
}
class Wolf {
    constructor() {
        this.x = 5*randomint(1, GrassAreaSize)+428;
        this.y = 5*randomint(1, GrassAreaSize)+4;
        this.id = "Wolf"+WolfCreated;
        this.element = document.createElement('div');
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('class', 'wolfObj');
        this.element.setAttribute('style', "position: absolute; left: 432px; top: 8px;");
        document.getElementById("WolfContainer").appendChild(this.element);
        this.energy = 70;
        this.age = 0;
        this.speed = 6.2;
        this.full = false;
        this.target = new Sheep();
        WolfCreated += 1;
    }
    Update() {
        let wolfys = document.getElementById(this.id);
        for (let wolf in WolfArray) {
            wolf = WolfArray[wolf];
            if ((wolf.target.id === this.target.id && wolf.id != this.id) || !(SheepArray.includes(this.target))) {
                pickNewSheep(this, wolf.target.id);
            }
        }
        let distance = GetDistance(this, this.target);
        this.x += distance[0] * (this.speed/distance[2]);
        this.y += distance[1] * (this.speed/distance[2]);

        wolfys.style.left = this.x.toString()+"px"
        wolfys.style.top = this.y.toString()+"px"
        CheckForSheep(WolfArray[WolfIdArray.indexOf(this.id)]);
        if (this.energy >= 120) {
            wolf = new Wolf();
            this.energy -= 70;
            wolf.x = this.x;
            wolf.y = this.y;
            WolfArray.push(wolf);
            WolfIdArray.push(wolf.id);
        }
        this.age += 1;
        if (this.age < 100) {
            this.energy -= 0.87;
        }
        else {
            this.energy -= 1.05;
            this.speed = 5.7;
        }
        if (this.age > 235) {
            this.speed = 5.2;
        }
        if (this.age >= 300 || this.energy <= 0) {    
            removeElement(this.id);  
            var index = WolfIdArray.indexOf(this.id);
            if (index > -1) {
                WolfIdArray.splice(index, 1);
                WolfArray.splice(index, 1)
            }          
        }
    }
}
function randomint(start, end) {
    end = end + 0.5
    start = start - 0.5
    var randomnum = (Math.random() * end);
    while (randomnum < start) {
        var randomnum = (Math.random() * end);  
    }
    return Math.round(randomnum);
}
function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}
function CheckForGrass(hsheep) {
    setvaluey = hsheep.y
    setvaluex = hsheep.x
    for (let gr in GrassGrid) {
        for (let gp in GrassGrid[gr]) {
            if (GrassGrid[gr][gp].eaten === false && setvaluex <= GrassGrid[gr][gp].coords[0]+5 && setvaluex >= GrassGrid[gr][gp].coords[0] && setvaluey <= GrassGrid[gr][gp].coords[1]+5 && setvaluey >= GrassGrid[gr][gp].coords[1]) {
                GrassGrid[gr][gp].eaten = true;
                hsheep.energy += GrassGrid[gr][gp].energygiven;
                hsheep.energygiven += GrassGrid[gr][gp].energygiven;
                GrassGrid[gr][gp].UpdateEaten(gr, gp)
            }
        }
    }
}
function GetDistance(wolf, sheep) {
    distancex = sheep.x - wolf.x;
    distancey = sheep.y - wolf.y;
    distancestraight = Math.sqrt(distancex**2 + distancey**2);
    return [distancex, distancey, distancestraight];
}
function CheckForSheep(hwolf) {
    for (let sheep in SheepArray) {
        sheep = SheepArray[sheep];
        if (hwolf.x <= sheep.x+7.5 && hwolf.x >= sheep.x && hwolf.y <= sheep.y+7.5 && hwolf.y >= sheep.y) {
            if (sheep.fighter === false || ((sheep.fighter === true && Math.random < 0.12) || (sheep.fighter === true && sheep.energy < 15))) {
                removeElement(sheep.id);  
                var index = SheepIdArray.indexOf(sheep.id);
                if (index > -1) {
                    SheepIdArray.splice(index, 1);
                    SheepArray.splice(index, 1)
                }
                hwolf.energy += sheep.energygiven;
            }
            else if (sheep.fighter === true) {
                pickNewSheep(hwolf, sheep.id)
                hwolf.energy -= 6;
                sheep.energy -= 3;
            }
        }
    }
}
function pickNewSheep(wolf, npsheepid) {
    let min = [[0, 0, 1000], 'baa'];
    for (let sheep in SheepArray) {
        sheep = SheepArray[sheep];
        let distance = GetDistance(wolf, sheep);
        if (distance[2] < min[0][2] && sheep.id != npsheepid) {
            min = [distance, sheep];
        }
    }
    wolf.target = min[1];
}

let GrassAreaSize = 120;
SheepArray = new Array();
SheepIdArray = new Array();
SheepCreated = 0;
WolfArray = new Array();
WolfIdArray = new Array();
WolfCreated = 0;
let stop = false;
SheepColours = ['white','gray','tan','lightpink','black']
let GrassGrid = new Array(GrassAreaSize);
GrassElements = new Array(GrassAreaSize);
document.getElementById('SimSpeed').value = '100';
document.getElementById("InputSheepNum").value = '10';
document.getElementById("InputWolfNum").value = '2';
document.getElementById("InputFightPerc").value = '3.4';
document.getElementById("InputGrassEnergy").value = '3';
document.getElementById("InputGrassRegrow").value = '2';
let containerDiv = document.getElementById("sim");
for (c=0; c < 2; c++) {
    for (let s=0; s < SheepColours.length; s++) {
        sheep = new Sheep();
        sheep.colour = SheepColours[s]
        SheepArray.push(sheep);
        SheepIdArray.push(sheep.id);
        sheep.Update();
    }
}
for (let w=0; w < 2; w++) {
    wolf = new Wolf();
    WolfArray.push(wolf);
    WolfIdArray.push(wolf.id);
    wolf.Update();
}

function GenSim() {
    for (let i = 0; i < GrassGrid.length; i++) {
        GrassGrid[i] = new Array(GrassAreaSize);
        GrassElements[i] = new Array(GrassAreaSize);
        for (let j = 0; j < GrassGrid[i].length; j++) {
            let newgrass = new Grass();
            GrassGrid[i][j] = newgrass;
            GrassGrid[i][j].coords = [5*(j+1)+428, 5*(i+1)+4];
            let columnElement = document.createElement('div');
            columnElement.className = "grid-item";
            containerDiv.appendChild(columnElement);
            GrassElements[i][j] = columnElement;
        }
    }
}

function ResetSim() {
    stop = true;
    SheepArray = new Array();
    SheepIdArray = new Array();
    SheepCreated = 0;
    WolfArray = new Array();
    WolfIdArray = new Array();
    WolfCreated = 0;
    SheepColours = ['white','gray','tan','lightpink','black']
    GrassGrid = new Array(GrassAreaSize);
    GrassElements = new Array(GrassAreaSize);
    containerDiv = document.getElementById("sim");
    while (document.getElementById("SheepContainer").hasChildNodes()) {
        document.getElementById("SheepContainer").removeChild(document.getElementById("SheepContainer").firstChild);
    }
    while (document.getElementById("WolfContainer").hasChildNodes()) {
        document.getElementById("WolfContainer").removeChild(document.getElementById("WolfContainer").firstChild);
    }
    for (let s=0; s < parseInt(document.getElementById("InputSheepNum").value); s++) {
        sc = s;
        while (sc > SheepColours.length-1) {
            sc -= SheepColours.length;
        }
        sheep = new Sheep();
        sheep.colour = SheepColours[sc]
        SheepArray.push(sheep);
        SheepIdArray.push(sheep.id);
        sheep.Update();
    }
    for (let w=0; w < parseInt(document.getElementById("InputWolfNum").value); w++) {
        wolf = new Wolf();
        WolfArray.push(wolf);
        WolfIdArray.push(wolf.id);
        wolf.Update();
    }
    while (containerDiv.hasChildNodes()) {
        containerDiv.removeChild(containerDiv.firstChild);
    }
    GenSim();
    stop = false;
}
GenSim();

function UpdateSim() {
    if (stop === false) {
        for (let sheep in SheepArray) {
            SheepArray[sheep].Update();
        }
        for (let wolf in WolfArray) {
            WolfArray[wolf].Update();
        }
        for (let gr in GrassGrid) {
            for (let gp in GrassGrid[gr]) {
                if (GrassGrid[gr][gp].eaten === true) {
                    GrassGrid[gr][gp].UpdateGrow(gr, gp);
                }
            }
        }
        setTimeout(UpdateSim, 200-parseInt(document.getElementById("SimSpeed").value));
    }
}
setTimeout(UpdateSim, 200-parseInt(document.getElementById("SimSpeed").value));
