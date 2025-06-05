const generatePackingList = require("./services/generatePackingList");
const pool = require("./db");

// interface Item {
//     name: string,
//     quantity: number,
//     packed: boolean
// }

//dodaj kategorię
//pobierz id kategorii
//wylicz ilość dla rzeczy dla podanej kategorii
//dodaj po kolei przedmioty z id danej kategorii

const generateCategories = async (category, trip_id, nights) => {
    // const { trip_id, nights } = req.body;
    // const [categoryId, setCategoryId] = useState<number>();
    // const ExistingCategories = await pool.query(
    //     "SELECT COUNT(*) FROM item_category WHERE trip_id=$1", [trip_id]
    // );
    // console.log('ExistingCategories', ExistingCategories)
    // const existingCategoriesCount= parseInt(ExistingCategories.rows[0].count,10);
    // if (existingCategoriesCount > 0) {
    //     console.log(`Kategorie dla trip_id ${trip_id} już istnieją. Pomijam generowanie.`);
    //     return;
    // }

    // const defaultCategories = ["Ubrania", "Kosmetyki", "Elektronika"];
    // const packingList =  generatePackingList(category, nights);

    //dodaj kategorię
    // for (const category of defaultCategories) {

        //czy istnieje już taka kategoria
        try {
            const itemCategory = await pool.query(
                "SELECT id FROM item_category WHERE trip_id=$1 AND name=$2",
                [trip_id, category]
            );

            let categoryId = itemCategory.rows[0]?.id;
            if(categoryId) {
                return;
            }
            // setCategoryId(res.json(itemCategory.rows));
            if (!categoryId) {
                //jeśli nie istnieje kategoria, to dodaj ją

                const body = {
                    name: category,
                    trip_id: trip_id,
                };
                const response = await fetch(`http://localhost:5000/api/item_category`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                console.log(response);

                //pobierz id nowej kategorii
                const newCategory = await pool.query(
                    "SELECT id FROM item_category WHERE trip_id=$1 AND name=$2",
                    [trip_id, category]
                );

                categoryId = newCategory.rows[0]?.id;
            }

            let packingList = generatePackingList(category, nights);
            //dodaj po kolei przedmioty z id danej kategorii
            for (const item of packingList) {
                await pool.query(`
                INSERT INTO packing_items (name, quantity, packed, item_category_id)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (item_category_id, name)
                DO UPDATE SET quantity = EXCLUDED.quantity, packed = EXCLUDED.packed;
            `, [item.name, item.quantity, item.packed, categoryId]);

                // const existingItem = await pool.query(
                //     "SELECT id FROM packing_items WHERE item_category_id=$1 AND name=$2",
                //     [categoryId, item.name]
                // );

                // if (existingItem.rows.length === 0) {
                // console.log(existingItem);

                //     try {
                //         const body = {
                //             name: item.name,
                //             quantity: item.quantity,
                //             packed: item.packed,
                //             item_category_id: categoryId
                //         };
                //         const response = await fetch(`http://localhost:5000/api/packing_items`, {
                //             method: "POST",
                //             headers: { "Content-Type": "application/json" },
                //             body: JSON.stringify(body),
                //         });
                //         console.log(response);

                //     } catch (error) {
                //         console.error(error.message);
                //     }
                // }
            }

        } catch (error) {
            console.error(error.message);
        }




        // //pobierz id kategorii
        // try {
        //     // const { trip_id } = req.params;
        //     const itemCategory = await pool.query(
        //         "SELECT id FROM item_category WHERE trip_id=$1 AND name=$2",
        //         [trip_id, category]
        //     );
        //     ;
        //     categoryId = itemCategory.rows[0]?.id;
        //     // setCategoryId(res.json(itemCategory.rows));
        // } catch (error) {
        //     console.error(error.message);
        // }

        //wylicz ilość dla rzeczy dla podanej kategorii
        // const [packingList, setPackingList]= useState<Item[]>([]);
        // setPackingList(generatePackingList(category, nights));


    // }

    // try {

    //     const packingList = await pool.query("SELECT id FROM packing_lists WHERE trip_id = $1", [trip_id])
    //     const packingListId = packingList.rows[0].id;


    //     for (const categoryName of defaultCategories) {
    //         const category = await pool.query("SELECT id FROM item_category WHERE name = $1 AND packing_list_id = $2", [categoryName, packingListId])
    //     }


    // } catch (error) {
    //     throw new Error(error);
    // };

    // packingList.forEach(async (category) => {
    //     await pool.query("INSERT INTO packing_items (name, quantity, packed, item_category_id, created_at) VALUES($1, $2, $3, $4, NOW()) RETURNING *",
    //         [category.name, category.quantity, category.packed,]);
    // })
}

module.exports = generateCategories;