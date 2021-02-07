const express = require("express");
const router = express.Router();
const TodoTask = require("../models/TodoTask.js");
let isSorted = false;
let typeOfSort = "date";
let displayNone = "";

let oldestFirst = ""
let newestFirst = ""
let alphabeticAz = ""
let alphabeticZa = ""

router.get("/", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page || 1;
  const totalData = await TodoTask.find().countDocuments();
  const dataToShowPerReq = 4;
  const totalDataPart = Math.ceil(totalData / dataToShowPerReq);
  const dataToShow = dataToShowPerReq * page;
  await TodoTask.find()
    .limit(dataToShow)
    .sort([[typeOfSort, sorted]])
    .exec(function (err, tasks) {
      res.render("todo.ejs", {
        sorted,
        page,
        totalData,
        totalDataPart,
        dataToShow,
        dataToShowPerReq,
        todoTasks: tasks,
        displayNone,
        oldestFirst,
        newestFirst,
        alphabeticAz,
        alphabeticZa
      });
    });

  let sortList = req.query.sorted;
  if (sortList) {
    isSorted = true;
  }
  if (totalData === 0) {
    isSorted = false;
    
  }
  if (totalData <= 4 ) {
     displayNone = "display-none"; 
  }
  if (totalData > 4 )  {
     displayNone = ""; 
  }
  
});

router.post("/", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = req.query.page;
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();

    res.redirect("/?page=" + page + "&&sorted=" + sorted);
  } catch (err) {
    res.redirect("/");
  }
});

router.get("/remove/:id", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  await TodoTask.deleteOne({ _id: req.params.id });
  let dataLength = await TodoTask.find().countDocuments();
  if (dataLength <= 4) {
    res.redirect("/?page=" + 1 + "&&sorted=" + sorted);
  }
  if (dataLength > 4 && dataLength % 4 >= 1) {
    res.redirect("/?page=" + page + "&&sorted=" + sorted);
  }
  if (dataLength > 4 && dataLength % 4 === 0) {
    res.redirect("/?page=" + (page - 1) + "&&sorted=" + sorted);
  }
});

router
  .get("/edit/:id", (req, res) => {
    let sorted = +req.query.sorted || 1;
    let page = +req.query.page || 1;
    const id = req.params.id;
    const dataToShowPerReq = 4;
    const dataToShow = dataToShowPerReq * page;
    TodoTask.find()
      .limit(dataToShow)
      .sort([[typeOfSort, sorted]])
      .exec(function (err, tasks) {
        res.render("editTodo.ejs", {
          sorted,
          page,
          dataToShow,
          dataToShowPerReq,
          todoTasks: tasks,
          idTask: id
        });
      });
  })
  .post("/edit/:id", async (req, res) => {
    let sorted = +req.query.sorted || 1;
    let page = +req.query.page;
    const id = req.params.id;
    await TodoTask.findByIdAndUpdate(id, {
      content: req.body.content,
    });
    if (isSorted === true) {
      await res.redirect("/?page=" + page + "&&sorted=" + sorted);
    } else {
      res.redirect("/");
    }
  });

router.get("/checked/:id", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  const id = req.params.id;
  const todo = await TodoTask.findById(id);

  if (todo.checked == true) {
    todo.checked = false;
    todo.class = "";
    todo.save();
  } else {
    todo.checked = true;
    todo.class = "checked";
    todo.save();
  }

  await res.redirect("/?page=" + page + "&&sorted=" + sorted);
});

router.get("/cancelEdit", async (req, res) => {
  let page = +req.query.page;
  await res.redirect("/?page=" + page + "&&sorted=-1");
});

router.get("/showmore", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  let totalDataPart = +req.query.totalPages;
  if (totalDataPart === 0) {
    res.redirect("/");
  }
  await res.redirect("/?page=" + (page + 1) + "&&sorted=" + sorted);
});

router.get("/showless", async (req, res) => {
  let sorted = +req.query.sorted || 1;
  await res.redirect("/?page=1&&sorted=" + sorted);
});

router.post("/sort", (req, res) => {
  let value = req.body.example;
  if (value == "oldFirst") {
    oldestFirst = "selected"
    newestFirst = ""
    alphabeticAz = ""
    alphabeticZa = ""
    typeOfSort = "date";
    value = 1;
  }
  if (value == "newFirst") {
    oldestFirst = ""
    newestFirst = "selected"
    alphabeticAz = ""
    alphabeticZa = ""
    typeOfSort = "date";
    value = -1;
  }
  if (value == "az") {
    oldestFirst = ""
    newestFirst = ""
    alphabeticAz = "selected"
    alphabeticZa = ""
    typeOfSort = "content";
    value = 1;
  }

  if (value == "za") {
    oldestFirst = ""
    newestFirst = ""
    alphabeticAz = ""
    alphabeticZa = "selected"
    typeOfSort = "content";
    value = -1;
  }

  res.redirect("/?sorted=" + value);
});

module.exports = router;
