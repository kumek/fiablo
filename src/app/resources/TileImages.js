import TileImage from './TileImage';
const resources_url = '/resources/images/terrain/grass/';
const _urls = [
	// 'grass_01.png',
	// 'grass_02.png',
	// 'grass_03.png',
	// 'grass_04.png',
	'grass_05.png',
	// 'grass_06.png',
	// 'grass_07.png',
	// 'grass_08.png',
	// 'grass_09.png',
	'grass_10.png',
	'grass_11.png',
	'grass_12.png',
	'grass_13.png',
	'grass_14.png',
	'grass_15.png',
	'grass_16.png',
	// 'grass_17.png',
	// 'grass_18.png',
];
const _images = [];

_urls.forEach(url => _images.push(new TileImage(resources_url + url)));
console.log(_images)

const TileImages = {
	loadImages: () => {
		return Promise.all(_images.map(img => img.load()));
	},

	getRandom: () => {
		return _images[Math.floor(Math.random() * _images.length)];
	}
};

export default TileImages;