function set_search_term() {
  document.getElementById("saved-message").classList.add('show');
  chrome.storage.sync.set({'search_term': document.getElementById("search_term").value}, function() {
    console.log('Settings saved');
  });
  load_gif();
  setTimeout(function() {
    document.getElementById("saved-message").classList.remove('show');
  }, 1450);
}

window.addEventListener('load', function (evt) {
  chrome.storage.sync.get('search_term', function(items) {
    document.getElementById("search_term").value = items.search_term;
    console.log(search_term);
    console.log('Settings retrieved');
  });
});

document.getElementById('save').addEventListener('click', set_search_term);
document.getElementById('search_term').addEventListener("keypress", function(e) {
  if (e.keyIdentifier=='Enter') {set_search_term();}
});

function load_gif() {
  chrome.storage.sync.get('search_term', function(items) {
    let search_term = items.search_term;
    if (search_term == undefined) { 
      document.getElementById('search_term').value = 'kitten';
      search_term = 'kitten'; 
    }

    // cleanse input, might want to make this less restrictive
    search_term = search_term.replace(/[^A-Za-z0-9]/g, '+'); 

    var xhr= new XMLHttpRequest();
    api_url = 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + search_term
    xhr.open('GET', api_url, true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want
        let dump = JSON.parse(this.responseText);
        let imgurl = dump.data.image_url;
        let div = '<img width=252 src="' + imgurl + '" />';
        document.getElementById("gif-holder").innerHTML = div;
        update_history(imgurl, search_term);
    };
    xhr.send();
  });
}

window.onload = function() {
  load_gif();
}

function update_history(imgurl, search_term) {
  console.log("getting history, imgurl: " + imgurl + ", search_term: " + search_term);
  chrome.storage.sync.get('giphy_history', function(items) {
    var giphy_history;
    if ('giphy_history' in items) {
      giphy_history = items['giphy_history'];
    } else {
      giphy_history = [];
    }
  
    if (giphy_history.length >= 5) {
      giphy_history.shift()
    } 
    
    giphy_history.push({'imgurl': imgurl, 'search_term': search_term})
    chrome.storage.sync.set({'giphy_history': giphy_history}, function() {
      // update_history_tab();
      let htmlstr = '';
      // need to build html string to populate history tab
      // might be easiest to have five divs, id of history_n and loop through list
      // so if there's no item n, the div would be empty?
      for (item in history) {do stuff}
      document.getElementById("history").innerHTML = giphy_history;
    })
  })
}