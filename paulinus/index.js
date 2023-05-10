const data = [
  {
    "JobRole": "Healthcare Rep.",
    "Remain": 77,
    "Leave": 7,
    "Percent_Remain": "91.66666666666666",
    "Percent_Leave": "8.333333333333332"
  },
  {
    "JobRole": "Human Resources",
    "Remain": 22,
    "Leave": 5,
    "Percent_Remain": "81.48148148148148",
    "Percent_Leave": "18.51851851851852"
  },
  {
    "JobRole": "Lab Technician",
    "Remain": 128,
    "Leave": 46,
    "Percent_Remain": "73.5632183908046",
    "Percent_Leave": "26.436781609195403"
  },
  {
    "JobRole": "Manager",
    "Remain": 74,
    "Leave": 5,
    "Percent_Remain": "93.67088607594937",
    "Percent_Leave": "6.329113924050633"
  },
  {
    "JobRole": "Manufacturing Dir.",
    "Remain": 98,
    "Leave": 6,
    "Percent_Remain": "94.23076923076923",
    "Percent_Leave": "5.769230769230769"
  },
  {
    "JobRole": "Research Director",
    "Remain": 52,
    "Leave": 2,
    "Percent_Remain": "96.29629629629629",
    "Percent_Leave": "3.7037037037037033"
  },
  {
    "JobRole": "Research Scientist",
    "Remain": 168,
    "Leave": 37,
    "Percent_Remain": "81.95121951219512",
    "Percent_Leave": "18.048780487804876"
  },
  {
    "JobRole": "Sales Executive",
    "Remain": 181,
    "Leave": 37,
    "Percent_Remain": "83.02752293577981",
    "Percent_Leave": "16.972477064220186"
  },
  {
    "JobRole": "Sales Rep.",
    "Remain": 33,
    "Leave": 22,
    "Percent_Remain": "60.0",
    "Percent_Leave": "40.0"
  },
  {
    "JobRole": "IT Specialist",
    "Remain": 85,
    "Leave": 15,
    "Percent_Remain": "85.0",
    "Percent_Leave": "15.0"
  },
  {
    "JobRole": "Marketing Coordinator",
    "Remain": 110,
    "Leave": 20,
    "Percent_Remain": "84.61538461538461",
    "Percent_Leave": "15.384615384615385"
  },
  {
    "JobRole": "Product Manager",
    "Remain": 130,
    "Leave": 35,
    "Percent_Remain": "78.78787878787878",
    "Percent_Leave": "21.21212121212121"
  },
  {
    "JobRole": "Software Engineer",
    "Remain": 170,
    "Leave": 40,
    "Percent_Remain": "84.0",
    "Percent_Leave": "16.0"
  },
  {
    "JobRole": "Graphic Designer",
    "Remain": 75,
    "Leave": 25,
    "Percent_Remain": "75.0",
    "Percent_Leave": "25.0"
  },
  {
    "JobRole": "Data Analyst",
    "Remain": 95,
    "Leave": 15,
    "Percent_Remain": "86.36363636363636",
    "Percent_Leave": "13.636363636363637"
  },
  {
    "JobRole": "Project Manager",
    "Remain": 180,
    "Leave": 50,
    "Percent_Remain": "78.26086956521739",
    "Percent_Leave": "21.73913043478261"
  },
  {
    "JobRole": "Customer Support",
    "Remain": 160,
    "Leave": 35,
    "Percent_Remain": "82.05128205128204",
    "Percent_Leave": "17.94871794871795"
  },
  {
    "JobRole": "Network Admin.",
    "Remain": 45,
    "Leave": 5,
    "Percent_Remain": "90.0",
    "Percent_Leave": "10.0"
  },
  {
    "JobRole": "Financial Analyst",
    "Remain": 120,
    "Leave": 30,
    "Percent_Remain": "80.0",
    "Percent_Leave": "20.0"
  }
];

const width = 900;
const height = 700;
const color = d3.scaleOrdinal(d3.schemeCategory10);
const hoverColor = "#ccc";

const treemapLayout = (data) => {
  const root = d3
    .hierarchy({ children: data })
    .sum((d) => d.Remain + d.Leave)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  return d3.treemap().size([width, height]).padding(4)(root);
};

const chart = () => {
  const svg = d3
    .select("#treemap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font", "10px sans-serif");

  const root = treemapLayout(data);
  const leaves = root.leaves();

  const cell = svg
    .selectAll("g")
    .data(leaves)
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  const rects = cell
    .append("rect")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => color(d.data.JobRole))
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  cell
    .append("text")
    .attr("x", 5)
    .attr("y", 15)
    .text((d) => d.data.JobRole);

  cell
    .append("text")
    .attr("x", 5)
    .attr("y", 35)
    .text(
      (d) =>
        `Remain: ${(
          (d.data.Remain / (d.data.Remain + d.data.Leave)) *
          100
        ).toFixed(2)}%`
    );

  cell
    .append("text")
    .attr("x", 5)
    .attr("y", 55)
    .text(
      (d) =>
        `Leave: ${(
          (d.data.Leave / (d.data.Remain + d.data.Leave)) *
          100
        ).toFixed(2)}%`
    );
   function handleMouseOver(d, i) {
      d3.select(this).style("fill", hoverColor);

      const hoverDetails = d3.select("#hover-details");
      hoverDetails.html(`
        <p><strong>Job Role:</strong> ${d.JobRole}</p>
        <p><strong>Remain:</strong> ${(d.Remain / (d.Remain + d.Leave) * 100).toFixed(2)}%</p>
        <p><strong>Leave:</strong> ${(d.Leave / (d.Remain + d.Leave) * 100).toFixed(2)}%</p>
      `);
      hoverDetails.style("display", "block");
    }

    function handleMouseOut(d, i) {
      d3.select(this).style("fill", d.JobRole);
      d3.select("#hover-details").style("display", "none");
    }


  const legend = svg
    .select("#legend")
    .append("svg")
    .append("g")
    .attr(
      "transform",
      "translate(" + (width - 150) + "," + (height - 20 * data.length) + ")"
    )
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

  legend
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => color(d.JobRole));

  legend
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text((d) => d.JobRole);
};

chart();

// Function to generate a random color
  function getRandomColor() {
    const letters = ["#006778", "#fa9191", "#346751", "#C84B31", "#333C83"];
    const color = "";
    for( i = 0; i < letters.length; i ++) {
      color = letters.indexOf(i);
    }
    return color;
  }
