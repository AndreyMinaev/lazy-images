;(function (window) {

	var
		resolutions = [
			{ key: 'low', value: 0 },
			{ key: 'high', value: 2 }
		],

		settings = {
			lazy: true,
			startClass: 'lazy-start'
		},

		dpr = window.devicePixelRatio,
		currentResolution = checkResolution(dpr, resolutions);


	function lazyImages(images, options) {
		images = images || document.images;
		images = images.length ? [].slice.call(images, 0) : [images];
		
		options = extend(settings, options);
		
		images
			.filter(notLoaded)
			.forEach(loadImage(options));
	}

	function notLoaded(image) {
		return !image.src;
	}

	function loadImage(options) {
		return function (image) {
			var src = getImageSrc(image, currentResolution),
				tempImage,
				loader;
			
			if (options.lazy) {
				tempImage = new Image();
				// loader = createLoader(image);

				// image.parentNode.replaceChild(loader, image);

				tempImage.addEventListener("load", function (e) {
					setTimeout(function () {
						image.src = src;
						// loader.parentNode.replaceChild(image, loader);
					}, 1000);
				}, false);

				tempImage.src = src;
			} else {
				image.src = src;
			}
		}
	}

	function getImageSrc(image, cRes) {
		var dataset = image.dataset,
			src = dataset[cRes+'Src'];

		if (!src) {
			resolutions.some(function (res) {
				var key = res.key;

				src = dataset[resolutions[key]+'Src'];

				return !!src;
			});
		}

		return src;
	}

	function checkResolution(dpr, resolutions) {
		var current = 0;

		resolutions.forEach(function (res, index) {
			var value = res.value;
			current = value < dpr ? index : current;
		});

		return resolutions[current].key;
	}

	function extend() {
		var newObject = {},
			sourceObjects = [].splice.call(arguments, 0);

		sourceObjects.forEach(function (obj) {
			for (prop in obj) if (obj.hasOwnProperty(prop)) {
				newObject[prop] = obj[prop];
			}
		});

		return newObject;
	}

	window.lazyImages = lazyImages;

}(window));