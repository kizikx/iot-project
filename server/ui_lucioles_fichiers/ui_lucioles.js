window.onload = function init() {
    let myData = [];
    macList = [];

    function searchMac(mac){
        const index = macList.indexOf(mac);
        if (index == -1) {
        macList.push(mac);
        myData.push({mac, temp: 0, light: 0, wifi: 0});
        return macList.length - 1;
        } else {
        return index;
        }
    }

    function replaceData(data, index){
            $("#num"+index).text("Esp"+index);
            $("#mac"+index).text(data.mac);
            $("#temp"+index).text(data.temp);
            $("#light"+index).text(data.light);
            $("#wifi"+index).text(data.wifi);
            $("#btn"+index).click(function(){
                ping(data.mac);
            })
    }
    
    Highcharts.setOptions({
	global: { 
            useUTC: false,
            type: 'spline'
	},
	time: {
	    timezone: 'Europe/Paris'
	}
    });

    var chart1 = new Highcharts.Chart({
        title: {
            text: 'Temperatures'
        },
	subtitle: {
            text: 'Irregular time data in Highcharts JS'
	},
        legend: {
            enabled: true
        },
        credits: false,
        chart: {renderTo: 'container1'},
        xAxis: {
            title: {
                text: 'Heure'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Temperature (Deg C)'
            }
        },
        series: [{name: 'ESP1', data: []},
		 {name: 'ESP2', data: []},
		 {name: 'ESP3', data: []},
		],

	colors: ['red', 'green', 'blue'],
	
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        }
    });

    var chart2 = new Highcharts.Chart({
        title: { text: 'Lights' },
        legend: {
            enabled: true
        },
        credits: false,
        chart: {renderTo: 'container2'},
        xAxis: {
            title: {
                text: 'Heure'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Lumen (Lum)'
            }
        },
	series: [{name: 'ESP1', data: []},
		 {name: 'ESP2', data: []},
		 {name: 'ESP3', data: []}],

	//colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
	colors: ['red', 'green', 'blue'],
	
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        }
    });

    
    function get_samples(path_on_node, serie, wh){
    node_url = 'http://62.210.139.84:3000'
    let topic = path_on_node.split("/")[2];

        $.ajax({
            url: node_url.concat(path_on_node), // URL to "GET" : /esp/temp ou /esp/light
            type: 'GET',
            headers: { Accept: "application/json", },
	    data: {"who": wh}, // parameter of the GET request
            success: function (resultat, statut) { // Anonymous function on success
                let listeData = [];
                resultat.forEach(function (element) {
            listeData.push([Date.parse(element.date),element.value]);
                });
                serie.setData(listeData); //serie.redraw();
                let pos = searchMac(wh);
                let newObject = myData[pos];
                if(topic === "temp"){
                    newObject.temp=serie.data[serie.data.length - 1].y;
                }
                else if(topic === "light"){
                    newObject.light=serie.data[serie.data.length - 1].y;
                }
                else if(topic === "wifi"){
                    newObject.wifi=serie.data[serie.data.length - 1].y;
                }
                displayEsp(myData);
                for(let z=0;myData.length;z++){
                    replaceData(myData[z], z);
                }
                
            },
            error: function (resultat, statut, erreur) {
            },
            complete: function (resultat, statut) {
            }
        });
    }
    
    function process_esp(which_esps,i){
	const refreshT = 100000 
	esp = which_esps[i];    
	get_samples('/esp/temp', chart1.series[i], esp);
	window.setInterval(get_samples,
			   refreshT,
			   '/esp/temp',    
			   chart1.series[i],
			   esp);            

	get_samples('/esp/light', chart2.series[i], esp);
	window.setInterval(get_samples,
			   refreshT,
			   '/esp/light',     
			   chart2.series[i],
               esp);       
    get_samples('/esp/wifi', chart3.series[i], esp);
    window.setInterval(get_samples,
                refreshT,
                '/esp/wifi',     
                chart3.series[i], 
                esp);    
    }

    var which_esps = ["80:7D:3A:FD:D7:78",
		      "80:7D:3A:FD:C2:F0",
              "30:AE:A4:8C:04:64"
            ]
    for (var i = 0; i < which_esps.length; i++) {
	process_esp(which_esps, i)
    }
};

function displayEsp(data){
    console.log(data);
    let table = '<table class="table">'+
    '<thead>'+
    '<tr>'+
    '<th scope="col">Esp</th>'+
    '<th scope="col">Mac</th>'+
    '<th scope="col">Temp</th>'+
    '<th scope="col">Light</th>'+
    '<th scope="col">Wifi</th>'+
    '<th scope="col">Ping</th>'+
    '</tr>'+
    '</thead>'+
    '<tbody>';
    for(let i=0;i<data.length;i++){
        table += '<tr>'+
        '<th id="num'+i+'" scope="row"></th>'+
        '<td id="mac'+i+'"></td>'+
        '<td id="temp'+i+'"></td>'+
        '<td id="light'+i+'"></td>'+
        '<td id="wifi'+i+'"></td>'+
        '<td><button id="btn'+i+'">ping</button></td>'+
      '</tr>';
    }
    table += '</tbody></table>';
    $('#toto').html(table);
}

function ping(mac){
    $.ajax({
        url: node_url.concat("/esp/ping/"+mac), 
        type: 'GET',
        headers: { Accept: "application/json", },
        success: function (resultat, statut) {        
        },
        error: function (resultat, statut, erreur) {
        },
        complete: function (resultat, statut) {
        }
    });
}