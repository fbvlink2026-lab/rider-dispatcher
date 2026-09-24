// ==================================================
// HABAL-HABAL RATE CALCULATOR v11.0 — logic.js
// Ginawa ni martodosko | Setyembre 2026
// ==================================================

// ========== KONFIGURASYON ==========
const DEV_KEY = "martodosko110";
const DEFAULT_MAINTENANCE_PER_DAY = 20.00;
const DEFAULT_RENT_PER_DAY = 0.00;
const DEFAULT_WORK_HOURS = 8.0;

let MAINTENANCE_PER_DAY = DEFAULT_MAINTENANCE_PER_DAY;
let RENT_PER_DAY = DEFAULT_RENT_PER_DAY;
let WORK_HOURS_PER_DAY = DEFAULT_WORK_HOURS;
let DEFAULT_VEHICLE = "motor";
let DAILY_GOAL = 0.00;
let GAS_PRICE_GLOBAL = null;
let LAST_FARE = {};
let LAST_TRIP_TYPE = "round";
let CUSTOM_VEHICLE = null;
let ADV_UNLOCKED = false;

const VEHICLES = {
    tricycle:   { name: "Trisikel",   kmPerL: 22.0, speedKmh: 25, refLow: 80,  refHigh: 150 },
    motor:      { name: "Motor",      kmPerL: 20.0, speedKmh: 35, refLow: 100, refHigh: 180 },
    jeepney:    { name: "Jeepney",    kmPerL:  8.0, speedKmh: 30, refLow: 150, refHigh: 250 },
    car:        { name: "Kotse",      kmPerL: 12.0, speedKmh: 45, refLow: 180, refHigh: 300 },
    van:        { name: "Van",        kmPerL:  9.0, speedKmh: 40, refLow: 250, refHigh: 450 }
};

let map = null;
let isGPSMode = false;
let isTracking = false;
let watchID = null;
let lastLat = null, lastLng = null;
let totalGPSDistance = 0;
let gpsPoints = [];
let gpsPolyline = null;
let routes = [
    { id:1, name:"Lopez → Calauag", start:"Lopez, Quezon", end:"Calauag, Quezon", km:12.0 },
    { id:2, name:"Calauag Bayan → Sumilang BLISS", start:"Calauag, Quezon", end:"Sumilang, Calauag, Quezon", km:5.5 },
    { id:3, name:"Lopez → Gumaca", start:"Lopez, Quezon", end:"Gumaca, Quezon", km:18.0 },
    { id:4, name:"Calauag → Tagkawayan", start:"Calauag, Quezon", end:"Tagkawayan, Quezon", km:32.0 },
    { id:5, name:"Calauag → Quezon Port", start:"Calauag, Quezon", end:"Quezon Port, Calauag", km:8.0 }
];
let tripRecords = [];
let editingId = null, selectedRoute = null, distKm = null, totalHours = null;
let routePoly = null, markerA = null, markerB = null;
window._lastTrip = null;

// ========== SIDE MENU ==========
function toggleSideMenu() {
    const menu = document.getElementById('sdMenu');
    const overlay = document.getElementById('sdOverlay');
    menu.classList.toggle('open');
    overlay.classList.toggle('open');
}
function closeSideMenu() {
    document.getElementById('sdMenu').classList.remove('open');
    document.getElementById('sdOverlay').classList.remove('open');
}
function goHome() {
    if (watchID) { navigator.geolocation.clearWatch(watchID); watchID = null; }
    isTracking = false;
    document.getElementById('calc-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
    selectedRoute = null;
    distKm = null;
    totalHours = null;
    isGPSMode = false;
}
function goBack() {
    goHome();
}

// ========== PAGKARGA ==========
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('advUnlocked') === 'true') {
        ADV_UNLOCKED = true;
        const panel = document.getElementById('advanced-panel');
        const unlocked = document.getElementById('advUnlocked');
        const lockItem = document.getElementById('advLockItem');
        if (panel) panel.classList.add('unlocked');
        if (unlocked) unlocked.classList.remove('hidden');
        if (lockItem) lockItem.style.display = 'none';
    }
    loadSettings(); loadTripRecords(); loadSavedTripData();
    const targetPerHour = document.getElementById("target-per-hour");
    const workHours = document.getElementById("work-hours");
    const gasPrice = document.getElementById("gas-price");
    if (targetPerHour) targetPerHour.addEventListener("input", updateTargetTotal);
    if (workHours) workHours.addEventListener("input", updateCostPerHour);
    if (gasPrice) gasPrice.addEventListener("input", saveGasPriceToMemory);
    renderRouteList();
    updateGrandTotalDisplay();
});

function getActiveVehicle() {
    if (DEFAULT_VEHICLE === "custom" && CUSTOM_VEHICLE) return CUSTOM_VEHICLE;
    return VEHICLES[DEFAULT_VEHICLE] || VEHICLES.motor;
}

function toggleCustomFields() {
    const sel = document.getElementById("def-veh");
    if (!sel) return;
    const fields = document.getElementById("custom-veh-fields");
    if (sel.value === "custom" && fields) fields.classList.add("active");
    else if (fields) fields.classList.remove("active");
}

function loadSettings() {
    const savedVeh = localStorage.getItem("defVehicle");
    const savedMaint = localStorage.getItem("maintPerDay");
    const savedRent = localStorage.getItem("rentPerDay");
    const savedWorkHrs = localStorage.getItem("workHoursPerDay");
    const savedCustom = localStorage.getItem("customVehicle");
    const savedGasGlobal = localStorage.getItem("gasPriceGlobal");
    
    DEFAULT_VEHICLE = savedVeh || "motor";
    MAINTENANCE_PER_DAY = savedMaint !== null ? parseFloat(savedMaint) : DEFAULT_MAINTENANCE_PER_DAY;
    RENT_PER_DAY = savedRent !== null ? parseFloat(savedRent) : DEFAULT_RENT_PER_DAY;
    WORK_HOURS_PER_DAY = savedWorkHrs !== null ? parseFloat(savedWorkHrs) : DEFAULT_WORK_HOURS;
    if (savedGasGlobal) GAS_PRICE_GLOBAL = parseFloat(savedGasGlobal);
    if (savedCustom) {
        CUSTOM_VEHICLE = JSON.parse(savedCustom);
        const cName = document.getElementById("custom-name");
        const cKmPerLit = document.getElementById("custom-kmperlit");
        const cSpeed = document.getElementById("custom-speed");
        const cRefLow = document.getElementById("custom-reflow");
        const cRefHigh = document.getElementById("custom-refhigh");
        if (cName) cName.value = CUSTOM_VEHICLE.name || "";
        if (cKmPerLit) cKmPerLit.value = CUSTOM_VEHICLE.kmPerL || "";
        if (cSpeed) cSpeed.value = CUSTOM_VEHICLE.speedKmh || "";
        if (cRefLow) cRefLow.value = CUSTOM_VEHICLE.refLow || "";
        if (cRefHigh) cRefHigh.value = CUSTOM_VEHICLE.refHigh || "";
    }
    updateSettingsDisplay();
}

