// The Belly Button Biodiversity Dashboard Challenge (Module 14)

// Get the api endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// initialize the data for entry into the website before selection
var navelId = 940;
// variable defined for processing
var option;

// function to create demographics, bar chart, wash frequency gauge, bubble chart
function createVisuals(navelId) {
        // console.log(navelId);
// 1. convert JSON file to an array of objects
    let data = d3.json(url).then(function(data) {
        // console.log(data);  
    let samples = data.samples;
        // console.log(samples);
    let metadata = data.metadata;   
        // console.log(metadata);

    // define all required variables:
    // create filtered data for individual's navel data
    let filteredSample = samples.filter(bacteriaData => bacteriaData.id == navelId)[0];
        console.log(filteredSample);

    // then sample_values for the bar chart
    let sample_values = filteredSample.sample_values;
        // console.log(sample_values);

    // then title for plots
    let plotTitle = ('Top 10 Bacteria for Navel Id:' + navelId); 

    // then otu_ids as labels for the bar chart
    let otu_ids = filteredSample.otu_ids;
        // console.log(otu_ids);

    // then otu_labels as the hovertext for the chart
    let otu_labels = filteredSample.otu_labels;
        // console.log(otu_labels);

    // y axis data to select top 10 (data default is sort desc)
    let ybarAxisData = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();
    // let ybarAxisData = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`);
        // console.log(ybarAxisData);

    // x axis data to select top 10 (data default is sort desc)
    // let xbarAxisData = sample_values.reverse().slice(0,10);
    let xbarAxisData = sample_values.slice(0,10).reverse();
        // console.log(xbarAxisData);

    // hovertext data to select top 10 (data default is sort desc)
    let hoverText = otu_labels.reverse().slice(0,10);
        // console.log(hoverText);

    // create filtered data for individual's demographics for the selected Navel Id
    let filteredMetadata = metadata.filter(bacteriaData => bacteriaData.id == navelId)[0];
        // console.log(filteredMetadata);
    washy = parseInt(filteredMetadata.wfreq);

// 2. create horizontal bar chart to display the top 10 OTUs for individual's navels    
    // trace for the navel data bar chart
    let traceBar = {
        x: xbarAxisData,
        y: ybarAxisData,
        text: hoverText,
        marker: {
            color: "MediumAquaMarine",
            width:  1
        },
        type: "bar",
        orientation: "h"
    };    
    // Create data array for bar chart
    let barData = [traceBar];
    // Apply a title to the layout
    let barLayout = {
        title: plotTitle,    
        // Include margins in the layout so the x-tick labels display correctly
        margin: {
            l: 150,
            r: 0,
            b: 75,
            t: 50,
            pad: 0,
        }
    };    
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", barData, barLayout);

// 3. create bubble chart that displays each sample
    // trace for the navel data
    // console.log(otu_ids)
    // console.log(sample_values)
    let traceBubble = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        type: "bubble",
        marker:{
            size: sample_values,
            color: otu_ids,
            colorscale: 'Hot'
        }        
    };    
    // Create data array
    let bubbleData = [traceBubble];
    // apply a title to the layout
    let bubbleLayout = {
        title: plotTitle,
        showlegend: false,
        xaxis:{
            title:{
                text: 'OTU ID',
            },
        },
        automargin: true,
        height: 600,
        width: 1300
    };
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. display the sample metadata, i.e., an individual's demographic info       
    let demographicsView = d3.select("#sample-metadata");
        // clear out the previous data
    demographicsView.html("");
    // 5. Display each key-value pair from the metadata JSON object somewhere on the page.
        // create filtered data for individual's demographics for the selected Navel Id
    Object.entries(filteredMetadata).forEach(entry => {
        let [key, value] = entry;
    // console.log(key, value);
        demographicsView.append("p").text(`${key}: ${value}`).property("value", navelId);
    });

    // advanced challenge assignment, added in for aesthetics on the dashboard
    let gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: washy,
            title:{text: "Number of Washings per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge:{
                axis: {range: [null, 9]},
                bar: { color: "#00ffcc" },
                steps: [
                { range: [0, 1], color: "#ccccff" },
                { range: [1, 2], color: "#b3b3ff" },
                { range: [2, 3], color: "#9999ff" },
                { range: [3, 4], color: "#8080ff" },
                { range: [4, 5], color: "#6666ff" },
                { range: [5, 6], color: "#4d4dff" },
                { range: [6, 7], color: "#3333ff" },
                { range: [7, 8], color: "#1a1aff" },
                { range: [8, 9], color: "#0000ff" },
                ]
            },
        },
    ];              
    let gaugeLayout = { width: 600, height: 600 };    
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
})};

// 6. update all the plots when a new sample is selected
function optionChanged(navelId) {
    console.log(navelId);

    createVisuals(navelId);
    };
// fun little function to pull a random Navel Id upon "select" option    
// function randomGenerateId(navelId) {
//     if(option === "select") {
//         let randomId = selDataset[Math.floor(Math.random()*selDataset.length)]
//         navelId = parseInt(randomId);
//         };
// };

// Then learn something fun about the various navel Id data available
function dashBoard() {
    // Use D3 to make the dropdown menu
    d3.json(url).then(function(data) {

    // set up the drop down list for selection
    let selDataset = Object.values(data.names)
    let option = ""
    // allow for a random selection
    // option += '<option value="select">select</option>';
    // then add the belly button Ids to the drop down menu
    for (let i = 0; i < selDataset.length; i++)
    {
    option += '<option value="'+ selDataset[i] +'">' + selDataset[i] + "</option>"
    }
    // begin with a random test subject so the Dashboard displays data
    // randomGenerateId();
    document.getElementById('selDataset').innerHTML = option
    console.log(option)
    console.log(selDataset)
    // view the demographics and charts
    createVisuals(navelId);
})};
// Let's begin
dashBoard();