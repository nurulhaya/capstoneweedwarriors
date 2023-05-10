//keep track of index we would be adding a new record to in case of a new form submit


let CURRENTTICKETID = 0
document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get the form values
    var title = document.getElementById('ticket-title').value;
    var description = document.getElementById('ticket-description').value;
    var priority = document.getElementById('ticket-priority').value;
    var location = document.getElementById('ticket-location').value

    //need date stored yyyy-mm-dd
    var element  = {
      //will get the length of the table to keep inventory of ids -- needed for updates, deletes.
      id: getNextTicketID(),
      title: title,
      description: description,
      priority: priority,
      location: location,
      status : 'Pending assignment',
    }

    addTicket(element);
    showTicket(element)

    // Reset the form
    document.getElementById('ticket-form').reset();
  });
  async function addTicket(element){
    const coords = element.location.split(',');
    await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: element.title,
        description: element.description,
        priority: element.priority,
        status: element.status, 
        latitude: parseFloat(coords[0]),
        longitude: parseFloat(coords[1])
      }),
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  }
  function showTicket(element){
    var ticketItem  = document.createElement('li')
      ticketItem.id = element.id
      ticketItem.innerHTML = '<strong>' + element.title + '</strong> - ' + element.description + ' (' + element.priority + ')';
      buildButtons(ticketItem)
      
      document.getElementById('ticket-list').appendChild(ticketItem)
  }
  function buildButtons(ticketItem){
    var button_div =  document.createElement('div');
    button_div.id = 'button_div';
    ticketItem.appendChild(button_div);
    var delButton= document.createElement('button') ;
    //var update_button = document.createElement('button');

    //update_button.innerHTML =  'UPDATE';
    delButton.innerHTML = 'RESOLVE';    

    //update_button.id =  'update_button';
    delButton.id = 'delete_button';
    button_div.appendChild(delButton);
    //button_div.appendChild(update_button);

    delButton.addEventListener('click', e => {
      resolveTicket(ticketItem)});
    //update_button.addEventListener('click', e => {
    //  updateTicket(ticketItem)});
  }
  async function resolveTicket(ticketItem){
    //ask to confirm, then remove ticket from tickets list  --- or just update with a resolvedate - takes currentdatetime 
    console.log(ticketItem.id)
    await fetch('/api/tickets',{
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ticketItem.id
      })
    })
      .then((res) => res.json())
      .then((json) => console.log(json));


    // Ticket is removed from list on front end, but remains in tickets table
    document.getElementById('ticket-list').removeChild(ticketItem);
  }
  function updateTicket(){
    //in case of clerical issue, just update the fields, really just fill out the form again ???
    console.log('updated');
  }
  function getNextTicketID(){
    return CURRENTTICKETID+=1;
  }
  document.addEventListener("DOMContentLoaded", async () => {
    let tickets = await fetch('/api/tickets')
    tickets = await tickets.json();


    //default ticket display -- shows all unresolved tickets in an unordered list 
    if (tickets.found == true){
      tickets.data.forEach(element => {
        if(element.status != 'Resolved' )
        showTicket(element)});
      CURRENTTICKETID = tickets.data.length
    }

  });