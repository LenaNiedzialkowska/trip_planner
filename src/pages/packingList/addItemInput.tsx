import React, { Fragment, useState } from "react";

interface Props {
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddItemInput(Props) {
  const [newItemName, setNewItemName] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: newItemName,
        quantity: 1,
        packed: "no",
        packing_list_id: 1,
        item_category_id: 1,
      };
      const response = await fetch("http://localhost:5000/api/packing_items", {
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
      <form className="d-flex" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control border-solid border-s border-black"
          onChange={(e) => setNewItemName(e.target.value)}
        ></input>
        <button className="btn btn-success">Add</button>
      </form>
    </Fragment>
  );
}
