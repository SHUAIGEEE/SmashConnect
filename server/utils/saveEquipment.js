import Equipment from "../models/Equipment.js";

const saveEquipment = async (scrapedEquipmentData, type, brand) => {
	for (const item of scrapedEquipmentData) {
		if (!item.flexibility) {
			item.flexibility = "default";
		}
		if (!item.balance) {
			item.balance = "default";
		}
		const existingEquipment = await Equipment.findOne({
			name: item.name,
			brand,
		});
		if (existingEquipment) {
			existingEquipment.set(item);
			await existingEquipment.save();
		} else {
			const newEquipment = new Equipment({
				...item,
				type,
				brand,
			});
			await newEquipment.save();
		}
	}
};

export default saveEquipment;
