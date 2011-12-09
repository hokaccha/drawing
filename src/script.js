(function() {
  if (window.isinit) return;

  (function init() {
    window.isinit = true;

    var canvas;
    var ctx;
    var body = document.body;
    var drawing = false;
    var x = 0;
    var y = 0;
    var color;
    var lineWidth;

    function onmousedown(e) {
        e.preventDefault();
        e.stopPropagation();
        drawing = true;
        x = e.offsetX;
        y = e.offsetY;
    }

    function onmousemove(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!drawing) return;

        var _x = e.offsetX;
        var _y = e.offsetY;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(_x, _y);
        ctx.stroke();
        ctx.closePath();
        x = _x;
        y = _y;
    }

    function onmouseup(e) {
        e.preventDefault();
        e.stopPropagation();
        drawing = false;
    }

    function onclick(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function onkeydown(e) {
        if (e.keyCode === 27) { // Esc
            action.end();
        }
    }

    var action = {
      start: function(params) {
        if (canvas) return;
        canvas = document.createElement('canvas');
        canvas.width = body.scrollWidth;
        canvas.height = body.scrollHeight;
        canvas.style.zIndex = '99999999';
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.cursor = 'crosshair';
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = color = params.color;
        ctx.lineWidth = lineWidth = params.lineWidth;
        window.addEventListener("mousedown", onmousedown, true);
        window.addEventListener("mousemove", onmousemove, true);
        window.addEventListener("mouseup", onmouseup, true);
        window.addEventListener("keydown", onkeydown, true);
        window.addEventListener("click", onclick, true);
        body.appendChild(canvas);
      },
      change: function(params) {
        if (params.color) {
          ctx.strokeStyle = color = params.color;
        }
        if (params.lineWidth) {
          ctx.lineWidth = lineWidth = params.lineWidth;
        }
      },
      end: function(params) {
        window.removeEventListener("mousedown", onmousedown, true);
        window.removeEventListener("mousemove", onmousemove, true);
        window.removeEventListener("mouseup", onmouseup, true);
        window.removeEventListener("keydown", onkeydown, true);
        window.removeEventListener("click", onclick, true);
        body.removeChild(canvas);
        canvas = null;
      }
    };

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
      if (request.action) {
        action[request.action](request);
      }

      sendResponse({
        isStart: !!canvas,
        color: color,
        lineWidth: lineWidth
      });
    });
  })();
})();
