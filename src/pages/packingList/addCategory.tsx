import React, { Fragment, useState } from "react";

interface Props {
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
  trip_id: number | null;
}

export default function AddCategory({
  setRefreshFlag,
  trip_id,
}: Props) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: newCategoryName,
        trip_id: trip_id,
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
        <div className="pl-2 border-2 border-grey rounded-lg shadow-md shadow-grey-500/50">
        <input
          type="text"
          className="form-control outline-none focus:ring-0 border-none"
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Add category"
        ></input>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-lg"
          disabled={newCategoryName ? false : true}
        >
          {">"}
        </button>
        </div>
      </form>
    </Fragment>
  );
}