function updateSettingsDisplay() {
    const v = getActiveVehicle();
    const showVehicle = document.getElementById("show-vehicle");
    const showMaint = document.getElementById("show-maint");
    const showRent = document.getElementById("show-rent");
    const showGasGlobal = document.getElementById("show-gas-global");
    const showWorkHours = document.getElementById("show-work-hours");
    const showDailyGoal = document.getElementById("show-daily-goal");
    const defVeh = document.getElementById("def-veh");
    const maintPerDay = document.getElementById("maint-per-day");
    const rentPerDay = document.getElementById("rent-per-day");
    const workHoursSetting = document.getElementById("work-hours-setting");
    const gasPriceGlobal = document.getElementById("gas-price-global");
    const workHours = document.getElementById("work-hours");
    
    if (showVehicle) showVehicle.textContent = v.name;
    if (showMaint) showMaint.textContent = MAINTENANCE_PER_DAY.toFixed(2);
    if (showRent) showRent.textContent = RENT_PER_DAY.toFixed(2);
    if (showGasGlobal) showGasGlobal.textContent = GAS_PRICE_GLOBAL ? GAS_PRICE_GLOBAL.toFixed(2) : "—";
    if (showWorkHours) showWorkHours.textContent = WORK_HOURS_PER_DAY.toFixed(1);
    if (showDailyGoal) showDailyGoal.textContent = DAILY_GOAL.toFixed(2);
    if (defVeh) defVeh.value = DEFAULT_VEHICLE;
    toggleCustomFields();
    if (maintPerDay) maintPerDay.value = MAINTENANCE_PER_DAY;
    if (rentPerDay) rentPerDay.value = RENT_PER_DAY;
    if (workHoursSetting) workHoursSetting.value = WORK_HOURS_PER_DAY;
    if (gasPriceGlobal) gasPriceGlobal.value = GAS_PRICE_GLOBAL || "";
    if (workHours) workHours.value = WORK_HOURS_PER_DAY;
    updateCostPerHour();
}

function updateCostPerHour() {
    const workHrsEl = document.getElementById("work-hours");
    const workHrs = parseFloat(workHrsEl?.value) || WORK_HOURS_PER_DAY;
    const costPerHr = (MAINTENANCE_PER_DAY + RENT_PER_DAY) / workHrs;
    const costPerHourEl = document.getElementById("cost-per-hour");
    if (costPerHourEl) costPerHourEl.textContent = costPerHr.toFixed(2);
    updateTargetTotal();
}

function updateTargetTotal() {
    const targetPerHourEl = document.getElementById("target-per-hour");
    const perHr = parseFloat(targetPerHourEl?.value) || 0;
    const workHrsEl = document.getElementById("work-hours");
    const workHrs = parseFloat(workHrsEl?.value) || WORK_HOURS_PER_DAY;
    DAILY_GOAL = perHr * workHrs;
    const targetTotalEl = document.getElementById("target-total");
    const showDailyGoalEl = document.getElementById("show-daily-goal");
    if (targetTotalEl) targetTotalEl.textContent = DAILY_GOAL.toFixed(2);
    if (showDailyGoalEl) showDailyGoalEl.textContent = DAILY_GOAL.toFixed(2);
    updateProgressBar();
}

function loadSavedTripData() {
    const savedType = localStorage.getItem("lastTripType");
    if (savedType) LAST_TRIP_TYPE = savedType;
    const savedFares = localStorage.getItem("lastFareByRoute");
    if (savedFares) LAST_FARE = JSON.parse(savedFares);
    const savedGas = localStorage.getItem("lastGasPrice");
    if (savedGas) GAS_PRICE_GLOBAL = parseFloat(savedGas);
}

function saveGasPriceToMemory() {
    const el = document.getElementById("gas-price");
    if (!el) return;
    const val = parseFloat(el.value);
    if (!isNaN(val) && val > 0) {
        GAS_PRICE_GLOBAL = val;
        localStorage.setItem("lastGasPrice", val);
        localStorage.setItem("gasPriceGlobal", val);
        const note = document.getElementById("gas-saved-note");
        if (note) note.classList.remove("hidden");
    }
}

function setTripType(type) {
    LAST_TRIP_TYPE = type;
    localStorage.setItem("lastTripType", type);
    document.getElementById("btn-oneway")?.classList.toggle("active", type === "one");
    document.getElementById("btn-roundtrip")?.classList.toggle("active", type === "round");
    updateDistanceLabels();
    if (distKm) recalcConsumption();
}

function updateDistanceLabels() {
    const isOneWay = LAST_TRIP_TYPE === "one";
    const kmLabel = document.getElementById("km-label");
    const literLabel = document.getElementById("liter-label");
    if (kmLabel) kmLabel.textContent = isOneWay ? "/daan (1-Way)" : "/daan × 2";
    if (literLabel) literLabel.textContent = isOneWay ? "/daan" : "/paikot";
}

function recalcConsumption() {
    const v = getActiveVehicle();
    const kmUsed = LAST_TRIP_TYPE === "one" ? distKm : distKm * 2;
    const liter = kmUsed / v.kmPerL;
    const hrs = kmUsed / v.speedKmh;
    const autoLiter = document.getElementById("auto-liter");
    const autoHours = document.getElementById("auto-hours");
    if (autoLiter) autoLiter.textContent = liter.toFixed(2);
    if (autoHours) autoHours.textContent = hrs.toFixed(2);
    totalHours = hrs;
}

function loadTripRecords() {
    const saved = localStorage.getItem("tripRecords");
    if (saved) tripRecords = JSON.parse(saved);
}

