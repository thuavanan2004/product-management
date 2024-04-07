// Button Status
const listButtonStatus = document.querySelectorAll("[button-status]");
if(listButtonStatus.length > 0){
    let url = new URL(window.location.href);

    listButtonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if(status){
                url.searchParams.set("status", status);
            }else {
                url.searchParams.delete("status");
            }
            
           window.location.href = url.href;
        });
        
    });
    
}
// End Button Status
// Search
const formSearch = document.querySelector("#form-search");

if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e)=> {
        console.log(e.target.elements.keyword.value);
        e.preventDefault();
        const param = e.target.elements.keyword.value;
        if(param){
            url.searchParams.set("keyword",param );
        }else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url;
    })
}

// End Search
// Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if(listButtonPagination.length > 0){
    let url = new URL(window.location.href);
    listButtonPagination.forEach((button) => {
        button.addEventListener("click", (e)=> {
            const page = button.getAttribute("button-pagination");
            if(page == 1){
                url.searchParams.delete("page");
                window.location.href = url.href;
            }else {
                url.searchParams.set("page", page);
                window.location.href = url.href;
            }
        });
        
    });
}
// End Pagination
// Button Change Status
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if(listButtonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("[form-change-status]");
    listButtonChangeStatus.forEach(button => {
        button.addEventListener("click", ()=> {
            const id = button.getAttribute("data-id");
            const status = button.getAttribute("data-status");
            const path = formChangeStatus.getAttribute("data-path");
            action = `${path}/${status}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}
// End Button Change Status

// Check Box Multi 
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if(checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");
    const listInputId = checkBoxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            listInputId.forEach(input => {
                input.checked = true;
            });
        } else{
            listInputId.forEach(input => {
                input.checked = false;
            });
        }
    })

    listInputId.forEach(inputId => {
        inputId.addEventListener("click", () => {
           const countInputIdChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;
           const lengthInputId = listInputId.length;
           if(countInputIdChecked == lengthInputId) {
                inputCheckAll.checked = true;
           }else {
                    inputCheckAll.checked = false;
           }
        })
    })
};

// End Check Box Multi
// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = formChangeMulti.querySelector("select[name='type']").value;
        const listInputChecked = document.querySelectorAll("input[name='id']:checked");
        if(listInputChecked.length > 0) {
            const ids = [];
            listInputChecked.forEach(input => {
                let id = input.value;
                if(type == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                }else {
                    ids.push(id);
                }
            });
            const stringIds = ids.join(", ");
            const input = formChangeMulti.querySelector("input[name='ids']");
            input.value = stringIds;
            if(type == "delete-all"){
                const isConfirm = confirm("Bạn có chắc chắn xóa những bản ghi này không !")
                if(!isConfirm){
                    return;
                }
            }
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi !");
        } 
    });
}
// End Form Change Multi
// Delete Product
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
    const formDelete = document.querySelector("[form-delete ]");
    const path = formDelete.getAttribute("data-path");
    buttonDelete.forEach( (button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn xóa sản phẩm này không ?");
            if(isConfirm){
                const id = button.getAttribute("data-id");
                action = `${path}/${id}?_method=DELETE`;
                console.log(action);
                formDelete.action = action;
                formDelete.submit();
                alert("Xóa sản phẩm thành công !");
            } 
        });
    })
}
// End Delete Product
// Trash
const buttonRecall = document.querySelectorAll("[button-recall]");
if(buttonRecall.length > 0) {
    const formRecall = document.querySelector("[form-recall]");
    const path = formRecall.getAttribute("data-path");
    buttonRecall.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const action = `${path}/${id}?_method=PATCH`;
            formRecall.action = action;
            formRecall.submit();
        });
    })
}
const buttonRemove = document.querySelectorAll("[button-remove]");
if(buttonRemove.length > 0) {
    const formRemove = document.querySelector("[form-remove]");
    const path = formRemove.getAttribute("data-path");
    buttonRemove.forEach((button) => {
        button.addEventListener("click", ()=> {
            const isConfirmRemove = confirm("Bạn có chắc chắn xóa vĩnh viễn sản phẩm này không ?");
                if(isConfirmRemove){
                    const id = button.getAttribute("data-id");
                    const action = `${path}/${id}?_method=DELETE`;
                    formRemove.action = action;
                    formRemove.submit();
                }
               
            });
    })
    
}
// End Trash
// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  let time = showAlert.getAttribute("data-time");
  time = parseInt(time);

  // Sau time giây sẽ đóng thông báo
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Khi click vào nút close-alert sẽ đóng luôn
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}

// End Show Alert
// Upload-image-preview
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change", () => {
        const file = uploadImageInput.files[0];
        if(file) {
        uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End Upload-image-preview
// Edit


// End Edit