import React, { Fragment, useState } from "react";

interface Props {
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
  trip_id: string | null;
  setClosePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddCategory({
  setRefreshFlag,
  trip_id,
  setClosePopup
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
      setClosePopup(true);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <Fragment>
      <form className="flex flex-col content-end flex-wrap mb-4 " onSubmit={onSubmitForm}>
        <div className="pl-2 border-2 border-grey rounded-lg shadow-md shadow-grey-500/50">
        <input
          type="text"
          className="form-control outline-none focus:ring-0 border-none"
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Add custom category"
        ></input>
        <button
          className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-400 hover:border-transparent rounded-lg duration-300 ease-in-out"
          disabled={newCategoryName ? false : true}
        >
          {">"}
        </button>
        </div>
      </form>
    </Fragment>
  );
}