function saveTripRecords() {
    localStorage.setItem("tripRecords", JSON.stringify(tripRecords));
}

function addTripRecord(routeName, fare, totalCost, netIncome, tripType = "round") {
    tripRecords.unshift({
        id: Date.now(),
        time: new Date().toLocaleString("tl-PH"),
        routeName, fare, totalCost, netIncome, tripType
    });
    saveTripRecords();
    updateGrandTotalDisplay();
}

function deleteSingleTrip(id) {
    if (!confirm("Burahin ba talaga?")) return;
    tripRecords = tripRecords.filter(t => t.id !== id);
    saveTripRecords();
    updateGrandTotalDisplay();
}

function clearAllTrips() {
    if (!confirm("Burahin ba talaga ang LAHAT?")) return;
    tripRecords = [];
    saveTripRecords();
    updateGrandTotalDisplay();
}

function updateProgressBar() {
    const totalNet = tripRecords.reduce((sum, t) => sum + t.netIncome, 0);
    const progressCard = document.getElementById("progress-card");
    if (DAILY_GOAL <= 0 || tripRecords.length === 0) {
        if (progressCard) progressCard.style.display = "none";
        return;
    }
    if (progressCard) progressCard.style.display = "block";
    const percent = Math.min(100, Math.max(0, (totalNet / DAILY_GOAL) * 100));
    const remaining = Math.max(0, DAILY_GOAL - totalNet);
    
    const progressPercent = document.getElementById("progress-percent");
    const progressEarned = document.getElementById("progress-earned");
    const progressRemaining = document.getElementById("progress-remaining");
    const progressBar = document.getElementById("progress-bar");
    const progressStatus = document.getElementById("progress-status");
    
    if (progressPercent) progressPercent.textContent = percent.toFixed(1) + "%";
    if (progressEarned) progressEarned.textContent = totalNet.toFixed(2);
    if (progressRemaining) progressRemaining.textContent = remaining.toFixed(2);
    if (progressBar) {
        progressBar.style.width = percent + "%";
        progressBar.className = "progress-bar-fill";
        if (percent >= 100) {
            progressBar.classList.add("progress-complete");
            if (progressStatus) {
                progressStatus.style.background = "#E8F5E9";
                progressStatus.style.color = "#2E7D32";
                progressStatus.innerHTML = "🎉 NAAABOT NA ANG LAYUNIN SA KITA!";
            }
        } else if (percent >= 50) {
            progressBar.classList.add("progress-orange");
            if (progressStatus) {
                progressStatus.style.background = "#FFF3E0";
                progressStatus.style.color = "#E65100";
                progressStatus.innerHTML = `⏳ Kalahati na — kulang pa ng ₱${remaining.toFixed(2)}`;
            }
        } else {
            progressBar.classList.add("progress-red");
            if (progressStatus) {
                progressStatus.style.background = "#FFEBEE";
                progressStatus.style.color = "#C62828";
                progressStatus.innerHTML = `📉 Nagsisimula pa — kulang pa ng ₱${remaining.toFixed(2)}`;
            }
        }
    }
}

function updateGrandTotalDisplay() {
    const grandTotalCard = document.getElementById("grand-total-card");
    const tripSumList = document.getElementById("trip-sum-list");
    const grandFare = document.getElementById("grand-fare");
    const grandCost = document.getElementById("grand-cost");
    const grandNet = document.getElementById("grand-net");
    
    if (tripRecords.length === 0) {
        if (grandTotalCard) grandTotalCard.style.display = "none";
        updateProgressBar();
        return;
    }
    if (grandTotalCard) grandTotalCard.style.display = "block";
    
    let totalFare = 0, totalCost = 0, totalNet = 0;
    tripRecords.forEach(t => {
        totalFare += t.fare;
        totalCost += t.totalCost;
        totalNet += t.netIncome;
    });
    
    if (grandFare) grandFare.textContent = totalFare.toFixed(2);
    if (grandCost) grandCost.textContent = totalCost.toFixed(2);
    if (grandNet) grandNet.textContent = totalNet.toFixed(2);
    
    if (tripSumList) {
        tripSumList.innerHTML = tripRecords.map(t => {
            let tag = "";
            if (DAILY_GOAL > 0) {
                const idx = tripRecords.indexOf(t);
                const running = tripRecords.slice(0, idx+1).reduce((s,x)=>s+x.netIncome,0);
                const pct = (running/DAILY_GOAL)*100;
                if (t.netIncome < 0) {
                    tag = `<span class="trip-progress-tag tag-behind">➖ Nakabawas</span>`;
                } else if (pct >= 100) {
                    tag = `<span class="trip-progress-tag tag-earned">✅ Nasa Layunin!</span>`;
                } else {
                    tag = `<span class="trip-progress-tag tag-needed">+${((t.netIncome/DAILY_GOAL)*100).toFixed(1)}%</span>`;
                }
            }
            const typeLabel = t.tripType === "one" ? "➡️ 1-Way" : "🔁 2-Way";
            return `<div class="trip-record ${t.netIncome<0?'negative':''}">
                <div class="trip-info">
                    <p style="font-size:13px;"><strong>${t.routeName}</strong> ${typeLabel} ${tag}</p>
                    <p style="font-size:11px;color:var(--muted);">${t.time}</p>
                    <p style="font-size:12px;">Singil: ₱${t.fare.toFixed(2)} • Gastos: ₱${t.totalCost.toFixed(2)} • Kita: <strong style="color:${t.netIncome>=0?'var(--ok)':'var(--danger)'}">₱${t.netIncome.toFixed(2)}</strong></p>
                </div>
                <button class="icon-btn btn-del" onclick="deleteSingleTrip(${t.id})">🗑️</button>
            </div>`;
        }).join("");
    }
    updateProgressBar();
}

// ========== GPS ==========
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function initMapIfNeeded() {
    if (!map && typeof L !== 'undefined') {
        map = L.map("map").setView([13.7, 122.7], 9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap"
        }).addTo(map);
    }
}

