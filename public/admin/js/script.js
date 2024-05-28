// Button Status
const listButtonStatus = document.querySelectorAll("[button-status]");
if (listButtonStatus.length > 0) {
    let url = new URL(window.location.href);

    listButtonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });

    });

}
// End Button Status
// Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const param = e.target.elements.keyword.value;
        if (param) {
            url.searchParams.set("keyword", param);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url;
    })
}

// End Search
// Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if (listButtonPagination.length > 0) {
    let url = new URL(window.location.href);
    listButtonPagination.forEach((button) => {
        button.addEventListener("click", (e) => {
            const page = button.getAttribute("button-pagination");
            if (page == 1) {
                url.searchParams.delete("page");
                window.location.href = url.href;
            } else {
                url.searchParams.set("page", page);
                window.location.href = url.href;
            }
        });

    });
}
// End Pagination
// Button Change Status
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if (listButtonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("[form-change-status]");
    listButtonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
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
if (checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");
    const listInputId = checkBoxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            listInputId.forEach(input => {
                input.checked = true;
            });
        } else {
            listInputId.forEach(input => {
                input.checked = false;
            });
        }
    })

    listInputId.forEach(inputId => {
        inputId.addEventListener("click", () => {
            const countInputIdChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;
            const lengthInputId = listInputId.length;
            if (countInputIdChecked == lengthInputId) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
};

// End Check Box Multi
// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = formChangeMulti.querySelector("select[name='type']").value;
        const listInputChecked = document.querySelectorAll("input[name='id']:checked");
        if (listInputChecked.length > 0) {
            const ids = [];
            listInputChecked.forEach(input => {
                let id = input.value;
                if (type == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });
            const stringIds = ids.join(", ");
            const input = formChangeMulti.querySelector("input[name='ids']");
            input.value = stringIds;
            if (type == "delete-all") {
                const isConfirm = confirm("Bạn có chắc chắn xóa những bản ghi này không !")
                if (!isConfirm) {
                    return;
                }
            }
            if (type == "remove-all") {
                const action = formChangeMulti.action;
                const path = action.split("?")[0];
                const newAction = `${path}?_method=DELETE`
                formChangeMulti.action = newAction
                const isConfirm = confirm("Bạn có chắc chắn xóa vĩnh viễn những bản ghi này không !")
                if (!isConfirm) {
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
// Delete 
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    const formDelete = document.querySelector("[form-delete]");
    buttonDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn xóa sản phẩm này không ?");
            if (isConfirm) {
                const path = formDelete.getAttribute("data-path");
                const id = button.getAttribute("data-id");
                action = `${path}/${id}?_method=DELETE`;
                formDelete.action = action;
                formDelete.submit();
                alert("Xóa sản phẩm thành công !");
            }
        });
    })
}
// End Delete
// Trash
const buttonRecall = document.querySelectorAll("[button-recall]");
if (buttonRecall.length > 0) {
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
if (buttonRemove.length > 0) {
    const formRemove = document.querySelector("[form-remove]");
    const path = formRemove.getAttribute("data-path");
    buttonRemove.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirmRemove = confirm("Bạn có chắc chắn xóa vĩnh viễn sản phẩm này không ?");
            if (isConfirmRemove) {
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
if (showAlert) {
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
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    const labelLogo = document.querySelector("label[for='thumbnail']");
    uploadImageInput.addEventListener("change", () => {
        const file = uploadImageInput.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            if (labelLogo) {
                labelLogo.style.display = "none";
            }
        }

    });
}
// End Upload-image-preview
// Sort
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select]");
    sortSelect.addEventListener("change", () => {
        const [sortKey, sortValue] = sortSelect.value.split("-");
        url.searchParams.set('sortKey', sortKey);
        url.searchParams.set('sortValue', sortValue);
        window.location.href = url.href;
    });
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    const sortSelectCheck = [sortKey, sortValue].join("-");

    if (sortKey && sortValue) {
        const listOption = sortSelect.querySelector(`option[value='${sortSelectCheck}']`)
        listOption.selected = true;
    }
    const buttonSortClear = sort.querySelector("[sort-clear]")
    buttonSortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    })

}
// End Sort
// Data table permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    const buttonSubmitPermissions = document.querySelector("[button-submit-permissions]");
    buttonSubmitPermissions.addEventListener("click", () => {
        const rows = tablePermissions.querySelectorAll("tr[data-name]");
        const roles = [];
        rows.forEach((row) => {
            const inputs = row.querySelectorAll("input");
            const dataName = row.getAttribute("data-name");
            if (dataName === "id") {
                inputs.forEach((input) => {
                    const id = input.getAttribute("value");
                    roles.push({
                        id: id,
                        permissions: []
                    });
                })
            } else {
                inputs.forEach((input, index) => {
                    const inputChecked = input.checked;
                    if (inputChecked) {
                        roles[index].permissions.push(dataName);
                    }
                })
            }

        });
        if (roles.length > 0) {
            const formChangePermissions = document.querySelector("[form-change-permissions]");
            const inputFormChangePermissions = formChangePermissions.querySelector("input[name='roles']");
            inputFormChangePermissions.value = JSON.stringify(roles);
            formChangePermissions.submit();
        }
    });

}
// End Data table permissions

