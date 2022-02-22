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

var container = document.createElement("div");
container.className = "auto-fill";

var element = document.createElement("div");
element.className = "element"

function AppendELement(cont) {
    var el = element.cloneNode(true);
    cont.appendChild(el);
}
function AppendELementWithCLassName(cont, name) {
    var el = element.cloneNode(true);
    el.classList.add(name);
    cont.appendChild(el);
}

var editor = document.querySelector("#el-container");
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
                AppendELement(autoFill);
           } 
        }
    
        autoFill.setAttribute("style", "grid-template-columns: repeat(" + numberOfElements + ", auto)");
        editor.appendChild(autoFill);
    
        setterbuttons.classList.remove("active");
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

function Template(name, template) {
    this.name = name;
    this.template = template;
  }

  function Section(section, columnN) {
    this.section = section;
    this.columnN = columnN;
  }
  
var createBtn = document.querySelector("#create");
createBtn.onclick = function() {
    var sectionArray = [];
    editor.querySelectorAll(".auto-fill").forEach((el) =>
    {
        var section = [];
        var elComStyle = window.getComputedStyle(el);
        let numberOfElement = elComStyle.getPropertyValue("grid-template-columns").split(" ").length;
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
        var newSection = new Section(section, numberOfElement);
        sectionArray.push(newSection);

    })
    var template = new Template("Template", sectionArray);
    console.log(template);

    localStorage.template = JSON.stringify(template);
    localStorage.backup = "";

    editor.innerHTML = "";
    constructor.classList.remove("active");

    ShowTemplate(template, "template");
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
        var section = new Section(s.section, s.columnN);
        sectionArray.push(section);
    });

    var result = new Template(obj.name, sectionArray);
    return result;
}

function ShowTemplate(obj, id) {
    var name = obj.name;
    var area = document.querySelector("#" + id);
    area.innerHTML = "";
    var sectionArray = obj.template;

    sectionArray.forEach((s) =>{
        var autoFill = container.cloneNode(true);

        s.section.forEach((el) =>{
            switch(el){
                case 0:
                    AppendELement(autoFill);
                    break;
                case -1:
                    AppendELementWithCLassName(autoFill, "empty");
                    break;
                case 1:
                    AppendELementWithCLassName(autoFill, "premium");
                    break;
                case 2:
                    AppendELementWithCLassName(autoFill, "premium-plus");
                    break;
                case 10:
                    AppendELementWithCLassName(autoFill, "reserved");
                    break;
            }
        });

        autoFill.setAttribute("style", "grid-template-columns: repeat(" + s.columnN + ", auto)");
        area.appendChild(autoFill);
    });
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