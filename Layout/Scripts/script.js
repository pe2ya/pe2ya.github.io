var constructor = document.querySelector(".page.constructor");
var preview = document.querySelector(".page.preview");
var btnContainers = document.querySelectorAll(".btn-container.nb");
var i;

for(i = 0; i < btnContainers.length; i++)
{
    btnContainers[i].onclick = function() {
        if(this === btnContainers[0] || this == btnContainers[2]){
            preview.classList.toggle("active");

            GetPagePosition(preview.className.includes("active"), -1);
        }
        else {
            constructor.classList.toggle("active");

           GetPagePosition(constructor.className.includes("active"), 1);
        }
    }
}

function GetPagePosition(bool, num)
{
    if(bool)
    {
        localStorage.page = num;
    }
    else
    {
        localStorage.page = 0;
    }
}

var addbutton  = document.querySelector("#add");
var setterbuttons = document.querySelector("#set");
var title = document.querySelector("#constructor-title");
addbutton.onclick = function() {
    setterbuttons.classList.toggle("active");
    title.classList.toggle("active");
}

var containerBtn = document.querySelector("#create-container");
var inputWidth = document.querySelector(".width input");
var inputHeight = document.querySelector(".height input");

function GetInput(input, limit, name){

    if(limit > 0)
    {
        let number = parseInt(input.value);
        if(Number.isInteger(number))
        {   
            if(number < 1)
            {
                alert(name + " is too low");
                return 0;
            }
            if(number <= limit) { return number; }

            alert("Number is too much\n"+ name + " set to: " + limit);
            return parseInt(limit);
        }
        else
        {
            alert("Incorrect " + name + " value");
            return 0;
        }
    }
    else {
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if(!format.test(input.value))
        {
            return input.value;
        } else {
            alert("Incorrect " + name + " value");
            return false
        }
    }
}

var container = document.createElement("div");
container.className = "auto-fill";

var element = document.createElement("div");
element.className = "element"

function AppendELement(cont, num, bool) {
    var el = element.cloneNode(true);
    if(num != 0){
        if(bool)
        {
            el.setAttribute("data-hover", num);
        } else {
            el.innerHTML = num;
        }
    }
    cont.appendChild(el);
}
function AppendELementWithCLassName(cont, name, num, bool) {
    var el = element.cloneNode(true);
    if(num != 0){
        if(bool)
        {
            el.setAttribute("data-hover", num);
        } else {
            el.innerHTML = num;
        }
    }
    el.classList.add(name);
    cont.appendChild(el);
}

var editor = document.querySelector("#el-container");
editor.innerHTML = "";
containerBtn.onclick = function() {
    let numberOfColumns = GetInput(inputHeight, 75, "Width");
    let numberOfElements = GetInput(inputWidth, 75, "Height");

    if(numberOfElements != 0 || numberOfColumns != 0)
    {
        var autoFill = container.cloneNode(true);
    
        for(i = 0; i < numberOfColumns; i++)
        {
           for(var j = 0; j < numberOfElements; j++)
           {
                AppendELement(autoFill, 0, false);
           } 
        }
    
        autoFill.setAttribute("style", "grid-template-columns: repeat(" + numberOfElements + ", auto)");
        editor.appendChild(autoFill);
    
        setterbuttons.classList.remove("active");
        title.classList.remove("active");
        inputWidth.value = "";
        inputHeight.value = "";

        localStorage.backup = editor.innerHTML;
    }
}

var emptyBtn = document.querySelector("#add-empty");
var premiumBtn = document.querySelector("#add-premium");
var premiumPlusBtn = document.querySelector("#add-premium-plus");
var EditBtn = document.querySelector("#edit-section");

var btns = [emptyBtn, premiumBtn, premiumPlusBtn, EditBtn];

