;(function (window) {

	var
		resolutions = {
			0: 'low',
			2: 'high'
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
			for ( res in resolutions ) if (resolutions.hasOwnProperty(res)) {
				if (src = dataset[resolutions[res]+'Src']) break;
			}
		}

		return src;
	}

	function checkResolution(dpr, resolutions) {
		var current = 0;

		for ( res in resolutions ) if (resolutions.hasOwnProperty(res)) {
			current = (+res > current && +res < dpr) ? res : current;
		}

		return resolutions[current];
	}

	window.lazyImages = lazyImages;

}(window));