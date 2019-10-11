var Y = require('yjs');
require('y-memory')(Y)
require('y-array')(Y)
require('y-map')(Y)
require('y-text')(Y)
require('y-websockets-client')(Y)

if (process.env.WS_HOST) {
  console.log(`Using WebSocket host: ${process.env.WS_HOST}`);
}

Y({
    db: {
      name: 'memory' // store the shared data in memory
    },
    connector: {
      name: 'websockets-client', // use the websockets connector
      room: 'form-test',            // Instances connected to the same room share data
      url: process.env.WS_HOST || '' // specify your own server destination
  },
    share: { // specify the shared content
      map: 'Map',    // y.share.map is of type Y.Map
      array: 'Array', // y.share.array is of type Y.Array
      textarea1: 'Text', // y.share.textarea is of type Y.Text
      textarea2: 'Text' // y.share.textarea is of type Y.Text
    },
    sourceDir: '/bower_components' // where the modules are (browser only)
  }).then(function (y) {
    window.y = y
    console.log('Yjs instance ready!')

    y.share.map // is an Y.Map instance

    // Update field states on initial load.
    updateTextfield1User(y.share.map.get('textfield1'));
    updateTextfield2User(y.share.map.get('textfield2'));
    // Bind plain text fields
    y.share.textarea1.bind(document.getElementById('textfield1'))
    y.share.textarea2.bind(document.getElementById('textfield2'))

    // Use Y.maps for single-state/atomic data formats. e.g., boolean, tags
    // Bind UI elements.
    // Set an observer for the UI Controls map
    y.share.map.observe(function(event){
      if (event.name === 'checkbox1') {
        updateCheckbox(event.value);
      }
      if (event.name === 'textfield1') {
        updateTextfield1User(event.value);
      }
      if (event.name === 'textfield2') {
        updateTextfield2User(event.value);
      }
    })

  });



// UI/UX changes based on Y.js updates.
function updateCheckbox(setting) {
  if (!setting) return;

  document.getElementsByName("checkbox1")[0].checked = setting.value;
  document.getElementById('checkbox1_user').style.display = 'unset';
  document.getElementById('checkbox1_user').innerHTML = setting.user;
}

function updateTextfield1User(setting) {
  if (setting.user !== document.getElementById('user').value && setting.value === 'lock') {
    document.getElementById('textfield1').style.border = "1px solid blue";
    document.getElementById('textfield1').disabled = true;
    document.getElementById('textfield1_user').style.display = 'unset';
    document.getElementById('textfield1_user').innerHTML = setting.user;
  }
  else {
    document.getElementById('textfield1').disabled = false;   
    document.getElementById('textfield1').style.border = '1px solid gray';
    document.getElementById('textfield1_user').style.display = 'none';
    document.getElementById('textfield1_user').innerHTML = setting.user; 
  }
}

function updateTextfield2User(setting) {
  if (setting.user !== document.getElementById('user').value && setting.value === 'lock') {
    document.getElementById('textfield2').style.border = "1px solid blue";
    document.getElementById('textfield2').disabled = true;   
    document.getElementById('textfield2_user').style.display = 'unset';
    document.getElementById('textfield2_user').innerHTML = setting.user;
  }
  else {
    document.getElementById('textfield2').disabled = false;
    document.getElementById('textfield2').style.border = '1px solid gray';
    document.getElementById('textfield2_user').style.display = 'none';
    document.getElementById('textfield2_user').innerHTML = setting.user; 
  }
}
