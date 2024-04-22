import { axisBottom, axisLeft, extent, scaleBand, scaleLinear } from "d3";

/**
 * renderiza linhas e circulos para a parte de grafico de linhas
 * @param {import("d3").Selection} selection - seleção de onde adicionado o grafico
 * @param {number} id  - indentificar de uma das colunas de dados
 * @param {import("d3").ScaleLinear} yScale - scala do eixo y
 * @param {Object []} data - os dados de onde os pontos devem ser renderizados
 * @param {Number} offset - metada da largura das barras, serve para ajutar a posição
 * @param {number} r - raio dos pontos
 * @param {number} lineWidth - expessura das linhas
 * @param {string} color - codigo hex da cor
 */
const lineChart = (selection, id, yScale, data, offset, r, lineWidth, color) => {
    selection
        .selectAll(`.t${id}-circle`)
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => d.x + offset)
            .attr('cy', d => d[`t${id}`])
            .attr('r', r)
            .attr('fill', color)
        .append('title')
        .text(d => Math.round(yScale.invert(d[`t${id}`])));

     selection
        .selectAll(`.t${id}-line`)
        .data(data.slice(1))
        .enter()
        .append('line')
            .attr('x1', (d, i) => data[i].x + offset)
            .attr('y1', (d, i) => data[i][`t${id}`])
            .attr('x2', (d, i) => data[i + 1].x + offset)
            .attr('y2', (d, i) => data[i + 1][`t${id}`])
            .style('stroke', color)
            .style('stroke-width', lineWidth);
};

/**
 * renderizar as barras do grafico de barras
 * @param {import("d3").Selection} selection - onde as barras serão adicionas
 * @param {Object []} data - localização de onde as barras serão renderizadas
 */
const barChart = (selection, data) => {
    selection                          
        .selectAll('rect')
        .data(data)
        .join('rect')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
        .append('title')
        .text(d => d.title);
}

/**
 * rederizar o eixo x junto com sua label
 * @param {import("d3").Selection} selection - seleção de elemento
 * @param {number} height - altura
 * @param {number} width - largura
 * @param {Object} margin - os valores das margens
 * @param {import("d3").ScaleBand} xScale - escala do eixo x
 * @param {string} text - string da label do eixo x
 */
const bottomX_axis = (selection, height, width, margin, xScale, text) => {
    selection.append('g')
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(axisBottom(xScale));
    selection.append('text')
        .attr('x', (width - margin.left - margin.right)/2 + 30)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .text(text);
};

/**
 * renderiza o eixo y junto com sua label
 * @param {import("d3").Selection} selection - seleção de elemento
 * @param {number} height - altura
 * @param {import("d3").ScaleLinear} yScale - escala do eixo y 
 * @param {object} margin - valores de margem
 * @param {string} text - String da label do eixo y
 */
const leftY_axis = (selection, height, yScale, margin, text) => {
    selection.append('g')
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(axisLeft(yScale));
    selection.append('text')
        .attr('transform', `translate(${margin.left - 30}, ${(height - margin.top - margin.bottom)/2 + 50}) rotate(-90)`)
        .text(text);
}

/**
 * cria um grafico de barras e linhas 
 * @returns {function} - função renderizar o plot de barras combinado com linhas
 */
export const Plot = () => {
    let width;
    let height;
    let data;
    let timeData;
    let xValue;
    let yValue;
    let margin;

    const my = (selection) => {
        const x = scaleBand()
            .domain(data.map(xValue))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = scaleLinear()
            .domain(extent(data, yValue))
            .range([height - margin.bottom, margin.top]);

        const marks = data.map(d => (
            {
                x: x(xValue(d)),
                y: y(yValue(d)),
                t1: y(d['T1 Total']),
                t2: y(d['T2 Total']),
                t3: y(d['T3 Total']),
                t4: y(d['T4 Total']),
                width: x.bandwidth(),
                height: height - margin.bottom - y(yValue(d)),
                title: yValue(d)
            }
        ));

        barChart(selection, marks);

        lineChart(selection, 1, y, marks, x.bandwidth()/2, 5, 2, '#E3BA22');
        lineChart(selection, 2, y, marks, x.bandwidth()/2, 5, 2, '#E6842A');
        lineChart(selection, 3, y, marks, x.bandwidth()/2, 5, 2, '#8E6C8A');
        lineChart(selection, 4, y, marks, x.bandwidth()/2, 5, 2, '#9A3E25');

        bottomX_axis(selection, height, width, margin, x, 'label eixo x');

        leftY_axis(selection, height, y, margin, 'label eixo y');
    };

    //setters
    my.width = function(_){
        return arguments.length ? ((width = +_), my) : width;
    }
    my.height = function(_){
        return arguments.length ? ((height = +_), my) : height;
    }
    my.data = function(_){
        return arguments.length ? ((data = _), my) : data;
    }
    my.timeData = function(_){
        return arguments.length ? ((timeData = _), my) : timeData;
    }
    my.xValue = function(_){
        return arguments.length ? ((xValue = _), my) : xValue;
    }
    my.yValue = function(_){
        return arguments.length ? ((yValue = _), my) : yValue;
    }
    my.margin = function(_){
        return arguments.length ? ((margin = _), my) : margin;
    }

    return my;
}