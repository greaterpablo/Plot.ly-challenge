//Defining functions and variables

//Chosen ID value function
function findID(){
    return d3.select("#selDataset").property("value");
}

//Create Demographics Data Table Function
function updateData(data){
    //find data for selected ID
    data.metadata.forEach(i => {
        if(parseInt(i.id) === parseInt(findID())){
            var chooseDemo = i;
            //Assign data to Demographics table
            var DemoData = d3.select("#sample-metadata");
            DemoData.html("") //empy table
            Object.entries(chooseDemo).forEach(([key, value]) => {
                DemoData.append('p')
                .text(`${key.toUpperCase()}: ${value}`)
            });
        }
    });
}


//Event function 
function tomoveHandler(){
    d3.json('samples.json').then(function(importData){
        var data = importData;
        updateData(data);
        updateChart(data);
        updateBubble(data);
    })
}


//Create Top 10 found bacteria Chart
function updateChart(data){
    //find data for chosen ID sample
    data.samples.forEach(i => {
        if(parseInt(i.id) === parseInt(findID())){
            var sampleData = i;
            console.log(sampleData);

            d3.select('bar').html("")

            var data = [{
             type: 'bar',
                x: sampleData.sample_values.slice(0,10).reverse(),
                y: sampleData.otu_ids.slice(0,10).map(k => `OTU ${k}`).reverse(),
                text: sampleData.otu_labels.slice(0,10).reverse(),
                orientation: 'h'
              }];
            
            var layout = {
                title: {text: 'Most Frequent OTU in Sample'},
                xaxis: {
                    title: {text: 'OTU Values'}
                }
            };
        
            Plotly.newPlot('bar', data, layout);
        }
    })
}

//Create Bubble Chart
function updateBubble(data) {
    //find data for chosen ID sample
    data.samples.forEach(i => {
        if (parseInt(i.id) === parseInt(findID())) {
            var sampleData = i;
            console.log(sampleData);

            d3.select('bubble').html("")

            var data = [{
                type: 'scatter',
                mode:'markers',
                x: sampleData.otu_ids,
                y: sampleData.sample_values,
                text: sampleData.otu_labels,
                marker: {
                    color: sampleData.otu_ids,
                    size: sampleData.sample_values
                }
            }];

            var layout = {
                title: {text: 'Bacteria OTU IDs and Frequency in Subject Sample'},
                yaxis: {
                    title: {text: 'OTU Values'}
                },
                xaxis: {
                    title: {text: 'OTU IDs'}
                }
            };

            Plotly.newPlot('bubble', data, layout);
        }
    })
}


////////////////////////////////////////////////////////////

//Initiate App

d3.json('samples.json').then(function(importData){
    var data = importData;
    console.log(data);

    //get subject ids and assign them to selector
    var subjectIds = data.metadata.map(i => i.id);
    IdSelector = d3.select("#selDataset");
    subjectIds.forEach(id => {
        IdSelector.append('option')
        .text(id)
        .attr('value', id);
    });

    //Assign table & graphs
    updateData(data);
    updateChart(data);
    updateBubble(data);

});

////////////////////////////////////////////////////////////
//Observe changes

d3.selectAll('#selDataset').on('change', tomoveHandler);