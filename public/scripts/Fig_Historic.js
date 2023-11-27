// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";
//import Chart from 'chart.js/auto'
var rawDateTime = new Date();
/*let schedule_01 = setInterval(updateDateTime, 100);
function updateDateTime() {
    const dateTime = document.querySelector(".dateTime_Username p");
    rawDateTime = new Date();
    let yy = rawDateTime.getFullYear();
    let mm = String(rawDateTime.getMonth() + 1).padStart(2, '0');
    let dd = String(rawDateTime.getDate()).padStart(2, '0');
    let hh = String(rawDateTime.getHours()).padStart(2, '0');
    let m = String(rawDateTime.getMinutes()).padStart(2, '0');
    let ss = String(rawDateTime.getSeconds()).padStart(2, '0');
    dateTime.textContent = yy + "/" + mm + "/" + dd + " " + hh + ":" + m + ":" + ss;
}*/

$(document).ready(function(){

  loadFig();
  timeFilter();

  })

const ctx = document.getElementById('RealTimeFig');



function loadFig(){
  var word = document.querySelector(".fig-container p");
  word.remove();
  Chart.defaults.font.size = 16;
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: '頻率',
        data: [{x:'2023-11-07 00:00:00',
                y:59.96},
               {x:'2023-11-07 00:00:01',
                y:59.95}, 
               {x:'2023-11-07 00:00:02',
                y:59.98},
               {x:'2023-11-07 00:00:03', 
                y:60.02},
               {x:'2023-11-07 00:00:04', 
                y:60.01},
               {x:'2023-11-07 00:00:05',
                y:59.92}, 
               {x:'2023-11-07 00:00:06',
                y:59.98},
               {x:'2023-11-07 00:00:07', 
                y:60.02},
               {x:'2023-11-07 00:00:08', 
                y:60.01},
               {x:'2023-11-07 00:00:09', 
                y:60.02},
               {x:'2023-11-07 00:00:10', 
                y:60.01},
               {x:'2023-11-07 00:00:11',
                y:59.92},
               {x:'2023-11-07 00:00:12',
                y:59.95}, 
               {x:'2023-11-07 00:00:13',
                y:59.98},
               {x:'2023-11-07 00:00:14', 
                y:60.02},
               {x:'2023-11-07 00:00:15', 
                y:60.01},
               {x:'2023-11-07 00:00:16',
                y:59.99}, 
               {x:'2023-11-07 00:00:17',
                y:59.98},
               {x:'2023-11-07 00:00:18', 
                y:60.02},
               {x:'2023-11-07 00:00:19', 
                y:60.01},
               {x:'2023-11-07 00:00:20', 
                y:60.02},
               {x:'2023-11-07 00:00:21',
                y:59.90},
               {x:'2023-11-07 00:00:22',
                y:59.95}, 
               {x:'2023-11-07 00:00:23',
                y:59.98},
               {x:'2023-11-07 00:00:24', 
                y:60.02},
               {x:'2023-11-07 00:00:25', 
                y:60.01},
               {x:'2023-11-07 00:00:26',
                y:59.98}, 
               {x:'2023-11-07 00:00:27',
                y:59.98},
               {x:'2023-11-07 00:00:28', 
                y:60.02},
               {x:'2023-11-07 00:00:29', 
                y:60.01},
               {x:'2023-11-07 00:00:30', 
                y:60.02},
               {x:'2023-11-07 00:00:31', 
                y:60.01},
               {x:'2023-11-07 00:00:32',
                y:59.97},
               {x:'2023-11-07 00:00:33',
                y:59.95}, 
               {x:'2023-11-07 00:00:34',
                y:59.98},
               {x:'2023-11-07 00:00:35', 
                y:60.02},
               {x:'2023-11-07 00:00:36', 
                y:60.01},
               {x:'2023-11-07 00:00:37',
                y:59.94}, 
               {x:'2023-11-07 00:00:38',
                y:59.98},
               {x:'2023-11-07 00:00:39', 
                y:60.02},
               {x:'2023-11-07 00:00:40', 
                y:60.01},
               {x:'2023-11-07 00:00:41', 
                y:60.02}],
        borderWidth: 1,
        yAxisID: 'y',
        stepped: true,
        pointStyle: false,
      },{
        label: '實功',
        data: [5900, 7000, 4000, -3000, -5000, 8500, 6000, -3000, -1000, -1000, -3000, 9000, 7000, 5000, -1000, -2000, 1000, 2000, -2000, -1000, -2000, 10000, 6000, 3000, -1500, -1000, 2500, 0, 0, 0, 0, 0, 5000, 6000, 3000, -2000, -1000, 6000, 3000, -2000, -2000, -2000],
        borderWidth: 1,
        yAxisID: 'y1',
        stepped: true,
        pointStyle: false,
      },{
        label: '執行率',
        data: [100, 98, 100, 96, 97, 96, 95, 95, 97, 100, 100, 100, 100, 100, 100, 99, 99, 98, 97, 97, 97, 99, 100, 100, 100, 100, 100, 100, 98, 98, 97, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        borderWidth: 1,
        stepped: true,
        pointStyle: false,
        yAxisID: 'y2',
      },{
        label: 'SOC',
        data: [90, 89, 88, 88, 89, 87, 85, 86, 87, 88, 88, 85, 84, 83, 84, 85, 85, 85, 84, 84, 85, 82, 80, 80, 79, 80, 81, 81, 81, 81, 81, 81, 81, 79, 78, 77, 77, 75, 74, 74, 75, 76],
        borderWidth: 1,
        stepped: true,
        pointStyle: false,
        yAxisID: 'y3',
      }]
    },
    options: {
      scales: {
        x: {
          min: '2023-11-07 00:00:00',  
          grid: {
              display:false,
          }, 
          ticks: {
              autoSkip: true,
              maxTicksLimit: 10
          } 
        }, 
        y: {
          title:{
              display: true,
              text:"頻率(Hz)",
          },
          suggestedMin: 59.75,
          suggestedMax: 60.25,  
          position: 'left'              
        },
        y1: {
          title:{
              display: true,
              text:"實功(kW)",
          },
          suggestedMin: -25000,
          suggestedMax: 25000,
          position: 'right'
        },
        y2: {
          display: false,
          suggestedMin: -100,
          suggestedMax: 100,
          position: 'right'
        },
        y3: {
          display: false,
          suggestedMin: 0,
          suggestedMax: 100,
          position: 'right'
        }
      }
    }
  });

}


