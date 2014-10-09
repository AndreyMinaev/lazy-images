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


	function lazyImages(images) {
		images = images || document.images;
		images = images.length ? [].slice.call(images, 0) : [images];
		
		images
			.filter(notLoaded)
			.forEach(loadImage);
	}

	function notLoaded(image) {
		return !image.src;
	}

	function loadImage(image) {
		var src = getImageSrc(image, currentResolution);
		
		image.src = src;
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

	window.lazyImages = lazyImages;

}(window));