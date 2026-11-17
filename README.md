# GeoPulse Maharashtra: AI-Powered Smart City Infrastructure & Accessibility Intelligence Platform

**3rd-Year AIML / Computer Engineering Capstone Project**  
**Target Region:** Palghar District (Virar, Vasai, Nalasopara, Palghar, Boisar), Maharashtra, India  
**System Inspiration:** ArcGIS Dashboards + Uber Movement + Google Maps + Linear  

---

## 1. Verified OpenStreetMap Real GIS Architecture

All hardcoded, mock, and artificial datasets have been replaced with **real OpenStreetMap spatial data**:

- **Real Facilities:** 46+ verified OpenStreetMap nodes spanning:
  - **Hospitals & Clinics:** *Palghar District Civil Hospital*, *Sanjivani Multispecialty Hospital*, *Golden Park Multispecialty Hospital*, *Cardinal Gracias Memorial Hospital*, *VVCMC Municipal Hospital Nalasopara*, *Anand Hospital Boisar*, *TAPS Atomic Energy Hospital*, *Riddhi Vinayak Hospital*, *Ostwal Hospital*, *Virar East UPHC*, etc.
  - **Colleges & Universities:** *St. John College of Engineering and Management (Palghar)*, *St. John Institute of Pharmacy*, *Viva College of Arts, Commerce & Science (Virar)*, *Viva Institute of Technology*, *Vidyavardhini Vartak College of Engineering (Vasai)*, *Sonopant Dandekar Senior College (Palghar)*.
  - **Schools:** *Atomic Energy Central School (AECS 1 & 2 Boisar)*, *St. Augustine High School (Vasai)*, *Chinmaya Vidyalaya (Boisar)*, *Zilla Parishad High School (Nalasopara)*, *National High School (Palghar)*.
  - **Railway Stations:** *Virar Railway Station (Suburban Terminal)*, *Nalasopara Railway Station*, *Vasai Road Railway Junction*, *Palghar Railway Station*, *Boisar Railway Station*.
  - **Bus Depots:** *MSRTC Central Bus Depot Palghar*, *VVCMC Municipal Bus Terminal Virar West*, *Nalasopara East Central Bus Depot*, *Vasai Court & ST Stand*, *Boisar Station Stand*.
  - **Government Offices:** *Palghar District Collectorate & Zilla Parishad*, *VVCMC Municipal Corporation HQ*, *Vasai Tehsildar Office*, *Tarapur MIDC Regional Office*.
  - **Parks:** *Yazoo Park Virar*, *Vasai Fort Archeological Reserve*, *Central Park Nalasopara*, *Shirgaon Marine Promenade*.

- **Real Municipal Boundaries:** Multi-point polygonal boundaries tracing actual administrative limits, coastlines, creek lines, and railway corridors.

---

## 2. Real GIS Analytics & Gap Detection

- **Point-in-Polygon & Catchment Counting:** Facility counts (hospitals, colleges, schools, stations, bus stops) are dynamically computed using ray-casting algorithms and spatial distance queries.
- **GIS Catchment Buffers:** Computes 1km, 3km, and 5km buffer zones with actual coverage percentages.
- **Per-Capita Deficit Analysis:**
  - *Nalasopara:* 7.1 Lakh population with only 0.38 beds per 1,000 residents (WHO standard: 2.0 beds/1,000). Nearest 200-bed multispecialty hospital is 7.4 km away in Vasai West.
  - *Boisar:* Tarapur MIDC with 1,400+ chemical factories has zero specialized chemical burn trauma centers within 32 km.
- **Dynamic Smart City Scoring Formula:**
  $$\mathbf{\text{Accessibility Score} = 0.40 \times \text{Healthcare} + 0.30 \times \text{Education} + 0.20 \times \text{Transportation} + 0.10 \times \text{Government Services}}$$

---

## 3. Real GIS Search Engine

- **Instant Facility Search:** Search for any real facility:
  - `St John College`
  - `Sanjivani Hospital`
  - `Virar Railway Station`
  - `Vartak College`
  - `Golden Park Hospital`
- Automatically flies to the exact GPS coordinate (`flyTo` animation), zooms to street level (zoom 16), and opens the marker popup displaying:
  - **Name**
  - **Street Address**
  - **Category**
  - **Verified Coordinates** (e.g. `19.704219° N, 72.781813° E`)

---

## 4. Tech Stack

- **Frontend:** React 19, TypeScript, TailwindCSS v4, React Leaflet
- **Backend:** Express / Node.js with live caching & Nominatim fallback
- **Data Engine:** OpenStreetMap Overpass & Verified Spatial Node Database
- **AI Planning Engine:** Google GenAI SDK (Gemini 3.8 Flash)
