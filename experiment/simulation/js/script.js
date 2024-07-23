const canvas = document.querySelector("#simscreen");
const ctx = canvas.getContext("2d");
const btnStart = document.querySelector(".btn-start");
const btnReset = document.querySelector(".btn-reset");
const voltageButtons = document.querySelectorAll(".voltage");
const vfspinner = document.querySelector("#vfspinner");
const temperature1 = document.querySelector("#temp1");
const temperature2 = document.querySelector("#temp2");
const temperature3 = document.querySelector("#temp3");
const temperature4 = document.querySelector("#temp4");
const temperature5 = document.querySelector("#temp5");
const btnCheck1 = document.querySelector(".btn-check1");
const btnCheck2 = document.querySelector(".btn-check2");
const taskTitle = document.querySelector(".task-title");



btnStart.addEventListener("click", initiateProcess);
btnReset.addEventListener("click", resetAll);
voltageButtons.forEach((voltage) =>
  voltage.addEventListener("click", () => setVoltage(voltage))
);
document.addEventListener('DOMContentLoaded', function () {
  const sliders = document.querySelectorAll('.slider');
  
  sliders.forEach(slider => {
      slider.addEventListener('input', function () {
          const tempVal = this.nextElementSibling;
          tempVal.textContent = this.value;
      });
  });
});


function enableElements() {
  const elements = [
    {slider: 'tinfslider', spinner: 'tinfspinner'},
    {slider: 'tbslider', spinner: 'tbspinner'},
    {slider: 'lslider', spinner: 'lspinner'},
    {slider: 'pslider', spinner: 'pspinner'},
    {slider: 'acslider', spinner: 'acspinner'}
  ];
  
  elements.forEach(el => {
    const slider = document.getElementById(el.slider);
    const spinner = document.getElementById(el.spinner);
    slider.style.pointerEvents = 'auto';
    slider.style.opacity = '1';
    spinner.disabled = false;
  });
}

function disableElements() {
  const elements = [
    {slider: 'tinfslider', spinner: 'tinfspinner'},
    {slider: 'tbslider', spinner: 'tbspinner'},
    {slider: 'lslider', spinner: 'lspinner'},
    {slider: 'pslider', spinner: 'pspinner'},
    {slider: 'acslider', spinner: 'acspinner'}
  ];
  
  elements.forEach(el => {
    const slider = document.getElementById(el.slider);
    const spinner = document.getElementById(el.spinner);
    slider.style.pointerEvents = 'none';
    slider.style.opacity = '0.5';
    spinner.disabled = true;
  });
}
document.querySelector(".tool-practice").style.opacity = "0.5";
document.querySelector(".tool-practice").style.pointerEvents = "none";
let steadyState = 0;
let currentVoltage = 0;
//controls section
var v = 0;
var tinf = 27; //Celsuis
var tbase = 30; //Celsuis
var len = 20; //Meter
var peri = 5; //Perimeter
var a_c = 25; //Area of cross section
var h_coeff = 100; //Convection coeff
var k = 201;
var qfin = 0;
var t_l2 = 0;

ktemp// var m = 5;
//timing section
let simTimeId = setInterval("", "1000");
let TimeInterval = setInterval("", "1000");
let TimeInterval1 = setInterval("", "1000");
var time=0;
var time1 = 0;
var time2 = 0;

//point tracing section and initial(atmospheric section)
var t1 = [26, 28.1, 26.5, 27, 27.2];
var off = [0,0,0,0,0];
var q = [43.36, 43.71, 43.84];
var qtemp = 1;
var ktemp = 1;
var th = [45,45,45,45,45];

//temporary or dummy variables for locking buttons
var temp=0;
var temp1 = 2;
var temp2 = 0;

