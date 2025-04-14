import React, { Fragment, useState } from "react";

interface Props {
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
  packing_list_id: number | null;
}

export default function AddCategory({
  setRefreshFlag,
  packing_list_id,
}: Props) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: newCategoryName,
        packing_list_id: packing_list_id,
      };
      const response = await fetch(`http://localhost:5000/api/item_category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
      setNewCategoryName("");
      setRefreshFlag(true);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <Fragment>
      <form className="flex justify-between mb-4" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control border-solid border-s border-black"
          onChange={(e) => setNewCategoryName(e.target.value)}
        ></input>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-lg"
          disabled={newCategoryName ? false : true}
        >
          Add category
        </button>
      </form>
    </Fragment>
  );
}
