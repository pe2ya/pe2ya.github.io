var constructor = document.querySelector(".page.constructor");
var preview = document.querySelector(".page.preview");
var btnContainers = document.querySelectorAll(".btn-container.nb");
var i;

for(i = 0; i < btnContainers.length; i++)
{
    btnContainers[i].onclick = function() {
        if(this === btnContainers[0] || this == btnContainers[2]){
            preview.classList.toggle("active");
        }
        else {
            constructor.classList.toggle("active");
        }
    }
}

var addbutton  = document.querySelector("#add");
var setterbuttons = document.querySelector("#set");
addbutton.onclick = function() {
    setterbuttons.classList.toggle("active");
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
var editor = document.querySelector("#el-container");
containerBtn.onclick = function() {
    let numberOfColumns = GetInput(inputHeight, 75, "Width");
    let numberOfElements = GetInput(inputWidth, 75, "Height");

    if(numberOfElements != 0 || numberOfColumns != 0)
    {
        var container = document.createElement("div");
        container.className = "auto-fill";
    
        var element = document.createElement('div');
        element.className = "element";
    
        for(i = 0; i < numberOfColumns; i++)
        {
           for(var j = 0; j < numberOfElements; j++)
           {
                var element = document.createElement('div');
                element.className = "element";
    
                container.appendChild(element);
           } 
        }
    
        container.setAttribute("style", "grid-template-columns: repeat(" + numberOfElements + ", auto)");
        editor.appendChild(container);
    
        setterbuttons.classList.remove("active");
        inputWidth.value = "";
        inputHeight.value = "";
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
            el.classList.toggle("active");
        }
    })
}
emptyBtn.onclick = function() { EditMode("empty"); SwitchBtn(emptyBtn); }
premiumBtn.onclick = function() { EditMode("premium"); SwitchBtn(premiumBtn); }
premiumPlusBtn.onclick = function() { EditMode("premium-plus"); SwitchBtn(premiumPlusBtn); }
EditBtn.onclick = function() { alert("Coming soon"); }

let sectionNumber = 1;

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
        var array = [];
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
        array.push(section);
        var newSection = new Section(array, numberOfElement);
        sectionArray.push(newSection);
    })
    var template = new Template("Template" + sectionNumber, sectionArray);
    console.log(template);
    sectionNumber++;

    editor.innerHTML = "";
    constructor.classList.remove("active");
}