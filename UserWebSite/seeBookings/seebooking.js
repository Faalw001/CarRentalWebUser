$(document).ready(async function () {

  let foundCustomerId;

  const allCustomers = await getCustomers();

  for (var i = 0; i < allCustomers.length; i++) {

    if (allCustomers[i].userName == keycloak.tokenParsed.email) {
      foundCustomerId = allCustomers[i].userId;
      console.log(typeof foundCustomerId);
      console.log(foundCustomerId);
      getMyOrders(foundCustomerId);
  
    }
  }

  $("#relode").click(function () {
    $("#div1").load("UserWebSite/seeBookings/seebookings.html");
  });



function getMyOrders(foundCustomerId) {
  fetch("http://localhost:9090/api/v1/myorders", {
    method: "POST",
    body: JSON.stringify({
      userId: foundCustomerId, // See comments 
    }),
    headers: {
      Authorization: 'Bearer ' + keycloak.token,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let bookings = data;
      bookings.forEach((booking) => {
        if (booking.canceled === true) {
          bookingTableCanceled(booking);
        }
        if (booking.canceled === false) {
          bookingTableActive(booking);
        }
      });
    });
}}
);

function bookingTableCanceled(booking) {
  const markup = `<td><strong>${booking.bookingId}</strong></td> <td>${booking.carId}</td> <td>${booking.userId}</td> <td>Canceled</td>  `;
  document.getElementById("11").insertAdjacentHTML("beforeend", markup);
}

function bookingTableActive(booking) {
  const arr = [];
  arr.push(booking);
  arr.forEach((arr) => {
    const markup =
      `<td><strong>${booking.bookingId}</strong></td> <td>${booking.carId}</td> <td>${booking.userId}</td>  ` +
      '<td><a class="btn1 button button" href="#popup1" style="text-decoration: none" id="' +
      booking.bookingId +
      '">Details</a></td>';
    document.getElementById("2").insertAdjacentHTML("beforeend", markup);
    bookingInfo(booking);
    bookingInfo2(booking);
  });
}

function bookingInfo2(booking) {
  $(document).on("click", ".btn2", function () {
    const btn = this; // gör en variabel av knappens egna värdem
    let id = String(btn.id); // över för knappens id som vi satt i tabellen vid id=" +car.carid+"
    const arr = [];
    arr.push(booking);
    arr.forEach((arr) => {
      if (arr.bookingId == id) {
      let a = document.getElementById("formUpdateOrder");
      a.innerHTML =
        "<form>"+
        "<label class='label' id='bookingIdU'>BookingId: "+id+" </label><br />" +
        "<label class='label' >Date To: </label><br />" +
        "<input id='dateFromU' type='date' value ="+booking.startDay +"><br />" +
        "<label class='label'>Date To: </label><br />" +
        "<input id='dateToU' type='date' value ="+booking.endDay +"><br />" +
        "<label class='label'>CarId: </label><br />" +
        "<input id='carIdU' type='number' placeholder ="+booking.carId +"><br />" +
        "<a class='btn3 button button2' href='#popup3' style='text-decoration: none' id=" +
        id +
        ">Submit</a>"+
        "<form>";
      }
    });
    
  });
}

function bookingInfo(booking) {
  $(document).on("click", ".btn1", function () {
    const btn = this; // gör en variabel av knappens egna värdem
    let id = String(btn.id); // över för knappens id som vi satt i tabellen vid id=" +car.carid+"
    const arr = [];
    arr.push(booking);
    arr.forEach((arr) => {
      if (arr.bookingId == id) {
        let a = document.getElementById("pbookingInfo");
        a.innerHTML =
          "<p id='id1'>OrderID: " +
          id +
          "<br>UserId: " +
          booking.userId +
          "<br>CarId: " +
          booking.carId +
          "<br>StartDate: " +
          booking.startDay +
          "<br>EndDate: " +
          booking.endDay +
          "<br>Days: " +
          booking.days +
          "<br>Price: " +
          booking.price +
          "</p> <a class='btn2 button button2' href='#popup2' style='text-decoration: none' id=" +
          id +
          "> Edit </a> " +
          "<a class='cancelbtn button button2' href='#popup4' style='text-decoration: none' id=" +
          id +
          "> Cancel </a> ";
      }
    });
  });

  $(document).on("click", ".btn3", function () {
    const btn = this;
    let id = String(btn.id);
   updateBooking(id);
  });

  $(document).on("click", ".cancelbtn", function () {
    const btn = this;
    let id = String(btn.id);

    cancelBooking(id);
  });

  function cancelBooking(id) {
    console.log(id);
    fetch("http://localhost:9090/api/v1/cancelorder", {
      method: "PUT",
      body: JSON.stringify({
        bookingId: id,
        canceled: true,
      }),
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  async function updateBooking(bookingId) {
    let id = bookingId;

    const sDay = document.getElementById("dateFromU").value;
    const eDay = document.getElementById("dateToU").value;
    const cid = document.getElementById("carIdU").value;

    $(document).on("click", ".btn3", function () {
      //console.log(cid)
    });

    // Hämta id för user id för user i denna order som ska uppdateras
    let foundCustomerId;
    const allCustomers = await getCustomers();
    for (var i = 0; i < allCustomers.length; i++) {
      if (allCustomers[i].userName == keycloak.tokenParsed.email) {
        foundCustomerId = allCustomers[i].userId;
      }
    }

    fetch("http://localhost:9090/api/v1/updateorder", {
      method: "PUT",
      body: JSON.stringify({
        bookingId: id,
        userId: foundCustomerId,
        carId: cid,
        startDay: sDay,
        endDay: eDay,
      }),
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
      
  }
  
}

async function getCustomers()  {
  await fetch("http://localhost:9090/api/v1/customers", {
    method: "GET",
    headers: {
        Authorization: 'Bearer ' + keycloak.token,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    }
})
      .then((response) => response.json())
      .then((data) => {
          customers = data; 

      }).catch((error) => {
          console.log("Error: response not returned: ", error);
      });

  return customers; 
}

