import { PlacesClient } from "@googlemaps/places";

const placesClient = new PlacesClient({});

export const getNearbyCourts = async (
	latitude,
	longitude,
	radius = 5000,
	nextPageToken = null
) => {
	try {
		const textQuery = "badminton court";

		const fieldMask = {
			"X-Goog-FieldMask":
				"places.id," +
				"places.displayName.text," +
				"places.shortFormattedAddress," +
				"places.location," +
				"places.internationalPhoneNumber," +
				"places.regularOpeningHours," +
				"places.googleMapsUri," +
				"places.websiteUri,",
		};

		const locationBias = {
			circle: {
				center: {
					latitude,
					longitude,
				},
				radius,
			},
		};

		// TODO: Remove if not needed
		const pageToken = nextPageToken ?? nextPageToken;

		const request = {
			textQuery,
			locationBias,
			pageToken,
		};

		// Place details: get_place
		const response = await placesClient.searchText(request, {
			otherArgs: {
				headers: fieldMask,
			},
		});

		// console.log(response[0].places);

		return response[0].places.map((place) => ({
			name: place.displayName.text,
			address: place.shortFormattedAddress,
			location: {
				type: "Point",
				coordinates: [
					place.location.longitude,
					place.location.latitude,
				],
			},
			googlePlaceId: place.id,
			phoneNumber: place?.internationalPhoneNumber,
			openingHours: place.regularOpeningHours?.weekdayDescriptions,
			googleMapsUri: place.googleMapsUri,
			websiteUri: place?.websiteUri,
		}));
	} catch (error) {
		console.error(error.message);
		throw new Error("Failed to get nearby courts");
	}
};