function EditMode(name) {


    var els = document.querySelectorAll(".element");
    for(i = 0; i < els.length; i++)
    {
        els[i].onclick = function() {
            if(this.className !== "element " + name)
            {
                this.className = "element";
            }
            this.classList.toggle(name);

            localStorage.backup = editor.innerHTML;
        }
    }
}

function SwitchBtn(btn)
{
    btns.forEach((el) =>
    {
        if(!(el === btn))
        {
           el.className = "btn-container edit";
        }
        else
        {
            el.classList.add("active");
        }
    })
}
emptyBtn.onclick = function() { EditMode("empty"); SwitchBtn(emptyBtn); }
premiumBtn.onclick = function() { EditMode("premium"); SwitchBtn(premiumBtn); }
premiumPlusBtn.onclick = function() { EditMode("premium-plus"); SwitchBtn(premiumPlusBtn); }
EditBtn.onclick = function() { alert("Coming soon"); }

function Template(name, template, defaultp, pprice, ppprice) {
    this.name = name;
    this.template = template;
    this.defaultp = defaultp;
    this.pprice = pprice;
    this.ppprice = ppprice;
  }

  function Section(section, columnN, rowN) {
    this.section = section;
    this.columnN = columnN;
    this.rowN = rowN;
  }
  
var createBtn = document.querySelector("#create");
createBtn.onclick = function() {

    if(editor.innerHTML.length > 1)
    {
        ConstructorForm.classList.add("active");
    } else {
        alert("At first add elements");
    }
}

// useless function
function ObjToJson(obj) {
    var pattern = '"template":[';
    var sections = obj.template;
    obj.template = [];
    var split = JSON.stringify(obj).split(pattern);
    var firstPart = split[0] + pattern;
    var secontPart = split[1];
    sections.forEach((s) => {
        var JsonString = JSON.stringify(s);
        firstPart += JsonString + ",";
    });
    result = firstPart.slice(0, -1) + secontPart;
    return result;
}

function JsonToObj(json){
    var obj = JSON.parse(json);
    var sectionArray = [];
    obj.template.forEach((s) =>{
        var section = new Section(s.section, s.columnN, s.rowN);
        sectionArray.push(section);
    });

    var result = new Template(obj.name, sectionArray, obj.defaultp, obj.pprice, obj.ppprice);
    return result;
}

function ShowTemplate(obj, id) {

    var area = document.querySelector("#" + id);
    area.innerHTML = "";

    var tempcontainer = document.createElement("div");
    tempcontainer.className = "template-container";

    var tempName = document.createElement("h1");
    tempName.innerHTML = obj.name;
    tempcontainer.appendChild(tempName);

    var tempSeats = document.createElement("div");
    tempSeats.className = "template-seats";

    var holder = document.createElement("div");
    holder.className = "template-info";

    var sectionArray = obj.template;
    let rn = 1;
    sectionArray.forEach((s) =>{
        var ts = tempSeats.cloneNode(false);
        var autoFill = container.cloneNode(false);
        var seats = container.cloneNode(false);

        let seatN = 1;
        let nl = 0;
        s.section.forEach((el) =>{
            if(nl % s.columnN == 0)
            {
                nl = 0;
                seatN = 1;
            }
            switch(el){
                case 0:
                    AppendELement(autoFill, seatN, true);
                    break;
                case -1:
                    AppendELementWithCLassName(autoFill, "empty", 0, true);
                    break;
                case 1:
                    AppendELementWithCLassName(autoFill, "premium", seatN, true);
                    break;
                case 2:
                    AppendELementWithCLassName(autoFill, "premium-plus", seatN, true);
                    break;
                case 10:
                    AppendELementWithCLassName(autoFill, "reserved", seatN, true);
                    break;
            }
            if(el != -1) {
                seatN++;
            }

            if(nl == 0)
            {
                AppendELementWithCLassName(seats, "empty", rn, false);
                rn++;
            }

            nl++;
        });
        seats.setAttribute("style", "grid-template-columns: 1");
        autoFill.setAttribute("style", "grid-template-columns: repeat(" + s.columnN + ", auto)");
        ts.appendChild(seats.cloneNode(true));
        ts.appendChild(autoFill);
        ts.appendChild(seats);
        holder.appendChild(ts);
    });
    tempcontainer.appendChild(holder)

    tempcontainer.appendChild(EnterPrice(obj.defaultp, obj.pprice, obj.ppprice));

    area.appendChild(tempcontainer);
    
}

