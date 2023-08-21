jQuery(document).ready(function ($) {
  lazyLoad();

  swiperInit({
    className: ".intro_slider_wrapper",
    breakpoints: false,
    observer: true,
    observeParents: true,
  });


  showPassword($);
  collapseFooterMenusInSmallScreens($);
  toggleSideMenuInSmallScreens($);
  verificationCodeSeprate();
  selectPIckerInit($);

  productsLayout($)

});

// functions init
function selectPIckerInit($) {
  $(".selectpicker").selectpicker();
}

function lazyLoad() {
  const images = document.querySelectorAll(".lazy-omd");

  const optionsLazyLoad = {
    //  rootMargin: '-50px',
    // threshold: 1
  };

  const preloadImage = function (img) {
    img.src = img.getAttribute("data-src");
    img.onload = function () {
      img.parentElement.classList.remove("loading-omd");
      img.parentElement.classList.add("loaded-omd");
      img.parentElement.parentElement.classList.add("lazy-head-om");
    };
  };

  const imageObserver = new IntersectionObserver(function (enteries) {
    enteries.forEach(function (entery) {
      if (!entery.isIntersecting) {
        return;
      } else {
        preloadImage(entery.target);
        imageObserver.unobserve(entery.target);
      }
    });
  }, optionsLazyLoad);

  images.forEach(function (image) {
    imageObserver.observe(image);
  });
}

function swiperInit(
  options
) {
  console.log(options);
  const swiper = new Swiper(options.className + " .swiper-container", {
    spaceBetween: 30,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    rtl: $("html").attr("dir") === "rtl" ? true : false,
    pagination: {
      el: options.className + " .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: options.className + " .swiper-button-next",
      prevEl: options.className + " .swiper-button-prev",
    },
    breakpoints: options.breakpoints,
    observer: options.observer,
    observeParents: options.observeParents,
    grid: options.grid,
    ...options
  });

  lazyLoad();

  return swiper;
}

function verificationCodeSeprate() {
  const inputElements = [...document.querySelectorAll("input.code-input")];

  inputElements.forEach((ele, index) => {
    ele.addEventListener("keydown", (e) => {
      // if the keycode is backspace & the current field is empty
      // focus the input before the current. The event then happens
      // which will clear the input before the current
      if (e.keyCode === 8 && e.target.value === "") {
        inputElements[Math.max(0, index - 1)].focus();
      }
    });
    ele.addEventListener("input", (e) => {
      if (e.target.value === "") {
        inputElements[index].classList = "code-input";
      } else {
        inputElements[index].classList = "code-input active";
      }

      // take the first character of the input
      // this actually breaks if you input an emoji like 👨‍👩‍👧‍👦....
      // but I'm willing to overlook insane security code practices.
      const [first, ...rest] = e.target.value;
      e.target.value = first ?? ""; // the `??` '' is for the backspace usecase
      const lastInputBox = index === inputElements.length - 1;
      const insertedContent = first !== undefined;
      if (insertedContent && !lastInputBox) {
        // continue to input the rest of the string
        inputElements[index + 1].focus();
        inputElements[index + 1].value = rest.join("");
        inputElements[index + 1].dispatchEvent(new Event("input"));
      }
    });
  });
}

function showPassword($) {
  $(".show-password-button-om").on("click", function (e) {
    e.preventDefault();

    if ($(this).parent().find("input").attr("type") == "text") {
      $(this).parent().find("input").attr("type", "password");
      $(this).removeClass("show-om");
    } else {
      $(this).parent().find("input").attr("type", "text");
      $(this).addClass("show-om");
    }
  });
}

function collapseFooterMenusInSmallScreens($) {
  if ($(window).width() <= 991) {
    $(".collapse-head-om").on("click", function (e) {
      e.preventDefault();

      $(".collapse-head-om")
        .not(this)
        .parent()
        .find(".list-collapse-om")
        .slideUp();
      $(this)
        .parent()
        .find(".list-collapse-om")
        .slideToggle({
          queue: false,
          complete: function () {
            $(".list-collapse-om").each(function () {
              if ($(this).css("display") == "none") {
                $(this).parent().removeClass("active");
              } else {
                $(this).parent().addClass("active");
              }
            });
          },
        });
    });
  }
}

