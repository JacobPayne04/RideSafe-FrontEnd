export function getCurrentCoords(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          callback(null, coords);
        },
        (error) => {
          callback(error, null);
        }
      );
    } else {
      callback(new Error("Geolocation not supported"), null);
    }
  }
  