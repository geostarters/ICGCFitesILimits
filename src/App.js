import React from 'react';
import { View } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

// styles
import sheet from './styles/sheet';

MapboxGL.setAccessToken("pk.eyJ1IjoiZ2Vvc3RhcnRlcnMiLCJhIjoiY2pvbnp4czhhMHoyZTNxdXVmaXE0cW9vcSJ9.EdP3QOltpjBJ-bWX3VVbkg");

class App extends React.Component {

  render() {
    return (
      <View style={sheet.matchParent}>
        <MapboxGL.MapView
          showUserLocation={true}
          zoomLevel={12}
          userTrackingMode={MapboxGL.UserTrackingModes.Follow}
          styleURL={ MapboxGL.StyleURL.Light }
          style={sheet.matchParent}
        />
      </View>
    );
  }
}

export default App;
