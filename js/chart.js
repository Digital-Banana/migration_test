// General Styling

var width = 860,
    height = 850,
    active = d3.select(null);

var projection = d3.geoMercator()
    .scale(9500)
    //.scale(7000)
    .translate([width / 2, height / 2])
    .center([5.3, 52.15]);

var zoom = d3.zoom()
    .scaleExtent([1, 15])
    .on("zoom", zoomed);

var path = d3.geoPath()
    .projection(projection)

var svg1 = d3.select("#chart1")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg1.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

svg1.call(zoom);
var g;

// Color Scales

//var colorValuesMunicipality_1 = [0, 2, 5, 8, 12, 18, 25, 35, 40];
//var colorPaletteMunicipality_1 = ['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#54278f','#3f007d'];
//var colorScaleMunicipality_1 = d3.scaleLinear()
//    .domain(colorValuesMunicipality_1)
//    .range(colorPaletteMunicipality_1);

var colorValuesMunicipality = [0, 2, 5, 8, 12, 18, 25, 35, 40];
var colorPaletteMunicipality = ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'];
var colorScaleMunicipality = d3.scaleLinear()
    .domain(colorValuesMunicipality)
    .range(colorPaletteMunicipality);

var colorValuesDistrict = [0, 5, 10, 15, 20, 30, 40, 55, 75];
var colorPaletteDistrict = ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'];
var colorScaleDistrict = d3.scaleLinear()
    .domain(colorValuesDistrict)
    .range(colorPaletteDistrict);

var colorValuesNeighborhood = [0, 5, 10, 15, 20, 30, 40, 55, 75];
var colorPaletteNeighborhood = ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'];
var colorScaleNeighborhood = d3.scaleLinear()
    .domain(colorValuesNeighborhood)
    .range(colorPaletteNeighborhood);

// Map Init and Reset

var mapini = false;

set_reset = function () {
    if (!mapini) {
        g = svg1.append("g")
            .attr("id", "holder");
        mapini = true;
    } else if (mapini) {
        g.remove();
        g = svg1.append("g")
            .attr("id", "holder");
    }
};

// Queue datasets

d3.queue()
    .defer(d3.json, "map/municipality.json")
    .defer(d3.json, "map/district.json")
    .defer(d3.json, "map/neighborhood.json")
    .await(drawMap);

// Draw Map per Municpality, District and Neighborhood

