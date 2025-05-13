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

const generateCategories = async (trip_id, nights) => {
    // const { trip_id, nights } = req.body;
    // const [categoryId, setCategoryId] = useState<number>();
    const defaultCategories = ["Ubrania", "Kosmetyki", "Elektronika"];
    let categoryId;
    // const packingList =  generatePackingList(category, nights);

    //dodaj kategorię
    defaultCategories.forEach(async category =>

     {

        //czy istnieje już taka kategoria
        try {
            // const { trip_id } = req.params;
            const itemCategory = await pool.query(
                "SELECT id FROM item_category WHERE trip_id=$1 AND name=$2",
                [trip_id, category]
            );
            ;
            categoryId = itemCategory.rows[0]?.id;
            // setCategoryId(res.json(itemCategory.rows));
            if(categoryId){
                return;
            }
        } catch (error) {
            console.error(error.message);
        }
        

        try {
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

        } catch (error) {
            console.error(error.message);
        }

        //pobierz id kategorii
        try {
            // const { trip_id } = req.params;
            const itemCategory = await pool.query(
                "SELECT id FROM item_category WHERE trip_id=$1 AND name=$2",
                [trip_id, category]
            );
            ;
            categoryId = itemCategory.rows[0]?.id;
            // setCategoryId(res.json(itemCategory.rows));
        } catch (error) {
            console.error(error.message);
        }

        //wylicz ilość dla rzeczy dla podanej kategorii
        // const [packingList, setPackingList]= useState<Item[]>([]);
        // setPackingList(generatePackingList(category, nights));
        let packingList = generatePackingList(category, nights);
        //dodaj po kolei przedmioty z id danej kategorii
        packingList.forEach(async(item) =>{
            try {
                const body = {
                    name: item.name,
                    quantity: item.quantity,
                    packed: item.packed,
                    item_category_id: categoryId
                };
                const response = await fetch(`http://localhost:5000/api/packing_items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                console.log(response);

            } catch (error) {
                console.error(error.message);
            }
        })
        
    })

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