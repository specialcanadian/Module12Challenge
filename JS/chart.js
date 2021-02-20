function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var OTUsamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
      //                   .filter here returns array of len 1, so [0] gives just the dict 
    var specificSamples = OTUsamples.filter(sampleObj => sampleObj.id == sample)[0];
    //  5. Create a variable that holds the first sample in the array.
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var OtuIds      = specificSamples.otu_ids;
    var OtuLabels   = specificSamples.otu_labels;
    var SampleValues= specificSamples.sample_values;

    // ========= Deliverable 3 ========================
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    // 3. Create a variable that holds the washing frequency.
    var WashFreq = resultArray.wfreq 
    //======== Deliverable 3 ===========================

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = (OtuIds.slice(0, 10)).map(cappy => "OTU "+cappy).reverse();
    var xticks = SampleValues.slice(0,10).reverse();
    // console.log(yticks)
    // // 8. Create the trace for the bar chart. 
    // console.log(OtuIds)
    // console.log(yticks)
    var barData = [{
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h"
  }];
    // // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: OtuIds,
      y: SampleValues,
      text: OtuLabels,
      mode: 'markers',
      marker: {
        size: SampleValues,
        color: OtuIds
      },
      
      }];
  
      // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Cultures per Sample",
        showlegend: false,
        height: 680,
        width: 1250,
        hovermode: OtuLabels
    };
  
      // 3. Use Plotly to plot the data with the layout.  
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);

          // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: WashFreq,
        title: { text: "Belly Button Wash Frequency per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null,10]},
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "AliceBlue" },
            { range: [2, 4], color: "Aquamarine" },
            { range: [4, 6], color: "Aqua" },
            { range: [6, 8], color: "CornflowerBlue" },
            { range: [8, 10], color: "Blue" }
          ],
        }
        
        // range: 10
      }];
    
    // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 500,
        height: 500,
      };

    // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout)
  });
}
