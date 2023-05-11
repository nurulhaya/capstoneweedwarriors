import * as tablesort from "./tablesort.js";

async function getTableData(table) {
  const dataFetch = await fetch(`/api/${table}`);
  const result = await dataFetch.json();
  return result.data ? result.data : [{ error: "No data found" }];
}

function updateTable(data) {
  let bodyhtml = "";
  if (data?.length > 0) {
    data.forEach((row) => {
      bodyhtml += `<tr>`;
      headers.forEach((header) => {
        if (header === "id") {
          let id = row.id;
          if ($.isNumeric(id) && String(id).length < 2) {
            id = `0${id}`;
          }
          bodyhtml += `<td>${id}</td>`;
        } else {
          bodyhtml += `<td>${row[header]}</td>`;
        }
      });
      bodyhtml += `<td>`;
      if (row.status !== "Resolved") {
        bodyhtml += `<button class="ui resolve basic button" name=${row.id}>Resolve</button>`;
      }
      bodyhtml += `</td></tr>`;
    });
  }
  table.innerHTML = bodyhtml;
}

async function resolveTicket(ticketID) {
  await fetch("/api/tickets", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: ticketID,
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}

async function getTableHeaders(table) {
  const headers = [];
  const headersFetch = await fetch(
    `/api/custom/SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}';`
  );
  const result = await headersFetch.json();
  result.forEach((col) => {
    headers.push(col.column_name);
  });

  return headers;
}

function createTableHeader(headers) {
  let headerhtml = "<tr>";
  headers.forEach((header) => {
    headerhtml += `<th>${header}</th>`;
  });
  document.querySelector("#tableheader").innerHTML =
    headerhtml + `<th></th>` + "</tr>";
}

const $form = $(".ui.form");
const table = document.querySelector("#tablebody");
let headers;
document.addEventListener("DOMContentLoaded", async () => {
  headers = await getTableHeaders("tickets");
  createTableHeader(headers);
  $(".ui.dropdown").dropdown();
  let data = await getTableData("tickets");
  updateTable(data); // initial load
  $("table").tablesort();
  $(".ui.form")
    .form({
      fields: {
        status: "empty",
        priority: "empty",
      },
    })
    .form("set values", {
      status: "All",
      priority: "all",
    });

  $form.on("submit", async function (e) {
    e.preventDefault();
    const filters = $form.form("get values");
    console.log(filters);
    let filteredData = data;
    if (filters.status !== 'all') {
      filteredData = data.filter((row) => row.status.toLowerCase() === filters.status);
    }
    if (filters.priority !== 'all') {
      filteredData = filteredData.filter((row) => row.priority.toLowerCase() === filters.priority);
    }
    updateTable(filteredData);
  });

    document.querySelectorAll(".resolve.button").forEach((button) => {
      button.addEventListener("click", (e) => {
        resolveTicket(e.target.name);
        location.reload();
      });
    });


  //   const createBtn = document.querySelector("#createTicketBtn");
  //   const statusDropdown = document.querySelector("#status");
  //   const priorityDropdown = document.querySelector("#priority");

  //   document.querySelectorAll(".resolve.button").forEach((button) => {
  //     button.addEventListener("click", (e) => {
  //       resolveTicket(e.target.name);
  //       location.reload();
  //     });
  //   });

  //   //   statusDropdown.addEventListener("change", () => {
  //   //     console.log(statusDropdown.value);
  //   //     if (statusDropdown.value !== undefined) {
  //   //       data = data.filter((row) => row.status === statusDropdown.value);
  //   //       console.log(data);
  //   //       updateTable(data);
  //   //       $("table").tablesort();
  //   //     }
  //   //   });
  //   createBtn.addEventListener("click", () => {});
});
