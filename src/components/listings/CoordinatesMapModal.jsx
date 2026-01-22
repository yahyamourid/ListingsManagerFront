// import React, { useEffect, useState, useRef, useMemo } from "react";
// import { X, RefreshCcw, Trash2, Maximize2, Minimize2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { GoogleMap, MarkerF } from "@react-google-maps/api";
// import { cn } from "@/lib/utils";

// const DEFAULT_CENTER = { lat: 12.155256231290371, lng: -68.26788999190961 };

// const mapContainerStyle = { width: "100%", height: "100%" };

// const mapOptions = {
//   mapTypeId: "hybrid",
//   disableDefaultUI: true,
//   zoomControl: true,
//   clickableIcons: false,
//   streetViewControl: false,
//   mapTypeControl: false,
// };

// /* -------------------- helpers -------------------- */
// // Allows numbers, optional minus, optional decimal
// const NUMBER_REGEX = /^-?\d*(\.\d*)?$/;

// const parseNumber = (value) => {
//   if (!NUMBER_REGEX.test(value)) return null;
//   if (value === "" || value === "-" || value === "." || value === "-.") {
//     return null;
//   }
//   const n = Number(value);
//   return Number.isFinite(n) ? n : null;
// };

// const validateLat = (value) => {
//   const n = parseNumber(value);
//   if (n === null) return "Invalid number";
//   if (n < -90 || n > 90) return "Latitude must be between -90 and 90";
//   return null;
// };

// const validateLng = (value) => {
//   const n = parseNumber(value);
//   if (n === null) return "Invalid number";
//   if (n < -180 || n > 180) return "Longitude must be between -180 and 180";
//   return null;
// };

// const isValidLat = (v) => Number.isFinite(v) && v >= -90 && v <= 90;
// const isValidLng = (v) => Number.isFinite(v) && v >= -180 && v <= 180;

// const parseCoord = (value) => {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : null;
// };

// export function CoordinatesMapModal({ isOpen, onClose, listing, onSave }) {
//   const mapRef = useRef(null);

//   /** INPUT STATE (strings – always safe) */
//   const [latInput, setLatInput] = useState("");
//   const [lngInput, setLngInput] = useState("");

//   /** UI STATE */
//   const [isModified, setIsModified] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   /** DERIVED VALID COORDS */
//   const parsedLat = useMemo(() => parseCoord(latInput), [latInput]);
//   const parsedLng = useMemo(() => parseCoord(lngInput), [lngInput]);

//   const hasValidCoordinates = isValidLat(parsedLat) && isValidLng(parsedLng);

//   const validCoordinates = hasValidCoordinates
//     ? { lat: parsedLat, lng: parsedLng }
//     : null;

//   /* -------------------- effects -------------------- */

//   useEffect(() => {
//     if (!isOpen) return;

//     if (listing?.latitude && listing?.longitude) {
//       setLatInput(String(listing.latitude));
//       setLngInput(String(listing.longitude));
//     } else {
//       setLatInput("");
//       setLngInput("");
//     }

//     setIsModified(false);
//   }, [isOpen, listing]);

//   /** Pan map ONLY when coords are valid */
//   useEffect(() => {
//     if (mapRef.current && validCoordinates) {
//       mapRef.current.panTo(validCoordinates);
//       mapRef.current.setZoom(18);
//     }
//   }, [validCoordinates]);

//   useEffect(() => {
//     document.body.style.overflow = isFullScreen ? "hidden" : "auto";
//     return () => (document.body.style.overflow = "auto");
//   }, [isFullScreen]);

//   /* -------------------- handlers -------------------- */

//   const handleMapClick = (e) => {
//     if (!e.latLng) return;

//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();

//     setLatInput(lat.toFixed(7));
//     setLngInput(lng.toFixed(7));
//     setIsModified(true);
//   };

//   const handleMarkerDragEnd = (e) => {
//     if (!e.latLng) return;

//     setLatInput(e.latLng.lat().toFixed(7));
//     setLngInput(e.latLng.lng().toFixed(7));
//     setIsModified(true);
//   };

//   const handlePaste = async () => {
//     try {
//       const text = await navigator.clipboard.readText();
//       const parts = text.split(/,\s*/);
//       if (parts.length === 2) {
//         setLatInput(parts[0]);
//         setLngInput(parts[1]);
//         setIsModified(true);
//       }
//     } catch (err) {
//       console.error("Clipboard read failed", err);
//     }
//   };

//   const handleClear = () => {
//     setLatInput("");
//     setLngInput("");
//     setIsModified(true);
//   };

//   const handleReset = () => {
//     if (listing?.latitude && listing?.longitude) {
//       setLatInput(String(listing.latitude));
//       setLngInput(String(listing.longitude));
//     } else {
//       setLatInput("");
//       setLngInput("");
//     }
//     setIsModified(false);
//   };

