/* ===================== Toggle Style Switcher ===================== */

(function(){
    var styleSwitcherToggle = document.querySelector(".style-switcher .style-switcher-toggler");
    var panel = document.querySelector(".style-switcher");
    if(styleSwitcherToggle && panel){
        // open/close only when toggler clicked
        styleSwitcherToggle.addEventListener("click", function(e){
            e.stopPropagation();
            panel.classList.toggle("open");
        });
        // close when clicking outside
        document.addEventListener("click", function(e){
            if(panel.classList.contains("open") && !panel.contains(e.target)){
                panel.classList.remove("open");
            }
        });
    }

    // Hide style switcher on scroll
    window.addEventListener("scroll", function(){
        var panel = document.querySelector(".style-switcher");
        if(panel && panel.classList.contains("open")){
            panel.classList.remove("open");
        }
    });

    // Toggle color styles
    window.setActiveStyle = function(color){
        var alternateStyles = document.querySelectorAll(".alternate-style");
        alternateStyles.forEach(function(style){
            if(color === style.getAttribute("title")){
                style.removeAttribute("disabled");
            } else {
                style.setAttribute("disabled", "true");
            }
        });
    };

    /* ============ Theme light and dark mode =========== */
    var dayNight = document.querySelector(".day-night");
    if(dayNight){
        dayNight.addEventListener("click", function(){
            var icon = dayNight.querySelector("i");
            document.body.classList.toggle("dark");
            if(icon){
                icon.classList.toggle("fa-sun", document.body.classList.contains("dark"));
                icon.classList.toggle("fa-moon", !document.body.classList.contains("dark"));
            }
        });

        window.addEventListener("load", function(){
            var icon = dayNight.querySelector("i");
            if(icon){
                icon.classList.toggle("fa-sun", document.body.classList.contains("dark"));
                icon.classList.toggle("fa-moon", !document.body.classList.contains("dark"));
            }
        });
    }
})();
