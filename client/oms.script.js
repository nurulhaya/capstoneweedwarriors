// JavaScript code goes here
document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get the form values
    var title = document.getElementById('ticket-title').value;
    var description = document.getElementById('ticket-description').value;
    var priority = document.getElementById('ticket-priority').value;


    addTicket(title,description,priority);
    // Create a new ticket item
    var ticketItem = document.createElement('li');
    ticketItem.innerHTML = '<strong>' + title + '</strong> - ' + description + ' (' + priority + ')';

    // Add the ticket item to the ticket list
    var ticketList = document.getElementById('ticket-list');
    ticketList.appendChild(ticketItem);

    // Reset the form
    document.getElementById('ticket-form').reset();
  });
  async function addTicket(title, description, priority){
    await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        priority: priority,
      }),
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  }
  document.addEventListener("DOMContentLoaded", async () => {
    let tickets = await fetch('/api/tickets')
    tickets = await tickets.json();
    tickets.data.forEach(element => {
      var ticketItem  = document.createElement('li')
      ticketItem.innerHTML = '<strong>' + element.title + '</strong> - ' + element.description + ' (' + element.priority + ')';
      document.getElementById('ticket-list').appendChild(ticketItem)
    });
  });