function openGPSRoute() {
    isGPSMode = true;
    selectedRoute = null;
    distKm = null; totalHours = null; totalGPSDistance = 0; gpsPoints = [];
    lastLat = lastLng = null; isTracking = false;
    
    const menuScreen = document.getElementById("menu-screen");
    const calcScreen = document.getElementById("calc-screen");
    const results = document.getElementById("results");
    const calcRouteName = document.getElementById("calc-route-name");
    const calcRouteAddr = document.getElementById("calc-route-addr");
    const mapNoteText = document.getElementById("map-note-text");
    const calcVehicle = document.getElementById("calc-vehicle");
    const gpsControls = document.getElementById("gps-controls");
    const gpsKmRow = document.getElementById("gps-km-row");
    const gpsStat = document.getElementById("gps-stat");
    const distStat = document.getElementById("dist-stat");
    const gasPrice = document.getElementById("gas-price");
    const gasSavedNote = document.getElementById("gas-saved-note");
    
    if (menuScreen) menuScreen.classList.add("hidden");
    if (calcScreen) calcScreen.classList.remove("hidden");
    if (results) results.classList.add("hidden");
    if (calcRouteName) calcRouteName.textContent = "📍 REALTIME GPS TRACKING";
    if (calcRouteAddr) calcRouteAddr.textContent = "Sundan ang iyong paglalakbay — awtomatikong sinusukat ang distansya";
    if (mapNoteText) mapNoteText.textContent = "📍 GPS — Sinusukat ang tunay na daan";
    
    const v = getActiveVehicle();
    if (calcVehicle) calcVehicle.textContent = `🚗 ${v.name} • ${v.kmPerL} km/L • Bilis: ${v.speedKmh} km/oras`;
    if (gpsControls) gpsControls.classList.remove("hidden");
    if (gpsKmRow) gpsKmRow.classList.add("hidden");
    if (gpsStat) gpsStat.classList.remove("hidden");
    if (distStat) distStat.classList.add("hidden");
    
    if (GAS_PRICE_GLOBAL && gasPrice) {
        gasPrice.value = GAS_PRICE_GLOBAL;
        if (gasSavedNote) gasSavedNote.classList.remove("hidden");
    }
    
    updateDistanceLabels();
    initMapIfNeeded();
    if (map) map.setView([13.7, 122.7], 13);
    updateCostPerHour();
}

function startGPSTracking() {
    if (!navigator.geolocation) {
        alert("❌ Hindi sinusuportahan ng iyong telepono ang GPS!");
        return;
    }
    if (!confirm("Simulan na ang pagsukat? Siguraduhin na naka-ON ang GPS.")) return;
    
    isTracking = true; totalGPSDistance = 0; gpsPoints = []; lastLat = lastLng = null;
    
    const gpsStartBtn = document.getElementById("gps-start-btn");
    const gpsStopBtn = document.getElementById("gps-stop-btn");
    const gpsUseBtn = document.getElementById("gps-use-btn");
    const gpsKmRow = document.getElementById("gps-km-row");
    const indicator = document.getElementById("gps-status-indicator");
    
    if (gpsStartBtn) gpsStartBtn.classList.add("hidden");
    if (gpsStopBtn) gpsStopBtn.classList.remove("hidden");
    if (gpsUseBtn) gpsUseBtn.classList.add("hidden");
    if (gpsKmRow) gpsKmRow.classList.add("hidden");
    if (indicator) {
        indicator.classList.remove("inactive");
        indicator.classList.add("active");
        indicator.innerHTML = "🔸 NAGSU-SUSUKAT...";
    }
    
    if (gpsPolyline && map) map.removeLayer(gpsPolyline);
    
    watchID = navigator.geolocation.watchPosition(
        onGPSPosition,
        onGPSError,
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
}

function onGPSPosition(pos) {
    const lat = pos.coords.latitude, lng = pos.coords.longitude;
    
    if (lastLat !== null && lastLng !== null) {
        const seg = calculateDistance(lastLat, lastLng, lat, lng);
        if (seg > 0.001) {
            totalGPSDistance += seg;
            gpsPoints.push([lat, lng]);
            
            if (gpsPolyline && map) {
                gpsPolyline.setLatLngs(gpsPoints);
            } else if (map && typeof L !== 'undefined') {
                gpsPolyline = L.polyline(gpsPoints, {
                    color: '#6A1B9A', weight: 5, opacity: 0.8
                }).addTo(map);
            }
            
            if (map) map.panTo([lat, lng]);
            const gpsKm = document.getElementById("gps-km");
            const gpsStat = document.getElementById("gps-stat");
            if (gpsKm) gpsKm.textContent = totalGPSDistance.toFixed(2);
            if (gpsStat) gpsStat.innerHTML = `📍 <strong>${totalGPSDistance.toFixed(2)} km</strong> na ang nasusukat`;
        }
    } else {
        gpsPoints.push([lat, lng]);
        if (map) map.setView([lat, lng], 16);
        const gpsStat = document.getElementById("gps-stat");
        if (gpsStat) gpsStat.innerHTML = `📍 Nagsimula sa: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
    lastLat = lat; lastLng = lng;
}

function onGPSError(err) {
    const ind = document.getElementById("gps-status-indicator");
    if (!ind) return;
    ind.classList.remove("active");
    ind.classList.add("inactive");
    let msg = "⚠️ GPS: ";
    if (err.code === 1) msg += "Tinanggihan — payagan ang GPS!";
    else if (err.code === 2) msg += "Hindi makuha — lumabas sa gusali?";
    else msg += "Error " + err.code;
    const gpsStat = document.getElementById("gps-stat");
    if (gpsStat) gpsStat.innerHTML = msg;
}

function stopGPSTracking() {
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
    isTracking = false;
    
    const ind = document.getElementById("gps-status-indicator");
    if (ind) {
        ind.classList.remove("active");
        ind.classList.add("inactive");
        ind.innerHTML = "✅ TUMIGIL NA";
    }
    
    const gpsStartBtn = document.getElementById("gps-start-btn");
    const gpsStopBtn = document.getElementById("gps-stop-btn");
    const gpsUseBtn = document.getElementById("gps-use-btn");
    const gpsKmRow = document.getElementById("gps-km-row");
    const gpsStat = document.getElementById("gps-stat");
    
    if (gpsStartBtn) gpsStartBtn.classList.remove("hidden");
    if (gpsStopBtn) gpsStopBtn.classList.add("hidden");
    
    if (totalGPSDistance > 0.01) {
        if (gpsUseBtn) gpsUseBtn.classList.remove("hidden");
        if (gpsKmRow) gpsKmRow.classList.remove("hidden");
        if (gpsStat) gpsStat.innerHTML = `✅ <strong>${totalGPSDistance.toFixed(2)} km</strong> — handa nang gamitin`;
    } else {
        if (gpsStat) gpsStat.innerHTML = "⚠️ Napakaikli — lumipat nang kaunti at subukan muli.";
    }
}

function useGPSDistance() {
    if (totalGPSDistance < 0.01) {
        alert("Wala pang nasukat!");
        return;
    }
    distKm = totalGPSDistance;
    const useKm = document.getElementById("use-km");
    const gpsStat = document.getElementById("gps-stat");
    if (useKm) useKm.textContent = distKm.toFixed(2);
    if (gpsStat) gpsStat.innerHTML = `✅ Ginagamit: <strong>${distKm.toFixed(2)} km</strong> (GPS)`;
    recalcConsumption();
    alert(`✅ Nakatakda na!\nDistansya: ${distKm.toFixed(2)} km\nPumili na ng uri ng biyahe at ilagay ang pamasahe.`);
}

// ========== SHARE ==========
function shareFB() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}
function shareMessenger() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/dialog/send?link=${url}&app_id=`, '_blank');
}
function shareWA() {
    const text = encodeURIComponent('🚗 Tingnan mo itong Habal-Habal Rate Calculator — ginawa ni martodosko!');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('✅ Nakopya na ang link! Ipadala mo na sa iba.');
    }).catch(() => alert('❌ Hindi makopya — subukan muli.'));
}
function shareApp() { shareWA(); }

