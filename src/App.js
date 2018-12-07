// @flow
import React from "react";
import { View } from "react-native";
import { Map } from "icgc-react-native-components";
import { MapboxToken } from "./constants";

// styles
import sheet from "./styles/sheet";


class App extends React.Component {

	render() {

		return (
			<View style={sheet.matchParent}>
				<Map options = {{
					showUserLocation: true,
					zoomLevel: 12,
					userTrackingMode: Map.UserTrackingModes.Follow,
					styleURL: Map.StyleURL.Night
				}}
				mapboxToken={ MapboxToken }
				style={sheet.matchParent}
				/>
			</View>
		);

	}

}

export default App;
