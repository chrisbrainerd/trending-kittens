
function load_gif() {
  chrome.storage.sync.get('search_term', function(items) {
    let search_term = items.search_term;
    if (search_term == undefined) { search_term = 'kitten'; }
    search_term = search_term.replace(/[^A-Za-z0-9]/g, '+');

    var xhr= new XMLHttpRequest();
    api_url = 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + search_term
    xhr.open('GET', api_url, true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; 
        let dump = JSON.parse(this.responseText);
        let imgurl = dump.data.image_url;
        let div = '<img id="giphygif" width=252 src="' + imgurl + '" />';
        document.getElementById("pagelet_trending_tags_and_topics").innerHTML = div;
    };
    xhr.send();
  });

}

// handler for subsequent DOM renders
function waitForElementToDisplay() {
        if (document.getElementById('giphygif')!=null) { 
            return; 
        }
        if (document.getElementById('pagelet_trending_tags_and_topics')!=null) {
            load_gif();
            return;
        } else {
            console.log("nothing yet...")
            setTimeout(function() {
                waitForElementToDisplay();
            }, 100);
        }
    }

waitForElementToDisplay();