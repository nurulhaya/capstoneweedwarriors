// JavaScript code goes here
document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get the form values
    var title = document.getElementById('ticket-title').value;
    var description = document.getElementById('ticket-description').value;
    var priority = document.getElementById('ticket-priority').value;

    // Create a new ticket item
    var ticketItem = document.createElement('li');
    ticketItem.innerHTML = '<strong>' + title + '</strong> - ' + description + ' (' + priority + ')';

    // Add the ticket item to the ticket list
    var ticketList = document.getElementById('ticket-list');
    ticketList.appendChild(ticketItem);

    // Reset the form
    document.getElementById('ticket-form').reset();
  });