// ========== KEY / ADVANCED ==========
function openKeyModal() {
    const modal = document.getElementById('key-modal');
    if (modal) modal.style.display = 'flex';
    const input = document.getElementById('key-input');
    if (input) input.value = '';
}
function closeKeyModal() {
    const modal = document.getElementById('key-modal');
    if (modal) modal.style.display = 'none';
}
function checkKey() {
    const input = document.getElementById('key-input');
    const val = input?.value.trim() || '';
    if (val === DEV_KEY) {
        ADV_UNLOCKED = true;
        closeKeyModal();
        const panel = document.getElementById('advanced-panel');
        const unlocked = document.getElementById('advUnlocked');
        const lockItem = document.getElementById('advLockItem');
        if (panel) panel.classList.add('unlocked');
        if (unlocked) unlocked.classList.remove('hidden');
        if (lockItem) lockItem.style.display = 'none';
        localStorage.setItem('advUnlocked', 'true');
        alert('✅ Nakatanggap na ng pahintulot! Nakabukas na ang lahat ng tampok.');
    } else {
        alert('❌ Mali ang susi — subukan muli o humingi ng tamang susi.');
    }
}
function openImportExport() {
    if (!ADV_UNLOCKED) {
        openKeyModal();
        return;
    }
    alert('💾 I-Export: Ise-save ang lahat ng ruta at pagtatakda bilang file\n📥 I-Import: Ibabalik ang nakaraang nakasave na file');
}

// ========== IMPORT / EXPORT ==========
function exportData() {
    if (!ADV_UNLOCKED) return;
    const data = {
        version: '11.0',
        author: 'martodosko',
        exportedAt: new Date().toISOString(),
        settings: {
            DEFAULT_VEHICLE,
            MAINTENANCE_PER_DAY,
            RENT_PER_DAY,
            WORK_HOURS_PER_DAY,
            GAS_PRICE_GLOBAL,
            CUSTOM_VEHICLE
        },
        routes,
        tripRecords,
        LAST_FARE,
        LAST_TRIP_TYPE
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rate-calc-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Na-export na! I-save ang file na ito sa ligtas na lugar.');
}
function importData(event) {
    if (!ADV_UNLOCKED) return;
    const file = event.target.files[0];
    if (!file) return;
    if (!confirm('⚠️ Papalitan nito ang kasalukuyang lahat ng ruta at talaan. Sigurado ka ba?')) {
        event.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.routes || !data.settings) throw new Error('Hindi tamang format');
            DEFAULT_VEHICLE = data.settings.DEFAULT_VEHICLE || 'motor';
            MAINTENANCE_PER_DAY = data.settings.MAINTENANCE_PER_DAY || 20;
            RENT_PER_DAY = data.settings.RENT_PER_DAY || 0;
            WORK_HOURS_PER_DAY = data.settings.WORK_HOURS_PER_DAY || 8;
            GAS_PRICE_GLOBAL = data.settings.GAS_PRICE_GLOBAL;
            CUSTOM_VEHICLE = data.settings.CUSTOM_VEHICLE;
            routes = data.routes || [];
            tripRecords = data.tripRecords || [];
            LAST_FARE = data.LAST_FARE || {};
            LAST_TRIP_TYPE = data.LAST_TRIP_TYPE || 'round';
            localStorage.setItem('defVehicle', DEFAULT_VEHICLE);
            localStorage.setItem('maintPerDay', MAINTENANCE_PER_DAY);
            localStorage.setItem('rentPerDay', RENT_PER_DAY);
            localStorage.setItem('workHoursPerDay', WORK_HOURS_PER_DAY);
            if (GAS_PRICE_GLOBAL) localStorage.setItem('gasPriceGlobal', GAS_PRICE_GLOBAL);
            if (CUSTOM_VEHICLE) localStorage.setItem('customVehicle', JSON.stringify(CUSTOM_VEHICLE));
            localStorage.setItem('tripRecords', JSON.stringify(tripRecords));
            localStorage.setItem('lastFareByRoute', JSON.stringify(LAST_FARE));
            localStorage.setItem('lastTripType', LAST_TRIP_TYPE);
            updateSettingsDisplay();
            renderRouteList();
            updateGrandTotalDisplay();
            alert('✅ Na-import na! Handang-handa na muli.');
        } catch (err) {
            alert('❌ Hindi mabasa ang file — tiyak na tama ang napiling file.');
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}

// ========== CONTACT US ==========
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.style.display = 'flex';
}
function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.style.display = 'none';
}
function sendContactMsg() {
    const name = document.getElementById('msg-name')?.value.trim() || 'Hindi nagpangalan';
    const text = document.getElementById('msg-text')?.value.trim();
    if (!text) { alert('Isulat muna ang mensahe!'); return; }
    const mailto = `mailto:?subject=Rate%20Calculator%20Mensyahe%20mula%20${encodeURIComponent(name)}&body=${encodeURIComponent(text)}%0A%0A---%0AGaling%20sa%20Habal-Habal%20Rate%20Calculator%20v11.0%20ni%20martodosko`;
    window.location.href = mailto;
    alert('✅ Bubukas ang iyong email app — ipadala mo na lang!');
    closeContactModal();
}

