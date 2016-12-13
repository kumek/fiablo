import TileImages from '../../../resources/TileImages';

// TODO: Move config somewhere else
const TILES_SIZE = 0.5;
export default class Tile {
	constructor(cords, type = 'GRASS') {
		this.cords = cords;
		this.tileImage = TileImages.getRandom();
		this.name = `Tile ${cords.x}-${cords.y}`;
	}
}