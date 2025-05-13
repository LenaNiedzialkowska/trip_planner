const defaultCategories = require("../config/defaultCategories");

function generatePackingList(category, nights){
    const categoryItems = defaultCategories[category];
    if(!categoryItems){
        throw new Error(`Category ${category} does not exist`);
    }

    return categoryItems.map((item) => ({
        name: item.name,
        quantity: item.rule(nights),
        packed: false
    }));
}

module.exports = generatePackingList;