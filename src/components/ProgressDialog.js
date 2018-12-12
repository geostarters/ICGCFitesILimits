// @flow
import React from "react";
import PropTypes from "prop-types";
import OfflineProgressDialog from "./ProgressDialog";
import { Bubble } from "icgc-react-native-components";
import { View, StyleSheet, TouchableOpacity } from 'react-native';

// styles
import sheet from "../styles/sheet";

class ProgressDialog extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			isDownloading: true,
			isCompleted: false
		};

	}

	getDefaultProps() {

		return {
			progressTitle: "Status",
			progressSubtext: "Percentage",
			resumeButtonText: "Resume",
			pauseButtonText: "Pause",
			stopButtonText: "Stop",
			activeStatusText: "Active",
			inactiveStatusText: "Inactive",
			completeStatusText: "Complete",
			showStopButton: false
		}

	}

	componentDidUpdate() {
		this.setState({
			isDownloading: this.props.percentage < 100,
			isCompleted: this.props.percentage >= 100
		});
	}

	formatPercent() {
	
		return Math.round(this.props.percentage / 100);
	
	}
	
	getRegionDownloadState() {

		if(this.state.isDownloading) {
			return this.props.activeStatusText;
		} else if(this.state.isCompleted) {
			return this.props.completeStatusText;
		} else {
			return this.props.inactiveStatusText;
		}

	}

	onResume() {

		this.setState({
			isDownloading: true,
		});

		this.props.onResume();
	
	}
	
	onPause() {

		this.setState({
			isDownloading: false,
		});

		this.props.onPause();
	
	}

	onStop() {

		this.setState({
			isDownloading: false,
		});

		this.props.onStop();

	}

	render() {

		return (
			<Bubble>
				<View style={{ flex: 1 }}>
				<Text>
					{`${this.props.progressTitle}: ${this.getRegionDownloadState()}`}
				</Text>
				<Text>{`${this.props.progressSubtext}: ${this.formatPercent()}`}</Text>

				<View style={styles.buttonCnt}>
					<TouchableOpacity onPress={() => this.onResume()}>
					<View style={styles.button}>
						<Text style={styles.buttonTxt}>{this.props.resumeButtonText}</Text>
					</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => this.onPause()}>
					<View style={styles.button}>
						<Text style={styles.buttonTxt}>{this.props.pauseButtonText}</Text>
					</View>
					</TouchableOpacity>

					{ this.props.showStopButton && 
						<TouchableOpacity onPress={() => this.onStop()}>
						<View style={styles.button}>
							<Text style={styles.buttonTxt}>{this.props.stopButtonText}</Text>
						</View>
						</TouchableOpacity>
					}
				</View>
				</View>
			</Bubble>
		);

	}

}

ProgressDialog.propTypes = {
	progressTitle: PropTypes.string,
	progressSubtext: PropTypes.string,
	resumeButtonText: PropTypes.string,
	pauseButtonText: PropTypes.string,
	stopButtonText: PropTypes.string,
	activeStatusText: PropTypes.string,
	inactiveStatusText: PropTypes.string,
	completeStatusText: PropTypes.string,
	showStopButton: PropTypes.bool,
	percentage: PropTypes.number,
	onPause: PropTypes.func,
	onResume: PropTypes.func,
	onPlay: PropTypes.func
};

export default ProgressDialog;
