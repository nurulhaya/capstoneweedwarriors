import * as tablesort from "./tablesort.js";

const table = document.querySelector("#tablecontents");

async function getTableData(table) {
  const dataFetch = await fetch(`/api/${table}`);
  const result = await dataFetch.json();
  return result.data ? result.data : [{"error": "No data found"}];
}

function updateTable(data) {
  const headers = Object.keys(data[0]);
  let headerhtml = "<thead><tr>";
  let bodyhtml = "<tbody>";
  headers.forEach((header) => {
    headerhtml += `<th>${header}</th>`;
  });
  headerhtml += "</tr></thead>";
  data.forEach((row) => {
    bodyhtml += `<tr>`;
    Object.values(row).forEach((value) => {
      if ($.isNumeric(value) && String(value).length < 2) {
        value = `0${value}`;
      }
      bodyhtml += `<td>${value}</td>`;
    });
    bodyhtml += `</tr>`;
  });
  bodyhtml += "</tbody>";
  table.innerHTML = headerhtml + bodyhtml;
}

document.addEventListener("DOMContentLoaded", async () => {
  const $selector = $(".ui.tableselect");
  let selectedTable = "";
  let data = [];

  $selector.dropdown({
    placeholder: "Select table",
    values: [
      {
        name: "catalog",
        value: "catalog",
      },
      {
        name: "media",
        value: "media",
      },
      {
        name: "reports",
        value: "reports",
      },
      {
        name: "severity",
        value: "severity",
      },
      {
        name: "users",
        value: "users",
      },
      {
        name: "tickets",
        value: "tickets",
      },
    ],
  });

  data = await getTableData('catalog');
  updateTable(data);

  $selector.on("change", async function () {
    table.innerHTML = "";
    selectedTable = $selector.dropdown("get value");
    data = await getTableData(selectedTable);
    updateTable(data);
    $("table").tablesort();
  });


});