//   const handleSave = () => {
//     onSave(listing, {
//       latitude: hasValidCoordinates ? parsedLat : null,
//       longitude: hasValidCoordinates ? parsedLng : null,
//     });
//     onClose();
//   };

//   /* -------------------- render helpers -------------------- */

//   const renderInputs = () => (
//     <div className="flex flex-col xl:flex-row gap-4 items-end w-full">
//       <div className="flex flex-col xl:flex-row gap-4 w-full">
//         <div className="flex-1 grid gap-1.5">
//           <Label>Latitude</Label>
//           <Input
//             value={latInput}
//             onChange={(e) => {
//               setLatInput(e.target.value);
//               setIsModified(true);
//             }}
//             placeholder="e.g. 12.155256"
//           />
//         </div>
//         <div className="flex-1 grid gap-1.5">
//           <Label>Longitude</Label>
//           <Input
//             value={lngInput}
//             onChange={(e) => {
//               setLngInput(e.target.value);
//               setIsModified(true);
//             }}
//             placeholder="e.g. -68.267889"
//           />
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <Button variant="outline" onClick={handlePaste}>
//           Paste
//         </Button>
//         <Button variant="outline" onClick={handleReset} disabled={!isModified}>
//           <RefreshCcw className="w-4 h-4 mr-2" />
//           Reset
//         </Button>
//         <Button
//           variant="destructive"
//           onClick={handleClear}
//           disabled={!latInput && !lngInput}
//         >
//           <Trash2 className="w-4 h-4 mr-2" />
//           Clear
//         </Button>
//       </div>
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div
//         className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       <div
//         className={cn(
//           "relative bg-card rounded-2xl shadow-xl flex flex-col transition-all",
//           isFullScreen
//             ? "fixed inset-0 rounded-none"
//             : "w-full max-w-5xl h-[90vh] p-6",
//         )}
//       >
//         {!isFullScreen && (
//           <div className="flex justify-between items-center pb-4">
//             <h2 className="text-xl font-bold">
//               Edit Coordinates – {listing?.address}
//             </h2>
//             <Button variant="ghost" size="icon" onClick={onClose}>
//               <X />
//             </Button>
//           </div>
//         )}

//         {!isFullScreen && renderInputs()}

//         <div className="relative flex-1 mt-4 rounded-xl overflow-hidden">
//           <GoogleMap
//             mapContainerStyle={mapContainerStyle}
//             center={validCoordinates ?? DEFAULT_CENTER}
//             zoom={validCoordinates ? 18 : 14}
//             options={mapOptions}
//             onLoad={(map) => (mapRef.current = map)}
//             onUnmount={() => (mapRef.current = null)}
//             onClick={handleMapClick}
//           >
//             {validCoordinates && (
//               <MarkerF
//                 position={validCoordinates}
//                 draggable
//                 onDragEnd={handleMarkerDragEnd}
//               />
//             )}

//             <div className="absolute top-4 right-4 z-50">
//               <Button
//                 size="icon"
//                 variant="secondary"
//                 onClick={() => setIsFullScreen((v) => !v)}
//               >
//                 {isFullScreen ? <Minimize2 /> : <Maximize2 />}
//               </Button>
//             </div>

//             {isFullScreen && (
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50">
//                 <div className="bg-background/95 p-4 rounded-xl shadow-xl">
//                   {renderInputs()}
//                 </div>
//               </div>
//             )}
//           </GoogleMap>
//         </div>

