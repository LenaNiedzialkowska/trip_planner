import React, { Fragment, useState } from "react";

interface Props {
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
  item_category_id: number;
}

export default function AddItemInput(Props) {
  const [newItemName, setNewItemName] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: newItemName,
        quantity: 1,
        packed: false,
        item_category_id: Props.item_category_id,
      };
      const response = await fetch(`http://localhost:5000/api/packing_items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      Props.setRefreshFlag(true);
      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <Fragment>
      <form className="flex flex-col items-center justify-between mb-4 flex justify-content-between w-[70%]" onSubmit={onSubmitForm}>
        <div className="pl-2 border-2 border-grey rounded-lg shadow-md shadow-grey-500/50">
        <input
          type="text"
          className="h-[100%] border border-0  outline-none focus:ring-0 border-none"
          placeholder="Add item"
          onChange={(e) => setNewItemName(e.target.value)}
        ></input>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-lg">
          {">"}
        </button>
        </div>
      </form>
    </Fragment>
  );
}
