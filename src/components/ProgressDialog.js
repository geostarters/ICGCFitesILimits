// @flow
import React from "react";
import OfflineProgressDialog from "./ProgressDialog";

// styles
import sheet from "../styles/sheet";

class ProgressDialog extends React.Component {

	formatPercent() {

		if (!this.state.offlineRegionStatus) {
			return '0%';
		}
		
		return Math.round(this.state.offlineRegionStatus.percentage / 10) / 10;
	
	}
	
	getRegionDownloadState(downloadState) {

		switch (downloadState) {
			case MapboxGL.OfflinePackDownloadState.Active:
				return 'Active';
		  	case MapboxGL.OfflinePackDownloadState.Complete:
				return 'Complete';
		  	default:
				return 'Inactive';
		}

	}

	render() {

		return (
			<Bubble>
				<View style={{ flex: 1 }}>
				<Text>
					Download State:{' '}
					{this._getRegionDownloadState(this.props.status.state)}
				</Text>
				<Text>Download Percent: {this.props.status.percentage}</Text>

				<View style={styles.buttonCnt}>
					<TouchableOpacity onPress={this.props.onResume}>
					<View style={styles.button}>
						<Text style={styles.buttonTxt}>Resume</Text>
					</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.onPause}>
					<View style={styles.button}>
						<Text style={styles.buttonTxt}>Pause</Text>
					</View>
					</TouchableOpacity>
				</View>
				</View>
			</Bubble>
		);

	}

}

export default MapPage;
