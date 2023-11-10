const data = {
  tasks: {
    one: {
      task: "Learning Javascript",
      state: true,
      end: "2020/10/21",
    },
    two: {
      task: "Reader Book Clean Code",
      state: false,
      end: "2023/12/31",
    },
    three: {
      task: "Running",
      state: false,
      end: "2023/06/25",
    },
    four: {
      task: "Pass the Evaluation",
      state: false,
      end: "2023/11/09",
    },
    five: {
      task: "Go to Karaoke",
      state: true,
      end: "2022/08/25",
    },
    six: {
      task: "Finish watching the serie",
      state: false,
      end: "2023/12/31",
    },
    seven: {
      task: "Controll Weight",
      state: false,
      end: "2020/11/22",
    },
  },
};

const numberMap = new Map()
  .set(1, "one")
  .set(2, "two")
  .set(3, "three")
  .set(4, "four")
  .set(5, "five")
  .set(6, "six")
  .set(7, "seven")
  .set(8, "eight")
  .set(9, "nine")
  .set(10, "ten")
  .set(11, "eleven")
  .set(12, "twelve")
  .set(13, "thirteen")
  .set(14, "fourteen")
  .set(15, "fifteen")
  .set(16, "sixteen")
  .set(17, "seventeen")
  .set(18, "eighteen")
  .set(19, "nineteen")
  .set(20, "twenty");

const taskName = document.getElementById("taskName");
const taskStatus = document.getElementById("taskStatus");
const taskDate = document.getElementById("taskDate");
const closeModal = document.getElementById("closeModal");
const saveData = document.getElementById("saveData");
const filterSelect = document.getElementById("filterSelect");

const deepCopy = (value) => {
  return JSON.parse(JSON.stringify(value));
};

const filterData = (data, filter) => {
  return {
    tasks: Object.keys(data.tasks)
      .filter(filter)
      .reduce((obj, key) => {
        obj[key] = data.tasks[key];
        return obj;
      }, {}),
  };
};

const getNextDay = (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
}

filterSelect.addEventListener("change", () => {
  const value = parseInt(filterSelect.value);
  const actual = new Date();
  let dataCopy = data;
  let filteredData = data;
  if (value === 0) {
    loadTable(data);
  } else if (value === 1) {
    filteredData = filterData(dataCopy, (key) => data.tasks[key].state);
  } else if (value === 2) {
    filteredData = filterData(dataCopy, (key) => !data.tasks[key].state && getNextDay(data.tasks[key].end) > actual);
  } else if (value === 3) {
    filteredData = filterData(dataCopy, (key) => !data.tasks[key].state && getNextDay(data.tasks[key].end) < actual);
  }
  loadTable(filteredData);
});

closeModal.addEventListener("click", () => {
  taskName.value = null;
  taskStatus.value = 1;
  taskDate.value = null;
});

saveData.addEventListener("click", () => {
  if((taskName.value === "" || !taskName.value) || (taskDate.value === "" || !taskDate.value)){
    return alert("No se han llenado todos los campos")
  }

  const task = {
    task: taskName.value,
    state: parseInt(taskStatus.value) !== 1,
    end: taskDate.value.replaceAll("-", "/"),
  };
  const elementAmount = Object.keys(data.tasks).length + 1;
  if (elementAmount === 20) {
    alert("No se pueden ingresar mas registros");
  }
  data.tasks[numberMap.get(elementAmount)] = task;
  filterSelect.value = 0;
  closeModal.click();
  loadTable(data);
});

taskDate.min = new Date().toLocaleDateString("fr-ca");

const getState = (state) => {
  const trueItem = `<div class="badge bg-success text-wrap" style="width: 6rem;">Terminada</div>`;
  const falseItem = `<div class="badge bg-warning text-wrap" style="width: 6rem;">Pendiente</div>`;
  return state ? trueItem : falseItem;
};

const buttonEventListener = (event) => {
  data.tasks[event].state = true;
  updateTableElement(data.tasks[event]);
  filterSelect.value = 0;
  loadTable(data);
};

const updateTableElement = (task) => {
  const row = document.getElementById("row-" + task.id);
  row.innerHTML = generateTableRow(task);
  filterSelect.value = 0;
};

const setDataInTable = (task) => {
  tableBody.innerHTML += generateTableRow(task);
};

const generateTableRow = (task) => {
  return `<tr id="row-${task.id}">
  <th scope="row ">${task.id}</th> 
  <td>${task.task}</td> 
  <td>${getState(task.state)}</td>
  <td>${task.end}</td>
  <td>${getActiveButton(task)}</td>
  </tr>`;
};

const getActiveButton = (task) => {
  const actualDate = new Date();
  const taskDate = getNextDay(task.end);
  let text = "Completar";
  let bgColor = "success";
  let disabled = "";
  if (actualDate > taskDate && !task.state) {
    text = "Fuera de tiempo";
    bgColor = "warning";
    disabled = "disabled";
  }
  if (task.state) {
    text = "Completada";
    bgColor = "secondary";
    disabled = "disabled";
  }

  const baseButton = `<button type="button" id="button-${task.id}" onclick="buttonEventListener('${task.id}')" class="btn btn-${bgColor} ${disabled}">${text}</button>`;
  return baseButton;
};

const loadTable = (info) => {
  tableBody.innerHTML = "";
  Object.keys(info.tasks).forEach((key) => {
    const task = info.tasks[key];
    task.id = key;
    setDataInTable(task);
  });
};

const init = () => {
  loadTable(data);
};

init();