function EnterPrice(d, p, pp) {
    var names = ["", "premium", "premium-plus"];
    var pr = [d, p, pp];

    var result =  document.createElement("div");
    result.className = "price-group";

    var appen = document.createElement("div");
    appen.className = "price";

    for(var i = 0; i < names.length; i++)
    {
        var a = appen.cloneNode(false);
        if(names[i] != "")
        {
            AppendELementWithCLassName(a, names[i], 0, false);
        } else {
            AppendELement(a, 0, false);
        }

        a.innerHTML += "- " + pr[i];
        result.append(a);
    }
    return result; 
}

var ConstructorCansel = document.querySelector("#constructor-cansel");
var ConstructorFComfirm = document.querySelector("#constructor-comfirm");
var ConstructorForm = document.querySelector("#constructor-form");

var InputNameConstr = document.querySelector("#tname");
var InputDefaultP = document.querySelector("#defaultp");
var InputPreriumPr = document.querySelector("#pprice");
var InputPremiumPlusPr = document.querySelector("#ppp");

ConstructorForm.onsubmit = function () {
     
    var name = GetInput(InputNameConstr, 0, "Template name");
    var defaultp = GetInput(InputDefaultP, 1_000_000, "Default price")
    var pprice = GetInput(InputPreriumPr, 1_000_000, "Premium price");
    var ppp = GetInput(InputPremiumPlusPr, 1_000_000, "Premium price");

    if(name && pprice && ppp)
    {
        var sectionArray = [];
        editor.querySelectorAll(".auto-fill").forEach((el) =>
        {
            var section = [];
            var elComStyle = window.getComputedStyle(el);
            let numberOfColumns = elComStyle.getPropertyValue("grid-template-columns").split(" ").length;
            let numberOfRows = elComStyle.getPropertyValue("grid-template-rows").split(" ").length;

            el.querySelectorAll(".element").forEach((child) =>
            {
                var classN = child.className;
                switch(classN){
                    case "element":
                        section.push(0);
                        break;
                    case "element empty":
                        section.push(-1);
                        break;
                    case "element premium":
                        section.push(1);
                        break;
                    case "element premium-plus":
                        section.push(2);
                        break;
                }
            })
            var newSection = new Section(section, numberOfColumns, numberOfRows);
            sectionArray.push(newSection);
    
        })
        var template = new Template(name, sectionArray, defaultp, pprice, ppp);
        console.log(template);
    
        localStorage.template = JSON.stringify(template);
        localStorage.backup = "";
        localStorage.page = 0;
    
        constructor.classList.remove("active");
        ConstructorForm.classList.remove("active");
    
        ShowTemplate(template, "template");
    
        editor.innerHTML = "";
        InputNameConstr.value = "";
        InputPreriumPr.value = "";
        InputPremiumPlusPr.value = ""; 

    }
    return false;
}

ConstructorCansel.onclick = function () {
    ConstructorForm.classList.remove("active");
}

ConstructorFComfirm.onclick = function () {
}

if(localStorage.template) {
    ShowTemplate(JsonToObj(localStorage.template), "template");
}

if(localStorage.backup) {
    editor.innerHTML = localStorage.backup;
}

if(localStorage.page) {
    switch(parseInt(localStorage.page)) {
        case -1: 
            preview.classList.add("active");
            break;
        case 1:
            constructor.classList.add("active");
            break;
    }
}

