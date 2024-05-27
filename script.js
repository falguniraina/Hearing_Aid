window.addEventListener("DOMContentLoaded", function () {
    let slides = [];
    const carousel = document.getElementById("carousel");
    const tabs = document.getElementById("tabs-wrapper");
    const carouselInd = document.getElementById("carousel_ind");
    let slideCount = 0;
    let currentSlide = 0;

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            slides = data.data;
            slideCount = slides.length;
            console.log(slides);
            renderCarouselItems();
            renderIndicators(tabs, "tab-item");
            renderIndicators(carouselInd, "indicator");
            init();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function renderCarouselItems() {
        slides.forEach(slide => {
            const slideElContent = document.createElement("h2");
            slideElContent.innerHTML = `<span><strong>hear.com</strong> HORIZON</span> ` + slide.label;
            const slideImage = document.createElement("img");
            slideImage.setAttribute("src", slide.imgUrl);
            const slideEl = document.createElement("div");
            slideEl.className = "carousel-item";
            slideEl.id = slide.key;
            slideEl.appendChild(slideElContent);
            slideEl.appendChild(slideImage);
            carousel.appendChild(slideEl);
        });
    }

    function renderIndicators(el, cls) {
        slides.forEach((slide, index) => {
            const indicatorEl = document.createElement('li');
            indicatorEl.className = cls;
            indicatorEl.innerHTML = `<span><strong>hear.com</strong> HORIZON</span> ` + slide.label;
            indicatorEl.setAttribute("data-carousel", slide.key);
            indicatorEl.addEventListener("click", () => goToSlide(index));
            el.appendChild(indicatorEl);
        });
    }

    function updateSlide() {
        slides.forEach((slide, index) => {
            const slideEl = document.getElementById(slide.key);
            if (slideEl) {
                slideEl.style.display = currentSlide === index ? 'flex' : 'none';
            }
        });
    }

    function goToSlide(index, isUpdatedUrl = true) {

        currentSlide = (index + slideCount) % slideCount;
        updateSlide();
        updateIndicators("tab-item");
        updateIndicators("indicator");
        if (isUpdatedUrl) {
            updateURL();
        }

    }

    function updateIndicators(cls) {
        const elements = document.querySelectorAll(`.${cls}`);
        elements.forEach((el, index) => {
            if (index === currentSlide) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });
    }
    function updateURL() {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('aud_device', slides[currentSlide].key);
        window.history.replaceState(null, null, newUrl.toString());
    }

    document.getElementById("prev-arrow").addEventListener('click', () => goToSlide(currentSlide - 1));
    document.getElementById("next-arrow").addEventListener('click', () => goToSlide(currentSlide + 1));

    function init() {
        const queryParam = new URLSearchParams(window.location.search).get('aud_device');
        if (queryParam) {
            const index = slides.findIndex(slide => slide.key === queryParam);
            if (index !== -1) {
                goToSlide(index, false);
            }
        } else {
            goToSlide(0, false);
        }
        updateSlide();
        updateIndicators("tab-item");
        updateIndicators("indicator");

    }
});
