const ROLES = ["Lead", "Response", "Reading", "Intercess"];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const OFFICE_DAYS = ["Tuesday", "Thursday"]

function loadNames() {
  const DEFAULT_NAMES = ["Joel", "Mike", "Dion", "Jiahao", "Haroun", "Julian", "Joelle", "Justin"]
  let initStr = "";
  for (let i = 0; i < DEFAULT_NAMES.length; i++) {
    initStr = initStr.concat(DEFAULT_NAMES.at(i), "\n");
  }
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

  let isAtLeastOnce = false;
  let leadMoreThanOnce = false;
  let tables = [];
  while (!isAtLeastOnce || !leadMoreThanOnce) {
    tables = [createTable(names, DAYS.at(0))];
    let i = 1
    while (i < DAYS.length) {
      const table = createTable(names, DAYS.at(i));
      if (names.length < 8 || !hasConsecutives(table, tables.at(i - 1))) {
        tables.push(table);
        i++;
      }
    }
    isAtLeastOnce = atLeastOnce(tables, names);
    leadMoreThanOnce = names.length < 5 || noLeadMoreThanOnce(tables);
  }

  for (let table of tables) {
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

function createTable(names, headerText = "Today") {
  const table = document.createElement("table");

  const header = document.createElement("th");
  header.textContent = headerText;
  header.colSpan = 2;
  table.appendChild(header);

  let blockedNames = [];
  for (let i = 0; i < ROLES.length; i++) {
    const row = document.createElement("tr");
    const roleCell = document.createElement("td");
    roleCell.className = ROLES.at(i);
    roleCell.textContent = ROLES.at(i);

    const nameCell = document.createElement("td");
    let randomName = getRandomName(names, blockedNames);
    if (ROLES.at(i) == "Response" && OFFICE_DAYS.includes(headerText)) {
      randomName = '-';
    }
    nameCell.className = "name";
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

function atLeastOnce(tables, NAMES) {
  let freq = {};
  for (let name of NAMES) {
    if (name == '-') continue;
    freq[name] = 0;
  }

  for (let table of tables) {
    const nameCells = Array.from(table.getElementsByClassName("name"));
    const names = nameCells.map((x) => x.textContent);
    for (let name of names) {
      if (name == '-') continue;
      freq[name]++;
    }
  }

  for (let name of NAMES) {
    if (freq[name] == 0) {
      return false;
    }
  }
  return true;
}

function hasConsecutives(table1, table2) {
  const nameSet1 = new Set(Array.from(table1.getElementsByClassName("name")).map((x) => x.textContent));
  const nameSet2 = new Set(Array.from(table2.getElementsByClassName("name")).map((x) => x.textContent));
  if (nameSet1.intersection(nameSet2).size != 0) {
    return true;
  }
  return false;
}

function noLeadMoreThanOnce(tables) {
  let freq = {};
  for (let table of tables) {
    const leadName = table.getElementsByClassName("Lead")[0].parentElement.getElementsByClassName("name")[0].textContent;
    if (freq[leadName] === undefined) {
      freq[leadName] = 1;
    } else {
      // freq[leadName]++;
      // console.log(freq);
      return false;
    }
  }
  return true;
}
