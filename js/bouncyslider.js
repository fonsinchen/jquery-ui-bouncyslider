

(function(K, $) {
    $.widget('kwarque.bouncyslider', {
        widgetEventPrefix : 'bounce',

        options : {
            min : 0,
            max : 1000,
            lower : 200,
            upper : 600,
            exponent : 2,
            innerExponent : 1,
            createLabels : function(start, end) {return [start, '', end];}
        },

        _create : function() {
            var self = this;
            var range = function() {return K.dce('div').addClass("ui-slider-range");};
            var slider = K.dce('div').appendTo(this.element);
            var labels = K.dce('div').addClass("ui-slider ui-slider-horizontal ui-slider-labels").appendTo(this.element);
            this.slider = slider;
            this.labels = labels;
            var o = this.options;
            var lower = o.lower;
            var upper = o.upper;
            var cutoff = 0;
            $.each(o.createLabels(o.min, o.max), function(i, label) {
                var widthTest = K.dce('span').height(0).text(label).appendTo(labels);
                cutoff = Math.max(cutoff, widthTest.width());
                widthTest.remove();
            });

            var leftLabels = range().css('text-align', 'right').appendTo(labels);
            var centerLabels = range().css('text-align', 'center').appendTo(labels);
            var rightLabels = range().css('text-align', 'left').appendTo(labels);

            var calcInterval = function(ui) {
                var transpose = function(range, diff, exponent) {
                    diff = diff * 3 / (o.max - o.min);
                    var sign = (diff < 0 ? -1 : 1);
                    return sign * range * Math.pow(diff * sign, exponent);
                };
                var curLower = lower, curUpper = upper;
                if (ui.value === ui.values[0]) {
                    var diffLower = ui.value - (2 * o.min + o.max) / 3;
                    if (diffLower < 0) {
                        curLower += transpose(lower - o.min, diffLower, o.exponent);
                    } else if (diffLower > 0) {
                        curLower += transpose(upper - lower, diffLower, o.innerExponent);
                    }
                }
                if (ui.value === ui.values[1]) {
                    var diffUpper = (o.min + 2 * o.max) / 3 - ui.value;
                    if (diffUpper < 0) {
                        curUpper -= transpose(o.max - upper, diffUpper, o.exponent);
                    } else if (diffUpper > 0) {
                        curUpper -= transpose(upper - lower, diffUpper, o.innerExponent);
                    }
                }
                curLower = Math.max(o.min, curLower);
                curUpper = Math.min(o.max, curUpper);
                return [Math.min(curLower, curUpper), Math.max(curLower, curUpper)];
            }

            var adjustLabels = function(event, ui) {
                var left = Math.round((ui.values[0] - o.min) * 100 / (o.max - o.min));
                var right = Math.round((ui.values[1] - o.min) * 100 / (o.max - o.min));
                var cutoffPercentage = cutoff * 100 / labels.width()
                if ((right - left) > cutoffPercentage) {
                    leftLabels.css('right', 100 - left + '%');
                    centerLabels.css('left', (right + left - cutoffPercentage) / 2 + '%');
                    centerLabels.css('width', cutoff + 'px');
                    rightLabels.css('left', right + '%');
                }
                var interval = calcInterval(ui);
                var labelVals = o.createLabels(interval[0], interval[1]);
                $.each([leftLabels, centerLabels, rightLabels], function(i, labelSpace) {
                    if (labelVals[i] === '') {
                        labelSpace.hide();
                    } else {
                        labelSpace.text(labelVals[i]).show();
                    }
                });
                self._values = {lower : interval[0], upper : interval[1]};
                if (event !== null) self._trigger('change', event, self._values);
            };

            slider.slider({
                range: true,
                min: o.min,
                max: o.max,
                values: [ (2 * o.min + o.max) / 3 , (o.min + 2 * o.max) / 3 ],
                stop: function(event, ui) {
                    var interval = calcInterval(ui);
                    lower = interval[0];
                    upper = interval[1];
                    slider.slider('values', 0, (2 * o.min + o.max) / 3);
                    slider.slider('values', 1, (o.min + 2 * o.max) / 3);
                    self._values = {lower : lower, upper : upper};
                    self._trigger('stop', event, self._values);
                },
                start : function(event) {
                    self._trigger('start', event, self._values);
                },
                change : adjustLabels,
                slide: adjustLabels
            });

            adjustLabels(null, {values : [
                slider.slider('values', 0),
                slider.slider('values', 1)]
            });
            return this;
        },

        destroy: function() {
            this.slider.slider('destroy');
            this.slider.remove();
            this.labels.remove();
            return this;
        },

        values : function() {
            return this._values;
        }
    });
})({dce : function (name) {
    return jQuery(document.createElement(name));
}}, jQuery);
