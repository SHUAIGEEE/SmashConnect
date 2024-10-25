import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const getCoordinates = async (placeName) => {
	try {
		const response = await client.geocode({
			params: {
				address: placeName,
				key: process.env.GOOGLE_MAPS_API_KEY,
			},
			timeout: 1000, // milliseconds
		});

		if (response.data.status === "OK") {
            console.log(response.data.results[0].address_components);
            console.log(response.data.results[0].geometry.location);
			const { lat, lng } = response.data.results[0].geometry.location;
			return [lng, lat]; // Return coordinates as [longitude, latitude]
		} else {
			throw new Error("Geocoding API error: " + response.data.status);
		}
	} catch (error) {
		console.error(error.data.error_message);
		throw new Error("Failed to get coordinates");
	}
};

export { getCoordinates };
