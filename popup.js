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
        console.log(dump);
        let imgurl = dump.data.image_url;
        let gif_height = dump.data.image_height;
        let gif_width = dump.data.image_width;
        let gif_aspect_ratio = gif_width / gif_height;
        let container_width = 350;
        let container_height = 300;
        let container_aspect_ratio = container_width / container_height;
        console.log(`BEFORE: height: ${gif_height}, width: ${gif_width}`);
        if (gif_width < container_width && gif_height < container_height) {
          gif_height *= 1000;
          gif_width *= 1000;
        }
        if (gif_aspect_ratio > container_aspect_ratio) {
          gif_width = container_width; 
          gif_height = gif_width / gif_aspect_ratio; 
        } else if (gif_aspect_ratio < container_aspect_ratio) {
          gif_height = container_height; 
          gif_width = gif_height * gif_aspect_ratio;
        } else {
          gif_width = container_width; 
          gif_height = container_height;
        }
        console.log(`AFTER:  height: ${gif_height}, width: ${gif_width}`);
// <img src="${imgurl}" width='${gif_height}' height='${gif_width}'/>
        // let div = `
        //   <div class="row">
        //     <div class="col s12">
        //       <div class="card">
        //         <div class="card-image">
        //           <img src="${imgurl}" />
        //         </div>
        //       </div>
        //     </div>
        //   </div>

        // `;
        let div = `<div class="row">
          <div class="col s12 m7">
            <div class="card">
              <div class="card-image">
                <img src="${imgurl}">
                <span class="card-title truncate">${search_term}</span>
              </div>
              <div class='card-action waves-effect waves-light btn copy_button' data-clipboard-text="${imgurl}"><i class="fa fa-clone fa-5x" aria-hidden="true"></i> Copy link</div>
              <div class="share_button card-action waves-effect waves-light btn" data-url="${imgurl}"><i class="fa fa-facebook-official fa-5x" aria-hidden="true"></i> Share</div>
            </div>
          </div>
        </div>`
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
  
    if (giphy_history.length >= 15) {
      giphy_history.shift()
    } 
    
    giphy_history.push({'imgurl': imgurl, 'search_term': search_term})
    chrome.storage.sync.set({'giphy_history': giphy_history}, function() {})
    
    let htmlstr = '<ul>';
    // need to build html string to populate history tab
    // might be easiest to have five divs, id of history_n and loop through list
    // so if there's no item n, the div would be empty?
    for (i=giphy_history.length-1; i>-1; i--) {
      // htmlstr += `
      //   <li>
      //     <img src="${giphy_history[i]['imgurl_small']}">
      //     <a class="waves-effect waves-light btn"><i class="fa fa-clone" aria-hidden="true"></i> Copy link</a>
      //     <a class="waves-effect waves-light btn"><i class="fa fa-facebook-official fa-3x" aria-hidden="true"></i> Share</a>
          

      //   </li>
      //   `

      htmlstr += `
        <div class="row">
          <div class="col s12 m7">
            <div class="card">
              <div class="card-image">
                <img src="${giphy_history[i]['imgurl']}">
                <span class="card-title truncate">${giphy_history[i]['search_term']}</span>
              </div>
              <div class='card-action waves-effect waves-light btn copy_button' data-clipboard-text="${giphy_history[i]['imgurl']}"><i class="fa fa-clone fa-5x" aria-hidden="true"></i> Copy link</div>
              <div class="share_button card-action waves-effect waves-light btn" data-url="${giphy_history[i]['imgurl']}"><i class="fa fa-facebook-official fa-5x" aria-hidden="true"></i> Share</div>
            </div>
          </div>
        </div>
      `
    }
    htmlstr += '</ul>'
    document.getElementById("history").innerHTML = htmlstr;
    var clipboard = new Clipboard('.copy_button');
    $(".copy_button").click(function() {
      Materialize.toast('Copied!', 2000) 
    })
    let share_buttons = document.querySelectorAll('.share_button');
    for (j=0;j<share_buttons.length; j++) {
      share_buttons[j].addEventListener('click', function() {
        let url = "https://www.facebook.com/sharer/sharer.php?u=" + $(this).data('url')
        chrome.tabs.create({url: url});

      })
    }

  })
}