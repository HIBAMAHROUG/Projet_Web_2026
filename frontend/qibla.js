(function initQiblaDirectionWidget() {
  const kaabaCoordinates = {
    lat: 21.4225,
    lon: 39.8262
  };

  const actionButton = document.getElementById('qiblaActionBtn');
  const statusElement = document.getElementById('qiblaStatus');
  const angleElement = document.getElementById('qiblaAngle');
  const distanceElement = document.getElementById('qiblaDistance');
  const locationElement = document.getElementById('qiblaLocation');
  const arrowElement = document.getElementById('qiblaArrow');

  if (!actionButton || !statusElement || !angleElement || !distanceElement || !locationElement || !arrowElement) {
    return;
  }

  function toRadians(value) {
    return (value * Math.PI) / 180;
  }

  function toDegrees(value) {
    return (value * 180) / Math.PI;
  }

  function computeQiblaBearing(userLat, userLon) {
    const userLatRad = toRadians(userLat);
    const kaabaLatRad = toRadians(kaabaCoordinates.lat);
    const deltaLonRad = toRadians(kaabaCoordinates.lon - userLon);

    const y = Math.sin(deltaLonRad);
    const x = (Math.cos(userLatRad) * Math.tan(kaabaLatRad)) - (Math.sin(userLatRad) * Math.cos(deltaLonRad));
    const bearing = (toDegrees(Math.atan2(y, x)) + 360) % 360;

    return bearing;
  }

  function computeDistanceKm(userLat, userLon) {
    const earthRadiusKm = 6371;

    const lat1 = toRadians(userLat);
    const lat2 = toRadians(kaabaCoordinates.lat);
    const deltaLat = toRadians(kaabaCoordinates.lat - userLat);
    const deltaLon = toRadians(kaabaCoordinates.lon - userLon);

    const a = (Math.sin(deltaLat / 2) ** 2) + (Math.cos(lat1) * Math.cos(lat2) * (Math.sin(deltaLon / 2) ** 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }

  function setBusyState(isBusy) {
    actionButton.disabled = isBusy;
    actionButton.setAttribute('aria-busy', String(isBusy));
    actionButton.innerHTML = isBusy
      ? '<i class="fas fa-spinner fa-spin"></i> جار تحديد الموقع...'
      : '<i class="fas fa-location-dot"></i> تحديد اتجاه القبلة الآن';
  }

  function updateQiblaUi(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    const bearing = computeQiblaBearing(userLat, userLon);
    const distanceKm = computeDistanceKm(userLat, userLon);

    statusElement.textContent = 'تم تحديد القبلة بنجاح';
    angleElement.textContent = `${bearing.toFixed(1)}°`;
    distanceElement.textContent = `${distanceKm.toFixed(0)} km`;
    locationElement.textContent = `${userLat.toFixed(4)}, ${userLon.toFixed(4)}`;

    arrowElement.style.transform = `translateX(-50%) rotate(${bearing.toFixed(1)}deg)`;
  }

  function handleQiblaError(error) {
    let message = 'تعذر تحديد الموقع';

    if (error && typeof error.code === 'number') {
      if (error.code === 1) {
        message = 'تم رفض إذن الموقع';
      } else if (error.code === 2) {
        message = 'الموقع غير متاح حاليا';
      } else if (error.code === 3) {
        message = 'انتهت مهلة تحديد الموقع';
      }
    }

    statusElement.textContent = message;
  }

  function locateAndComputeQibla() {
    if (!navigator.geolocation) {
      statusElement.textContent = 'المتصفح لا يدعم خدمة تحديد الموقع';
      return;
    }

    setBusyState(true);

    navigator.geolocation.getCurrentPosition(
      function onSuccess(position) {
        updateQiblaUi(position);
        setBusyState(false);
      },
      function onError(error) {
        handleQiblaError(error);
        setBusyState(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }

  actionButton.addEventListener('click', locateAndComputeQibla);
})();
