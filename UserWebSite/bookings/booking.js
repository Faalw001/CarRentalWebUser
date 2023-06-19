$(document).ready(function () {




  // hämtar bilar

  fetch("http://localhost:9090/api/v1/cars", {
    headers: {
      Authorization: 'Bearer ' + keycloak.token,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let cars = data;
      sort(cars);

      // sorting
      // cars är en array som skickas till sort från fetch, i sort så sickas cars som den är till car table som skriver ut tabellen.
      //om inte man klickar på en av knapparna som sedan rensar tabellen med innerHTML och sedan skriver efter den har sorterat och sist skickar vidare till car table.
      function sort(cars) {
        document.getElementById("sortModel").onclick = function () {
          cars.sort((a, b) => {
            const modelA = a.model.toUpperCase();
            const modelB = b.model.toUpperCase();
            if (modelA < modelB) {
              return -1;
            }
            if (modelA > modelB) {
              return 1;
            }
            return 0;
          });
          let a = "";
          document.querySelector("table tbody").innerHTML = a;
          carTable(cars);
        };
        document.getElementById("sortName").onclick = function () {
          cars.sort((a, b) => {
            const nameA = a.carName.toUpperCase();
            const nameB = b.carName.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          let a = ""; // detta för att rensa tabellen och skicka in cars array på nytt sorterat.
          document.querySelector("table tbody").innerHTML = a;
          carTable(cars);
        };
        document.getElementById("sortPrice").onclick = function () {
          cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
          let a = "";
          document.querySelector("table tbody").innerHTML = a;
          carTable(cars);
        };
        document.getElementById("sortId").onclick = function () {
          cars.sort((a, b) => a.carId - b.carId);
          let a = ""; // detta för att rensa tabellen och skicka in cars array på nytt sorterat.
          document.querySelector("table tbody").innerHTML = a;
          carTable(cars);
        };
      }
      carTable(cars);
    });
});

function carTable(cars) {
  cars.forEach((car) => {
    const markup =
      `<td><strong>${car.carId}</strong></td> <td>${car.carName} </td> <td>${car.model} </td> <td>${car.pricePerDay}</td> ` +
      '<td><a class="btnBook button button" href="#popup1" style="text-decoration: none" id="' +
      car.carId +
      '">Book</a></td>';
    document
      .querySelector("table tbody")
      .insertAdjacentHTML("beforeend", markup);
  });
}

// ta ut id från knapp i tabell
$(document).on("click", ".btnBook", async function id() {
  const btn = this; // gör en variabel av knappens egna värdem
  let carId = String(btn.id); // över för knappens id som vi satt i tabellen vid id=" +car.carid+"
  let a = document.getElementById("pCarId");
  a.innerHTML = "<p id='id1'>CarID: " + carId + "</p>";

  let foundCustomerId;

  const allCustomers = await getCustomers();

  for (var i = 0; i < allCustomers.length; i++) {
  
    if (allCustomers[i].userName == keycloak.tokenParsed.email) {
      foundCustomerId = allCustomers[i].userId;
      console.log(typeof foundCustomerId);
      console.log(foundCustomerId);
      let a = document.getElementById("pUserId");
      a.innerHTML = "<p id='id1'>UserID: " + foundCustomerId + "</p>";
    }
  }



  orderCar(carId, foundCustomerId);
});

async function orderCar(carId, foundCustomerId) {

console.log("in ordercar "+ carId)
// jag behövde skicka in carID utan att fetch körs så ladde fetch delen i en nestlad function.
 document.getElementById("btnsubmit").onclick = function postCar(){
  const sDay = document.getElementById("cbDateFrom").value;
  const eDay = document.getElementById("cbDateTo").value;
  
  fetch("http://localhost:9090/api/v1/ordercar", {
    method: "POST",
    body: JSON.stringify({
      userId: foundCustomerId, // Change to foundcustiomerId
      carId: carId,
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
  console.log("in postcar "+carId)
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
