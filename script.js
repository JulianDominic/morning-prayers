const ROLES = ["Lead", "Response", "Reading", "Intercess"];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

function loadNames() {
  const NAMES = ["Joel", "Mike", "Dion", "Gareth", "Jiahao", "Haroun", "Julian", "Eugene", "Timothy", "Krysten"]
  let initStr = "";
  for (let i = 0; i < NAMES.length; i++) {
    initStr = initStr.concat(NAMES.at(i), "\n");
  }
  console.log(initStr);
  const textarea = document.querySelector("textarea");
  textarea.value = initStr;
}

function handleGenerateOne() {
  var outputArea = document.getElementById("output-area");
  clearTables(outputArea);

  showErrorMessage("");
  const names = getNames();
  // check if the input is valid
  if (names.length < 4) {
    showErrorMessage("ERROR: Need at least 4 names!")
    return;
  }

  const table = createTable(names);
  outputArea.appendChild(table);
}

function handleGenerateWeek() {
  var outputArea = document.getElementById("output-area");
  clearTables(outputArea);

  showErrorMessage("");
  const names = getNames();
  // check if the input is valid
  if (names.length < 4) {
    showErrorMessage("ERROR: Need at least 4 names!")
    return;
  }

  for (let i = 0; i < DAYS.length; i++) {
    const table = createTable(names, DAYS.at(i));
    outputArea.appendChild(table);
  }
}

function getNames() {
  var inputText = document.querySelector("textarea").value;
  var names = inputText.split("\n");
  // remove blank entries
  names = names.filter((item) => item.trim() != "")
  return names;
}

function clearTables(outputArea) {
  let currentTables = Array.from(outputArea.children);
  for (let i = 0; i < currentTables.length; i++) {
    outputArea.removeChild(currentTables.at(i));
  }
}

function createTable(names, headerText="Today") {
  const table = document.createElement("table");
  
  const header = document.createElement("th");
  header.textContent = headerText;
  header.colSpan = 2;
  table.appendChild(header);
  
  let blockedNames = [];
  for (let i = 0; i < ROLES.length; i++) {
    const row = document.createElement("tr");
    const roleCell = document.createElement("td");
    roleCell.textContent = ROLES.at(i);

    const nameCell = document.createElement("td");
    const randomName = getRandomName(names, blockedNames);
    nameCell.textContent = randomName;
    blockedNames.push(randomName);

    row.appendChild(roleCell);
    row.appendChild(nameCell);
    table.appendChild(row);
  }
  return table;
}

function getRandomName(names, blockedNames) {
  let idx = Math.floor(Math.random() * names.length);
  while (blockedNames.includes(names.at(idx))) {
    idx = Math.floor(Math.random() * names.length);
  }
  return names.at(idx);
}

function showErrorMessage(error) {
  var errorArea = document.getElementById("error");
  
  let currentErrors = Array.from(errorArea.children);
  for (let i = 0; i < currentErrors.length; i++) {
    errorArea.removeChild(currentErrors.at(i));
  }

  const errorMessage = document.createElement("p");
  errorMessage.textContent = error;
  errorMessage.className = "errorMessage";
  errorArea.appendChild(errorMessage);
}
