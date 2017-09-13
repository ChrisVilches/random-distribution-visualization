var canvas = document.getElementById("chart");
var ctx = canvas.getContext("2d");
var editor = CodeMirror.fromTextArea($("#function-textarea")[0], {
  lineNumbers: true,
  mode: "javascript",
  theme: "ambiance"
});

var lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "Distribution",
      data: [],
      backgroundColor: ['rgba(04, 82, 145, 0.2)']
    }]
  }
});


function showChart(fn, iterations){

  var segments = new Array(101);
  for(var i=0; i<101; i++)
    segments[i] = 0;

  for(var i=0; i<iterations; i++){
    var n = fn();

    if(n < 0 || n > 1){
      throw new Error(`Your function returned ${n}. It must return a value between 0 and 1 inclusive.`);
    }

    n *= 100;
    n = Math.floor(n);
    segments[n]++;
  }

  var values = [];
  var labels = [];
  for(var i=0; i<100; i++){
    values.push(segments[i]);

    if(i % 10 == 0){
      labels.push(i);
    } else {
      labels.push('');
    }
  }
  values.push(values[99]);
  labels.push('100');

  lineChart.config.data.labels = labels;
  lineChart.config.data.datasets[0].data = values;

  lineChart.update();
}

$(document).ready(function(){
  $('#ok-btn').click(function(){
    var txt = editor.getValue();
    var iterations = +$("#iterations-input").val();
    var fn = new Function(txt);

    try {
      showChart(fn, iterations);
    } catch(e){
      $.notify(e, {
        position: 'bottom left'
      });
    }
  });

  showChart(new Function(editor.getValue()), 100000);
});