// ========== SETTINGS MODAL ==========
function openSettings() {
    updateSettingsDisplay();
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'flex';
}
function closeSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'none';
}
function saveSettings() {
    const veh = document.getElementById("def-veh")?.value;
    const maintVal = parseFloat(document.getElementById("maint-per-day")?.value);
    const rentVal = parseFloat(document.getElementById("rent-per-day")?.value);
    const workHrsVal = parseFloat(document.getElementById("work-hours-setting")?.value);
    const gasVal = parseFloat(document.getElementById("gas-price-global")?.value);
    
    if (isNaN(maintVal) || maintVal < 0 || isNaN(rentVal) || rentVal < 0 || isNaN(workHrsVal) || workHrsVal <= 0) {
        alert("Ilagay ang tamang halaga!");
        return;
    }
    
    if (veh === "custom") {
        const cName = document.getElementById("custom-name")?.value.trim() || "Aking Sasakyan";
        const cKmPerL = parseFloat(document.getElementById("custom-kmperlit")?.value);
        const cSpeed = parseFloat(document.getElementById("custom-speed")?.value);
        const cRefLow = parseFloat(document.getElementById("custom-reflow")?.value);
        const cRefHigh = parseFloat(document.getElementById("custom-refhigh")?.value);
        if (isNaN(cKmPerL) || cKmPerL <= 0 || isNaN(cSpeed) || cSpeed <= 0 || isNaN(cRefLow) || cRefLow <= 0 || isNaN(cRefHigh) || cRefHigh < cRefLow) {
            alert("Punan nang tama ang lahat ng patlang!");
            return;
        }
        CUSTOM_VEHICLE = { name: cName, kmPerL: cKmPerL, speedKmh: cSpeed, refLow: cRefLow, refHigh: cRefHigh };
        localStorage.setItem("customVehicle", JSON.stringify(CUSTOM_VEHICLE));
    }
    
    DEFAULT_VEHICLE = veh;
    MAINTENANCE_PER_DAY = maintVal;
    RENT_PER_DAY = rentVal;
    WORK_HOURS_PER_DAY = workHrsVal;
    
    if (!isNaN(gasVal) && gasVal > 0) {
        GAS_PRICE_GLOBAL = gasVal;
        localStorage.setItem("gasPriceGlobal", gasVal);
        localStorage.setItem("lastGasPrice", gasVal);
    }
    
    localStorage.setItem("defVehicle", veh);
    localStorage.setItem("maintPerDay", maintVal);
    localStorage.setItem("rentPerDay", rentVal);
    localStorage.setItem("workHoursPerDay", workHrsVal);
    
    document.getElementById("work-hours").value = WORK_HOURS_PER_DAY;
    updateSettingsDisplay();
    closeSettings();
}

// ========== ROUTES / GEOCODING / OSRM ==========
async function geocode(pangalan) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pangalan)}&format=json&limit=1`;
    try {
        const res = await fetch(url, { headers: { "Accept-Language": "tl,en" } });
        const d = await res.json();
        if (!d.length) return null;
        return { lat: +d[0].lat, lon: +d[0].lon };
    } catch { return null; }
}

async function getRouteOSRM(startName, endName) {
    const a = await geocode(startName);
    const b = await geocode(endName);
    if (!a || !b) return null;
    
    const v = getActiveVehicle();
    const profile = v.speedKmh <= 30 ? "bike" : "car";
    const url = `https://router.project-osrm.org/route/v1/${profile}/${a.lon},${a.lat};${b.lon},${b.lat}?overview=full&geometries=geojson`;
    
    try {
        const res = await fetch(url);
        const d = await res.json();
        if (d.code !== "Ok") return null;
        const r = d.routes[0];
        const kmOneWay = r.distance / 1000;
        const totalSecRound = r.duration * 2 * 1.15;
        const totalHrs = totalSecRound / 3600;
        return {
            a, b,
            kmOneWay: Math.round(kmOneWay * 100) / 100,
            totalHours: Math.round(totalHrs * 100) / 100,
            geometry: r.geometry.coordinates
        };
    } catch { return null; }
}

function showMap(a, b, coords) {
    initMapIfNeeded();
    if (routePoly) map.removeLayer(routePoly);
    if (markerA) map.removeLayer(markerA);
    if (markerB) map.removeLayer(markerB);
    
    const pts = coords.map(p => [p[1], p[0]]);
    routePoly = L.polyline(pts, { color: "#1565C0", weight: 5, opacity: 0.8 }).addTo(map);
    
    markerA = L.marker([a.lat, a.lon], {
        icon: L.divIcon({
            html: `<div style="background:#43A047;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;">A</div>`,
            className: "",
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        })
    }).addTo(map);
    
    markerB = L.marker([b.lat, b.lon], {
        icon: L.divIcon({
            html: `<div style="background:#E53935;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;">B</div>`,
            className: "",
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        })
    }).addTo(map);
    
    map.fitBounds(routePoly.getBounds(), { padding: [20, 20] });
}

async function fetchRoute() {
    const start = document.getElementById("m-start")?.value.trim();
    const end = document.getElementById("m-end")?.value.trim();
    if (!start || !end) { alert("Ilagay ang Simula at Dulo!"); return; }
    
    const btn = document.getElementById("fetch-btn");
    const resultEl = document.getElementById("fetch-result");
    
    if (btn) {
        btn.innerHTML = `<span class="spin"></span> Kinukuha...`;
        btn.disabled = true;
    }
    if (resultEl) resultEl.style.display = "none";
    
    const r = await getRouteOSRM(start, end);
    
    if (!r) {
        if (btn) { btn.innerHTML = "🗺️ Kumuha Tumpak na Ruta"; btn.disabled = false; }
        alert("Hindi makuha ang ruta. Suriin ang pangalan ng lugar.");
        return;
    }
    
    if (document.getElementById("m-km")) document.getElementById("m-km").value = r.kmOneWay.toFixed(2);
    if (resultEl) {
        resultEl.textContent = `✅ Nakuha: ${r.kmOneWay.toFixed(2)} km (isang daan)`;
        resultEl.style.display = "block";
    }
    if (btn) { btn.innerHTML = "🗺️ Kumuha Tumpak na Ruta"; btn.disabled = false; }
}

