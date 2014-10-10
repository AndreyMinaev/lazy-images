;(function (window) {

	var
		resolutions = [
			// value is a minimum pixel ratio for key
			// and key is a part of data attribute(data-{{ key }}-src)
			{ key: 'low', value: 0 },
			{ key: 'high', value: 2 }
		],

		settings = {
			// true - load via virtual image element
			// false - just assign src
			lazy: true,

			beforeLoadStart: noopWithDone,
			beforeInsertImage: noopWithDone,
			afterInsertImage: noopWithDone,

			createLoader: createLoader
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

	/**
	 * Filter elements with src
	 * @param {HTMLImageElement} image
	 * @return {boolean}
	 */
	function notLoaded(image) {
		return !image.src;
	}

	function loadImage(options) {

		return function (image) {
			var src = getImageSrc(image, currentResolution),
				tempImage,
				loader;
			
			if (!src) {
				return ;
			}

			if (options.lazy) {
				tempImage = new Image();
				loader = options.createLoader(image);

				// remove image from DOM
				image.parentNode.replaceChild(loader, image);

				// when beforeLoadStart handler finished
				options.beforeLoadStart(loader, function () {

					// when virtual image loaded
					tempImage.addEventListener("load", function (e) {

						// when beforeInsertImage handler finished
						options.beforeInsertImage(loader, function () {

							// when image loaded from cache(almost immediately)
							image.onload = function () {

								// insert image to DOM
								loader.parentNode.replaceChild(image, loader);

								// execute afterInsertImage handler
								options.afterInsertImage(image);
							};
							// load image from cache
							image.src = src;
						});
					}, false);

					// load image to virtual image and actually cache him
					tempImage.src = src;
				});
			} else {
				image.src = src;
			}
		}
	}

	/**
	 * Do nothing or invoke done function if available
	 * @param {HTMLElement} element
	 * @param {function} done
	 */
	function noopWithDone(element, done) {
		done && done();
	}

	/**
	 * Check dataset of image element and try to find image source url
	 * for current resolution.
	 * If it's not exist then trying to find any available source url
	 * from lowest resolution to higher.
	 * @param {HTMLImageElement} image
	 * @param {string} cRes - current resolution key
	 * @return {string}
	 */
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

	/**
	 * 
	 * @return {string}
	 */
	function checkResolution(dpr, resolutions) {
		var current = 0;

		resolutions.forEach(function (res, index) {
			var value = res.value;
			current = value < dpr ? index : current;
		});

		return resolutions[current].key;
	}

	/**
	 * 
	 * @param {HTMLImageElement} image
	 * @return {HTMLElement}
	 */
	function createLoader(image) {
		var container = document.createElement('div');

		container.innerHTML = 'Loading...';
		container.className = 'lazy-loader';

		container.style.width = image.width + 'px';
		container.style.height = image.height + 'px';
		container.style.lineHeight = image.height + 'px';

		return container;
	}

	/**
	 * create new object augmented with passed objects
	 * @param {object...}
	 * @return {object}
	 */
	function extend() {
		var newObject = {},
			sourceObjects = [].splice.call(arguments, 0),
			prop;

		sourceObjects.forEach(function (obj) {
			for (prop in obj) if (obj.hasOwnProperty(prop)) {
				newObject[prop] = obj[prop];
			}
		});

		return newObject;
	}

	window.lazyImages = lazyImages;

}(window));