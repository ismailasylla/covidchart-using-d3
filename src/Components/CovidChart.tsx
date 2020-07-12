import React, { useRef, useState, useEffect } from 'react';
import { GoMarkGithub } from 'react-icons/go';
import { select, Selection } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import 'd3-transition';
import { easeElastic } from 'd3-ease';
import randomstring from 'randomstring';

// Will refactore the component which will allow us to pass the data via props for much cleaner code.
let Countries = [
  {
    name: 'UAE',
    cases: 32,
  },
  {
    name: 'USA',
    cases: 67,
  },
  {
    name: 'China',
    cases: 81,
  },
  {
    name: 'UK',
    cases: 38,
  },
  {
    name: 'Africa',
    cases: 5,
  },
  {
    name: 'Frace',
    cases: 100,
  },
];
const CovidChart: React.FC = () => {
  const dimensions = { width: 800, height: 500 };
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState(Countries);
  const [name, setName] = useState('');
  const [cases, setCases] = useState('');

  let x = scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, dimensions.width])
    .padding(0.05);

  let y = scaleLinear()
    .domain([0, max(data, (d) => d.cases)!])
    .range([dimensions.height, 0]);

  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);

  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      selection
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.name)!)
        .attr('y', dimensions.height)
        .attr('width', x.bandwidth)
        .attr('fill', '#03fcfc')
        .attr('height', 0)
        /**
         * Transitions work similar to CSS Transitions
         * From an inital point, to the conlcuded point
         * in which you set the duration, and the ease
         * and a delay if you'd like
         */
        .transition()
        .duration(700)
        .delay((_, i) => i * 100)
        .ease(easeElastic)
        .attr('height', (d) => dimensions.height - y(d.cases))
        .attr('y', (d) => y(d.cases));
    }
  }, [selection]);

  useEffect(() => {
    if (selection) {
      x = scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, dimensions.width])
        .padding(0.05);
      y = scaleLinear()
        .domain([0, max(data, (d) => d.cases)!])
        .range([dimensions.height, 0]);

      const rects = selection.selectAll('rect').data(data);

      rects
        .exit()
        .transition()
        .ease(easeElastic)
        .duration(400)
        .attr('height', 0)
        .attr('y', dimensions.height)
        .remove();

      /**
       * a delay is added here to aid the transition
       * of removing and adding elements
       * otherwise, it will shift all elements
       * before the add/remove transitions are finished
       */
      rects
        .transition()
        .delay(300)
        .attr('x', (d) => x(d.name)!)
        .attr('y', (d) => y(d.cases))
        .attr('width', x.bandwidth)
        .attr('height', (d) => dimensions.height - y(d.cases))
        .attr('fill', 'red');

      rects
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.name)!)
        .attr('width', x.bandwidth)
        .attr('height', 0)
        .attr('y', dimensions.height)
        .transition()
        .delay(400)
        .duration(500)
        .ease(easeElastic)
        .attr('height', (d) => dimensions.height - y(d.cases))
        .attr('y', (d) => y(d.cases))
        .attr('fill', 'orange');
    }
  }, [data]);

  /**
   * functions to help add and remove elements to show transitions
   */
  const addData = () => {
    const dataToAdd = {
      name: randomstring.generate(),
      cases: Math.round(Math.random() * 80 + 20),
    };
    setData([...data, dataToAdd]);
  };

  const removeData = () => {
    if (data.length === 0) {
      return;
    }
    setData([...data.slice(0, data.length - 1)]);
  };

  return (
    <>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
      <div className="btn-group mt-4">
        <button
          type="button"
          className="btn btn-outline-info m-2"
          onClick={addData}
        >
          Add Data
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={removeData}
        >
          Remove Data
        </button>
      </div>
      <div className="container mt-5">
        <h3>
          Link to the repo -
          <a
            href="https://github.com/Syldox/covidchart-using-d3"
            style={{ textDecoration: 'none' }}
          >
            {' '}
            <GoMarkGithub size={50} />{' '}
          </a>
        </h3>
      </div>
    </>
  );
};

export default CovidChart;