function drawMap(err, municipality, district, neighborhood) {
    if (err) throw error;

    /*** Non-western Migrants ***/

    d3.select("#municipality").on("click", function (d) {
        set_reset();

        g.selectAll("path")
            .data(municipality.features)
            .enter().append("path")
            .attr("class", "municipality")
            .attr("d", path)
            .on("click", clicked)
            .style("fill", function (d) {
                return colorScaleMunicipality(d.properties.P_N_W_AL);
            })

            .on("mouseover", function (d) {
                tip.transition()
                    .duration(100)
                    .style("opacity", .9)
                tip.html(
                    "<h4>" + "Municipality " + "</h4>" + "<p>" +
                    d.properties.GM_NAAM + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Total population " + "</h4>" + "<p>" +
                    d.properties.AANT_INW + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Percentage non-Western migrants " + "</h4>" + "<p>" +
                    d.properties.P_N_W_AL + "%" + "</p>"
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
    })

    d3.select("#district").on("click", function (d) {
        set_reset();

        g.selectAll("path")
            .data(district.features)
            .enter().append("path")
            .attr("class", "district")
            .attr("d", path)
            .on("click", clicked)
            .style("fill", function (d) {
                return colorScaleDistrict(d.properties.P_N_W_AL);
            })

            .on("mouseover", function (d) {
                tip.transition()
                    .duration(100)
                    .style("opacity", .9)
                tip.html(
                    "<h4>" + "District " + "</h4>" + "<p>" +
                    d.properties.WK_NAAM + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Total population " + "</h4>" + "<p>" +
                    d.properties.AANT_INW + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Percentage non-Western migrants " + "</h4>" + "<p>" +
                    d.properties.P_N_W_AL + "%" + "</p>"
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
    })

    d3.select("#neighborhood").on("click", function (d) {
        set_reset();

        g.selectAll("path")
            .data(neighborhood.features)
            .enter().append("path")
            .attr("class", "neighborhood")
            .attr("d", path)
            .on("click", clicked)
            .style("fill", function (d) {
                return colorScaleNeighborhood(d.properties.P_N_W_AL);
            })

            .on("mouseover", function (d) {
                tip.transition()
                    .duration(100)
                    .style("opacity", .9)
                tip.html(
                    "<h4>" + "Neighborhood " + "</h4>" + "<p>" +
                    d.properties.BU_NAAM + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Total population " + "</h4>" + "<p>" +
                    d.properties.AANT_INW + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Percentage non-Western migrants " + "</h4>" + "<p>" +
                    d.properties.P_N_W_AL + "%" + "</p>"
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
    })

    /*** Western Migrants ***/

    d3.select("#municipality_western").on("click", function (d) {
        set_reset();

        g.selectAll("path")
            .data(municipality.features)
            .enter().append("path")
            .attr("class", "municipality")
            .attr("d", path)
            .on("click", clicked)
            .style("fill", function (d) {
                return colorScaleMunicipality(d.properties.P_WEST_AL);
            })

            .on("mouseover", function (d) {
                tip.transition()
                    .duration(100)
                    .style("opacity", .9)
                tip.html(
                    "<h4>" + "Municipality " + "</h4>" + "<p>" +
                    d.properties.GM_NAAM + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Total population " + "</h4>" + "<p>" +
                    d.properties.AANT_INW + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Percentage Western migrants " + "</h4>" + "<p>" +
                    d.properties.P_WEST_AL + "%" + "</p>"
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
    })

    d3.select("#district_western").on("click", function (d) {
        set_reset();

        g.selectAll("path")
            .data(district.features)
            .enter().append("path")
            .attr("class", "district")
            .attr("d", path)
            .on("click", clicked)
            .style("fill", function (d) {
                return colorScaleDistrict(d.properties.P_WEST_AL);
            })

            .on("mouseover", function (d) {
                tip.transition()
                    .duration(100)
                    .style("opacity", .9)
                tip.html(
                    "<h4>" + "District " + "</h4>" + "<p>" +
                    d.properties.WK_NAAM + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Total population " + "</h4>" + "<p>" +
                    d.properties.AANT_INW + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Percentage Western migrants " + "</h4>" + "<p>" +
                    d.properties.P_WEST_AL + "%" + "</p>"
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
    })

    d3.select("#neighborhood_western").on("click", function (d) {
        set_reset();

        g.selectAll("path")
            .data(neighborhood.features)
            .enter().append("path")
            .attr("class", "neighborhood")
            .attr("d", path)
            .on("click", clicked)
            .style("fill", function (d) {
                return colorScaleNeighborhood(d.properties.P_WEST_AL);
            })

            .on("mouseover", function (d) {
                tip.transition()
                    .duration(100)
                    .style("opacity", .9)
                tip.html(
                    "<h4>" + "Neighborhood " + "</h4>" + "<p>" +
                    d.properties.BU_NAAM + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Total population " + "</h4>" + "<p>" +
                    d.properties.AANT_INW + "</p>" +
                    "<br>" + "<hr> " +
                    "<h4>" + "Percentage Western migrants " + "</h4>" + "<p>" +
                    d.properties.P_WEST_AL + "%" + "</p>"
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
    })

    var tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


};

// Click and Zoom Functions

function clicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(15, 0.9 / Math.max(dx / width, dy / height))),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg1.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    svg1.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
}

function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    g.attr("transform", d3.event.transform);
}

function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