//         {!isFullScreen && (
//           <div className="pt-4 flex justify-end gap-4">
//             <Button variant="ghost" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave} disabled={!isModified}>
//               Save Changes
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useRef, useMemo } from "react";
import { X, RefreshCcw, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = { lat: 12.155256231290371, lng: -68.26788999190961 };

const mapOptions = {
  mapTypeId: "hybrid",
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  streetViewControl: false,
  mapTypeControl: false,
};

/* -------------------- validation helpers -------------------- */

// Allows numbers, optional minus, optional decimal
const NUMBER_REGEX = /^-?\d*(\.\d*)?$/;

const parseNumber = (value) => {
  if (!NUMBER_REGEX.test(value)) return null;
  if (value === "" || value === "-" || value === "." || value === "-.") {
    return null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const validateLat = (value) => {
  const n = parseNumber(value);
  if (n === null) return "Invalid number";
  if (n < -90 || n > 90) return "Latitude must be between -90 and 90";
  return null;
};

const validateLng = (value) => {
  const n = parseNumber(value);
  if (n === null) return "Invalid number";
  if (n < -180 || n > 180) return "Longitude must be between -180 and 180";
  return null;
};

export function CoordinatesMapModal({ isOpen, onClose, listing, onSave }) {
  const mapRef = useRef(null);

  /** input state */
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");

  /** ui state */
  const [isModified, setIsModified] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  /** validation */
  const latError = latInput ? validateLat(latInput) : null;
  const lngError = lngInput ? validateLng(lngInput) : null;

  const isValid = !latError && !lngError && latInput && lngInput;

  /** derived valid coords */
  const validCoordinates = useMemo(() => {
    if (!isValid) return null;
    return {
      lat: Number(latInput),
      lng: Number(lngInput),
    };
  }, [isValid, latInput, lngInput]);

  /* -------------------- effects -------------------- */

  useEffect(() => {
    if (!isOpen) return;

    if (listing?.latitude && listing?.longitude) {
      setLatInput(String(listing.latitude));
      setLngInput(String(listing.longitude));
    } else {
      setLatInput("");
      setLngInput("");
    }
    setIsModified(false);
  }, [isOpen, listing]);

  useEffect(() => {
    if (mapRef.current && validCoordinates) {
      mapRef.current.panTo(validCoordinates);
      mapRef.current.setZoom(18);
    }
  }, [validCoordinates]);

  useEffect(() => {
    document.body.style.overflow = isFullScreen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isFullScreen]);

  /* -------------------- handlers -------------------- */

  const handleMapClick = (e) => {
    if (!e.latLng) return;
    setLatInput(e.latLng.lat().toFixed(7));
    setLngInput(e.latLng.lng().toFixed(7));
    setIsModified(true);
  };

  const handleMarkerDragEnd = (e) => {
    if (!e.latLng) return;
    setLatInput(e.latLng.lat().toFixed(7));
    setLngInput(e.latLng.lng().toFixed(7));
    setIsModified(true);
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    const parts = text.split(/,\s*/);
    if (parts.length === 2) {
      setLatInput(parts[0]);
      setLngInput(parts[1]);
      setIsModified(true);
    }
  };

    const handleReset = () => {
    if (listing?.latitude && listing?.longitude) {
      setLatInput(String(listing.latitude));
      setLngInput(String(listing.longitude));
    } else {
      setLatInput("");
      setLngInput("");
    }
    setIsModified(false);
  };

  const handleClear = () => {
    setLatInput("");
    setLngInput("");
    setIsModified(true);
  };

  const handleSave = () => {
    onSave(listing, {
      latitude: isValid ? Number(latInput) : null,
      longitude: isValid ? Number(lngInput) : null,
    });
    onClose();
  };

  /* -------------------- render -------------------- */

  const renderInputs = () => (
    <div className="flex flex-col xl:flex-row gap-4 w-full">
      <div className="flex-1">
        <Label>Latitude</Label>
        <Input
          value={latInput}
          onChange={(e) => {
            if (NUMBER_REGEX.test(e.target.value)) {
              setLatInput(e.target.value);
              setIsModified(true);
            }
          }}
          className={cn(latError && "border-red-500")}
          placeholder="-90 → 90"
        />
        {latError && <p className="text-xs text-red-500 mt-1">{latError}</p>}
      </div>

      <div className="flex-1">
        <Label>Longitude</Label>
        <Input
          value={lngInput}
          onChange={(e) => {
            if (NUMBER_REGEX.test(e.target.value)) {
              setLngInput(e.target.value);
              setIsModified(true);
            }
          }}
          className={cn(lngError && "border-red-500")}
          placeholder="-180 → 180"
        />
        {lngError && <p className="text-xs text-red-500 mt-1">{lngError}</p>}
      </div>

      <div className="flex gap-2 items-end">
        <Button variant="outline" onClick={handleReset} disabled={!isModified}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          variant="destructive"
          onClick={handleClear}
          disabled={!latInput && !lngInput}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={cn(
          "relative bg-card rounded-2xl shadow-xl flex flex-col",
          isFullScreen ? "fixed inset-0" : "w-full max-w-5xl h-[90vh] p-6",
        )}
      >
        {!isFullScreen && (
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">
              Edit Coordinates – {listing?.address}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        )}

        {!isFullScreen && renderInputs()}

        <div className="flex-1 mt-4 rounded-xl overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={validCoordinates ?? DEFAULT_CENTER}
            zoom={validCoordinates ? 18 : 14}
            options={mapOptions}
            onLoad={(map) => (mapRef.current = map)}
            onClick={handleMapClick}
          >
            {validCoordinates && (
              <MarkerF
                position={validCoordinates}
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            )}

            <div className="absolute top-4 right-4 z-50">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setIsFullScreen((v) => !v)}
              >
                {isFullScreen ? <Minimize2 /> : <Maximize2 />}
              </Button>
            </div>
          </GoogleMap>
        </div>

        {!isFullScreen && (
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