function searchData(){
	//var fromDate = $("#fromDate").val(); 想要字串還是解析過的時間?
	//var toDate = $("#toDate").val();
	var fromTime = $("#fromTime").val();
	var toTime = $("#toTime").val();
	var level = $("#level").val();

	console.log("Start Date: "+fromDate);
	console.log("Start Time: "+fromTime);
	console.log("End Date: "+toDate);
	console.log("End Timee: "+toTime);
	console.log("level: "+level);

}
function getDate( element ) {
	var date;
	var dateFormat = "yy-mm-dd";
	try {
	  date = $.datepicker.parseDate( dateFormat, element.value );
	} catch( error ) {
	  date = null;
	}

	return date;
  }
	/*補0*/
	Number.prototype.pad = function(digits){
		for(var n=this.toString(); n.length < digits; n = 0+n);
		return n;
	}

function timeFilter(){
	var from = $( "#fromDate" )
		.datepicker({                  
		  dateFormat: "yy-mm-dd",
		  changeMonth: true,
		  changeYear: true,
		  showMonthAfterYear : true,
		  maxDate: 0,                 
		})
		.on( "change", function() {          
		  fromDate=getDate(this);                  
		  const year=fromDate.getFullYear(); 
		  const month=fromDate.getMonth()+3;  //限制搜尋範圍3個月
		  const date=fromDate.getDate();  
		  var newDate=new Date(year,month,date);  
		  to.datepicker( "option", "minDate", fromDate );

		  if (newDate > rawDateTime){
			to.datepicker("option", "maxDate", 0); 
		  }
		  else{
			to.datepicker("option", "maxDate", newDate); 
		  }
		  console.log("from:"+fromDate);      
		}),

	  to = $( "#toDate" ).datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		maxDate: 0,
	  })
	  .on( "change", function() {
		from.datepicker( "option", "maxDate", getDate( this ) );               
		toDate=getDate(this);
		console.log("to:"+toDate);
		
	  });            
	  

	  fromTime = $('#fromTime').timepicker({
		timeFormat: "H:mm:ss p",  
		interval: 60,
		//change: setEnd    想限制日期相同時的時間範圍須合理 但仍有問題    
	  })

	  

	  toTime = $('#toTime').timepicker({
		timeFormat: "H:mm:ss p",
		interval: 60,
		//change: setStart
	  });
	   //預設日期時間帶入今天
	  //var fromdateString = rawDateTime.getFullYear() + '-' + (rawDateTime.getMonth()+1) + '-' + (rawDateTime.getDate()-7);
	  var todateString =   rawDateTime.getFullYear() + '-' + (rawDateTime.getMonth()+1) + '-' + rawDateTime.getDate();	
	  var hou = rawDateTime.getHours().pad(2);
	  var min = rawDateTime.getMinutes().pad(2);
	  var sec = rawDateTime.getSeconds().pad(2); 
	  var AM; 
	  if (hou >= 12){
		AM="PM"
	  }
	  else{
		AM="AM"
	  }
	  $("#toDate").val(todateString);   
	  $("#toTime").val(hou+":"+min+":"+sec+" "+AM);      
	
  }
