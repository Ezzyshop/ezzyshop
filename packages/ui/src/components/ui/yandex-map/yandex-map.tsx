import { LocateFixedIcon, MapPinIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Map, Polygon } from "@pbe/react-yandex-maps";
import { YMapsApi } from "@pbe/react-yandex-maps/typings/util/typing";
import { Button } from "../button";
import { YandexMapProvider } from "./yandex-map-provider";

type Coordinates = [number, number];
const DEFAULT_COORDINATES: Coordinates = [41.2995, 69.2401];

type LocationData = {
  coordinates: Coordinates;
  address: string;
};

interface IZone {
  _id: string;
  polygon: { coordinates: number[][][] };
}

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
  confirmDisabled?: boolean;
  outsideZoneLabel?: string;
  zones?: IZone[];
}

interface YandexBoundsChangeEvent {
  get: (key: string) => unknown;
}

interface YandexMapController {
  setCenter: (
    coordinates: Coordinates,
    zoom?: number,
    options?: { duration?: number },
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
  confirmDisabled = false,
  outsideZoneLabel,
  zones = [],
}: IProps) => {
  const [mapInstance, setMapInstance] = useState<YMapsApi | null>(null);
  const [mapRef, setMapRef] = useState<YandexMapController | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks the current map center so the geocoding effect always has the latest value
  const currentCenterRef = useRef<Coordinates>(
    initialCoordinates ?? DEFAULT_COORDINATES,
  );

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

        const locationData: LocationData = { coordinates, address: newAddress };
        setSelectedLocation(locationData);
        onLocationChange?.(locationData);
        setIsResolvingAddress(false);
      });
    },
    [mapInstance, onLatChange, onLngChange, onLocationChange],
  );

  // Keep a stable ref so debounce callbacks never hold a stale closure
  const getAddressRef = useRef(getAddress);
  useEffect(() => {
    getAddressRef.current = getAddress;
  }, [getAddress]);

  // Geocode initial position once the Yandex API has loaded
  useEffect(() => {
    if (mapInstance) {
      void getAddressRef.current(currentCenterRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance]);

  // Auto-detect on mount when no explicit coordinates are provided
  useEffect(() => {
    if (!initialCoordinates) {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const coordinates: Coordinates = [
              coords.latitude,
              coords.longitude,
            ];
            currentCenterRef.current = coordinates;
            mapRef?.setCenter(coordinates, 15, { duration: 300 });
            void getAddressRef.current(coordinates);
          },
          () => {},
        );
      }
    }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBoundsChange = useCallback((e: YandexBoundsChangeEvent) => {
    const newCenter = e.get("newCenter") as Coordinates | undefined;
    if (!newCenter) return;

    currentCenterRef.current = newCenter;
    setIsMoving(true);
    setSelectedLocation(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsMoving(false);
      void getAddressRef.current(newCenter);
    }, 600);
  }, []);

  const detectCurrentLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinates: Coordinates = [coords.latitude, coords.longitude];
        currentCenterRef.current = coordinates;
        mapRef?.setCenter(coordinates, 15, { duration: 300 });
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setIsMoving(false);
        void getAddressRef.current(coordinates);
        setIsDetectingLocation(false);
      },
      () => {
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true },
    );
  }, [mapRef]);

  const handleConfirmLocation = () => {
    if (!selectedLocation) return;
    onLocationSelect(selectedLocation);
  };

  return (
    <YandexMapProvider>
      <div className={className}>
        <div className="relative">
          {/* Resolved address label */}
          {selectedLocation?.address && !isMoving && (
            <div className="absolute top-4 left-1/2 z-10 w-[calc(100%-2rem)] -translate-x-1/2 px-4 py-3 text-center text-2xl font-semibold">
              {selectedLocation.address}
            </div>
          )}

          {/* Fixed center pin — tip anchored to map center */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full"
            style={{ transition: isMoving ? "none" : "transform 0.15s ease" }}
          >
            <MapPinIcon
              className="size-10 text-primary"
              style={{
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))",
                transform: isMoving ? "translateY(-6px)" : "translateY(0)",
                transition: "transform 0.15s ease",
              }}
            />
          </div>

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
            <div className="absolute bottom-4 left-2 right-2 z-10 flex flex-col gap-2">
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={handleConfirmLocation}
                disabled={
                  !selectedLocation ||
                  isResolvingAddress ||
                  isMoving ||
                  confirmDisabled
                }
              >
                {outsideZoneLabel ?? confirmLabel}
              </Button>
            </div>
          )}

          <Map
            defaultState={{
              center: initialCoordinates ?? DEFAULT_COORDINATES,
              zoom: 15,
            }}
            width={width}
            height={height}
            onLoad={setMapInstance}
            onBoundsChange={handleBoundsChange}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            instanceRef={(ref: any) => setMapRef(ref)}
            options={{ suppressMapOpenBlock: true }}
            modules={["geolocation", "geocode"]}
          >
            {zones.map((zone) => (
              <Polygon
                key={zone._id}
                geometry={zone.polygon.coordinates.map((ring) =>
                  ring.map(([lng, lat]) => [lat, lng]),
                )}
                options={{
                  fillColor: "#22c55e",
                  fillOpacity: 0.15,
                  strokeColor: "#16a34a",
                  strokeWidth: 2,
                  strokeOpacity: 0.7,
                }}
              />
            ))}
          </Map>
        </div>
      </div>
    </YandexMapProvider>
  );
};
