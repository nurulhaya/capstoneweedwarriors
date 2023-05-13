import * as tablesort from "./tablesort.js";

const reportsHeaders = [
  "id",
  "species",
  "severity",
  "location",
  "photo",
  "reported_by",
  "created",
];
const $form = $(".ui.ticketsform");
const $reportsForm = $(".ui.reportsform");
const table = document.querySelector("#tablebody");
let headers;

async function getTickets() {
  const ticketsFetch = await fetch(`/api/tickets`);
  const result = await ticketsFetch.json();
  return result.data ? result.data.sort((a, b) => a.id - b.id) : [];
}

function updateTicketsTable(data) {
  let bodyhtml = "<span style='padding:20px'>No tickets</span>";
  if (data.length > 0) {
    bodyhtml = "";
    data.forEach((row) => {
      if (row.status === "Resolved") {
        bodyhtml += `<tr class="positive">`;
      } else if (row.status === "Assigned") {
        bodyhtml += `<tr class="warning">`;
      } else {
        bodyhtml += `<tr>`;
      }
      headers.forEach((header) => {
        if (header === "id") {
          let id = row.id;
          if ($.isNumeric(id) && String(id).length < 2) {
            id = `0${id}`;
          }
          bodyhtml += `<td>${id}</td>`;
        } else if (
          (header === "created" || header === "last_modified") &&
          row[header] !== null
        ) {
          const date = row[header];
          bodyhtml += `<td>${new Date(date)
            .toLocaleString().split(',')[0]
            .replace(",", "")
            .replace(/:\d+ /, " ")
          }
            </td>`;
        } else {
          bodyhtml += `<td>${row[header]}</td>`;
        }
      });
      bodyhtml += `<td>`;
      if (row.status !== "Resolved") {
        bodyhtml += `<button class="tiny ui resolve basic button" name=${row.id}>Resolve</button>`;
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

async function getTicketsTableHeaders() {
  const headers = [];
  const headersFetch = await fetch(
    `/api/custom/SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tickets';`
  );
  const result = await headersFetch.json();
  result.forEach((col) => {
    headers.push(col.column_name);
  });

  return headers;
}

function createTableHeader(headers, headerID) {
  let headerhtml = "<tr>";
  headers.forEach((header) => {
    headerhtml += `<th>${header}</th>`;
  });
  document.querySelector(`${headerID}`).innerHTML =
    headerhtml + `<th></th>` + "</tr>";
}

async function updateReportsTable(data) {
  const reportsTable = document.querySelector("#reportstablebody");
  let bodyhtml = "<span style='padding:20px'>No reports</span>";
  if (data.length > 0) {
    const reports = await fetch(`/api/custom/SELECT report_id FROM tickets;`);
    const reportIDs = await reports.json();
    bodyhtml = "";
    data.forEach((row) => {
      bodyhtml += `<tr>`;
      reportsHeaders.forEach((header) => {
        if (header === "id") {
          let id = row.id;
          if ($.isNumeric(id) && String(id).length < 2) {
            id = `0${id}`;
          }
          bodyhtml += `<td>${id}</td>`;
        } else if (
          (header === "created" || header === "last_modified") &&
          row[header] !== null
        ) {
          const date = row[header];
          bodyhtml += `<td>${new Date(date)
            .toLocaleString()
            .replace(",", "")
            .replace(/:\d+ /, " ")}</td>`;
        } else if (header === "photo") {
          bodyhtml += `<td><a href="${row[header]}" target="_blank">image</a></td>`;
        } else {
          bodyhtml += `<td>${row[header]}</td>`;
        }
      });
      bodyhtml += `<td>`;
      if (!reportIDs.map(r => r.report_id).includes(row.id)) {
        bodyhtml += `<button class="tiny ui create basic button" name=${row.id}>Create ticket</button>`;
      }
      bodyhtml += `</td></tr>`;
    });
  }

  reportsTable.innerHTML = bodyhtml;
}

async function getReports() {
  const dataFetch =
    await fetch(`/api/custom/SELECT reports.id, c.common_name AS species, s.category AS severity, ST_AsText(location) AS location, m.url AS photo, CONCAT(u.first_name, ' ', u.last_name) AS reported_by, created FROM reports
    JOIN media m on m.id = reports.media_id
    JOIN severity s on s.id = reports.severity_id
    JOIN catalog c on reports.catalog_id = c.id
    JOIN users u on u.id = reports.user_id;`);
  const result = await dataFetch.json();
  return result.length > 0 ? result.sort((a, b) => a.id - b.id) : [];
}

document.addEventListener("DOMContentLoaded", async () => {
  $(".menu .item").tab();
  headers = await getTicketsTableHeaders();
  createTableHeader(headers, "#tableheader");
  $(".ui.dropdown").dropdown();
  let data = await getTickets();
  let reportsData = await getReports();
  updateTicketsTable(data); // initial load
  $form
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
  createTableHeader(reportsHeaders, "#reportstableheader");
  await updateReportsTable(reportsData);
  $reportsForm
    .form({
      fields: {
        severity: "empty",
      },
    })
    .form("set values", {
      severity: "all",
    });
  $("table").tablesort();

  $form.on("submit", async function (e) {
    e.preventDefault();
    const filters = $form.form("get values");
    let filteredData = data;
    if (filters.status !== "all") {
      filteredData = data.filter(
        (row) => row.status.toLowerCase() === filters.status
      );
    }
    if (filters.priority !== "all") {
      filteredData = filteredData.filter(
        (row) => row.priority.toLowerCase() === filters.priority
      );
    }
    updateTicketsTable(filteredData);
  });

  $reportsForm.on("submit", async function (e) {
    e.preventDefault();
    const filters = $reportsForm.form("get values");
    let filteredData = reportsData;
    if (filters.severity === "high") {
      filteredData = filteredData.filter((row) => {
        return parseInt(row.severity.slice(0, 2)) >= 60;
      });
    } else if (filters.severity === "low") {
      filteredData = filteredData.filter((row) => {
        return parseInt(row.severity.slice(0, 2)) <= 50;
      });
    }
    await updateReportsTable(filteredData);
  });

  document.querySelectorAll(".resolve.button").forEach((button) => {
    button.addEventListener("click", (e) => {
      resolveTicket(e.target.name);
      location.reload();
    });
  });

  document.querySelectorAll(".create.button").forEach((button) => {
    button.addEventListener("click", async (e) => {
    const reportID = e.target.name;
      $('.ui.modal')
      .modal({
        blurring: true
      }).modal('show');
      $('.ui.newticket').form({
        fields: {
          title: "empty",
          description: "empty",
          priority: "empty",
          report_id: "empty",
        },
      })
      .form("set values", {
        title: await getReportInfo(reportID),
        description: "New ticket created from report",
        report_id: parseInt(reportID),
      });
      
    });
  });
  const $newTicketForm = $(".ui.newticket");
    $newTicketForm.on("submit", async function (e) {
        e.preventDefault();
        const input = $newTicketForm.form("get values");
        if ($newTicketForm.form("is valid")) {
        await createTicket(input);
        location.reload();
        }
    });
});
async function getReportInfo(reportID) {
    const dataFetch = await fetch(`/api/custom/SELECT c.common_name, s.category FROM reports
    JOIN severity s on s.id = reports.severity_id
    JOIN catalog c on reports.catalog_id = c.id
    WHERE reports.id = ${reportID};`);
    const result = await dataFetch.json();
    console.log(result);
    return `${result[0].common_name} - ${result[0].category}`;
}

async function createTicket(input) {
    await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: capitalize(input.title),
          description: capitalize(input.description),
          priority: capitalize(input.priority),
          status: 'Not started', 
          report_id: input.report_id,
        }),
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
}


function capitalize(word){
    return word.charAt(0).toUpperCase()
    + word.slice(1)
}