function openAddModal() {
    isGPSMode = false;
    editingId = null;
    const modal = document.getElementById("add-modal");
    if (document.getElementById("modal-title")) document.getElementById("modal-title").textContent = "➕ Bagong Ruta";
    if (document.getElementById("m-name")) document.getElementById("m-name").value = "";
    if (document.getElementById("m-start")) document.getElementById("m-start").value = "";
    if (document.getElementById("m-end")) document.getElementById("m-end").value = "";
    if (document.getElementById("m-km")) document.getElementById("m-km").value = "";
    if (document.getElementById("fetch-result")) document.getElementById("fetch-result").style.display = "none";
    if (modal) modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("add-modal");
    if (modal) modal.style.display = "none";
    editingId = null;
}

function saveRoute() {
    const name = document.getElementById("m-name")?.value.trim();
    const start = document.getElementById("m-start")?.value.trim();
    const end = document.getElementById("m-end")?.value.trim();
    const km = parseFloat(document.getElementById("m-km")?.value);
    
    if (!name || !start || !end || isNaN(km) || km <= 0) {
        alert("Punan nang tama ang lahat!");
        return;
    }
    
    if (editingId) {
        const idx = routes.findIndex(r => r.id === editingId);
        if (idx !== -1) {
            routes[idx] = { id: editingId, name, start, end, km };
        }
    } else {
        routes.push({ id: Date.now(), name, start, end, km });
    }
    
    renderRouteList();
    closeModal();
}

function editRoute(id) {
    const r = routes.find(x => x.id === id);
    if (!r) return;
    editingId = id;
    if (document.getElementById("modal-title")) document.getElementById("modal-title").textContent = "✏️ Baguhin ang Ruta";
    if (document.getElementById("m-name")) document.getElementById("m-name").value = r.name;
    if (document.getElementById("m-start")) document.getElementById("m-start").value = r.start;
    if (document.getElementById("m-end")) document.getElementById("m-end").value = r.end;
    if (document.getElementById("m-km")) document.getElementById("m-km").value = r.km;
    if (document.getElementById("fetch-result")) document.getElementById("fetch-result").style.display = "none";
    const modal = document.getElementById("add-modal");
    if (modal) modal.style.display = "flex";
}

function deleteRoute(id) {
    if (!confirm("Burahin ba ang rutang ito?")) return;
    routes = routes.filter(x => x.id !== id);
    renderRouteList();
}

function recordDirectTrip(routeId) {
    const r = routes.find(x => x.id === routeId);
    if (!r) return;
    
    const gasPrice = GAS_PRICE_GLOBAL;
    if (!gasPrice) {
        alert("Ilagay muna ang Presyo ng Gasolina sa ⚙️ Pagtatakda!");
        return;
    }
    
    const fare = LAST_FARE[routeId] || 0;
    if (!fare || fare <= 0) {
        alert("Wala pang nakatakdang pamasahe. Gamitin muna ang ▶️ para kuwentyahin.");
        return;
    }
    
    const workHrs = WORK_HOURS_PER_DAY;
    const v = getActiveVehicle();
    const kmUsed = LAST_TRIP_TYPE === "one" ? r.km : r.km * 2;
    const liter = kmUsed / v.kmPerL;
    const costGas = liter * gasPrice;
    const hrs = kmUsed / v.speedKmh;
    const costPerHr = (MAINTENANCE_PER_DAY + RENT_PER_DAY) / workHrs;
    const costTime = costPerHr * hrs;
    const totalCost = costGas + costTime;
    const netIncome = fare - totalCost;
    
    addTripRecord(r.name, fare, totalCost, netIncome, LAST_TRIP_TYPE);
    alert(`✅ Naitala na!\nSingil: ₱${fare.toFixed(2)}\nKita: ₱${netIncome.toFixed(2)}`);
}

function renderRouteList() {
    const list = document.getElementById("route-list");
    if (!list) return;
    
    if (!routes.length) {
        list.innerHTML = `<p style='color:var(--muted);text-align:center;padding:20px;'>Wala pang nakalagay na ruta.</p>`;
        return;
    }
    
    list.innerHTML = routes.map((r, i) => `
        <div class="route-item">
            <div class="route-num">${i+1}</div>
            <div class="route-info">
                <div class="route-name">${r.name}</div>
                <div class="route-meta">${r.start} → ${r.end}<br>📏 ${r.km.toFixed(2)} km/daan</div>
            </div>
            <div class="route-actions">
                <button class="icon-btn btn-go" onclick="useRoute(${r.id})" title="Buksan Kuwenta">▶️</button>
                <button class="icon-btn btn-add" onclick="recordDirectTrip(${r.id})" title="Itala Agad">➕</button>
                <button class="icon-btn btn-edit" onclick="editRoute(${r.id})" title="Baguhin">✏️</button>
                <button class="icon-btn btn-delete" onclick="deleteRoute(${r.id})" title="Burahin">🗑️</button>
            </div>
        </div>
    `).join("");
}

function useRoute(id) {
    selectedRoute = routes.find(r => r.id === id);
    if (!selectedRoute) return;
    
    distKm = selectedRoute.km;
    const v = getActiveVehicle();
    
    const menuScreen = document.getElementById("menu-screen");
    const calcScreen = document.getElementById("calc-screen");
    const results = document.getElementById("results");
    const calcRouteName = document.getElementById("calc-route-name");
    const calcRouteAddr = document.getElementById("calc-route-addr");
    const mapNoteText = document.getElementById("map-note-text");
    const calcVehicle = document.getElementById("calc-vehicle");
    const gpsControls = document.getElementById("gps-controls");
    const gpsKmRow = document.getElementById("gps-km-row");
    const gpsStat = document.getElementById("gps-stat");
    const distStat = document.getElementById("dist-stat");
    const gasPrice = document.getElementById("gas-price");
    const gasSavedNote = document.getElementById("gas-saved-note");
    
    if (menuScreen) menuScreen.classList.add("hidden");
    if (calcScreen) calcScreen.classList.remove("hidden");
    if (results) results.classList.add("hidden");
    if (gpsControls) gpsControls.classList.add("hidden");
    if (gpsKmRow) gpsKmRow.classList.add("hidden");
    if (gpsStat) gpsStat.classList.add("hidden");
    if (distStat) distStat.classList.remove("hidden");
    
    if (calcRouteName) calcRouteName.textContent = selectedRoute.name;
    if (calcRouteAddr) calcRouteAddr.textContent = `${selectedRoute.start} → ${selectedRoute.end}`;
    if (mapNoteText) mapNoteText.textContent = "📏 Nakatakdang Distansya";
    if (calcVehicle) calcVehicle.textContent = `🚗 ${v.name} • ${v.kmPerL} km/L • Bilis: ${v.speedKmh} km/oras`;
    
    const useKm = document.getElementById("use-km");
    if (useKm) useKm.textContent = distKm.toFixed(2);
    
    if (GAS_PRICE_GLOBAL && gasPrice) {
        gasPrice.value = GAS_PRICE_GLOBAL;
        if (gasSavedNote) gasSavedNote.classList.remove("hidden");
    }
    
    const fareInput = document.getElementById("fare-amount");
    if (fareInput && LAST_FARE[id]) fareInput.value = LAST_FARE[id];
    
    updateDistanceLabels();
    recalcConsumption();
    updateCostPerHour();
}

