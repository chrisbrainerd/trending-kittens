function set_search_term() {
  // localStorage.search_term = document.getElementById("search_term").value;
  chrome.storage.sync.set({'search_term': document.getElementById("search_term").value}, function() {
    console.log('Settings saved');
  });


  document.getElementById("search_term").value = "saved!";
  setTimeout(window.close(), 1200);
  // window.close();
}

window.addEventListener('load', function (evt) {
  chrome.storage.sync.get('search_term', function(items) {
    document.getElementById("search_term").value = items.search_term;
    console.log(search_term);
    console.log('Settings retrieved');
  });
  // document.getElementById("search_term").value = localStorage.search_term;
});

document.getElementById('save').addEventListener('click', set_search_term);