function displayDiv(ele) {
  const taskScreen = document.querySelectorAll(".task-screen");
  taskScreen.forEach((task) => {
    task.classList.add("hide");
  });
  if (ele.classList.contains("tool-objective")) {
    document.querySelector(".objective").classList.remove("hide");
    taskTitle.textContent = "Objective";

  }
  if (ele.classList.contains("tool-description")) {
    document.querySelector(".description").classList.remove("hide");
    taskTitle.textContent = "Description";

  }
  if (ele.classList.contains("tool-explore")) {
    document.querySelector(".explore").classList.remove("hide");
    document.querySelector(".extra-info").classList.remove("hide");
    taskTitle.textContent = "Experiment";



    if (temp2 !== 1) {
      drawModel();
      startsim();
      varinit();
    }
  }
  if (ele.classList.contains("tool-practice")) {
    document.querySelector(".practice").classList.remove("hide");
    taskTitle.textContent = "Solve";


    if (temp2 == 1) {
 
      temp1 = 1;
      validation();
      document.querySelector("#info").innerHTML = "Temperature Gradient";
      document.querySelector(".extra-info").classList.remove("hide");
      console.log("option visible")
    } else {
      console.log("option invisible")
    
      document.querySelector("#info").innerHTML =
        "Perform the experiment to solve the questions";
      document.querySelector(".graph-div").classList.add("hide");
      document.querySelector(".questions").classList.add("hide");
      document.querySelector(".extra-info").classList.add("hide");
    }
  }
}
//Change in Variables with respect to time
function varinit() {
 
	varchange();
	//Variable r1 slider and number input types
	$('#tinfslider').slider("value", tinf);	
	$('#tinfspinner').spinner("value", tinf);

  if (tinf > tbase) {
    tbase = tinf + 5;
  }
  //-----------
  $('#tbslider').slider("value", tbase);	
	$('#tbspinner').spinner("value", tbase);

  
  //-----------
  $('#lslider').slider("value", len);	
	$('#lspinner').spinner("value", len);

  //-----------
  $('#pslider').slider("value", peri);	
	$('#pspinner').spinner("value", peri);

  //-----------
  $('#acslider').slider("value", a_c);	
	$('#acspinner').spinner("value", a_c);

	 
  if(time2 > 0){ t1[0] += off[0];};
  if(time2 > 0){ t1[1] += off[1];};
  if(time2 > 0){t1[2] += off[2];};
  if(time2 > 3){t1[3] += off[3];};
  if(time2 > 3){t1[4] += off[4];};

  if(v == 10){
    heat = 50;
    qtemp = q[0];
    ktemp = k[0];
  }
  else if(v == 20){
    heat = 60;
    qtemp = q[1];
    ktemp = k[1];
  }
  else if(v == 30){
    heat = 70;
    qtemp = q[2];
    ktemp = k[2];
  }
  else{
    heat = 0;
  }

  // $('#Heat').spinner("value",heat);

	// $('#temp1').spinner("value",t1[0]);
	
	// $('#temp2').spinner("value", t1[1]);

	// $('#temp3').spinner("value", t1[2]);

	// $('#temp4').spinner("value", t1[3]);

	// $('#temp5').spinner("value", t1[4]);
  // console.log(currentVoltage, vf);
  // if (time2 > 0) {
  //   t1[0] += off[0];
  // }
  // if (time2 > 1) {
  //   t1[1] += off[1];
  // }
  // if (time2 > 2) {
  //   t1[2] += off[2];
  // }
  // if (time2 > 3) {
  //   t1[3] += off[3];
  // }
  // if (time2 > 4) {
  //   t1[4] += off[4];
  // }

  // vfspinner.textContent = vf;
  // temperature1.textContent = t1[0].toFixed(2);
  // temperature2.textContent = t1[1].toFixed(2);
  // temperature3.textContent = t1[2].toFixed(2);
  // temperature4.textContent = t1[3].toFixed(2);
  // temperature5.textContent = t1[4].toFixed(2);
}
function varchange()
{
//Variable f slider and number input types
$('#tinfslider').slider({ max : 100, min : 0, step : 1 });		// slider initialisation : jQuery widget
$('#tinfspinner').spinner({ max : 100, min : 0, step : 1 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#tinfslider" ).on( "slide", function( e, ui ) { $('#tinfspinner').spinner("value",ui.value); ptx=[]; pty=[];j = 0 ;} );
$( "#tinfspinner" ).on( "spin", function( e, ui ) { $('#tinfslider').slider("value",ui.value); ptx=[]; pty=[];j=0; });
$( "#tinfspinner" ).on( "change", function() {  varchange() } );

//-----------------------------//
//Variable f slider and number input types
$('#tbslider').slider({ max : 100, min : 0, step : 1 });		// slider initialisation : jQuery widget
$('#tbspinner').spinner({ max : 100, min : 0, step : 1 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#tbslider" ).on( "slide", function( e, ui ) { $('#tbspinner').spinner("value",ui.value); ptx=[]; pty=[];j = 0 ;} );
$( "#tbspinner" ).on( "spin", function( e, ui ) { $('#tbslider').slider("value",ui.value); ptx=[]; pty=[];j=0; });
$( "#tbspinner" ).on( "change", function() {  varchange() } );

//-----------------------------//
//Variable f slider and number input types
$('#lslider').slider({ max : 100, min : 0, step : 1 });		// slider initialisation : jQuery widget
$('#lspinner').spinner({ max : 100, min : 0, step : 1 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#lslider" ).on( "slide", function( e, ui ) { $('#lspinner').spinner("value",ui.value); ptx=[]; pty=[];j = 0 ;} );
$( "#lspinner" ).on( "spin", function( e, ui ) { $('#lslider').slider("value",ui.value); ptx=[]; pty=[];j=0; });
$( "#lspinner" ).on( "change", function() {  varchange() } );

//-----------------------------//
//Variable f slider and number input types
$('#pslider').slider({ max : 100, min : 0, step : 1 });		// slider initialisation : jQuery widget
$('#pspinner').spinner({ max : 100, min : 0, step : 1 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#pslider" ).on( "slide", function( e, ui ) { $('#pspinner').spinner("value",ui.value); ptx=[]; pty=[];j = 0 ;} );
$( "#pspinner" ).on( "spin", function( e, ui ) { $('#pslider').slider("value",ui.value); ptx=[]; pty=[];j=0; });
$( "#pspinner" ).on( "change", function() {  varchange() } );


//-----------------------------//
//Variable f slider and number input types
$('#acslider').slider({ max : 100, min : 0, step : 1 });		// slider initialisation : jQuery widget
$('#acspinner').spinner({ max : 100, min : 0, step : 1 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#acslider" ).on( "slide", function( e, ui ) { $('#acspinner').spinner("value",ui.value); ptx=[]; pty=[];j = 0 ;} );
$( "#acspinner" ).on( "spin", function( e, ui ) { $('#acslider').slider("value",ui.value); ptx=[]; pty=[];j=0; });
$( "#acspinner" ).on( "change", function() {  varchange() } );	

}


//stops simulations
function simperiod() {
  if (time1 >= 5.0) {
    clearInterval(TimeInterval);
    clearInterval(TimeInterval1);
    time1 = 0;
    time2 = 0;
    temp1 = 0;
    temp2 = 1;
    // watertemp();

    ctx.clearRect(620, 485, 100, 50);

  } else {
    drawGradient();
    steadyState = 5 - Math.round(time1);
    document.querySelector(
      ".comment"
    ).innerHTML = `Wait for  ${steadyState} seconds for steady state`;
    btnReset.setAttribute("disabled", true);
    
    if (steadyState === 0) {
      temp2 = 0;
      document.querySelector(
        ".comment"
      ).innerHTML = `The steady state is achieved
`;
document.querySelector(".tool-practice").style.opacity = "1";
document.querySelector(".tool-practice").style.pointerEvents = "auto";
btnReset.removeAttribute("disabled");
    }
    if (tbase < tinf) {
      document.querySelector(
        ".comment"
      ).innerHTML = `T<sub>base</sub> adjusted to `+ (Math.round(tinf+5));
      // printcomment("<strong>T<sub>base</sub> adjusted to <strong>" + , 2)
    }
    // printcomment(
    //   "Wait for " + (5 - Math.round(time1)) + " seconds for steady state",
    //   2
    // );
  }
}
//draw gradient w.r.t. time in thermometer water flow and heater
function drawGradient() {

  //heater simulation
  var h = 100*time1;
  //create gradient
  var grd1 = ctx.createLinearGradient(0, 0, h, 0)
  grd1.addColorStop(0,"red");
  grd1.addColorStop(1,"pink");
  // Fill with gradient
  ctx.fillStyle = grd1;
  ctx.fillRect(100, 137, 295, 35);
 

   
}

// initial model
function drawModel() {
  ctx.clearRect(0, 0, 800, 600); //clears the complete canvas#simscreen everytime

  // ctx.clearRect(0,0,250,400);  //clears the complete canvas#simscreen everytime
  
  var background = new Image();
  background.src = "./images//model4.png";

  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function(){
    ctx.drawImage(background, 50, 50, 400, 200); 
    //ctx.clearRect(78, 210, 46, 64);
    ctx.font = "15px Comic San MS";

    ctx.fillStyle = "black";
   ctx.lineJoin = "round";

   ctx.rect(100, 137, 295, 35);
   ctx.stroke();

 
    drawGradient();
    // printcomment("\th =100 W/m<sup>2</sup>.K<br>\t<i>K</i>  = 201 W/m.K", 1)
  }
}

function comment1() {
  $( "#tinfspinner" ).spinner({change:function() { tinf = $("#tinfspinner").spinner("value"); } });
  $( "#tbspinner" ).spinner({change:function() { tbase = $("#tbspinner").spinner("value"); } });
  $( "#lspinner" ).spinner({change:function() { len = $("#lspinner").spinner("value"); } });
  $( "#pspinner" ).spinner({change:function() { peri = $("#pspinner").spinner("value"); } });
  $( "#acspinner" ).spinner({change:function() { a_c = $("#acspinner").spinner("value"); } });
  if(tinf!=0){
    time = 0;
    temp = 1;
   
    clearInterval(simTimeId);
  }

}

//offset for thermometer and temp change
function offset() {
  if(currentVoltage == 10){
    //path = "./images//V1.jpg";
    off[0] = 23.4;
    off[1] = 22.58;
    off[2] = 22.9;
    off[3] = 6.5;
    off[4] = 5.9;
  }
  else if(currentVoltage == 20){
    //path = "./images//V2.jpg";
    off[0] = 24;
    off[1] = 22.98;
    off[2] = 23.3;
    off[3] = 7;
    off[4] = 6.9;
  }
  else if(currentVoltage == 30){
    //path = "./images//V3.jpg";
    off[0] = 24.2;
    off[1] = 23.18;
    off[2] = 23.7;
    off[3] = 7.5;
    off[4] = 7.4;
  }
  // temp1 = 0;
  // temp2 = 1;
}
// function setVoltage(ele) {
//   currentVoltage = Number(ele.value);
//   btnStart.removeAttribute("disabled");
// }

function startsim() {
  simTimeId = setInterval("time=time+0.1; comment1(); ", "100");
}
function initiateProcess() {

  btnStart.setAttribute("disabled", true);
  $('.temperature-group').css({
    "opacity":0.5,
    "pointer-events":"none"
  });
  simstate();
  disableElements();
}

function simstate() {
  if (temp == 1) {
    time=0;	
    temp = 0;
    temp1 = 1;
    TimeInterval = setInterval("time1=time1+.1; simperiod();", "100");
    TimeInterval1 = setInterval("time2=time2+1; varinit()", "1000");
    opt="short_insulated";
   
  }
  // calc("short_insulated");

}

//Calculations of the experienment
function validation() {
console.log("reched this line ")

  var m= Math.sqrt((h_coeff*peri)/(k*a_c));

  var datapoints = [];
  console.log(datapoints);
  var datapoints_1 = [];
  var thetha_b = tbase-tinf;
  if(opt=="short_insulated")
  {
    for(var i=0; i<=len; i++)
    {
        y = thetha_b * Math.exp(-m * i);
        z = y + tinf;
        // y = Math.round(y * 10)/10;
        datapoints.push({x:i, y:z});
        console.log(datapoints);
    }
  }
  q_fin = Math.sqrt(h_coeff * peri * a_c * k ) * (thetha_b);
  q_fin = q_fin.toFixed(2);
  t_l2 = tinf + (thetha_b) * Math.exp(-m * (len / 2)).toFixed(2);

  drawgraph("graph", datapoints, "x in (mm)", "Temperature profile(T(x))");
console.log(" not reched this line ")

    // drawgraph("graph1", datapoints_1, "x in mm", "Temperature profile(T)");
  btnCheck1.addEventListener("click", () => validateAnswer1());
  btnCheck2.addEventListener("click", () => validateAnswer2());
}

function validateAnswer1() {
  const correctAnswer = document.querySelector(".correct-answer1");
  const unit = document.querySelector(".question-unit1");
  unit.innerHTML = `W`;
  let userEnteredValue = Number(
    document.querySelector(".question-input1").value
  );
  let answer = userEnteredValue == q_fin ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${q_fin} W`;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function validateAnswer2() {
  const correctAnswer = document.querySelector(".correct-answer2");
  const unit = document.querySelector(".question-unit2");
  unit.innerHTML = `°C`;
  let userEnteredValue = Number(
    document.querySelector(".question-input2").value
  );
  let answer = userEnteredValue === t_l2 ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${t_l2} °C`;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function resetAll() {
  btnReset.setAttribute("disabled", true);
  document.querySelector(".tool-practice").style.opacity = "0.5";
document.querySelector(".tool-practice").style.pointerEvents = "none";
$('.temperature-group').css({
  "opacity":1,
  "pointer-events":"auto"
});
  btnStart.removeAttribute("disabled");
  document.querySelector(".comment").innerHTML = "";
  // if (temp1 == 0) {
    temp2 = 0;
     temp1 = 2;
    t1 = [26, 28.1, 26.5, 27, 27.2];
    th = [45,45,45,45,45];
  currentVoltage = 0;
  vf = 0;
  document.querySelector(".correct-answer1").innerHTML = "";
  document.querySelector(".question-unit1").innerHTML = `W`;
  document.querySelector(".question-input1").value = "";
  document.querySelector(".correct-answer2").innerHTML = "";
  document.querySelector(".question-unit2").innerHTML = `°C`;
  document.querySelector(".question-input2").value = "";
  varinit();
  startsim();
  drawModel();
  enableElements()
}

function movetoTop() {
  practiceDiv.scrollIntoView();
}
