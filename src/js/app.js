/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import $ from 'jquery';
import Plotly from 'plotly.js-dist';

import config from './config';
import loadSection from './util/load-section';

import '../scss/main.scss';

const {
  maxN,
  renderChart,
  renderResult,
  renderCachedResult,
  renderEachStep,
  computeEachStep,
  initialN,
} = config;

const values = {
  n: [],
  i: [],
};

const cachedN = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
  81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
  101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
  121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140,
  141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160,
  161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
  181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200,
  201, 202, 203, 204, 205, 206, 207, 208, 209,
];

const cachedI = [
  2, 3, 9, 11, 24, 35, 28, 31, 80, 60, 121, 119, 116, 195, 75, 79, 204, 323, 228, 199,
  146, 264, 529, 504, 200, 675, 540, 251, 840, 899, 186, 191, 1088, 748, 1225, 324, 740, 1140, 1521, 1079,
  1680, 336, 1204, 484, 540, 460, 1692, 1151, 734, 2499, 2601, 624, 2808, 971, 1980, 783, 2508, 696, 1416, 3299,
  1220, 3099, 441, 447, 4224, 1188, 2412, 2311, 4760, 3220, 4260, 1007, 3066, 5475, 1125, 1824, 1540, 2027, 4108, 2640,
  6560, 1640, 6889, 6551, 764, 7395, 5220, 2551, 7920, 8099, 5460, 1655, 3720, 1692, 9025, 4607, 1164, 9603, 9801, 3299,
  8484, 1019, 6798, 4679, 11024, 7420, 2996, 1620, 1962, 2640, 4107, 6720, 12768, 4331, 3450, 3364, 10764, 9204, 14161, 1439,
  9800, 10248, 4428, 5083, 3124, 13860, 1016, 1023, 4644, 10920, 17161, 3431, 2926, 17955, 18225, 1632, 2740, 6347, 4170, 4899,
  6626, 5112, 8580, 9791, 6960, 21315, 17052, 6659, 19668, 6300, 15100, 4559, 7802, 15708, 24025, 12167, 1884, 24963, 22260, 8479,
  11592, 4859, 5868, 11316, 2474, 5976, 22044, 3528, 4732, 1700, 25137, 7568, 29928, 30275, 6300, 7743, 24780, 4272, 32041, 30779,
  9954, 6552, 33489, 11040, 28860, 34595, 18700, 7895, 35720, 2660, 36481, 11520, 4052, 37635, 17160, 12739, 30732, 4355, 3582,
  19999, 12060, 21816, 36540, 20807, 13940, 35844, 33948, 14351, 43680,
];

const createStepper = (n) => {
  const data = [];
  let cardsToFlip = 1;
  let steps = 0;

  data.push('1'.repeat(n));

  const nextGeneration = () => {
    const lastRowData = data[data.length - 1];
    let newRowData = '';

    const affectedCards = lastRowData.slice(0, cardsToFlip);

    affectedCards.split('').reverse().forEach((char) => {
      newRowData += char === '1'
        ? '0'
        : char === '0'
          ? '1'
          : '0';
    });

    newRowData += lastRowData.slice(affectedCards.length, lastRowData.length);

    if (cardsToFlip === n) {
      cardsToFlip = 1;
    } else {
      cardsToFlip += 1;
    }

    data.push(newRowData);

    if (newRowData.indexOf('0') < 0) {
      steps = data.length - 1;

      return false;
    }

    return true;
  };

  const render = () => {
    const $steps = $(`<div class="steps" data-steps="${n}" />`);

    data.forEach((dataItem) => {
      const $row = $('<div class="row" />');

      dataItem.split('').forEach((value) => {
        $row.append(`<div class="card card--${value === '1' ? 'front' : 'back'}" />`);
      });

      $steps.append($row);
    });

    $('.data').append($steps);
  };

  const getData = () => data;
  const getSteps = () => steps;

  return {
    getData,
    getSteps,
    nextGeneration,
    render,
  };
};

$(() => {
  loadSection($('<section class="data" />'), {}, () => {
    $('.data').append('<div id="chart" />');

    const startTime = Date.now();
    let rendered = false;
    let running = false;
    let n = initialN;

    if (!computeEachStep) {
      n = maxN;
    }

    const mainInterval = setInterval(() => {
      if (!running && !renderCachedResult) {
        running = true;

        const stepper = createStepper(n);

        const stepInterval = setInterval(() => {
          if (n <= maxN && !stepper.nextGeneration()) {
            values.n.push(n);
            values.i.push(stepper.getSteps());

            if (renderResult && (renderEachStep || n === maxN)) {
              stepper.render();
            }

            n += 1;
            running = false;
            rendered = true;

            console.log(`Done: ${n - 1}`);
            console.log(`Step count: ${stepper.getSteps()}`);
            console.log(`Time since start: ${(Date.now() - startTime) / 1000}s`);

            clearInterval(stepInterval);
          }
        }, 0);
      }

      if (renderCachedResult || (!computeEachStep && rendered) || (computeEachStep && n === maxN)) {
        clearInterval(mainInterval);

        setTimeout(() => {
          if (renderChart) {
            Plotly.newPlot('chart', [{
              x: renderCachedResult ? cachedN : values.n,
              y: renderCachedResult ? cachedI : values.i,
            }]);
          }

          console.log(values);
          console.log(`Total time elapsed: ${(Date.now() - startTime - 1000) / 1000}s`);
        }, 1000);
      }
    }, 0);
  });
});
