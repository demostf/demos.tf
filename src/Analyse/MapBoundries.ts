const overWriteMapBoundaries = {
	'pl_badwater': {
		boundaryMin: {
			x: -3100,
			y: -3400
		},
		boundaryMax: {
			x: 4100,
			y: 3250
		}
	},
	'cp_gullywash_final1': {
		boundaryMin: {
			x: -4190,
			y: -3100
		},
		boundaryMax: {
			x: 5530,
			y: 2520
		}
	},
	'cp_process_final': {
		boundaryMin: {
			x: -5400,
			y: -3100
		},
		boundaryMax: {
			x: 5400,
			y: 3100
		}
	},
	'cp_badlands': {
		boundaryMin: {
			x: -4300,
			y: -4950
		},
		boundaryMax: {
			x: 4300,
			y: 4950
		}
	},
	'pl_upward': {
		boundaryMin: {
			x: -3100,
			y: -3500
		},
		boundaryMax: {
			x: 4100,
			y: 2600
		}
	},
	'koth_product_rc8': {
		boundaryMin: {
			x: -5600,
			y: -3800
		},
		boundaryMax: {
			x: 2200,
			y: 3800
		}
	},
	'koth_viaduct': {
		boundaryMin: {
			x: -5600,
			y: -3800
		},
		boundaryMax: {
			x: 2200,
			y: 3800
		}
	},
	'cp_snakewater_final1': {
		boundaryMin: {
			x: -5800,
			y: -3400
		},
		boundaryMax: {
			x: 6900,
			y: 3800
		}
	},
	'ultiduo_baloo': {
		boundaryMin: {
			x: -1200,
			y: -1500
		},
		boundaryMax: {
			x: 1200,
			y: 1500
		}
	},
	'cp_sunshine_rc9': {
		boundaryMin: {
			x: -9650,
			y: 200
		},
		boundaryMax: {
			x: -1550,
			y: 10300
		}
	},
	'cp_metalworks_rc7': {
		boundaryMin: {
			x: -3750,
			y: -6750
		},
		boundaryMax: {
			x: 4300,
			y: 5000
		}
	},
	'cp_steel': {
		boundaryMin: {
			x: -3100,
			y: -3600
		},
		boundaryMax: {
			x: 4300,
			y: 2650
		}
	},
	'koth_lakeside_final': {
		boundaryMin: {
			x: -4600,
			y: -3200
		},
		boundaryMax: {
			x: 4500,
			y: 2900
		}
	},
	'cp_granary_pro_b10': {
		boundaryMin: {
			x: -5100,
			y: -6600
		},
		boundaryMax: {
			x: 1150,
			y: 6600
		}
	},
	'koth_ashville_rc1': {
		boundaryMin: {
			x: -3400,
			y: -4100
		},
		boundaryMax: {
			x: 3450,
			y: 4100
		}
	},
	'cp_reckoner_b3a': {
		boundaryMin: {
			x: -3800,
			y: -5150
		},
		boundaryMax: {
			x: 3800,
			y: 5150
		}
	},
	'pl_borneo': {
		boundaryMin: {
			x: -3600,
			y: -7800
		},
		boundaryMax: {
			x: 3800,
			y: 3500
		}
	},
	'pl_swiftwater_final1': {
		boundaryMin: {
			x: -1600,
			y: -6200
		},
		boundaryMax: {
			x: 6350,
			y: 3000
		}
	},
	'ultiduo_grove_b2': {
		boundaryMin: {
			x: -2000,
			y: -2100
		},
		boundaryMax: {
			x: 2000,
			y: 2100
		}
	},
	'pl_vigil_b2': {
		boundaryMin: {
			x: -1700,
			y: -2500
		},
		boundaryMax: {
			x: 5000,
			y: 5300
		}
	},
};

export function findMapAlias(map) {
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

export interface MapBoundries {
	boundaryMin: {
		x: number;
		y: number;
	};
	boundaryMax: {
		x: number;
		y: number;
	}
}

export function getMapBoundaries(map: string): MapBoundries|null {
	const mapAlias = findMapAlias(map);
	return overWriteMapBoundaries[mapAlias];
}
