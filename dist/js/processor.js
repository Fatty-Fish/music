(function($, root) {
    $scope = $(document.body);
    var curDuration;
    var frameId;
    var startTime;
    var lastPercent = 0;

    function formateDate(duration) {
        duration = Math.floor(duration);
        var minute = Math.floor(duration / 60);
        var second = duration - minute * 60;
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        return minute + ":" + second;
    }

    function renderAllTime(duration) {
        curDuration = duration;
        lastPercent = 0;
        var allTime = formateDate(duration);
        $scope.find(".all-time").html(allTime);
    }

    function start(per) {
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();
        lastPercent = per || lastPercent;

        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPercent + (curTime - startTime) / (curDuration * 1000);
            if (percent < 1) {
                frameId = requestAnimationFrame(frame);
                upDate(percent);
            } else {
                cancelAnimationFrame(frameId);
            }
        }
        frame();
    }

    function upDate(percent) {
        var currentTime = percent * curDuration;
        var time = formateDate(currentTime);
        $scope.find(".cur-time").html(time);
        renderPro(percent);
    }

    function renderPro(percent) {
        var percentage = (percent - 1) * 100 + "%";
        $scope.find(".pro-top").css({
            transform: "translateX(" + percentage + ")"
        })
    }

    function stop() {
        var stopTime = new Date().getTime();
        lastPercent = lastPercent + (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);
    }
    root.processor = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        upDate: upDate
    }
})(window.Zepto, window.player);