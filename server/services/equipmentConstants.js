// Define Scores and Weights For Racquets
export const flexibilityStyleScores = {
	"extra-stiff": {
		aggressive: 3,
		balanced: 1,
		defensive: 0,
	},
	stiff: {
		aggressive: 3,
		balanced: 2,
		defensive: 0,
	},
	medium: {
		aggressive: 0,
		balanced: 3,
		defensive: 0,
	},
	flexible: {
		aggressive: 0,
		balanced: 2,
		defensive: 3,
	},
	"extra-flexible": {
		aggressive: 0,
		balanced: 0,
		defensive: 3,
	},
	default: {
		aggressive: 0,
		balanced: 0,
		defensive: 0,
	},
};

export const flexibilityLevelScores = {
	"extra-stiff": {
		beginner: 0,
		intermediate: 2,
		advanced: 3,
	},
	stiff: {
		beginner: 0,
		intermediate: 3,
		advanced: 3,
	},
	medium: {
		beginner: 0,
		intermediate: 3,
		advanced: 0,
	},
	flexible: {
		beginner: 3,
		intermediate: 2,
		advanced: 0,
	},
	"extra-flexible": {
		beginner: 3,
		intermediate: 0,
		advanced: 0,
	},
	default: {
		beginner: 0,
		intermediate: 0,
		advanced: 0,
	},
};

export const balanceStyleScores = {
	"extra-head-heavy": {
		aggressive: 3,
		balanced: 0,
		defensive: 0,
	},
	"head-heavy": {
		aggressive: 3,
		balanced: 2,
		defensive: 0,
	},
	"even-balance": {
		aggressive: 0,
		balanced: 3,
		defensive: 2,
	},
	"head-light": {
		aggressive: 0,
		balanced: 2,
		defensive: 3,
	},
	"extra-head-light": {
		aggressive: 0,
		balanced: 0,
		defensive: 3,
	},
	default: {
		aggressive: 0,
		balanced: 0,
		defensive: 0,
	},
};

export const balanceLevelScores = {
	"extra-head-heavy": {
		beginner: 0,
		intermediate: 1,
		advanced: 3,
	},
	"head-heavy": {
		beginner: 0,
		intermediate: 2,
		advanced: 3,
	},
	"even-balance": {
		beginner: 3,
		intermediate: 3,
		advanced: 0,
	},
	"head-light": {
		beginner: 3,
		intermediate: 0,
		advanced: 0,
	},
	"extra-head-light": {
		beginner: 3,
		intermediate: 0,
		advanced: 0,
	},
	default: {
		beginner: 0,
		intermediate: 0,
		advanced: 0,
	},
};

// Weights for calculating final scores
export const weights = {
	style: { flexibility: 0.5, balance: 0.5 },
	level: { flexibility: 0.7, balance: 0.3 },
};

// Define Properties For Strings
export const stringProperties = {
	"VICTOR Badminton Strings VBS-61 String": {
		durability: 7,
		repulsionPower: 9,
		control: 8,
		hittingSound: 9,
	},
	"VICTOR Badminton Strings VBS-68P String": {
		durability: 8,
		repulsionPower: 9,
		control: 7,
		hittingSound: 7,
	},
	"VICTOR Badminton String VBS-70P String": {
		durability: 9,
		repulsionPower: 8,
		control: 7,
		hittingSound: 7,
	},
	"VICTOR Badminton String VBS-70 String": {
		durability: 9,
		repulsionPower: 7,
		control: 8,
		hittingSound: 6,
	},
	"VICTOR x CRAYON SHINCHAN Strings V-63CS": {
		durability: 6,
		repulsionPower: 8,
		control: 7,
		hittingSound: 7,
	},
	"VICTOR Badminton Strings VBS-66 NANO String": {
		durability: 8,
		repulsionPower: 9,
		control: 7,
		hittingSound: 7,
	},
	"VICTOR Badminton Strings VBS-69N String": {
		durability: 9,
		repulsionPower: 9,
		control: 7,
		hittingSound: 8,
	},
	"VICTOR Badminton Strings VBS-63 String": {
		durability: 7,
		repulsionPower: 9,
		control: 7,
		hittingSound: 7,
	},
	"VICTOR Badminton String VS-69": {
		durability: 9,
		repulsionPower: 7,
		control: 7,
		hittingSound: 6,
	},
	"VICTOR Badminton String VS-65": {
		durability: 6,
		repulsionPower: 9,
		control: 7,
		hittingSound: 8,
	},
	"EXBOLT 68": {
		durability: 11,
		repulsionPower: 9,
		control: 10,
		hittingSound: 8,
	},
	EXBOLT65: {
		durability: 8,
		repulsionPower: 10,
		control: 10,
		hittingSound: 9,
	},
	"EXBOLT 63": {
		durability: 7,
		repulsionPower: 11,
		control: 10,
		hittingSound: 10,
	},
	AEROSONIC: {
		durability: 5,
		repulsionPower: 11,
		control: 9,
		hittingSound: 11,
	},
	"BG66 FORCE": {
		durability: 6,
		repulsionPower: 10,
		control: 10,
		hittingSound: 9,
	},
	"BG66 ULTIMAX": {
		durability: 6,
		repulsionPower: 10,
		control: 10,
		hittingSound: 10,
	},
	"NANOGY 98": {
		durability: 7,
		repulsionPower: 10,
		control: 8,
		hittingSound: 8,
	},
	"BG80 POWER": {
		durability: 7,
		repulsionPower: 9,
		control: 6,
		hittingSound: 7,
	},
	BG80: {
		durability: 6,
		repulsionPower: 8,
		control: 6,
		hittingSound: 7,
	},
	AEROBITE: {
		durability: 6,
		repulsionPower: 10,
		control: 10,
		hittingSound: 9,
	},
	"AEROBITE BOOST": {
		durability: 7,
		repulsionPower: 8,
		control: 10,
		hittingSound: 7,
	},
	SKYARC: {
		durability: 7,
		repulsionPower: 8,
		control: 10,
		hittingSound: 6,
	},
	"NANOGY 95": {
		durability: 10,
		repulsionPower: 8,
		control: 6,
		hittingSound: 7,
	},
	BG65: {
		durability: 10,
		repulsionPower: 7,
		control: 6,
		hittingSound: 6,
	},
	"BG65 TITANIUM": {
		durability: 7,
		repulsionPower: 7,
		control: 6,
		hittingSound: 7,
	},
};
