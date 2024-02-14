$(document).ready(function() {
    for(let i = 0; i <6;i++){
        var img = $('<img>');
        img.attr('src','static/sprites/sprites/items/poke-ball.png');
        $(".ennemy-team").append(img);
    }
    for(let i = 0; i <6;i++){
        var img = $('<img>');
        img.attr('src','static/sprites/sprites/items/poke-ball.png');
        $(".your-team").append(img);
    }

});


function updateHealthBar(percentage,pokemon) {
    healthBar = $('#pokemon-health-bar'+pokemon);
    console.log(healthBar)
    percentage = Math.min(Math.max(percentage, 0), 100);
    healthBar.css('width',percentage + '%');
    if (percentage < 20) {
        healthBar.addClass('critical-health');
    } else if (percentage < 50) {
        healthBar.addClass('low-health');
        healthBar.removeClass('critical-health');
    } else {
        healthBar.removeClass('low-health');
        healthBar.removeClass('critical-health');
    }
}

