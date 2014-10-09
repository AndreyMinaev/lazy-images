
###Description
Loads the images in accordance with device pixel ratio(DPR).

###Usage
On image tag you must specify available sources with prefix. Prefix indicate for which DPR intended image. By default available two prefix:
- low(from 0 to 2)
- high(greater than 2)

Also you must specify image size.

example:
```
<img data-low-src="/low/resolution/image" data-high-src="/high/resolution/image" width="150" height="100">
```


```
var images = document.querySelectorAll('img');
// if you using jquery
var images = $('img');

// load set of images
lazyImages(images);

// use options
lazyImages(images, {
	// options
});

// or load all images on page
lazyImages();
```

###Options
| name  | type | description |
| ------------- | ------------- | ------------- |
| lazy  | boolean  | load via virtual image element if true else just assign appropriate url to src attribute (default: true) |
| beforeLoadStart | function  | invoked after loader element is inserted in DOM |
| beforeInsertImage | function  | invoked when image loaded but not inserted in DOM
| afterInsertImage | function  | invoked when image inserted in DOM |
| createLoader | function  | create loader element|

example:
```
lazyImages(images, {
	// add animation when loader inserted
	beforeLoadStart: function (element, done) {
		$(element).fadeIn(done);
	},
	
	// and before he gonna be removed
	beforeLoadStart: function (element, done) {
		$(element).fadeOut(done);
	},

	// create custom loader
	createLoader: function (image) {
		var newLoader = $('<div>New super loader</div>');
		
		// must return HTMLElement object
		return newLoader[0];
	}
})
```