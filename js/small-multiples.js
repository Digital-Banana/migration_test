d3.csv('data/smallmultiples__afrika.csv')
    .row(function (r) {
        return {
            migratieachtergrond: r.migratieachtergrond,
            totaal: Number(r.totaal),
            perioden: Number(r.perioden)
        }
    })
    .get(function (data) {
        var nested = d3.nest()
            .key(function (k) {
                return k.migratieachtergrond;
            })
            .entries(data);

        nested.forEach(function (gt) {
            gt.trackball = [];
        });

        var yExtent = fc.extentLinear()
            .accessors([function (d) {
                return d.totaal;
            }])
            //.pad([0, 0.1])
            .include([0]);

        var xExtent = fc.extentLinear()
            .accessors([function (d) {
                return d.perioden;
            }]);

        var area = fc.seriesSvgArea()
            .crossValue(function (d) {
                return d.perioden;
            })
            .mainValue(function (d) {
                return d.totaal;
            });

        var line = fc.seriesSvgLine()
            .crossValue(function (d) {
                return d.perioden;
            })
            .mainValue(function (d) {
                return d.totaal;
            });

        var gridlines = fc.annotationSvgGridline()
            .xTicks(0)
            .yTicks(4);

        var point = fc.seriesSvgPoint()
            .crossValue(function (d) {
                return d.perioden;
            })
            .mainValue(function (d) {
                return d.value;
            })
            .size(2)
            .decorate(function (selection) {
                selection.enter()
                    .append('text');
                selection.select('text')
                    .text(d => d.value)
            })

        var line = fc.annotationSvgLine()
            .orient('vertical')
            .value(function (d) {
                return d.perioden;
            })
            .decorate(function (selection) {
                selection.enter()
                    .select('.bottom-handle')
                    .append('text');
                selection.select('.bottom-handle text')
                    .text(d => d.perioden)
            })


        var multi = fc.seriesSvgMulti()
            .series([area, line, gridlines, line, point])
            .mapping(function (data, index, series) {
                switch (series[index]) {
                    case point:
                    case line:
                        return data.trackball;
                    default:
                        return data.values;
                }
            });

        var xScale = d3.scaleLinear();

        // create a chart
        var chart = fc.chartSvgCartesian(
                xScale,
                d3.scaleLinear())
            .yDomain(yExtent(data))
            .xDomain(xExtent(data))
            .xLabel(function (d) {
                return d.key;
            })
            .yTicks(3)
            .yTickFormat(d3.format('.0s'))
            .xTicks(2)
            .xTickFormat(d3.format('0'))
            .yOrient('left')
            .plotArea(multi);

        function render() {
            var update = d3.select('#small-multiples')
                .selectAll('div.multiple')
                .data(nested);
            update.enter()
                .append('div')
                .classed('multiple', true)
                .merge(update)
                .call(chart)
                .classed('tooltipTrackball', function (d) {
                    return d.trackball.length;
                });

            // add the pointer component to the plot-area, re-rendering
            // each time the event fires.
            var pointer = fc.pointer()
                .on('point', function (event) {
                    if (event.length) {
                        // determine the year
                        var perioden = Math.round(xScale.invert(event[0].x));
                        // add the point to each series
                        nested.forEach(function (group) {
                            var value = group.values.find(function (v) {
                                return v.perioden === perioden;
                            });
                            group.trackball = [{
                                perioden: perioden,
                                value: value.totaal
              }];
                        })
                    } else {
                        nested.forEach(function (g2) {
                            g2.trackball = [];
                        })
                    }
                    render();
                });

            d3.selectAll('#small-multiples .plot-area')
                .call(pointer);
        }

        render();
    });









//d3.csv('../data/smallmultiples__afrika.csv')
//    .row(function (r) {
//        return {
//            migratieachtergrond: r.migratieachtergrond,
//            totaal: Number(r.totaal),
//            perioden: Number(r.perioden)
//        }
//    })
//    .get(function (data) {
//        var nested = d3.nest()
//            .key(function (k) {
//                return k.migratieachtergrond;
//            })
//            .entries(data);
//    
//    nested.forEach(function(g) {
//      g.trackball = [{
//        perioden: 2008,
//        value: 10000
//      }];
//    });
//
//        var yExtent = fc.extentLinear()
//            .accessors([function (d) {
//                return d.totaal;
//            }])
//            .pad([0, 0.1])
//            .include([0]);
//
//        var xExtent = fc.extentLinear()
//            .accessors([function (d) {
//                return d.perioden;
//            }]);
//
//        var area = fc.seriesSvgArea()
//            .crossValue(function (d) {
//                return d.perioden;
//            })
//            .mainValue(function (d) {
//                return d.totaal;
//            });
//
//        var line = fc.seriesSvgLine()
//            .crossValue(function (d) {
//                return d.perioden;
//            })
//            .mainValue(function (d) {
//                return d.totaal;
//            });
//
//        var gridlines = fc.annotationSvgGridline()
//            .xTicks(0)
//            .yTicks(4);
//    
//    var point = fc.seriesSvgPoint()
//      .crossValue(function(d) { return d.perioden; })
//      .mainValue(function(d) { return d.value; })
//    	.size(55)
//    	.decorate(function(selection) {
//        selection.enter()
//        	.append('text');        
//        selection.select('text')
//        	.text(function(d) { return d.value; })
//      });
//
//        var multi = fc.seriesSvgMulti()
//    	.series([area, line, gridlines, point])
//      .mapping(function(data, index, series) {
//        switch (series[index]) {
//        case point:
//          return data.trackball;
//        default:
//          return data.values;
//        }
//      });
//
//    var xScale = d3.scaleLinear();
//    
//    var chart = fc.chartSvgCartesian(
//        xScale,
//        d3.scaleLinear())
//      .yDomain(yExtent(data))
//    	.xDomain(xExtent(data))
//    	.xLabel(function(d) { return d.key; })
//    	.yTicks(3)
//    	.xTicks(2)
//    	.xTickFormat(d3.format('0'))
//      .yOrient('left')
//    	.plotArea(multi);
//  
//    d3.select('#small-multiples')
//      .selectAll('div')
//      .data(nested)
//      .enter()
//      .append('div')
//      .call(chart);
//    });
