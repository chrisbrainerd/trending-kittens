window.onload = function() {

  chrome.storage.sync.get('search_term', function(items) {
    let search_term = items.search_term;
    if (search_term == undefined) { search_term = 'kitten'; }
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
        // document.getElementById('y').innerHTML= this.responseText;
        document.getElementById("pagelet_trending_tags_and_topics").innerHTML = div;
    };
    xhr.send();
  });

}