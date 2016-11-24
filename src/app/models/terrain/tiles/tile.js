import TileImages from '../../../resources/TileImages';

// TODO: Move config somewhere else
const TILES_SIZE = 0.5;
export default class Tile {
	constructor(position, cords, type = 'GRASS', ) {
		this.cords = cords;
		this.position = position;
		this.tileImage = TileImages.getRandom();
	}
}