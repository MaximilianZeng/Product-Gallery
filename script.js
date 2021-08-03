let products;
let carousel = document.body.querySelector("#carousel");
let dots = document.body.querySelector("#carousel .dots");
let slideIndex = 1;

fetch('./index.json')
.then((response) => response.json())
.then((data) => handleProductData(data));

let handleProductData = (productData) => {
    products = productData["groups"];
    products.forEach((product, index) => {
        var product_wrapper = document.createElement("div");
        product_wrapper.classList.add("grid-item");
        product_wrapper.classList.add("product-frame");

        var image = document.createElement("img");
        if ("hero" in product)
            image.setAttribute("src", product["hero"]["href"]);
        image.setAttribute("alt", "Image unavailable");

        var overlay = document.createElement("div");
        overlay.classList.add("info-overlay");
        var title = document.createElement("p");
        title.innerHTML = product["name"];
        var price = document.createElement("p");
        overlay.addEventListener("click", () => { handleProductClick(index) }, false);

        var product_price = 0;
        'priceRange' in product 
            ? product_price = product["priceRange"]["selling"]["high"]
            : product_price = product["price"]["regular"]
        price.innerHTML = "\$ " + product_price;
        overlay.appendChild(title);
        overlay.appendChild(price);

        product_wrapper.append(image);
        product_wrapper.append(overlay);
        document.body.querySelector(".grid-container").appendChild(product_wrapper);
    })
}

let handleProductClick = (index) => {
    let images = products[index]["images"];
    let imageCount = images.length;
    if (imageCount == 0) {
        alert("Sorry, no images available for this product")
        return;
    }
    images.forEach((imageObj, index) => {
        let wrapper = document.createElement("div");
        wrapper.classList.add("slide");
        wrapper.classList.add("fade");
        let image = document.createElement("img");
        image.setAttribute("src", imageObj.href);
        wrapper.append(image);
        carousel.prepend(wrapper);

        let dot = document.createElement("span");
        dot.setAttribute("class", "dot");
        dot.addEventListener("click", () => { currentSlide(index+1) }, false);
        dots.append(dot);
    });
    showSlides(1);
    showOverlay();
}

let plusSlides = (n) => {
    showSlides(slideIndex += n);
}

let currentSlide = (n) => {
    showSlides(slideIndex = n);
}

let showSlides = (n) => {
    let slides = document.querySelectorAll(".slide");
    let dots = document.querySelectorAll(".dot");

    if (n > slides.length) {
        slideIndex = 1
    }  

    if (n < 1) {
        slideIndex = slides.length
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].classList.add("active");
}

let showOverlay = () => {
    document.querySelector("#overlay").style.width = "100%";
    document.querySelector("#carousel").style.visibility = "visible";
    slideIndex = 1;
}

let closeOverlay = () => {
    document.querySelector("#overlay").style.width = "0%";
    document.querySelector("#carousel").style.visibility = "hidden";
    var toRemove = carousel.querySelectorAll(".slide");
    toRemove.forEach( child => child.remove());
    dots.innerHTML = '';
    slideIndex = 1;
}