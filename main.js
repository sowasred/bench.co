const fetchMetaData = async () => {
  let allData = [];
  let morePagesAvailable = true;
  let pageNumber = 1;

  while (morePagesAvailable) {
    const response = await fetch(
      `https://resttest.bench.co/transactions/${pageNumber}.json`
    );
    let { ok } = response;
    if (ok) {
      let data = await response.json();
      let { transactions } = data;
      transactions.forEach((e) => allData.unshift(e));
      pageNumber++;
    } else {
      morePagesAvailable = false;
    }
  }
  allData = allData.reverse();

  loadResult(allData);

  return allData;
};

const clearTable = (table) => {
  let rows = table.rows;
  let i = rows.length;
  while (--i) {
    rows[i].parentNode.removeChild(rows[i]);
  }
};

const currecyFormat = (amount) => {
  let textTemp =
    parseFloat(amount) > 0 ? `$${amount}` : `-$${Math.abs(amount)}`;

  return textTemp;
};

const generateTable = (table, data) => {
  for (let element of data) {
    let newRow = table.insertRow(-1);
    let tbody = document.createElement("tbody");

    for (let key in element) {
      let newText = document.createTextNode(element[key]);
      if (key == "Date") {
        let newCell = newRow.insertCell(0);
        newCell.appendChild(newText);
      } else if (key == "Company") {
        let newCell = newRow.insertCell(1);
        newCell.appendChild(newText);
      } else if (key == "Amount") {
        newText.textContent = currecyFormat(element[key]);
        let newCell = newRow.insertCell(-1);
        newCell.appendChild(newText);
      } else if (key == "Ledger") {
        let newCell = newRow.insertCell(1);
        newCell.appendChild(newText);
      }
      newRow.appendChild(tbody);
    }
    table.appendChild(tbody);
  }
};

const calculateTotal = (table, data) => {
  let total = 0;
  data.map((item) => {
    total += parseFloat(item.Amount);
  });
  table.rows[0].cells[3].innerHTML = currecyFormat(total);
};

const loadResult = (array) => {
  let tableSelf = document.querySelector("table");
  clearTable(tableSelf);
  calculateTotal(tableSelf, array);
  generateTable(tableSelf, array);
};

fetchMetaData();
