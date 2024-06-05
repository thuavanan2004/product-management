// show-alert
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
// End show-alert

// Scroll Sticky
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.header');
  var headerHeight = header.offsetHeight;

  window.addEventListener('scroll', function () {
    if (window.scrollY > headerHeight) {
      header.classList.add('header-sticky');
    } else {
      header.classList.remove('header-sticky');
    }
  });
});
// Slide Swiper
const swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 10,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 1000,
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  }
});
// End Slide Swiper
// Box Filter price
const boxFilterPrice = document.querySelector("[box-filter-price]");
if (boxFilterPrice) {
  let url = new URL(window.location.href)
  const listButtonFilter = boxFilterPrice.querySelectorAll("[button-filter]");

  listButtonFilter.forEach(button => {
    const [price_from, price_to] = button.getAttribute("data-path").split("-");
    button.addEventListener("click", () => {
      url.searchParams.set("price_from", price_from);
      url.searchParams.set("price_to", price_to);
      window.location.href = url.href;
    })
    if (
      url.searchParams.get("price_from") === price_from &&
      url.searchParams.get("price_to") === price_to
    ) {
      button.classList.add("active");
    }
  })


  const buttonFilterClear = document.querySelector("[button-clear]")
  if (buttonFilterClear) {
    buttonFilterClear.addEventListener("click", () => {
      url.searchParams.delete("price_from")
      url.searchParams.delete("price_to")
      window.location.href = url.href;
    })
  }

}
// End Box filter price
// Filter Sort 
const filterSort = document.querySelector("[filter-sort]");
if (filterSort) {
  const url = new URL(window.location.href);
  const listButtonSort = filterSort.querySelectorAll("[button-sort]");
  listButtonSort.forEach(button => {
    const path = button.getAttribute("data-path");
    const [sortKey, sortValue] = path.split("-")
    button.addEventListener("click", () => {
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
      window.location.href = url.href;
    })
    if (
      url.searchParams.get("sortKey") === sortKey &&
      url.searchParams.get("sortValue") === sortValue
    ) {
      button.classList.add("active");
    }
  })
  // Đánh dấu nút sắp xếp đang hoạt động sau khi tải trang

}
// Button Change Quantity In Cart
const listFormInputQuantity = document.querySelectorAll(".page-cart .input-quantity")
if (listFormInputQuantity.length > 0) {

  const listButtonSubstractQuantity = document.querySelectorAll("[button-substract-quantity]")
  listButtonSubstractQuantity.forEach((button) => {
    button.addEventListener("click", () => {
      const inputQuantity = button.closest(".input-quantity").querySelector("[input-quantity]");
      const currentValue = parseInt(inputQuantity.value)
      if (currentValue > 1)
        inputQuantity.value = currentValue - 1;

      const productId = inputQuantity.getAttribute("item-id");
      window.location.href = `/cart/update/${productId}/${inputQuantity.value}`
    })
  })

  const listButtonAddQuantity = document.querySelectorAll("[button-add-quantity]")
  listButtonAddQuantity.forEach(button => {
    button.addEventListener("click", () => {
      const inputQuantity = button.closest(".input-quantity").querySelector("[input-quantity]");
      const currentValue = parseInt(inputQuantity.value)
      inputQuantity.value = currentValue + 1;

      const productId = inputQuantity.getAttribute("item-id");
      window.location.href = `/cart/update/${productId}/${inputQuantity.value}`
    })
  })

}
// End Button Quantity Change Cart
// Change quantity in Product detail
const divUpdateQuantity = document.querySelector(".product-detail .input-quantity");
if (divUpdateQuantity) {
  const buttonSubstractQuantity = document.querySelector("[button-substract-quantity]")
  buttonSubstractQuantity.addEventListener("click", () => {
    const inputQuantity = buttonSubstractQuantity.closest(".input-quantity").querySelector("[input-quantity]");
    const currentValue = parseInt(inputQuantity.value)
    if (currentValue > 1)
      inputQuantity.value = currentValue - 1;
  })

  const buttonAddQuantity = document.querySelector("[button-add-quantity]");
  buttonAddQuantity.addEventListener("click", () => {
    const inputQuantity = buttonAddQuantity.closest(".input-quantity").querySelector("[input-quantity]");
    const currentValue = parseInt(inputQuantity.value)
    inputQuantity.value = currentValue + 1;
  })
}
// End Change quantity in Product detail
//Form CheckOut with data Province
const fetchDistricts = async (province_id) => {
  try {
    const response = await fetch(`https://vapi.vnappmob.com/api/province/district/${province_id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch districts');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchWards = async (district_id) => {
  try {
    const response = await fetch(`https://vapi.vnappmob.com/api/province/ward/${district_id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch districts');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const formCheckout = document.querySelector("[form-checkout]");
if (formCheckout) {
  $(document).ready(function () {
    $('.selectpicker').selectpicker();
  });

  const selectCity = formCheckout.querySelector("[name='city_id']");
  const selectDistrict = formCheckout.querySelector("[name='district_id']");
  const selectWard = formCheckout.querySelector("[name='ward_id']");

  selectCity.addEventListener("change", async (event) => {
    const province_id = event.target.value.split('-')[0];
    const dataDistricts = await fetchDistricts(province_id);
    selectDistrict.innerHTML = "<option value=''>-- Quận huyện --</option>";
    selectWard.innerHTML = "<option value=''>-- Phường xã --</option>";
    dataDistricts.forEach(district => {
      const value = `${district.district_id}-${district.district_name}`;
      selectDistrict.innerHTML += `<option value="${value.replace(/"/g, '&quot;')}">${district.district_name}</option>`;
    });
    $('.selectpicker').selectpicker('refresh');
  });

  selectDistrict.addEventListener("change", async (event) => {
    const district_id = event.target.value.split('-')[0]; // Extracting the district_id from the value
    const dataWards = await fetchWards(district_id);
    selectWard.innerHTML = "<option value=''>-- Phường xã --</option>";
    dataWards.forEach(ward => {
      const value = `${ward.ward_id}-${ward.ward_name}`;
      selectWard.innerHTML += `<option value="${value.replace(/"/g, '&quot;')}">${ward.ward_name}</option>`;
    });
    $('.selectpicker').selectpicker('refresh');
  });
}


//End Form CheckOut with data Province
// Update method payemnt 
document.addEventListener('DOMContentLoaded', function () {
  const paymentMethods = document.querySelectorAll('.method-item');

  paymentMethods.forEach(method => {
    method.addEventListener('click', function (event) {
      paymentMethods.forEach(method => {
        method.classList.remove('active');
      });

      this.classList.add('active');

      const selectedPaymentMethod = this.dataset.method;

      order.paymentMethod = selectedPaymentMethod;
    });
  });
});
// End Update method payemnt 