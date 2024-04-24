import { select, json, geoPath, geoMercator } from "d3";

const width = window.innerWidth;
const height = window.innerHeight;

const svg = select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

/**
 * recebe coordenadas de um poligono e devolve o seu centro
 * @param {Array} coords 
 * @returns {Array}
 */
const getCentroid = (coords) => {
    let x = 0;
    let y = 0;
    const n = coords.length;
    for(let i = 0; i<coords.length; i++){
        x += coords[i][0];
        y += coords[i][1];
    }
    return [x/n, y/n]
}

const Main = () => {
    json("./russas_map/russas.json").then(data => {
        const projection = geoMercator()
            .fitSize([width, height], data)
            .center([-37.97670,-4.93924])
            .scale(400000)
        const path = geoPath()
            .projection(projection);       

        
        let render_data = data.features.map(
            d => (
                {
                    p: path(d.geometry),
                    label: d.properties.name,
                    color: !d.geometry ? 'none' : 'blue',
                    centroid: projection(getCentroid(d.geometry.coordinates[0]))
                }
            )
        )
        render_data = render_data.filter(d => d.label !== undefined);
        
        for(let i=0; i<render_data.length; i++){
            console.log(render_data[i].centroid);
        }

        svg.selectAll('path')
            .data(render_data)
            .join('path')
                .attr('d', d => d.p)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
        svg.selectAll('circle')
            .data(render_data)
            .join('circle')
                .attr('cx', d => d.centroid[0])
                .attr('cy', d => d.centroid[1])
                .attr('r', 7)
                .attr('fill', 'red')
            .append('title')
            .text(d => d.label)

    });
};

Main();

