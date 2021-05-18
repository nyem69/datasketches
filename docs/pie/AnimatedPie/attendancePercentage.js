var duration = 1500,
    transition = 200,
    percent = 45,
    width = window.innerWidth - 20,
    height = window.innerHeight - 20;

var radius = Math.min(width, height) / 3,
    pie = d3.pie().sort(null),
    format = d3.format(".0%");

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var arc = d3.arc()
        .innerRadius(radius * .8)
        .outerRadius(radius);

var text = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em");

function calcPercent(curValue,maxValue) {
    return [(curValue/maxValue)*100, (maxValue-curValue)/maxValue*100];
};

d3.csv('attendancePerc.csv').then(function(data){

    data.forEach(function(d){
        d.attended = +d.attended;
        d.total = +d.total;
        console.log(d.attended, d.total);

        dataset = {
            percent : d.attended/d.total *100,
            lower: calcPercent(0,d.total),
            upper: calcPercent(d.attended,d.total)
        }

    });

    //lower = function(d){ return calcPercent(0, d.total); }
    //upper = function(d){ return calcPercent(d.attended, d.total); }

    console.log('pie(dataset.lower)',pie(dataset.lower))

    path = svg.selectAll("path")
        .data(pie(dataset.lower))
        .enter().append("path")
        .attr('class',function (d, i) {
            console.log('d = ' +d.data + " i =" + i + ' color = color'+i);
            return "color" + i
        })
        .attr("d", arc)
        .each(function (d) {
            console.log('d = ' + Object.keys(d));
            console.log('data = ' + d.data, " index = " + d.index +" value= " + d.value );
            this._current = d;
        });

    progress = 0;

    timeout = setTimeout(function () {
        clearTimeout(timeout);
        path = path.data(pie(dataset.upper));

        i={};

        path.transition().duration(duration).attrTween("d", function (a,k) {

							console.log(k, 'this._current', this._current, a)

	            i[k] = d3.interpolate(this._current, a);
	            this._current = i[k](0);

	            i2 = d3.interpolate(progress, dataset.percent )

	            return function (t) {
	                text.text(format(i2(t) /100));
	              	return arc( i[k](t) );
	            };
        });
    }, 200);

})

/*
var duration = 1500,
    transition = 200,
    percent = 45,
    width = window.innerWidth - 20,
    height = window.innerHeight - 20;

var dataset = {
            lower: calcPercent(0,100),
            upper: calcPercent(percent,100)
        },
        radius = Math.min(width, height) / 3,
        pie = d3.pie().sort(null),
        format = d3.format(".0%");

var arc = d3.arc()
        .innerRadius(radius * .8)
        .outerRadius(radius);

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var path = svg.selectAll("path")
                .data(pie(dataset.lower))
                .enter().append("path")
                .attr("class", function (d, i) {
                    return "color" + i
                })
                .attr("d", arc)
                .each(function (d) {
                    console.log("d = " + d);
                    console.log('data = ' + d.data, " index = " + d.index +" value= " + d.value );
                    this._current = d;
                });

var text = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em");

var progress = 0;

var timeout = setTimeout(function () {
    clearTimeout(timeout);
    path = path.data(pie(dataset.upper));
    path.transition().duration(duration).attrTween("d", function (a) {
        console.log('a = '+ a.data);
        var i = d3.interpolate(this._current, a);
        console.log('current= '+this._current.data);
        var i2 = d3.interpolate(progress, percent)
        this._current = i(0);
        return function (t) {
            console.log('t = ' + t);
            text.text(format(i2(t) /100));
            return arc(i(t));
        };
    });
}, 200);

function calcPercent(percent,maxPerc) {
    return [percent/maxPerc *100, ((maxPerc - percent) /maxPerc)*100];
};*/