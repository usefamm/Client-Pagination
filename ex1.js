$(document).ready(function () {
  $(".profile").click(function () {
    read($(this).parent());
  });
});

//some datas
let list_get1;
let list_get2;
let list_limited = [];
let edit_list = [];
let images = $(".card-img-top");
let ids = $(".card-title");
let emails = $(".card-text span");
let links = $(".card-body a");
var targetUser = null;



//Just doing some ajax stuff and calling our required functions for creating our page...
function achieve() {
  $.ajax({
    method: "GET",
    url: "https://reqres.in/api/users?page=1",
    success: function (result) {
      list_get1 = result.data;
    },
  });
  $.ajax({
    method: "GET",
    url: "https://reqres.in/api/users?page=2",
    success: function (resultt) {
      list_get2 = resultt.data;

      concat();
      buttons();
      pages(1);
    },
  });
}

achieve();

//merging two arrays and creating our limited list for just six length...
function concat() {
  edit_list = list_get1.concat(list_get2);
  list_limited = list_get1.concat(list_get2);

  list_limited = chunkArray(list_limited, 6);
}

//for dividing our array to 6 length
function chunkArray(myArray, chunk_size) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

//creating our buttons...
function buttons() {
  for (let i = 0; i < list_limited.length; i++) {
    $(".pagination").append(
      `   <li class="page-item"><a id="${
        i + 1
      }" class="page-link but" onclick="pages(this.id)"  href="#${i + 1}">${
        i + 1
      }</a></li>`
    );
  }
}

//crating our pages...
function pages(element) {
  $(".mt-5").html("");
  for (let j = 0; j < list_limited[element - 1].length; j++) {
    if (list_limited[element - 1].length === j) {
      break;
    }

    $(".mt-5").append(`   <div class="mt-3 col-12 col-md-6 col-lg-4">
             
       <div class="card" id="${list_limited[+element - 1][j].id}">
      <img class="card-img-top" src="${
        list_limited[+element - 1][j].avatar
      }" alt="Card image cap">
      <div class="card-body">
          <h5 class="card-title">${list_limited[+element - 1][j].id} </h5>
          <p class="card-text">email:${list_limited[+element - 1][j].email} </p>
          <button class="btn btn-primary profile" >user profile</button>
      </div>
  </div>
  </div> `);
    $(".profile").click(function () {
      read($(this).parent().find("h5").html());
    });
  }
}

//*********************************************************************************************** */
//                                      READ,CREATE,UPDATE,DELETE                                 */
//*********************************************************************************************** */

//reading our profile
function read(element) {
  list_limited = list_limited.flat();

  $(".modal").css("display", "block");
  targetUser = list_limited.find((el) => el.id - "" === element - "");
  $(".modal-header h2").html("Read");

  $(".modal-body").html(`<img class="avatars" src="${targetUser.avatar}">
  <p>id: ${targetUser.id}</p>
  <p>firstName: ${targetUser.first_name}</p>
  <p>lastName: ${targetUser.last_name}</p>
  <p>email: ${targetUser.email}</p>
  `);
  $(".modal-footer")
    .html(`<button class="btn updateBtn" onclick="showUpdateForm()">Update</button>
  <button class="btn DeleteBtn" onclick="Delete(${element})">Delete</button>`);
  list_limited = chunkArray(list_limited, 6);
}



//UPLOADING OUR IMAGE 
function imagess() {
  const inpFile = document.getElementById("inpFile");
  const previewContainer = document.getElementById("imagePreview");
  const previewImage = previewContainer.querySelector(".image-preview__image");
  const previewDefaultText = previewContainer.querySelector(
    ".image-preview__default-text"
  );

  const file = inpFile.files[0];
  if (file) {
    const reader = new FileReader();

    previewDefaultText.style.display = "none";
    previewImage.style.display = "block";

    reader.addEventListener("load", function () {
      previewImage.setAttribute("src", this.result);
    });
    reader.readAsDataURL(file);
  } else {
    previewDefaultText.style.display = null;
    previewImage.style.display = null;
    previewImage.setAttribute("src", "");
  }
  $(".createBtn").click(function () {
    create();
  });
}



