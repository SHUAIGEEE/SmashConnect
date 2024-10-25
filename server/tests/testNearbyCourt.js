import { getNearbyCourts } from "../utils/getNearByCourts.js";

const run = async () => {
	try {
		const courts = await getNearbyCourts(3.1319197, 101.6840589);
		console.log(courts);
		// for (const court of courts) {
		// 	console.log(court.openingHours);
		// }
	} catch (error) {
		console.error(error.message);
	}
};

run();
