async function fetchMetaData() {
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

  return allData.reverse();
}

function clearTable(table) {
  var rows = table.rows;
  var i = rows.length;
  while (--i) {
    rows[i].parentNode.removeChild(rows[i]);
  }
}

const currecyFormat = (amount) => {
  let textTemp =
    parseFloat(amount) > 0 ? `$${amount}` : `-$${Math.abs(amount)}`;

  return textTemp;
};

const loadResult = (array) => {
  let tableSelf = document.querySelector("table");
  clearTable(tableSelf);
  // let tablebody = document.querySelector("tbody");

  // console.info("ozan", tablebody);
  // tableSelf.appendChild(tablebody);
  calculateTotal(tableSelf, array);
  generateTable(tableSelf, array);
};

fetchMetaData();

function generateTable(table, data) {
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
}

const calculateTotal = (table, data) => {
  let total = 0;
  let thead = document.querySelector("#header");
  console.info(thead);

  data.map((item) => {
    console.info(item);
    total += parseFloat(item.Amount);
  });
  console.info(total);

  table.rows[0].cells[3].innerHTML = currecyFormat(total);
};
