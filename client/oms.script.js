//keep track of index we would be adding a new record to in case of a new form submit
let CURRENTTICKETID = 0
document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get the form values
    var title = document.getElementById('ticket-title').value;
    var description = document.getElementById('ticket-description').value;
    var priority = document.getElementById('ticket-priority').value;
    
    var element  = {
      //will get the length of the table to keep inventory of ids -- needed for updates, deletes.
      id: getNextTicketID(),
      title: title,
      description: description,
      priority: priority,
      status : 'pending'
    }

    addTicket(title,description,priority);
    buildTicket(element)

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
  function buildTicket(element){
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
    var update_button = document.createElement('button');

    update_button.innerHTML =  'UPDATE';
    delButton.innerHTML = 'RESOLVE';    

    update_button.id =  'update_button';
    delButton.id = 'delete_button';
    button_div.appendChild(delButton); button_div.appendChild(update_button);

    delButton.addEventListener('click', e => {
      deleteTicket(ticketItem)});
    update_button.addEventListener('click', e => {
      updateTicket(ticketItem)});
  }
  async function deleteTicket(ticketItem){
    //ask to confirm, then remove ticket from tickets list  --- or just update with a resolvedate - takes currentdatetime 
    console.log(ticketItem.id)
    await fetch('/api/tickets',{
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ticketItem.id
      })
    })
      .then((res) => res.json())
      .then((json) => console.log(json));

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

    if (tickets.found == true){
      tickets.data.forEach(element => {buildTicket(element)});
      CURRENTTICKETID = tickets.data.length
    }

  });