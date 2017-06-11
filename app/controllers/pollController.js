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
      htmlStr.push("<span class=\"option\"><input type=\"radio\" name=\"choice\" value=\""+val[0]+"\">"+val[0]+"</span>");
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
    var options = {'title':titleP, 'width':500, 'height':500};

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