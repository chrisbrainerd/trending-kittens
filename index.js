  $(document).ready(function(){
    $('ul.tabs').tabs();

    $(".collapsible-header, .tab").click(function() {
    	// hack hack hack hack
		var scrolLDown = setInterval(function() {
			$('html,body').animate({scrollTop: $(document).height()}, 1);
		}, 1)
		setTimeout(function() {
			clearInterval(scrollDown)
		}, 200)

    })
  });

