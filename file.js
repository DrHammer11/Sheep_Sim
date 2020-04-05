function loadData() {
    dataArray = JSON.parse(localStorage.getItem("SimChanges"));
    return dataArray;
}

function UpdateData(newdata) {
    localStorage.setItem("SimChanges", JSON.stringify(newdata));
}

class Grass {
    constructor() {
        this.energygiven = parseInt(document.getElementById("InputGrassEnergy").value);
        this.eaten = false;
        this.coords = ['x','y'];
        // this.illness = false;
        // if (Math.random() < 0.001) {
        //     this.illness = true;
        // }
      }
      UpdateEaten(gr, gp) {
        // if (this.illness === true) {
        //     GrassElements[gr][gp].style.backgroundColor = 'yellowgreen';
        // }
        if (this.eaten === true) {
            GrassElements[gr][gp].style.backgroundColor = "saddlebrown";
        }
      }
      UpdateGrow(gr, gp) {
        gr = parseInt(gr)
        gp = parseInt(gp)
        let ChanceOfRegrow = 0;
        //let ChanceOfIllness = 0;
        if (gp !== 0 && GrassGrid[gr][gp-1].eaten === false) {
            ChanceOfRegrow += parseInt(document.getElementById("InputGrassRegrow").value)/400;
            // if (GrassGrid[gr][gp-1].illness === true) {
            //     ChanceOfIllness += 0.01;
            // }
        }
        if (gp !== 119 && GrassGrid[gr][gp+1].eaten === false) {
            ChanceOfRegrow += parseInt(document.getElementById("InputGrassRegrow").value)/400;
            // if (GrassGrid[gr][gp+1].illness === true) {
            //     ChanceOfIllness += 0.01;
            // }
        }
        if (gr !== 0 && GrassGrid[gr-1][gp].eaten === false) {
            ChanceOfRegrow += parseInt(document.getElementById("InputGrassRegrow").value)/400;
            // if (GrassGrid[gr-1][gp].illness === true) {
            //     ChanceOfIllness += 0.01;
            // }
        }
        if (gr !== 119 && GrassGrid[gr+1][gp].eaten === false) {
            ChanceOfRegrow += parseInt(document.getElementById("InputGrassRegrow").value)/400;
            // if (GrassGrid[gr+1][gp].illness === true) {
            //     ChanceOfIllness += 0.01;
            // }
        }
        if (Math.random() <= ChanceOfRegrow) {
            this.eaten = false;
            GrassElements[gr][gp].style.backgroundColor = "green";
        }
        // if (Math.random() <= ChanceOfIllness && this.eaten === false) {
        //     if (this.illness === true && Math.random() <= 0.2) {
        //         this.eaten = true;
        //         this.illness = false;
        //     }
        //     else {
        //         this.illness = true;
        //     }
        // }
        // if (Math.random() <= 0.014-ChanceOfIllness) {
        //     this.illness = false;
        //     GrassElements[gr][gp].style.backgroundColor = "green";
        // }
      }
}
class Sheep {
    constructor() {
        this.x = 5*randomint(1, GrassAreaSize)+350;
        this.y = 5*randomint(1, GrassAreaSize)+4;
        this.id = "Sheep"+SheepCreated;
        this.element = document.createElement('div');
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('class', 'sheepObj');
        this.element.setAttribute('style', "position: absolute; left: 0px; top: 0px;");
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
        if (this.x > 5*GrassAreaSize+346) {
            this.x = 5*GrassAreaSize+346;
        }
        if (this.y > 5*GrassAreaSize+4) {
            this.y = 5*GrassAreaSize-1;
        }
        if (this.x < 350) {
            this.x = 350;
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
                this.energy -= 5;
                this.energygiven -= 5;
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
        if (this.age >= parseInt(document.getElementById("InputSheepAge").value) || this.energy <= 0) {       
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
        this.x = 5*randomint(1, GrassAreaSize)+350;
        this.y = 5*randomint(1, GrassAreaSize)+4;
        this.id = "Wolf"+WolfCreated;
        this.element = document.createElement('div');
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('class', 'wolfObj');
        this.element.setAttribute('style', "position: absolute; left: 0px; top: 0px;");
        document.getElementById("WolfContainer").appendChild(this.element);
        this.energy = 70;
        this.age = 0;
        this.speed = parseInt(document.getElementById("InputWolfSpeed").value);
        this.originalspeed = parseInt(document.getElementById("InputWolfSpeed").value);
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
            this.speed = this.originalspeed - this.originalspeed*(0.5/6.2);
        }
        if (this.age > 235) {
            this.speed = this.originalspeed - this.originalspeed*(0.5/6.2);
        }
        if (this.age >= parseInt(document.getElementById("InputWolfAge").value) || this.energy <= 0) {    
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
                //GrassGrid[gr][gp].illness = false;
                if (hsheep.colour === "pink") {
                    hsheep.energy += 0.1 * GrassGrid[gr][gp].energygiven;
                }
                hsheep.energy += GrassGrid[gr][gp].energygiven;
                hsheep.energygiven += GrassGrid[gr][gp].energygiven;
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
        if (hwolf.x <= sheep.x+9 && hwolf.x >= sheep.x && hwolf.y <= sheep.y+9 && hwolf.y >= sheep.y) {
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
SheepPopGraph = new Array();
SheepCreated = 0;
WolfArray = new Array();
WolfIdArray = new Array();
WolfPopGraph = new Array();
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
document.getElementById("InputWolfAge").value = '300';
document.getElementById("InputSheepAge").value = '250';
document.getElementById("InputWolfSpeed").value = '6.2';
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
            GrassGrid[i][j].coords = [5*(j+1)+350, 5*(i+1)+4];
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
    SheepPopGraph = new Array();
    SheepCreated = 0;
    WolfArray = new Array();
    WolfIdArray = new Array();
    WolfPopGraph = new Array();
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
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx2.clearRect(0, 0, c2.width, c2.height);
    ctx2.beginPath();
    ctx2.moveTo(0, 0);
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
                //if (GrassGrid[gr][gp].eaten === true) {
                GrassGrid[gr][gp].UpdateGrow(gr, gp);
                //}
                GrassGrid[gr][gp].UpdateEaten(gr, gp);
                //if (GrassGrid[gr][gp].eaten === true || GrassGrid[gr][gp].illness === true) {
                //    GrassGrid[gr][gp].UpdateEaten(gr, gp);
                //}
            }
        }
        let totalspp = '';
        for (let scs in SheepColours) {
            scs = SheepColours[scs];
            let counter = 0;
            for (let sheep in SheepArray) {
                sheep = SheepArray[sheep];
                if (sheep.colour === scs) {
                    counter += 1;
                }
            }
            totalspp += (scs + " sheep population: "+counter.toString()+"<br>");
        }
        document.getElementById("sheepPop").innerHTML = totalspp;
        document.getElementById("wolfPop").innerHTML = "Wolf population: "+WolfArray.length.toString();
        WolfPopGraph.push(WolfArray.length);
        ctx.strokeStyle = "rgb(77, 85, 85)";
        if ((WolfPopGraph.length-1)/2 > 300) {
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            WolfPopGraph = [];
        }
        ctx.lineTo((WolfPopGraph.length-1)/2, c.height-WolfArray.length);
        ctx.stroke();
        SheepPopGraph.push(SheepArray.length);
        ctx2.strokeStyle = "rgb(201, 129, 195)";
        if ((SheepPopGraph.length-1)/2 > 300) {
            ctx2.clearRect(0, 0, c2.width, c2.height);
            ctx2.beginPath();
            ctx2.moveTo(0, 0);
            SheepPopGraph = [];
        }
        ctx2.lineTo((SheepPopGraph.length-1)/2, c2.height-SheepArray.length);
        ctx2.stroke();
        setTimeout(UpdateSim, 200-parseInt(document.getElementById("SimSpeed").value));
    }
}
function SaveChanges() {
   UpdateData([document.getElementById('SimSpeed').value,
   document.getElementById("InputSheepNum").value,
   document.getElementById("InputWolfNum").value,
   document.getElementById("InputFightPerc").value,
   document.getElementById("InputGrassEnergy").value,
   document.getElementById("InputGrassRegrow").value,
   document.getElementById("InputWolfAge").value,
   document.getElementById("InputSheepAge").value,
   document.getElementById("InputWolfSpeed").value])
}
function LoadChanges() {
    sca = loadData();
    document.getElementById('SimSpeed').value = sca[0];
    document.getElementById("InputSheepNum").value = sca[1];
    document.getElementById("InputWolfNum").value = sca[2];
    document.getElementById("InputFightPerc").value = sca[3];
    document.getElementById("InputGrassEnergy").value = sca[4];
    document.getElementById("InputGrassRegrow").value = sca[5];
    document.getElementById("InputWolfAge").value = sca[6];
    document.getElementById("InputSheepAge").value = sca[7];
    document.getElementById("InputWolfSpeed").value = sca[8];   
 }
//  function ViewGraph() {
//     var c = document.getElementById("myCanvas");
//     var ctx = c.getContext("2d");
//     ctx.clearRect(0, 0, c.width, c.height);
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     ctx.strokeStyle = "rgb(77, 85, 85)";
//     for (let wp in WolfPopGraph) {
//         ctx.lineTo(wp/2, c.height-WolfPopGraph[wp]);
//         ctx.stroke();
//     }
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     ctx.strokeStyle = "rgb(201, 129, 195)";
//     for (let sp in SheepPopGraph) {
//         ctx.lineTo(sp/2, c.height-SheepPopGraph[sp]);
//         ctx.stroke();
//     }
// }
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.moveTo(0, 0);
var c2 = document.getElementById("myCanvas2");
var ctx2 = c2.getContext("2d");
ctx2.beginPath();
ctx2.moveTo(0, 0);
setTimeout(UpdateSim, 200-parseInt(document.getElementById("SimSpeed").value));
