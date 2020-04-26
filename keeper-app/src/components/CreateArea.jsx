//jshint esversion:6
import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Zoom from "@material-ui/core/Zoom";

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "" });
  const [selected, setSelected] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    props.addNote(note);
    setNote({ title: "", content: "" });
  }

  function handleChange(event) {
    var newValue = event.target.value;
    var name = event.target.name;

    setNote((preValue) => {
      return { ...preValue, [name]: newValue };
    });
  }

  function handleSelect() {
    setSelected(true);
  }

  return (
    <div>
      <form className="create-note">
        {selected && (
          <input
            onChange={handleChange}
            name="title"
            placeholder="Title"
            value={note.title}
          />
        )}
        <textarea
          onChange={handleChange}
          onSelect={handleSelect}
          name="content"
          placeholder="Take a note..."
          rows={selected ? "3" : "1"}
          value={note.content}
        />
        <Zoom in={selected}>
          <Fab onClick={handleClick}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
