// "click" event listeners for all 'a' elements
let authorLinks = document.querySelectorAll("a");

for (authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

// to get author info
async function getAuthorInfo() {
    // to launch modal using JS
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();

    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);

    let authorInfo = document.querySelector("#authorInfo");

    // formats information from database to display all author's info
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
                                 ${data[0].lastName} (${data[0].sex}) <br>
                            </h1>
                            
                            <strong> Profession: </strong> ${data[0].profession} <br>
                            <strong> Date of Birth: </strong> ${data[0].dob} <br>
                            <strong> Date of Death: </strong> ${data[0].dod} <br>
                            <strong> Country: </strong> ${data[0].country} <br>
                            <strong> Biography: </strong> ${data[0].biography} <br>
                            `;

    authorInfo.innerHTML += `<img src = " ${data[0].portrait}"
        width = "200"> <br>`;
}