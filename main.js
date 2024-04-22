import { csv, group, select, sum } from "d3";
import { Plot } from "./Plot";

const csvUrl = '';

const width = window.innerWidth;
const height = window.innerHeight;
const margin = {
    'top': 30,
    'right': 44,
    'bottom': 44,
    'left': 44,
}

const parseRow = (d) => {   
    d['T1'] = +d['T1'];
    d['T2'] = +d['T2'];
    d['T3'] = +d['T3'];
    d['T4'] = +d['T4'];
    d['Qtd'] = +d['Qtd'];
    return d;
}

const getDataByMonth = (data) => {
    const groupedData = Array.from(group(data, (d) => d['Mês (mes/ano)']).entries())
        .map(([key, value])=>{
            const sumT1 = sum(value, d => +d['T1']);
            const sumT2 = sum(value, d => +d['T2']);
            const sumT3 = sum(value, d => +d['T3']);
            const sumT4 = sum(value, d => +d['T4']);
            const qtdTotal = sum(value, d => +d['Qtd']);

            return {
                'Mês (mes/ano)': key,
                'T1 Total': sumT1,
                'T2 Total': sumT2,
                'T3 Total': sumT3,
                'T4 Total': sumT4,
                'Qtd. Total': qtdTotal
            }
        });
    
    return groupedData;
}

const svg = select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

const main = async () => {
    const data = await csv(csvUrl, parseRow);

    const groupedData = getDataByMonth(data);

    const plot = Plot()
        .width(width)
        .height(height)
        .data(groupedData)
        .xValue((d) => d['Mês (mes/ano)'])
        .yValue((d) => d['Qtd. Total'])
        .margin(margin);

    svg.call(plot);
}

main()