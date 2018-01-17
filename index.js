let ctx = document.getElementById("canvas").getContext("2d");
		  let images = {};

		  if (localStorage && localStorage.savedJSON) {
		      document.getElementById("json").value = localStorage.savedJSON;
		  } else {
		      document.getElementById("json").value = JSON.stringify([{"url": "http://file/to/url.png","x": 500,"y": 500},{"url": "http://file/to/url.jpg","x": 842,"y": 184}]);
		  }

		  document.body.style.margin = 0;
		  document.body.style.padding = 0;
		  document.getElementsByTagName("html")[0].style.overflow = "hidden";

		  document.getElementById("canvas").style.width = window.innerWidth;
		  document.getElementById("canvas").style.height = window.innerHeight - 120;
		  document.getElementById("uiBotWrapper").style.height = `calc(100% - ${window.innerHeight - 120}px`;
		
			function drawThing(item) {
			    ctx.drawImage(images[item.url], item.x, item.y);
			}

		  document.getElementById("clickity").addEventListener("click", function() {
		    localStorage.savedJSON = document.getElementById("json").value;

		    ctx.clearRect(0, 0, document.getElementById("canvas").width, document.getElementById("canvas").height);

		    for (let item of JSON.parse(document.getElementById("json").value).reverse()) {
		      if (!images[item.url]) {
			  images[item.url] = new Image();
			  images[item.url].src = item.url;

			  images[item.url].onload = function() {
				  drawThing(item);
			  }
		      } else {
			      drawThing(item);
		      }
		    }
		  });