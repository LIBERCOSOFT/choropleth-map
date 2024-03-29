const w = 1300;
const h = 700;

const svg = d3
  .select ('#home')
  .append ('svg')
  .attr ('width', w)
  .attr ('height', h);

const path = d3.geoPath ();

//variable for the color range
let color = d3
  .scaleLinear ()
  .range (['lightgreen', 'darkgreen'])
  .domain ([2.6, 75.1]);

d3
  .queue ()
  .defer (
    d3.json,
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
  )
  .defer (
    d3.json,
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'
  )
  .await (ready);

//adding the data of the .json link to the function for implementation
function ready (error, us, education) {
  if (error) {
    throw error;
  }

  //an array that stores the info of the tooltip: hover text
  let educationData = [];
  education.map (function (val) {
    educationData.push ([
      val.fips,
      val.area_name,
      val.state,
      val.bachelorsOrHigher,
    ]);
  });

  svg
    .append ('g')
    .attr ('class', 'counties')
    .selectAll ('path')
    .data (topojson.feature (us, us.objects.counties).features)
    .enter ()
    .append ('path')
    .attr ('d', path)
    .attr ('transform', 'translate(180, 50)')
    .style ('fill', d => {
      let colorScale;
      educationData.map (function (val) {
        if (val[0] == d.id) {
          colorScale = val[3];
        }
      });
      return color (colorScale);
    })
    .append ('title')
    .text (d => {
      let tooltip;
      educationData.map (function (val) {
        if (val[0] == d.id) {
          tooltip = val[1] + ', ' + val[2] + ': ' + val[3] + '%';
        }
      });
      return tooltip;
    });

  svg
    .append ('path')
    .attr ('class', 'counties-borders')
    .attr (
      'd',
      path (
        topojson.mesh (us, us.objects.states, function (a, b) {
          return a !== b;
        })
      )
    )
    .attr ('transform', 'translate(180, 50)');

  let rectData = [3, 12, 21, 30, 39, 48, 57, 66];

  //X-Scale rect preferences
  const xScale = d3
    .scaleBand ()
    .domain ([
      '3% -',
      '12% -',
      '21% -',
      '30% -',
      '39% -',
      '48% -',
      '57% -',
      '66%',
    ])
    .range ([800, 1040])
    .padding (-1.8);
  const xAxis = d3.axisBottom (xScale);
  svg
    .append ('g')
    .attr ('transform', 'translate(0, 58)')
    .style ('font-size', '11.5px')
    .call (xAxis);

  svg
    .selectAll ('rect')
    .data (rectData)
    .enter ()
    .append ('rect')
    .attr ('x', (d, i) => i * 30)
    .attr ('y', 50)
    .attr ('width', 30)
    .attr ('height', 9)
    .attr ('transform', 'translate(800,0)')
    .style ('fill', d => color (d));
}
