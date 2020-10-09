const overWriteMapBoundaries = require('./mapboundries.json');

overWriteMapBoundaries['koth_viaduct'] = overWriteMapBoundaries['koth_product_rc8'];
overWriteMapBoundaries['cp_prolands'] = overWriteMapBoundaries['cp_badlands'];

const mapAliases = new Map<string, string>([
	['cp_prolands', 'cp_badlands']
]);

function getMapBasename(map: string): string {
	if (overWriteMapBoundaries[map]) {
		return map;
	}
	const trimMapName = (map) => {
		while (map.lastIndexOf('_') > map.indexOf('_')) {
			map = map.substr(0, map.lastIndexOf('_'));
		}
		return map;
	};
	const trimmed = trimMapName(map);
	if (overWriteMapBoundaries[trimmed]) {
		return trimmed;
	}
	for (const existingMap of Object.keys(overWriteMapBoundaries)) {
		if (trimMapName(existingMap) === map) {
			return existingMap;
		}
	}
	for (const existingMap of Object.keys(overWriteMapBoundaries)) {
		if (trimMapName(existingMap) === trimmed) {
			return existingMap;
		}
	}
	return map;
}

export function findMapAlias(map: string): string {
	const baseName = getMapBasename(map);
	const alias = mapAliases.get(baseName);
	return alias ? alias : baseName;
}

export interface MapBoundries {
	boundary_min: {
		x: number;
		y: number;
	};
	boundary_max: {
		x: number;
		y: number;
	}
}

export function getMapBoundaries(map: string): MapBoundries | null {
	const mapAlias = findMapAlias(map);
	return overWriteMapBoundaries[mapAlias];
}