function calculateFare() {
    const fareInput = document.getElementById("fare-amount");
    const fare = parseFloat(fareInput?.value);
    const gasPrice = parseFloat(document.getElementById("gas-price")?.value);
    
    if (!distKm || isNaN(fare) || fare <= 0 || isNaN(gasPrice) || gasPrice <= 0) {
        alert("⚠️ Punan nang tama ang lahat — Distansya, Presyo ng Gasolina, at Pamasahe!");
        return;
    }
    
    const v = getActiveVehicle();
    const workHrs = WORK_HOURS_PER_DAY;
    const kmUsed = LAST_TRIP_TYPE === "one" ? distKm : distKm * 2;
    const liter = kmUsed / v.kmPerL;
    const hrs = kmUsed / v.speedKmh;
    const costGas = liter * gasPrice;
    const costPerHr = (MAINTENANCE_PER_DAY + RENT_PER_DAY) / workHrs;
    const costTime = costPerHr * hrs;
    const totalCost = costGas + costTime;
    const netIncome = fare - totalCost;
    const perKm = fare / kmUsed;
    const perHour = netIncome / hrs;
    
    if (selectedRoute) {
        LAST_FARE[selectedRoute.id] = fare;
        localStorage.setItem("lastFareByRoute", JSON.stringify(LAST_FARE));
    }
    GAS_PRICE_GLOBAL = gasPrice;
    localStorage.setItem("lastGasPrice", gasPrice);
    localStorage.setItem("gasPriceGlobal", gasPrice);
    
    const results = document.getElementById("results");
    if (results) results.classList.remove("hidden");
    
    document.getElementById("res-fare").textContent = fare.toFixed(2);
    document.getElementById("res-km").textContent = kmUsed.toFixed(2);
    document.getElementById("res-liter").textContent = liter.toFixed(2);
    document.getElementById("res-gas-price").textContent = gasPrice.toFixed(2);
    document.getElementById("res-cost-gas").textContent = costGas.toFixed(2);
    document.getElementById("res-hrs").textContent = hrs.toFixed(2);
    document.getElementById("res-cost-time").textContent = costTime.toFixed(2);
    document.getElementById("res-total-cost").textContent = totalCost.toFixed(2);
    document.getElementById("res-net").textContent = netIncome.toFixed(2);
    document.getElementById("res-per-km").textContent = perKm.toFixed(2);
    document.getElementById("res-per-hour").textContent = perHour.toFixed(2);
    
    const netEl = document.getElementById("res-net");
    if (netIncome >= 0) {
        netEl.style.color = "var(--ok)";
        netEl.style.fontWeight = "bold";
    } else {
        netEl.style.color = "var(--danger)";
        netEl.style.fontWeight = "bold";
    }
    
    window._lastTrip = { fare, totalCost, netIncome };
}

function saveAndRecord() {
    if (!window._lastTrip) {
        alert("Kuwentyahin muna bago itala!");
        return;
    }
    if (!selectedRoute && !isGPSMode) {
        alert("Walang napiling ruta!");
        return;
    }
    
    const routeName = isGPSMode
        ? `📍 GPS — ${distKm.toFixed(2)} km`
        : selectedRoute.name;
    
    addTripRecord(
        routeName,
        window._lastTrip.fare,
        window._lastTrip.totalCost,
        window._lastTrip.netIncome,
        LAST_TRIP_TYPE
    );
    
    alert("✅ Naitala na!");
    window._lastTrip = null;
}

function shareLastResult() {
    if (!window._lastTrip) {
        alert("Kuwentyahin muna bago i-share!");
        return;
    }
    const t = window._lastTrip;
    const routeName = isGPSMode
        ? `GPS — ${distKm.toFixed(2)} km`
        : selectedRoute?.name || "Biyahe";
    const text = encodeURIComponent(
        `🚗 ${routeName}\n` +
        `Uri: ${LAST_TRIP_TYPE === "one" ? "1-Daan" : "Paikot"}\n` +
        `Singil: ₱${t.fare.toFixed(2)}\n` +
        `Kabuuang Gastos: ₱${t.totalCost.toFixed(2)}\n` +
        `Kita: ₱${t.netIncome.toFixed(2)}\n\n` +
        `— Galing sa Habal-Habal Rate Calculator ni martodosko`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
}

function resetCalc() {
    document.getElementById("fare-amount").value = "";
    document.getElementById("results").classList.add("hidden");
    window._lastTrip = null;
}

// ========== I-EXPORT SA GLOBAL ==========
Object.assign(window, {
    toggleSideMenu, closeSideMenu, goHome, goBack,
    setTripType, openGPSRoute, useGPSDistance,
    startGPSTracking, stopGPSTracking,
    openAddModal, closeModal, saveRoute, editRoute, deleteRoute,
    useRoute, calculateFare, saveAndRecord, shareLastResult, resetCalc,
    openSettings, closeSettings, saveSettings,
    openKeyModal, closeKeyModal, checkKey, openImportExport,
    exportData, importData,
    openContactModal, closeContactModal, sendContactMsg,
    shareFB, shareMessenger, shareWA, copyLink, shareApp,
    fetchRoute, recordDirectTrip
});

console.log("✅ logic.js — BUONG BUO NA AT HANDA NA!");

