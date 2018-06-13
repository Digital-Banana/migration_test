var svg2 = d3.select("#chart2"),
    margin = {
        top: 10,
        right: 20,
        bottom: 130,
        left: 40
    },
    width = +svg2.attr("width") - margin.left - margin.right,
    height = +svg2.attr("height") - margin.top - margin.bottom,
    g2 = svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleBand()
    .rangeRound([0, height])
    .paddingInner(0.05)
    .align(0.1);

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var z = d3.scaleOrdinal()
    .range(['#ece7f2', '#74a9cf', '#045a8d', '#fb6a4a', '#cb181d']);

d3.csv("data/migratieachtergrond_20jaar_totaal.csv", function (d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}, function (error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);

    data.sort(function (a, b) {
        return a.total - b.total;
    });

    y.domain(data.map(function (d) {
        return d.Perioden;
    }));
    x.domain([0, d3.max(data, function (d) {
        return d.total;
    })]).nice();
    z.domain(keys);

    g2.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
        .attr("fill", function (d) {
            return z(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("y", function (d) {
            return y(d.data.Perioden);
        })
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("width", function (d) {
            return x(d[1]) - x(d[0]);
        })
        .attr("height", y.bandwidth())
        .on("mouseover", function (d) {
            tip.transition()
                .duration(100)
                .style("opacity", .9)
            tip.html(
                "<h4>" + "Year " + "</h4>" + "<p>" +
                d.data["Perioden"] + "</p>" + 
                "<br>" + "<hr> " +
                "<h4>" + "Dutch background " + "</h4>" + "<p>" +
                d.data["Dutch background"] + "</p>" +
                "<br>" + "<hr> " +
                "<h4>" + "First generation Western migrants " + "</h4>" + "<p>" +
                d.data["First generation Western migrants"] + "</p>" +
                "<br>" + "<hr> " +
                "<h4>" + "Second generation Western migrants " + "</h4>" + "<p>" +
                d.data["Second generation Western migrants"] + "</p>" +
                "<br>" + "<hr> " +
                "<h4>" + "First generation non-Western migrants " + "</h4>" + "<p>" +
                d.data["First generation non-Western migrants"] + "</p>" +
                "<br>" + "<hr> " +
                "<h4>" + "Second generation non-Western migrants " + "</h4>" + "<p>" +
                d.data["Second generation non-Western migrants"] + "</p>"
            )
        })
        .on("mousemove", function (d) {
            tip
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY + 5) + "px");
        })
        .on("mouseout", function (d) {
            tip.transition()
                .duration(100)
                .style("opacity", 0);
        });

    var tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    g2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(y));

    g2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(null, "s"))
        .append("text")
        .attr("y", 45)
        .attr("x", x(x.ticks().pop()))
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        //        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Population")
        .attr("transform", "translate(" + (-width) + ",-10)");

    var legend = g2.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice())
        .enter().append("g")
        //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        .attr("transform", function (d, i) {
            return "translate(0," + (340 + i * 20) + ")";
        });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });
});







