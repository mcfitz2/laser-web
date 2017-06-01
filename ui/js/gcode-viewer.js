/**
 * Created by micahfitzgerald on 4/10/17.
 */
$(function() {
    var c = document.getElementById("grid");
    var ctx = c.getContext("2d");
    var scale = 1;
    var originx = 0;
    var originy = 0;
    var w = c.width;
    var h = c.height;

    c.onmousewheel = function (event){
        console.log(event);
        var mousex = event.clientX - c.offsetLeft;
        var mousey = event.clientY - c.offsetTop;
        var wheel = event.wheelDelta / 120;//n or -n

        var zoom = 1 + wheel / 2;

        ctx.translate(
            originx,
            originy
        );
        ctx.scale(zoom, zoom);
        ctx.translate(
            -( mousex / scale + originx - mousex / ( scale * zoom ) ),
            -( mousey / scale + originy - mousey / ( scale * zoom ) )
        );

        originx = ( mousex / scale + originx - mousex / ( scale * zoom ) );
        originy = ( mousey / scale + originy - mousey / ( scale * zoom ) );
        scale *= zoom;
    }
    setInterval(function() {
        ctx.fillStyle = "white";
        ctx.fillRect(originx,originy,w/scale,h/scale);
        for (var i = 0; i <= w; i = i + 30) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, w);
        }
        ctx.stroke();
        for (var i = h; i >= 0; i = i - 30) {
            ctx.moveTo(0, i);
            ctx.lineTo(h, i);
        }
        ctx.stroke();
    }, 100);
});