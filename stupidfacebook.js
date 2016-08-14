toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "2000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

console.log("after init")
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
        let img_aspect_ratio = dump.data.image_width / dump.data.image_height;
        let height = 260 / img_aspect_ratio;
        let div = `
        <div id='giphy-holder'>
            <div id='giphygif-options'>
                <div id='giphygif-share'>
                    <i class="fa fa-facebook-official" aria-hidden="true"></i>&nbsp;&nbsp;Share
                </div>
                <div id='giphygif-copy' class='waves-effect' data-clipboard-text='${imgurl}'>
                    <i class="fa fa-clone" aria-hidden="true"></i>&nbsp;&nbsp;Copy
                </div>

            </div>
            <img id="giphygif" width=260 height=${height} src="${imgurl}" />
        </div>
        `;
        document.getElementById("pagelet_trending_tags_and_topics").innerHTML = div;
        var clipboard = new Clipboard('#giphygif-copy');
        document.getElementById("giphygif-share").addEventListener("click", function() {
            window.open(`http://www.facebook.com/sharer/sharer.php?u=${imgurl}`)
        })
        document.getElementById("giphygif-copy").addEventListener("click", function() {
            toastr["success"]("Copied!")
        })
        document.getElementById("pagelet_trending_tags_and_topics").onmouseover = function() {
            document.getElementById("giphygif-options").className = 'active';
        }
        document.getElementById("pagelet_trending_tags_and_topics").onmouseout = function() {
            document.getElementById("giphygif-options").className = '';
        }
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
    chrome.storage.sync.set({'giphy_history': giphy_history}, function() {})
  })
}

waitForElementToDisplay();

