var result_zoom = document.querySelectorAll('#image-zoom-result')
var carousels = document.querySelectorAll('.carousel')

if (carousels) {
    carousels.forEach((carousel, index) => {
        $(`#${carousel.id}`).on('slid.bs.carousel', function (e) {            
            var image_zoom = e.target.querySelector('.carousel-inner .active #image-zoom')
            var image_zoom_query = $('.carousel-inner .active #image-zoom').prevAll()
            image_zoom_query.remove()
            
            if (image_zoom) {
                imageZoom(image_zoom, result_zoom[index])
            }            
        })              
    });
}

function imageZoom(img, result) {    
    var lens, cx, cy;    
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);

    lens.addEventListener("mouseout", outLens);
    img.addEventListener("mouseout", outLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    
    function outLens(e){
        result.classList.remove("image-zoom-result-active")
        result.classList.add("image-zoom-result-inactive")
    }
    function moveLens(e) {    
        result.classList.add("image-zoom-result-active")
        result.classList.remove("image-zoom-result-inactive")
        
        var pos, x, y;
        /*prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        /*calculate the position of the lens:*/
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);
        /*prevent the lens from being positioned outside the image:*/
        if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
        if (x < 0) {x = 0;}
        if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
        if (y < 0) {y = 0;}
        /*set the position of the lens:*/
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /*display what the lens "sees":*/        
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
        
    }
    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
    }
}
