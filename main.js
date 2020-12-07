const fetchMetaData = async () => {
  try {
    let allData = [];
    let morePagesAvailable = true;
    let pageNumber = 1;
    let tableSelf = document.querySelector("table");

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
    clearTable(tableSelf);
    generateTable(tableSelf, allData);
    calculateBalance(tableSelf, allData);
  } catch (error) {
    console.error(error);
  }
};

const currecyFormat = (amount) => {
  let textTemp =
    parseFloat(amount) > 0 ? `$${amount}` : `-$${Math.abs(amount)}`;

  return textTemp;
};

const clearTable = (table) => {
  let rows = table.rows;
  let i = rows.length;
  while (--i) {
    rows[i].parentNode.removeChild(rows[i]);
  }
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

const calculateBalance = (table, data) => {
  let total = 0;
  data.map((item) => {
    total += parseFloat(item.Amount);
  });
  table.rows[0].cells[3].innerHTML = currecyFormat(total);
};

fetchMetaData();
