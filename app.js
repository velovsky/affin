//init
const myApp = new myAppClass();
myApp.render();

const myApp2 = new myAppClass();
myApp2.render();

function myAppClass()
{
  //props (default values)
  this.adultos = 1;
  this.criancas = 0;
  this.bebes = 0;

  //dom refs
  this.app = undefined;

  //html template
  this._template = 
  `
    <div class="header">
      <img src="./user.png" alt="">
      <span class="header-text">${this.adultos} Adulto</span>
    </div>

    <div class="content"></div>
  `;

  this._section =
  `
    <span></span>
    <div class="quantify">
      <div class="square minus">-</div>
      <span></span>
      <div class="square plus">+</div>
    </div>
  `

  //methods
  this._createSection = function(type, labelText) //auxiliary method
  {
    let sectionDom = document.createElement('div');
    sectionDom.className = "section " + type;
    sectionDom.innerHTML = this._section;

    let labelDom = sectionDom.querySelector("span:first-child");
    labelDom.innerHTML = labelText;

    let valueDom = sectionDom.querySelector(".quantify > span");
    valueDom.innerHTML = this[type];

    let minusDom = sectionDom.querySelector(".quantify .minus");
    minusDom.addEventListener('click', 
      () => { this.doMaths(type, valueDom, "sub") }, false);
    let plusDom = sectionDom.querySelector(".quantify .plus");
    plusDom.addEventListener('click', 
      ()=> { this.doMaths(type, valueDom, "add") }, false);

    return sectionDom;
  },
  this._toggleDisableClasses = function(domArr, isAdd)
  {
    for( var i=0; i < domArr.length; i++ )
    {
      isAdd ? domArr[i].classList.add('disabled') : 
        domArr[i].classList.remove('disabled')
    }
  },
  this.open = function(appDom)
  {
    appDom.classList.add("is-open");
  },
  this.updateText = function()
  {
    let headerTextDom = this.app.querySelector(".header-text");

    //clean
    headerTextDom.innerHTML = "";

    //adultos
    headerTextDom.innerHTML += this.adultos;
    headerTextDom.innerHTML += this.adultos !== 1 ? " Adultos" : " Adulto";

    //criancas
    if(this.criancas > 0)
    {
      headerTextDom.innerHTML += ', '
      headerTextDom.innerHTML += this.criancas;
      headerTextDom.innerHTML += this.criancas > 1 ? " Crianças" : " Criança";
    }

    //bebes
    if(this.bebes > 0)
    {
      headerTextDom.innerHTML += ', '
      headerTextDom.innerHTML += this.bebes;
      headerTextDom.innerHTML += this.bebes > 1 ? " Bebés" : " Bebé";
    }
  },
  this.doMaths = function(type, valueDom, operation)
  {
    let oldValue =  this[type];
    operation === "add" ? this[type]++ : this[type]--;

    //rules
    if( this[type] < 0 )
    {
      //pass old value
      this[type] = oldValue;

      return;
    }


    if( (this.adultos + this.criancas + this.bebes) > 9)
    {
      //pass old value
      this[type] = oldValue;

      //disable all 'plus'
      let pluses = this.app.querySelectorAll('.square.plus');
      this._toggleDisableClasses(pluses, true);

      return;
    }

    if( this.criancas > this.adultos * 4 )
    {
      //pass old value
      this[type] = oldValue;

      //disable criancas 'plus'
      let pluses = this.app.querySelectorAll('.section.criancas .square.plus');
      this._toggleDisableClasses(pluses, true);

      return;
    }

    if( this.criancas >= this.adultos * 4 && this.bebes >= this.adultos 
       || this.bebes > this.adultos
       || this.criancas > this.adultos && this.bebes >= this.adultos
       || Math.floor( this.criancas / this.adultos ) >= 2 && this.bebes > 0 )
    {
      //pass old value
      this[type] = oldValue;

      //disable bebes 'plus'
      let pluses = this.app.querySelectorAll('.section.bebes .square.plus');
      this._toggleDisableClasses(pluses, true);

      return;
    }
    
    //if valid continue & restore disabled buttons
    let squares = this.app.querySelectorAll('.square');
    this._toggleDisableClasses(squares, false);

    valueDom.innerHTML = this[type];
    this.updateText();
  }
  this.render = function()
  {
    //new DOM
    //APP
    let newAppDom = document.createElement('div');
    newAppDom.className = "app";
    newAppDom.innerHTML = this._template;    //append template

    //HEADER
    let headerDom = newAppDom.querySelector(".header");
    headerDom.addEventListener('click', () => this.open(newAppDom), false);

    //CONTENT
    let contentDom = newAppDom.querySelector(".content");

    //CONTENT: adultos
    let adultosSectionDom = this._createSection("adultos", "Adultos (+12 anos)");
    contentDom.append(adultosSectionDom);

    //CONTENT: criancas
    let criancasSectionDom = this._createSection("criancas", "Crianças (2-11 anos)");
    contentDom.append(criancasSectionDom);

    //CONTENT: bebes
    let bebesSectionDom = this._createSection("bebes", "Bebés (-2 anos)");
    contentDom.append(bebesSectionDom);

    //TODO: input the element to append to?
    document.body.append(newAppDom);
    this.app = newAppDom;

    //close app when clicked outside of box
    const closeApp = 
    function(element)
    {
      if(this === element.target.closest(".app"))
        return;

      this.classList.remove('is-open');
    }.bind(newAppDom);
    
    document.addEventListener('click', closeApp);
  }
}