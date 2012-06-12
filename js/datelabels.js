
(function($) {
    var datelabels = function(startVal, endVal) {
        var startDate = new Date(startVal);
        var endDate = new Date(endVal);
        var common = '';
        var start = '';
        var end = '';
        var nullpad = function(number) {
            return (number < 10 ? '0' : '') + number;
        }
        var month = function(date) {
            return nullpad(date.getMonth() + 1);
        }
        var day = function(date) {
            return nullpad(date.getDate());
        }
        var time = function(date) {
            return nullpad(date.getHours()) + ':' + nullpad(date.getMinutes());
        }
        if (startDate.getFullYear() === endDate.getFullYear()) {
            common += startDate.getFullYear();
            if (startDate.getMonth() === endDate.getMonth()) {
                common += '/' + month(startDate);
                if (startDate.getDate() === endDate.getDate()) {
                    common += '/' + day(startDate);
                } else {
                    start = day(startDate);
                    end = day(endDate);
                }
            } else {
                start = month(startDate) + '/' + day(startDate);
                end = month(endDate) + '/' + day(endDate);
            }
        } else {
            start = startDate.getFullYear();
            end = endDate.getFullYear();
            var yeardiff = end - start;
            if (yeardiff < 10) {
                start += '/' + month(startDate);
                end += '/' + month(endDate);
                if (yeardiff < 3) {
                    start += '/' + day(startDate);
                    end += '/' + day(endDate);
                }
            }
        }
        if (endVal - startVal < 7 * 86400000) {
            start += ' ' + time(startDate);
            end += ' ' + time(endDate);
        }
        return [start, common, end];
    }
    $(document).ready(function() {
        $('#slider-range').bouncyslider({
            createLabels : datelabels,
            min : -86400000 * 31,
            max : 86400000 * 31,
            lower : 0,
            upper : 86400000,
            stop : function(event, ui) {alert(ui.lower + '/' + ui.upper)}
        });
    });
})(jQuery);