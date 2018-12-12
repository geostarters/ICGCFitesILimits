// @flow
import React from "react";
import { View } from "react-native";
import { Map } from "icgc-react-native-components";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import ProgressDialog from "./ProgressDialog";
import QuestionDialog from "./QuestionDialog";
import { MapboxToken, DownloadableArea } from "../constants";

// styles
import sheet from "../styles/sheet";

MapboxGL.setAccessToken(MapboxToken);

class MapPage extends React.Component {

	constructor(props) {
		super(props);
	
		this.offlinePackName = "offlinePack";

		this.state = {
			name: this.offlinePackName,
			offlineRegion: null,
			offlineRegionStatus: null,
			isMapDownloaded: false,
			isMapDownloading: false,
			showDownloadQuestion: false
		};
	
		this.onDownloadProgress = this.onDownloadProgress.bind(this);

		console.log("MapPage constructor???", MapboxGL);
		MapboxGL.getAccessToken().then((val) => console.log("AT1", val), () => console.log("AT2", val));
		MapboxGL.offlineManager.getPack(this.offlinePackName).then(
			(val) => { console.log("1", val); this.setState({isMapDownloaded: true}) }, 
			(val) => { console.log("2", val); this.setState({isMapDownloaded: false, showDownloadQuestion: true}) }
		);
		console.log("MapPage constructor!!!");

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

	onStop() {
		
		if(this.state.offlineRegion) {
			this.state.offlineRegion.stop();
		}
	}

	downloadMap() {

		this.onStartDownload();
		this.setState({ isMapDownloading: true });

	}

	hideQuestionDialog() {

		this.setState({ showDownloadQuestion: false });

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
				{ this.state.showDownloadQuestion &&
					<QuestionDialog 
						isModal={true}
						showTitle={false}
						acceptButtonText="Sí"
						cancelButtonText="No"
						acceptButtonPressed={ () => this.downloadMap() }
						cancelButtonPressed={ () => this.hideQuestionDialog() }
					>
						Vols descarregar el mapa per utilitzar-lo sense connexió?
					</QuestionDialog>
				}
				{ this.state.offlineRegionStatus !== null && 
					this.state.isMapDownloading &&
					<ProgressDialog 
						percentage={ this.state.offlineRegionStatus.status.percentage }
						onPause={ () => this.onPause() }
						onResume={ () => this.onResume() }
						progressTitle="Estat de descàrrega"
						progressSubtext="Percentatge"
						resumeButtonText="Reprèn"
						pauseButtonText="Pausa"
						stopButtonText="Atura"
						activeStatusText="Activa"
						inactiveStatusText="Inactiva"
						completeStatusText="Completa"
						showStopButton={true}
					/>
				}
			</View>
		);

	}

}

export default MapPage;
