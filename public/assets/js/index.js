var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// Keeps track of notes in textarea
var activeNote = {};

// Gets all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// A function for saving a note to the db
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// A function for deleting a note from the db
var deleteNotes = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  })
};

// If there is an activeNote, display it, otherwise render empty inputs
var renders_ActiveNote = function() {
  $saveNoteBtn.hide();

  if (typeof activeNote.id === "number") {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Get the note data from the inputs, save it to the db and update the view
var handles_NoteSave = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };
  
  saveNote(newNote);
    getAndRenderNotes();
    renders_ActiveNote();
};

// Deletes notes
var handles_Deletes = function(event) {
  event.stopPropagation();

  var note = $(this).data('id');

  if (activeNote.id === note) {
    activeNote = {};
  }

  deleteNotes(note);
  getAndRenderNotes();
  renders_ActiveNote();
};

// Sets the activeNote and displays it
var handles_NoteView = function() {
  activeNote = $(this).data();
  renders_ActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handles_NewNoteView = function() {
  activeNote = {};
  renders_ActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
var handles_RenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
var renders_NoteList = function(notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    $li.data('id',i);

    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note' data-id="+i+">"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renders_NoteList(data);
  });
};

$saveNoteBtn.on("click", handles_NoteSave);
$noteList.on("click", ".list-group-item", handles_NoteView);
$newNoteBtn.on("click", handles_NewNoteView);
$noteList.on("click", ".delete-note", handles_Deletes);
$noteTitle.on("keyup", handles_RenderSaveBtn);
$noteText.on("keyup", handles_RenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();