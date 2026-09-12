# 🏠 Complete Multi-Room Architectural AI Video Generation Workflow
### *Seamless Scrollytelling Visual Production for High-End Real Estate & HVAC Platforms*

---

## 🎯 Objective
Generate a consistent, photorealistic, 60fps cinematic **FPV one-take fly-through video** that starts from the hot sunny Florida sky, descends into a Cape Coral coastal home, and navigates seamlessly through the **Living Room ➔ Master Bedroom ➔ Luxury Bathroom** with a uniform structural layout and materials.

---

## 📐 Phase 1: Architectural & Material Style Bible (Fixed DNA)

To prevent the AI from generating mismatched walls, lighting, or flooring between rooms, lock down these design tokens across all prompts:

| Attribute | Fixed Specification |
| :--- | :--- |
| **Architectural Style** | Modern Coastal Florida Minimalist Villa (Floor-to-ceiling sliding glass doors, 10ft high ceilings) |
| **Flooring** | Seamless continuous light oak wide-plank wood flooring across all dry rooms |
| **Wall & Ceiling Finish** | Ultra-matte off-white (#FAFAFA) with architectural linear AC slot diffusers |
| **Lighting Atmosphere** | Scorching 5000K Florida summer sunlight outside + Crisp 4000K cool LED linear cove lighting inside |
| **HVAC Visual Motif** | Subtle aerodynamic cyan-blue airflow ribbons (#00E5FF) radiating from ceiling AC diffusers |

---

## 🖼️ Phase 2: Generating Keyframes with Midjourney

Generate 4 keyframe images using the exact same style seed and style reference (`--sref`) to maintain strict continuity.

### Keyframe 1: Sunny Sky & Drone Descent (Exterior Reveal)
```text
High-angle aerial drone shot descending from blazing sunny blue sky through scattered heat-haze clouds, revealing a luxury modern flat-roof coastal villa in Cape Coral Florida with turquoise pool and palm trees, intense golden sun flare, photorealistic, architectural drone photography, 8k --ar 16:9 --style raw --v 7.0
```

### Keyframe 2: Open-Plan Master Cutaway & Living Room
```text
Wide-angle interior view of a luxury modern Florida living room with floor-to-ceiling open sliding glass doors leading to pool patio, low-profile linen sofa, continuous light oak wide-plank wood floors, ceiling linear HVAC diffusers with subtle glowing cyan cooling air streams, bright daylight --ar 16:9 --style raw --v 7.0
```
*(Save this generated image and copy its Image URL to use as `--sref` for Keyframes 3 & 4).*

### Keyframe 3: Hallway to Master Bedroom
```text
Interior view looking straight down a sunlit architectural hallway into a luxury master bedroom with king platform bed, matching continuous light oak floors, off-white minimalist walls, linear AC slot diffusers on ceiling, cool ambient lighting --sref [KEYFRAME_2_URL] --sw 800 --ar 16:9 --style raw --v 7.0
```

### Keyframe 4: Master Ensuite Bathroom
```text
Luxury modern ensuite bathroom connecting from master bedroom, seamless transition from oak floor to large-format white porcelain tile, glass walk-in rain shower, floating oak double vanity, crisp cool air atmosphere, soft architectural daylight --sref [KEYFRAME_2_URL] --sw 800 --ar 16:9 --style raw --v 7.0
```

---

## 🎬 Phase 3: AI Video Generation & Keyframe Stitching

Use **Luma Dream Machine**, **Kling AI (v1.6/2.0)**, or **Runway Gen-3 Alpha** with Keyframe Stitching (First Frame ➔ Last Frame interpolation).

```
[Keyframe 1: Sky] ──(Clip 1)──> [Keyframe 2: Living Room] ──(Clip 2)──> [Keyframe 3: Bedroom] ──(Clip 3)──> [Keyframe 4: Bathroom]
```

### Clip 1: Sky ➔ Living Room Entry (5 seconds)
- **Start Frame**: Keyframe 1 (Aerial Sky/House)
- **End Frame**: Keyframe 2 (Living Room)
- **Motion Prompt**:
  ```text
  Continuous FPV drone dive descending from sunny sky, swooping down towards the modern villa, effortlessly flying through the open sliding glass doors into the cool air-conditioned living room. Fast dive slowing down into a smooth stabilized glide, photorealistic 60fps.
  ```

### Clip 2: Living Room ➔ Bedroom (5 seconds)
- **Start Frame**: Keyframe 2 (Living Room)
- **End Frame**: Keyframe 3 (Bedroom)
- **Motion Prompt**:
  ```text
  Smooth steadycam dolly forward gliding across the light oak floor, tracking past the living room sofa, moving directly through the hallway doorway into the master bedroom. Constant eye-level height, zero warping, seamless architectural movement.
  ```

### Clip 3: Bedroom ➔ Bathroom (4 seconds)
- **Start Frame**: Keyframe 3 (Bedroom)
- **End Frame**: Keyframe 4 (Bathroom)
- **Motion Prompt**:
  ```text
  Smooth continuous push-in gliding past the master bed, entering straight into the luxury glass master bathroom, slow deceleration to a calm rest showing crisp cool air ambiance, cinematic architectural walkthrough.
  ```

---

## 🎞️ Phase 4: Video Assembly & Frame Extraction

### 1. Merge Clips (DaVinci Resolve / CapCut / FFmpeg)
Combine `clip1.mp4`, `clip2.mp4`, and `clip3.mp4` into a single 14-second seamless Master Video (`hvac_tour_master.mp4`).

### 2. Extract WebP Sequence with FFmpeg
Run the following command to generate lightweight WebP frames (15 frames per second):

```bash
# Create directory
mkdir -p public/scrolly_frames

# Extract 15fps WebP sequence (Quality 80, 1080p width)
ffmpeg -i hvac_tour_master.mp4 \
  -vf "fps=15,scale=1920:-1" \
  -c:v libwebp -lossless 0 -quality 80 \
  public/scrolly_frames/frame_%03d.webp
```
*Result: ~210 high-performance WebP images (~40KB each), ready for smooth HTML5 Canvas / Framer scrub scrolling.*

---

## 🌐 Phase 5: Scrollytelling Scroll-Map Integration

| Scroll Percentage | Visual Section | Overlay Copy & Call-to-Action |
| :--- | :--- | :--- |
| **0% – 25%** | Sky Descent to Villa | *"Blistering Florida Heat Outside? Stay 100% Cool Inside."* + [24/7 Emergency Service] |
| **25% – 55%** | Living Room Glide | *"Engineered for Southwest Florida Humidity & Comfort."* |
| **55% – 85%** | Bedroom & Hallway | *"Whisper-Quiet, Zoned Temperature Control in Every Room."* |
| **85% – 100%** | Luxury Bathroom Rest | *"Voted Best HVAC Contractor in Lee County."* + [Schedule Free Estimate Today] |