function toggleSideMenuInSmallScreens($) {
  // nav men activation
  $("#menu-butt-activ-om").on("click", function (e) {
    e.preventDefault();

    $("#navbar-menu-om").addClass("active-menu");
    $(".overlay").addClass("active");
    $("body").addClass("overflow-body");
  });

  // nav men close
  $(".close-button__ , .overlay ").on("click", function (e) {
    e.preventDefault();
    $("#navbar-menu-om").removeClass("active-menu");
    $(".overlay").removeClass("active");

    $("body").removeClass("overflow-body");
  });
}

function stickyHeader($) {
  let lastScroll = 0;
  const fixedHeaderElement = $(".fixed_header__");

  $(document).on("scroll", function () {
    let currentScroll = $(this).scrollTop();

    const isScrollingDown = function () {
      return currentScroll < lastScroll && currentScroll > 500;
    };
    const isScrollingUp = function () {
      return currentScroll > lastScroll && currentScroll > 500;
    };

    const fixedHeightToHeaderWrapper = function (fixedHeaderElement) {
      const fixedHeaderElementHeight = fixedHeaderElement.innerHeight();
      $(".main_header__").css("height", fixedHeaderElementHeight);
    };

    fixedHeightToHeaderWrapper(fixedHeaderElement);

    if (isScrollingDown()) {
      fixedHeaderElement
        .addClass("active_menu__")
        .removeClass("not_active_menu__");
    } else if (isScrollingUp()) {
      fixedHeaderElement
        .removeClass("active_menu__")
        .addClass("not_active_menu__");
    } else {
      fixedHeaderElement.removeClass("active_menu__ not_active_menu__");
    }
    lastScroll = currentScroll;
  });
}

function dragFilesUpload() {
  const uploadFileInput = document.getElementById("drag_file_upload");
  const outputFileParent = document.getElementById("uploaded_files");
  const uploadFileInputLabel = document.getElementById("drag_file_label");
  let outputFileChildren = "";

  if (!uploadFileInput) {
    return;
  }

  if (outputFileChildren == "") {
    outputFileParent.style.display = "none";
  }

  uploadFileInput.addEventListener("change", () => {
    const formatFileSize = function (bytes) {
      const sufixes = ["B", "kB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
    };

    for (let i = 0; i < uploadFileInput.files.length; i++) {
      if (i >= 5) {
        break;
      }
      let file = uploadFileInput.files[i];
      let fileName = file.name;
      let fileSize = formatFileSize(file.size);

      if (file.type === "image/jpeg" || file.type === "image/png") {
        outputFileChildren += `
            <div class="strip">
              <p class="file_name">
                ${fileName}
                <span class="file_size"> حجم الملف ${fileSize}</span>
              </p>
              <button class="delete_file_button" onclick="return this.parentNode.remove()">
                حذف
              </button>
            </div>
          `;
      }
    }
    uploadFileInputLabel.classList.add("change_border");
    outputFileParent.style.display = "block";
    outputFileParent.innerHTML = outputFileChildren;
  });
}

function productsLayout($) {
  const swiperBreakNormalPoints = {
    0: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 2,
    },
    767: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 4,
    },
  };

  const swiperVerticalBreakPoints = {
    0: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 1,
    },
    767: {
      slidesPerView: 1,
    },
    992: {
      slidesPerView: 2,
    },
    1200: {
      slidesPerView: 2,
    },
  };

  const swiperProps = {
    autoplay: false,
    slidesPerColumn: 2,
    loop: false,
    spaceBetween: 16,
    slidesPerColumnFill: "row",
  }

  swiperProps.breakpoints = swiperBreakNormalPoints;
  swiperProps.className = "#best_seller_swiper__";
  swiperInit(swiperProps);

  swiperProps.className = "#most_viewed_slider";
  swiperInit(swiperProps);

  swiperProps.className = "#our_choise_swiper__";
  swiperProps.breakpoints = swiperVerticalBreakPoints;
  swiperInit(swiperProps);



  $('.cards_view_button').on("click", function () {
    const productAttrTarget = $(this).attr("target");
    const targetSection = $("." + productAttrTarget);
    const products = targetSection.find(".product_card")
    const swiperWrapper = targetSection.find(".products_seller_content").find(">div");
    swiperProps.className = "#" + swiperWrapper.attr("id");


    $(this).siblings().removeClass("active")
    $(this).addClass("active");

    if ($(this).hasClass("virtical_cards_view")) {
      products.addClass("vertical_view");
      swiperProps.breakpoints = swiperVerticalBreakPoints;

    } else {
      products.removeClass("vertical_view");
      swiperProps.breakpoints = swiperBreakNormalPoints;
    }

    swiperInit(swiperProps);

  })

}
