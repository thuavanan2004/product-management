// show-alert
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
// End show-alert
// Table Change InfoCart
const tableCart = document.querySelector("[table-cart]")
if(tableCart){
  const listInputQuantity = tableCart.querySelectorAll("input[name='quantity']");
  listInputQuantity.forEach(input => {
    input.addEventListener("change", (e) => {
      const quantityChange = input.value;
      const productId = input.getAttribute("item-id");
      window.location.href = `/cart/update/${productId}/${quantityChange}`
    })
  });
 
}
// End Table Change InfoCart