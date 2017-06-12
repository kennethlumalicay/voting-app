'use strict';

  // Load google charts
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  var infoArr = [];
  var titleP= '';
  var idP= '';

  function show() {
    var htmlStr = [];
    infoArr.forEach((val, i) => {
      htmlStr.push("<span class=\"option\"><input id=\""+i+
        "\"type=\"radio\" name=\"choice\" class=\"radio\" value=\""
        +val[0]+"\">"+"<label for=\""+i+"\">"+val[0]+"</label></span>");
    });
    $('#choices').append(htmlStr.join(''));
  }

  function initValues(id,title,choices) {
    var info = choices.split(',');
    titleP+=titleP==''?title:'';
    idP+=idP==''?id:'';
    for(var i=0; i<info.length; i+=2) {
      infoArr.push(info.slice(i,i+2));
    }
    infoArr = infoArr.map(e=>[e[0],+e[1]]); // parse int
    show();

    $('#choices-form').prop("action", "/savepoll/"+idP);
  }
  // Draw the chart and set the chart values
  function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Option');
    data.addColumn('number', 'Votes');
    data.addRows(infoArr);

    // Optional; add a title and set the width and height of the chart
    var options = {'title':titleP, 'width':500, 'height':250,
        'chartArea': {'left': 0, 'top': 25, 'width': '100%', 'height': '100%'},
        'backgroundColor': 'transparent', 'fontSize': 20, 'fontName': 'Verdana',
        'is3D': true,  legend: { position: 'labeled', 'textStyle': {'color': 'turquoise',
        'fontName': 'Verdana', 'fontSize':17}}, 'chartArea.backgroundColor':'transparent',
        'titleTextStyle': {'color': 'turquoise', 'fontName':'Verdana', 'fontSize':15,
        'bold': true}
    };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('chart'));
    chart.draw(data, options);
  }

  $('#choices-form input').on('click', function() {
    if($('input[name=choice]:checked', '#choices-form').val()=='other') {
      $('#other-t').prop("disabled",false).prop("required", true);
    } else {
      $('#other-t').prop("disabled",true).prop("required", false);
    }
  });

  $('.options').on('click', function() {
    console.log("inside .options");
    this.find('input:radio[name=choice]').attr('checked', true);
  });