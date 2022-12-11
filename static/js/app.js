//Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json

const DataSamples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//dropdown menu
function DropDownFunction() {

    // Use D3 to select the dropdown menu
    var DropDownItems = d3.select("#selDataset");
    
    d3.json(DataSamples).then((data) => {

        var DataNames = data.names;
    
        DataNames.forEach((name) => {
            var option = DropDownItems.append("option");
            option.text(name);
        });

        var displayID = DropDownItems.property("value");
        console.log("displayID:", displayID);

               DemoInfo(displayID);
    });    
}


// Update data and charts
function DemoInfo(subjectID) {

    // Use D3 to select the demographic info panel
    var DemoData = d3.select("#sample-metadata");

        DemoData.html("");

    d3.json(DataSamples).then((data) => {
       
        var metaData = data.metadata.filter(sample => sample.id == subjectID)[0];
        console.log("metaData:", metaData);
        
        Object.entries(metaData).forEach(([key, value]) => {
          DemoData.append("h6").text(`${key}: ${value}`);
        });
        
        var samplesData = data.samples.filter(sample => sample.id == subjectID)[0];
        
        Graphs(subjectID, samplesData);
        
        var wfreq = metaData.wfreq;

        // Call the function to create gauge chart - in bonus.js file
        //gaugeChart(subjectID, wfreq);
    });
}


// Create Grpahs
function Graphs(subjectID, samplesInfo) {

    console.log("samplesInfo:", samplesInfo);
    console.log("subjectID:", subjectID);

    
    var otuIDs = samplesInfo.otu_ids;
    var otuLabels = samplesInfo.otu_labels;
    var sampleValues = samplesInfo.sample_values;

    
    // Bar Chart 
    
    var topOtuIDs = otuIDs.slice(0,10).reverse().map(otuID => "OTU " + otuID);
    var topOtuLabels = otuLabels.slice(0,10).reverse();
    var topsampleValues = sampleValues.slice(0,10).reverse();

    
    let traceBar = {
        x: topsampleValues,
        y: topOtuIDs,
        text: topOtuLabels,
        type: "bar",
        orientation: "h"
    }
    
    let dataBar = [traceBar];

    
    let layoutBar = {
        title: `<b>Top 10 Bacteria Species<br> in Test Subject ${subjectID}</b>`,
        xaxis: {title: `Sample Values`},
    
    }
   
    Plotly.newPlot("bar", dataBar, layoutBar);

    // Bubble Chart //
    
   
    let traceBubble = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
            size: sampleValues,
            color: otuIDs,
            colorscale: "Earth"
        }
    }
    
    let dataBubble = [traceBubble];

    
    let layoutBubble = {
        title: `<b>All Bacteria Species in Test Subject ${subjectID}</b>`,
        xaxis: {title: `Operational Taxonomic Unit (OTU) ID`},
        yaxis: {title: `Sample Values`}
    }
    
    Plotly.newPlot("bubble", dataBubble, layoutBubble);
    
}

// Change of dropdown menu 
function optionChanged(newID) {
    console.log("newID:", newID)
    DemoInfo(newID);
}

DropDownFunction();
