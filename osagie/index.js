// Create D3.JS toolTip
const Tooltip = d3
  .select(".lollipopchart")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background", "rgba(246, 226, 210, .5)")
  .style("border", "solid")
  .style("border-color", "rgba(246, 226, 210, 1)")
  .style("border-width", "1px")
  .style("border-radius", "8px")
  .style("box-shadow", getRandomColor())
  .style("-webkit-backdrop-filter", "blur(5px)")
  .style("padding", "5px")
  .style("margin", "auto")
  .style("width", "300px")
  .style("font-size", "15px");

  // Function to generate a random color
  // function getRandomColor() {
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }
  // Function to generate a random color
  function getRandomColor() {
    const letters = ["#006778", "#fa9191", "#346751", "#C84B31", "#333C83"];
    const color = "";
    for( i = 0; i < 6; i++) {
      return letters[Math.floor(Math.random() * 5)];
    }
    return color;
  }

// A function that create / update the plot for a given variable:
function filter(filterData) {
  // get parent div width size
  let width = document.getElementsByClassName("box")[0].clientWidth;
  

  // set the width, height and margin for the lollipop chart
  let margin = { top: 30, right: 30, bottom: 85, left: 55 };
  (width = width - margin.left - margin.right),
    (height = 600 - margin.top - margin.bottom);

  let color = d3
    .scaleOrdinal()
    .range([
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
    ]);

  // append the svg object to the body of the page
  let svg = d3
    .select(".lollipopchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let lollipop = svg.append("g").attr("class", "lollipop");
  lollipop.append("g").attr("transform", `translate(0, ${height})`);

  let bars = lollipop.append("g").attr("class", "bars");
  let circles = lollipop.append("g").attr("class", "circles");

  // Initialize the X axis
  let x = d3.scaleBand().range([0, width]).padding(0.9);

  // Initialize the Y axis
  let y = d3.scaleLinear().range([height, 0]);

  // Parse the Data
  d3.json("Cleaned_Data.json").then(function (data) {
    data.forEach(function (d) {
      d.total = +d[filterData];
    });

    // X axis
    x.domain(
      data.map(function (d) {
        return d.JobRole;
      })
    );

    // Add Y axis
    y.domain([0, checkIfActive()]);

    function checkIfActive() {
      const remainBtn = document.getElementById("remain");
      if(remainBtn.disabled) {
        return 60;
      } else {
        return 185;
      }
    }

    // variable bar: map data into bar / vertical line
    bars
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", function (d, i) {
        return color(i);
      })
      .attr("x", function (d) {
        return x(d.JobRole);
      })
      .attr("width", x.bandwidth())
      .attr("y", height)
      .transition()
      .duration(1500)
      .attr("y", function (d) {
        return y(d[filterData]);
      })
      .attr("height", function (d) {
        return height - y(d.total);
      });

    // variable circles: map data into the circle / head
    circles
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.JobRole) + x.bandwidth() / 2;
      })
      .attr("cy", height)
      .attr("r", x.bandwidth() / 2)
      .attr("fill", "white")
      .attr("stroke-width", 5)
      .attr("stroke", function (d, i) {
        return color(i);
      })
      .on("mouseover", function () {
        return Tooltip.style("opacity", 1);
      })
      .on("mousemove", function (d) {
        let Area = d3.select(this).datum().JobRole;
        let Percent_remain = d3.select(this).datum().Percent_Remain;
        let Percent_leave = d3.select(this).datum().Percent_Leave;
        let Remain = d3.select(this).datum().Remain;
        let Leave = d3.select(this).datum().Leave;

        return Tooltip.html(
          "<h2>" +
            Area+
            "</h2><hr>" +
            "<p>" +
            Remain +
            " Remain" +
            "</p>" +
            "<p>" +
            Leave +
            " Leave</p><hr>" +
            "<p><strong> "
        )
          .style("left", d.clientX + 15 + "px")
          .style("top", d.clientY - 30 + "px");
      })
      .on("mouseleave", function () {
        return Tooltip.style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr("cy", function (d) {
        return y(d[filterData]);
      })
      .on("end", function () {
        d3.select(this).transition().duration(500).attr("r", 6);
      });

    lollipop
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    lollipop.append("g").transition().duration(1000).call(d3.axisLeft(y));
  });
}

// Initialize plot
filter("Remain");

const remainBtn = document.getElementById("remain");
const leaveBtn = document.getElementById("leave");

remainBtn.addEventListener("click", (e) => {
  console.log(remainBtn);
  remainBtn.disabled = true;
  leaveBtn.disabled = false;
  d3.select(".lollipopchart").selectAll("svg").remove();
  filter(leaveBtn.innerText);
});
leaveBtn.addEventListener("click", (e) => {
  leaveBtn.disabled = true;
  remainBtn.disabled = false;
  d3.select(".lollipopchart").selectAll("svg").remove();
  filter(remainBtn.innerText);
});
