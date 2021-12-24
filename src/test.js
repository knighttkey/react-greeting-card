var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var DOMURL = self.URL || self.webkitURL || self;

var svg = new Blob([svgString], {
  type: "image/svg+xml"
});
var url = DOMURL.createObjectURL(svg);
var png = '';

var toLoad = 2;
var loaded = 0;
var background = new Image();
var svgImg = new Image();

// attach the event to both images
background.onload = svgImg.onload = function(){
 // only when both has loaded
 if(++loaded === toLoad){
  
  // set the canvas size to the svg image's one
  canvas.width = svgImg.width;
  canvas.height = svgImg.height;
  
  // draw the background image first
  ctx.drawImage(background, (canvas.width/2)-(background.width/2), (canvas.height/2)-(background.height/2));
	// then the svg image
  ctx.drawImage(svgImg, 0, 0);
  png = canvas.toDataURL("image/png");
  document.querySelector('#chart').innerHTML = '<img src="' + png + '"/>';
  // you want to revoke the svgImg ObjectURL, not the canvas dataURI
  DOMURL.revokeObjectURL(svgImg.src);
 
 }
}
svgImg.src = url;
// set it only if you're doing a cross origin request
// Object URL are not
background.crossOrigin = 'anonymous';
background.src = 'https://dl.dropboxusercontent.com/s/4e90e48s5vtmfbd/aaa.png'