import { LocateFixedIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Map, Placemark } from "@pbe/react-yandex-maps";
import { YMapsApi } from "@pbe/react-yandex-maps/typings/util/typing";
import { Button } from "../button";
import { YandexMapProvider } from "./yandex-map-provider";

type Coordinates = [number, number];
const DEFAULT_COORDINATES: Coordinates = [41.2995, 69.2401];
type LocationData = {
  coordinates: Coordinates;
  address: string;
};

interface IProps {
  className?: string;
  onLocationSelect: (data: LocationData) => void;
  onLocationChange?: (data: LocationData) => void;
  onLatChange?: (lat: number) => void;
  onLngChange?: (lng: number) => void;
  initialCoordinates?: Coordinates;
  height?: string;
  width?: string;
  myLocationLabel?: string;
  confirmLabel?: string;
}

interface YandexMapEvent {
  get: (key: string) => Coordinates;
}

interface YandexMapInstance {
  geometry: {
    getCoordinates: () => Coordinates;
  };
}

interface YandexDragEvent {
  get: (key: string) => YandexMapInstance;
}

interface YandexMapController {
  setCenter: (
    coordinates: Coordinates,
    zoom?: number,
    options?: { duration?: number }
  ) => void;
}

export const YandexMap = ({
  className,
  onLocationSelect,
  onLocationChange,
  onLatChange,
  onLngChange,
  initialCoordinates,
  height = "200px",
  width = "100%",
  myLocationLabel = "Men qayerdaman?",
  confirmLabel,
}: IProps) => {
  const [mapInstance, setMapInstance] = useState<YMapsApi | null>(null);
  const [mapRef, setMapRef] = useState<YandexMapController | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates>(
    initialCoordinates ?? DEFAULT_COORDINATES
  );
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [pendingCoordinates, setPendingCoordinates] = useState<Coordinates | null>(
    null
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);

  const getAddress = useCallback(
    async (coordinates: Coordinates) => {
      if (!mapInstance) return;

      onLatChange?.(coordinates[0]);
      onLngChange?.(coordinates[1]);
      setIsResolvingAddress(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapInstance.geocode(coordinates).then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0);

        const newAddress = [
          firstGeoObject.getLocalities().length
            ? firstGeoObject.getLocalities()
            : firstGeoObject.getAdministrativeAreas(),
          firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
          firstGeoObject.getPremiseNumber(),
        ]
          .filter(Boolean)
          .join(", ");

        const locationData = {
          coordinates,
          address: newAddress,
        };

        setSelectedLocation(locationData);
        onLocationChange?.(locationData);
        setIsResolvingAddress(false);
      });
    },
    [mapInstance, onLatChange, onLngChange, onLocationChange]
  );

  const selectCoordinates = useCallback(
    (coordinates: Coordinates) => {
      setSelectedCoordinates(coordinates);
      setSelectedLocation(null);
      mapRef?.setCenter(coordinates, 15, { duration: 300 });
      if (!mapInstance) {
        setPendingCoordinates(coordinates);
        return;
      }

      setPendingCoordinates(null);
      void getAddress(coordinates);
    },
    [getAddress, mapInstance, mapRef]
  );

  const detectCurrentLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinates: Coordinates = [coords.latitude, coords.longitude];
        selectCoordinates(coordinates);
        setIsDetectingLocation(false);
      },
      () => {
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, [selectCoordinates]);

  useEffect(() => {
    if (initialCoordinates) {
      setSelectedCoordinates(initialCoordinates);
    }
  }, [initialCoordinates]);

  useEffect(() => {
    if (!initialCoordinates) {
      detectCurrentLocation();
    }
  }, [detectCurrentLocation, initialCoordinates]);

  useEffect(() => {
    if (mapInstance && pendingCoordinates) {
      void getAddress(pendingCoordinates);
      setPendingCoordinates(null);
    }
  }, [getAddress, mapInstance, pendingCoordinates]);

  const handleMapClick = (e: YandexMapEvent) => {
    const coordinates = e.get("coords") as Coordinates;
    selectCoordinates(coordinates);
  };

  const handleDragEnd = (e: YandexDragEvent) => {
    const coordinates = e.get("target").geometry.getCoordinates() as Coordinates;
    selectCoordinates(coordinates);
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) return;

    onLocationSelect(selectedLocation);
  };

  return (
    <YandexMapProvider>
      <div className={className}>
        <div className="relative">
          {selectedLocation?.address && (
            <div className="absolute top-4 left-1/2 z-10 w-[calc(100%-2rem)] -translate-x-1/2   px-4 py-3 text-center text-2xl font-semibold ">
              {selectedLocation.address}
            </div>
          )}
          <Button
            type="button"
            variant="secondary"
            className="absolute bottom-20 right-2 z-10 h-9 rounded-full px-3 shadow-md"
            aria-label={myLocationLabel}
            title={myLocationLabel}
            onClick={detectCurrentLocation}
            disabled={isDetectingLocation}
          >
            <LocateFixedIcon className="size-4" />
            <span>{myLocationLabel}</span>
          </Button>
          {confirmLabel && (
            <Button
              type="button"
              size="lg"
              className="absolute bottom-4 left-2 right-2 z-10"
              onClick={handleConfirmLocation}
              disabled={!selectedLocation || isResolvingAddress}
            >
              {confirmLabel}
            </Button>
          )}
          <Map
            state={{
              center: selectedCoordinates,
              zoom: 15,
            }}
            width={width}
            height={height}
            onClick={handleMapClick}
            onLoad={setMapInstance}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            instanceRef={(ref: any) => setMapRef(ref)}
            options={{
              suppressMapOpenBlock: true,
            }}
            modules={["geolocation", "geocode"]}
          >
            <Placemark
              geometry={selectedCoordinates}
              options={{
                draggable: true,
                iconColor: "var(--primary)",
              }}
              properties={{
                hintContent: "Drag to move",
              }}
              onDragEnd={handleDragEnd}
            />
          </Map>
        </div>
      </div>
    </YandexMapProvider>
  );
};
