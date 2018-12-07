// @flow
import React from "react";
import { View } from "react-native";
import { Map } from "icgc-react-native-components";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import ProgressDialog from "./ProgressDialog";
import DownloadMapDialog from "./DownloadMapDialog";
import { MapboxToken, DownloadableArea } from "../constants";

// styles
import sheet from "../styles/sheet";

class MapPage extends React.Component {

	constructor(props) {
		super(props);
	
		this.offlinePackName = "offlinePack";

		this.state = {
			name: this.offlinePackName,
			offlineRegion: null,
			offlineRegionStatus: null,
			isMapDownloaded: (await MapboxGL.offlineManager.getPack(this.offlinePackName) !== undefined)
			isMapDownloading: false
		};
	
		this.onDownloadProgress = this.onDownloadProgress.bind(this);

	  }

	componentWillUnmount() {
		// avoid setState warnings if we back out before we finishing downloading
		MapboxGL.offlineManager.deletePack(this.state.name);
		MapboxGL.offlineManager.unsubscribe('test');
	}

	onStartDownload() {

		const options = {
			name: this.state.name,
			styleURL: Map.StyleURL.Night,
			bounds: DownloadableArea.bounds,
			minZoom: DownloadableArea.minZoom,
			maxZoom: DownloadableArea.maxZoom,
		};

		MapboxGL.offlineManager.createPack(options, this.onDownloadProgress, this.onDownloadError);

	}

	onDownloadProgress(offlineRegion, offlineRegionStatus) {

		this.setState({
		  name: offlineRegion.name,
		  offlineRegion: offlineRegion,
		  offlineRegionStatus: offlineRegionStatus,
		});

	}
	
	onDownloadError(offlineRegion, offlineRegionStatus) {

		//TODO: Show error dialog
		throw new Error(JSON.stringify(offlineRegionStatus));
	
	}

	formatPercent() {

		if (!this.state.offlineRegionStatus) {
			return '0%';
		}
		
		return Math.round(this.state.offlineRegionStatus.percentage / 10) / 10;
	
	}
	
	onResume() {

		if (this.state.offlineRegion) {
			this.state.offlineRegion.resume();
		}
	
	}
	
	onPause() {

		if (this.state.offlineRegion) {
			this.state.offlineRegion.pause();
		}
	
	}

	render() {

		return (
			<View style={sheet.matchParent}>
				<Map 
					options = {{
						showUserLocation: true,
						zoomLevel: 12,
						userTrackingMode: Map.UserTrackingModes.Follow,
						styleURL: Map.StyleURL.Night
					}}
					mapboxToken={ MapboxToken }
					style={sheet.matchParent}
				/>
				{ !this.state.isMapDownloaded && 
					!this.state.isMapDownloading && 
					<DownloadMapDialog />
				}
				{ this.state.offlineRegionStatus !== null && 
					this.state.isMapDownloading &&
					<ProgressDialog 
						offlineRegion={ this.state.offlineRegionStatus }
						onPause={ () => this.onPause() }
						onResume={ () => this.onResume() }
					/>
				}
			</View>
		);

	}

}

export default MapPage;