// Data default Table Permissions
const dataRecord = document.querySelector("[data-records]");
if (dataRecord) {
    const tablePermissions = document.querySelector("[table-permissions]");
    const records = JSON.parse(dataRecord.getAttribute("data-records"));
    records.forEach((record, index) => {
        record.permissions.forEach((dataName) => {
            const row = tablePermissions.querySelector(`[data-name='${dataName}']`);
            if (row) {
                const item = row.querySelectorAll("input");
                item[index].checked = true;
            }
        });

    });
}
// End Data default Table Permissions
// Sider 
const activeSider = document.querySelector("[sider]")
if (activeSider) {
    let href = window.location.href;
    const activeLi = href.split("/")[4].split("?")[0]

    if (activeLi == "roles") {
        if (href.split("/")[5] == "permissions") {
            const listLi = activeSider.querySelector(`li[${href.split("/")[5]}]`);
            listLi.classList.add("active")
        } else {
            const listLi = activeSider.querySelector(`li[${activeLi}]`);
            listLi.classList.add("active")
        }
    } else {
        const listLi = activeSider.querySelector(`li[${activeLi}]`);
        if (listLi) {
            listLi.classList.add("active")
        }

    }

}
// End Sider 
// BreadCrumb
document.addEventListener('DOMContentLoaded', function () {
    const breadcrumb = document.querySelector("[breadcrumb] ol")
    const hrefCurrent = window.location.href;
    const arrayHrefCurrent = hrefCurrent.split("/");
    const currentPage = arrayHrefCurrent[arrayHrefCurrent.length - 1];
    for (let index = 4; index < arrayHrefCurrent.length; index++) {
        const element = arrayHrefCurrent[index];
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `/`;
        link.textContent = element;
        li.appendChild(link);
        li.classList.add('breadcrumb-item');
        breadcrumb.appendChild(li)
    }

    //    currentPageLi.classList.add("active")
    const currentPageh6 = document.querySelector("[currentPage]");
    if (currentPageh6) {
        switch (currentPage) {
            case "products":
                currentPageh6.textContent = "Danh sách sản phẩm"
                break;
            case "dashboard":
                currentPageh6.textContent = "Tổng quan"
                break;
            case "products-category":
                currentPageh6.textContent = "Danh mục sản phẩm"
                break;
            case "order-management":
                currentPageh6.textContent = "Đơn hàng"
                break;
            case "roles":
                currentPageh6.textContent = "Nhóm quyền"
                break;
            case "permissions":
                currentPageh6.textContent = "Phân quyền"
                break;
            case "accounts":
                currentPageh6.textContent = "Tài khoản"
                break;

            default:
                break;
        }
    }


});
// End BreadCrumb

//Chart
document.addEventListener('DOMContentLoaded', function () {
    const chartOrder = document.getElementById('chart-order');
    if (chartOrder) {
        var ctx = chartOrder.getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12', ],
                datasets: [{
                    label: 'Đơn hàng',
                    data: [120, 130, 140, 180, 220, 200, 210, 240, 100, 160, 120, 210],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});

var data = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    products: [120, 150, 170, 180, 220, 200, 210, 240, 230, 190, 220, 210],
    categories: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190],
    blogs: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160]
};

document.addEventListener('DOMContentLoaded', function () {
    const chartMultiline = document.getElementById('chart-multiline');
    if (chartMultiline) {
        const ctx = chartMultiline.getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                        label: 'Sản phẩm',
                        data: data.products,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Danh mục',
                        data: data.categories,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Blog',
                        data: data.blogs,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                        tension: 0.1,
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});