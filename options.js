// Saves options to chrome.storage
function save_options() {
  
  var autoDelete = document.getElementById('autodelete').checked;
  chrome.storage.local.set({
    autodelete: autoDelete
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Option saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });

   var hostip = document.getElementById('host').value;
  chrome.storage.local.set({
    host: hostip
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'host updated.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get({
    autodelete: true, host: "localhost"
  }, function(items) {
    document.getElementById('autodelete').checked = items.autodelete;
    document.getElementById('host').value =items.host;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);