function gHeatmap(response){
	console.log("La respuesta del sql");
	console.log(response);
	var reportData =[];
	
	for (var i=0;i<response.total_rows;i++){
		
		reportData.push(new google.maps.LatLng(response.rows[i]['lat'], response.rows[i]['lon']));
	}
	
	console.log(reportData);

	
	var pointArray = new google.maps.MVCArray(reportData);

	heatmap = new google.maps.visualization.HeatmapLayer({
    	data: pointArray
	});
	heatmap.set('radius', heatmap.get('radius') ? null : 50);
/* 	heatmap.set('dissipating', true); */

	heatmap.setMap(map);
}