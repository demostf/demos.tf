const overWriteMapBoundaries = {
	'pl_badwater_pro_v9': {
		"boundaryMin": {
			"x": -3041,
			"y": -4747
		},
		"boundaryMax": {
			"x": 4057,
			"y": 3445
		}
	},
	'cp_gullywash_final1': {
		"boundaryMin": {
			"x": -6578,
			"y": -4419
		},
		"boundaryMax": {
			"x": 7978,
			"y": 3767
		}
	},
	'cp_process_final': {
		"boundaryMin": {
			"x": -5219,
			"y": -4106
		},
		"boundaryMax": {
			"x": 5219,
			"y": 3960
		}
	},
	'cp_badlands': {
		"boundaryMin": {
			"x": -4294,
			"y": -4903
		},
		"boundaryMax": {
			"x": 4324,
			"y": 4853
		}
	},
	'pl_upward': {
		"boundaryMin": {
			"x": -3366,
			"y": -4355
		},
		"boundaryMax": {
			"x": 4422,
			"y": 3471
		}
	},
	'koth_product_rc8': {
		"boundaryMin": {
			"x": -8924,
			"y": -4728
		},
		"boundaryMax": {
			"x": 2496,
			"y": 4728
		}
	},
	'koth_viaduct': {
		"boundaryMin": {
			"x": -8924,
			"y": -4728
		},
		"boundaryMax": {
			"x": 2496,
			"y": 4728
		}
	},
	'cp_snakewater_final1': {
		"boundaryMin": {
			"x": -5648,
			"y": -4852
		},
		"boundaryMax": {
			"x": 6710,
			"y": 5252
		}
	},
	'ultiduo_baloo': {
		"boundaryMin": {
			"x": -1678,
			"y": -1964
		},
		"boundaryMax": {
			"x": 1678,
			"y": 1964
		}
	},
	'cp_sunshine': {
		"boundaryMin": {
			"x": -10979,
			"y": 149
		},
		"boundaryMax": {
			"x": -233,
			"y": 10255
		}
	},
	'cp_metalworks_rc7': {
		"boundaryMin": {
			"x": -3208,
			"y": -6706
		},
		"boundaryMax": {
			"x": 3524,
			"y": 4932
		}
	},
	'cp_steel': {
		"boundaryMin": {
			"x": -3001,
			"y": -4233
		},
		"boundaryMax": {
			"x": 4389,
			"y": 2759
		}
	},
	'koth_lakeside_final': {
		"boundaryMin": {
			"x": -4604,
			"y": -3431
		},
		"boundaryMax": {
			"x": 4604,
			"y": 2581
		}
	},
	'cp_granary_pro_b10': {
		"boundaryMin": {
			"x": -4094,
			"y": -6854
		},
		"boundaryMax": {
			"x": 2058,
			"y": 6854
		}
	},
	'koth_ashville_rc1': {
		"boundaryMin": {
			"x": -3529,
			"y": -4081
		},
		"boundaryMax": {
			"x": 3529,
			"y": 4111
		}
	},
	'cp_reckoner_b3a': {
		"boundaryMin": {
			"x": -3797,
			"y": -4900
		},
		"boundaryMax": {
			"x": 3797,
			"y": 4900
		}
	},
	'pl_borneo': {
		"boundaryMin": {
			"x": -3552,
			"y": -8154
		},
		"boundaryMax": {
			"x": 3752,
			"y": 3792
		}
	},
	'pl_swiftwater_final1': {
		"boundaryMin": {
			"x": -2366,
			"y": -6236
		},
		"boundaryMax": {
			"x": 6402,
			"y": 3206
		}
	},
	'ultiduo_grove_b2': {
		"boundaryMin": {
			"x": -2099,
			"y": -1793
		},
		"boundaryMax": {
			"x": 2099,
			"y": 1793
		}
	},
	'pl_vigil_b2': {
		"boundaryMin": {
			"x": -1612,
			"y": -2983
		},
		"boundaryMax": {
			"x": 4986,
			"y": 5817
		}
	},
	'koth_bagel_rc4': {
		"boundaryMin": {
			"x": -4260,
			"y": -2926
		},
		"boundaryMax": {
			"x": 4260,
			"y": 2926
		}
	},
	'ctf_ballin_sky': {
		"boundaryMin": {
			"x": -1024,
			"y": -1504
		},
		"boundaryMax": {
			"x": 1024,
			"y": 1504
		}
	},
	'koth_ultiduo_r_b7': {
		"boundaryMin": {
			"x": -1337,
			"y": -1313
		},
		"boundaryMax": {
			"x": 1337,
			"y": 1313
		}
	},
	'koth_warmtic_rc4': {
		"boundaryMin": {
			"x": -2716,
			"y": -4443
		},
		"boundaryMax": {
			"x": 4586,
			"y": 4541
		}
	}
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

export function getMapBoundaries(map: string): MapBoundries | null {
	const mapAlias = findMapAlias(map);
	return overWriteMapBoundaries[mapAlias];
}
