
chrome.runtime.onInstalled.addListener(function(info){
  chrome.storage.local.set({
    autodelete: true, host: "localhost"
  }, function(items) {
  });
});


let filename=""
let focus=0;
let atServer=false; 
let serverTabId=-1;
let activeId=-1;
let host =""
var downloadIds=[]
var popIds=[]

chrome.storage.onChanged.addListener(function(changes, namespace) {
      for (var key in changes) {
        var storageChange = changes[key];
        if(key=='host')
          host=storageChange.newValue;
      }
});

/*chrome.tabs.onRemoved.addListener(function(tabId,info){
    if(serverTabId==tabId)
        {

          del=false;
          chrome.storage.local.get('autodelete', function(data) {
       
            del=data.autodelete;
            var i=0
          var len = downloadIds.length;
   
          if(del)
          for (; i < len; i++) {
            chrome.downloads.removeFile(downloadIds[i]);
              }
              downloadIds=[]
           });
          
        }
});*/
chrome.windows.onRemoved.addListener(function(windowid) {
      if(popIds.includes(windowid))
       {

          del=false;
          chrome.storage.local.get('autodelete', function(data) {
       
            del=data.autodelete;
            var i=0
          var len = downloadIds.length;
   
          if(del)
          for (; i < len; i++) {
            chrome.downloads.removeFile(downloadIds[i]);
              }
              downloadIds=[]
           });
          
        
        popIds=popIds.splice(popIds.indexOf(windowid),1)
      }
})

function checkForValidUrl(tabId, changeInfo, tab) {
    // If the tabs url starts with "http://specificsite.com"...
    if (tab.url.includes(host)) {
        // ... show the page action.
        chrome.pageAction.show(tabId);
        serverTabId=tabId;

    } else {
      chrome.pageAction.hide(tabId);
    }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onActiveChanged.addListener(function(tabId, selectInfo){
  chrome.tabs.get(tabId, function(tab){ 
    activeId=tabId;
    var active=false;
    if(tab.hasOwnProperty('pendingUrl'))
        if(tab.pendingUrl.includes(host))
          active=true;
    if(tab.hasOwnProperty('url') )
        if(tab.url.includes(host))
          active=true;
    if(active)
      serverTabId=tabId;
  });
});
chrome.downloads.onCreated.addListener(function(item){
    chrome.storage.local.get('host', function(data) {
      host=data.host;
       url=item.finalUrl+item.url;
  if(url.includes(host))
    downloadIds.push(item.id);

    });

});

chrome.downloads.onChanged.addListener(function(delta){
  
  if(delta.hasOwnProperty('filename'))
    filename=delta.filename.current;
  var myProp = 'state';
  if(delta.hasOwnProperty(myProp))
    if(delta.state.current=="complete")
      {
          
          if(downloadIds.includes(delta.id))
          {

          var createData={url:"file:///"+filename};

          chrome.windows.create(createData,function(win){
            popIds.push(win.id)
            tabId=win.tabs[0].id;
            chrome.windows.update(win.id, { focused: true });
             chrome.tabs.executeScript(
            tabId,
            {file: 'printDialog.js'});

    
 });
      } 
      

}   
});