//when we click it will open create form...
$("#myBtn").click(function () {
  list_limited = list_limited.flat();
  $(".modal").css("display", "block");
  $(".modal-header h2").html("Create");
  $(".modal-body").html(`
            <input type="file" class="createFormInputs avatar" name="inpFile" id="inpFile" onchange="imagess()" >
            <div class="image-preview" id="imagePreview" >
            <img src="" alt="Image-preview" class="image-preview__image" >
                <span class="image-preview__default-text">Image Preview</span>     </div>
            <input type="text" class="createFormInputs id"  placeholder="id" value="${
              +(list_limited.slice(-1)[0].id) + 1
            }" disabled>
            <input type="text" class="createFormInputs first_name"  placeholder="firstName">
            <input type="text" class="createFormInputs last_name"  placeholder="lastName">
            <input type="text" class="createFormInputs email"  placeholder="Email">
           `);
  $(".modal-footer").html(`<button class="btn createBtn" >Create</button>`);

  list_limited = chunkArray(list_limited, 6);
});

//CREATING NEW USER
function create() {


  const previewContainer = document.getElementById("imagePreview");
  const previewImage = previewContainer.querySelector(".image-preview__image");

  let createFormInputs = $(".createFormInputs");
  let obj = {};
  list_limited = list_limited.flat();

  for (let index = 0; index < createFormInputs.length; index++) {
    let input = createFormInputs[index];

    if (
      index === 1 &&
      list_limited.findIndex((el) => el.id === input.value - "") !== -1
    ) {
      return alert("Invalid input...Same ID");
    } else if (input.value === "") {
      return alert("Invalid input...Fill all boxes");
    }
  }

  obj = {
    avatar: `${previewImage.src}`,
    id: `${ +(list_limited.slice(-1)[0].id) + 1}`,
    first_name: `${$(".first_name").val()}`,
    last_name: `${$(".last_name").val()}`,
    email: `${$(".email").val()}`,
  };

  list_limited.push(obj);

  list_limited = chunkArray(list_limited, 6);

  $(".modal").css("display", "none");

  $(".but").remove();

  $(".profile").click(function () {
    read($(this).parent().find("h5").html());
  });

  buttons();

  pages(Math.ceil(+(obj.id) / 6))
}


//SHOWING OUR UPDATE FORM
function showUpdateForm() {
  $(".modal-header h2").html("Update");
  $(".modal-body")
    .html(` <input type="file" class="createFormInputs avatar" name="inpFile" id="inpFile" onchange="imagess()"  >
    <div class="image-preview" id="imagePreview"  >
    <img src="" alt="Image-preview" class="image-preview__image" >
        <span class="image-preview__default-text"></span>     </div>
    
    
    
    <input type="text" class="updateFormInputs id" value="${targetUser.id}" disabled>
    <input type="text" class="updateFormInputs first_name" value="${targetUser.first_name}">
    <input type="text" class="updateFormInputs last_name" value="${targetUser.last_name}">
    <input type="text" class="updateFormInputs email" value="${targetUser.email}">
   `);
  $(".modal-footer").html(
    `<button class="btn saveBtn" onclick="update()">Save</button>`
  );

}



//UPDATE
function update() {
  list_limited = list_limited.flat()
  let updateFormInputs = $(".updateFormInputs");
  const previewContainer = document.getElementById("imagePreview");
  const previewImage = previewContainer.querySelector(".image-preview__image");


  for (let index = 0; index < updateFormInputs.length; index++) {
    let input = updateFormInputs[index];
    if (input.value === "") {
      return alert("Fill all inputs dude...I said it thousand times:/");
    }




  }

  targetUser.first_name = `${$(".first_name").val()}`
  targetUser.last_name = `${$(".last_name").val()}`
  targetUser.id = `${$(".id").val()}`
  targetUser.avatar = `${previewImage.src}`

  list_limited = chunkArray(list_limited, 6);


  $(".modal").css("display", "none");

  $(".but").remove();

  buttons();

  pages(Math.ceil(targetUser.id / 6))

  $(".profile").click(function () {
    read($(this).parent().find("h5").html());
  })





}



//DELETE...
function Delete(element) {



  list_limited = list_limited.flat();
  for (i = 0; i < list_limited.length; i++) {
    list_limited = list_limited.filter((el) => el.id - "" !== element - "");
    $(".but").remove();
    list_limited = chunkArray(list_limited, 6);

    $(".modal").css("display", "none");

    break;
  }

  buttons();


  pages(Math.ceil(element / 6));
}