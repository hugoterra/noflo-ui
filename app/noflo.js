window.addEventListener('polymer-ready', function() {
  document.body.classList.remove('loading');

  var noflo = require('noflo');
  var graphs = {};
  var fbps = Array.prototype.slice.call(document.querySelectorAll('script[type="application/fbp"]'));
  fbps.forEach(function (fbp) {
    var fbpString = (fbp.innerText || fbp.textContent).trim();
    var fbpId = fbp.getAttribute('id');
    noflo.graph.loadFBP(fbpString, function (graph) {
      graphs[fbpId] = graph;
      graph.name = fbpId;
      graph.baseDir = '/noflo-ui';
      if (fbpId === 'main') {
        noflo.createNetwork(graph, function (network) {
          //network.on('data', function (data) { console.log(data); });
          for (var component in graphs) {
            if (component === 'main') {
              continue;
            }
            network.loader.registerComponent('local', component, graphs[component]);
          }
          network.connect(function () {
            network.start();
          });
        }, true);
      }
    });
  });

  // Show help on demand
  var help = document.querySelector('noflo-help');
  document.getElementById("openhelp").addEventListener("click", function (event) {
    if (help) {
      help.open();
      event.preventDefault();
    }
    // Otherwise follow link to docs
  });

});

