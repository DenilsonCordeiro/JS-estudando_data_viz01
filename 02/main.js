import { select, json, geoPath, geoMercator } from "d3";

const width = window.innerWidth;
const height = window.innerHeight;

const svg = select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const Main = () => {
    json("./russas_map/russas.json").then(data => {

        //TODO: ver oque eu posso fazer sobre esses numeros hardcoded
        const projection = geoMercator()
            .fitSize([width, height], data)
            .scale(524860)
            .translate([width/2 + 347900, height/2 - 45360]);
        const path = geoPath()
            .projection(projection);        

        
        //TODO: implementar função que devolva o centro de cada path
        const render_data = data.features.map(
            d => (
                {
                    p: path(d.geometry),
                    label: d.properties.name,
                    color: !d.geometry ? 'none' : 'blue',
                    center: d.geometry
                }
            )
        )

        console.log(render_data[1].center)

        //TODO: append circulos com as informações de cada região adiministrativa
        svg.selectAll('path')
            .data(render_data)
            .join('path')
                .attr('d', d => d.p)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('fill', 'none')

    });
};

Main();

