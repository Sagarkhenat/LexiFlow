# 🧠 About LexiFlow

**LexiFlow** is a high-performance, mobile-first document intelligence platform designed to bridge the gap between physical paperwork and structured digital ecosystems. Unlike traditional scanners, LexiFlow utilizes **Multimodal LLMs** to not just capture images, but to "understand" the semantic context of documents—automatically categorizing receipts, medical records, and business cards with zero manual input.

Developed as a showcase of **Senior-level Angular architecture**, the project prioritizes performance, native device integration, and a sophisticated approach to the "Error State" logic required for production-ready mobile software.

## 🏗️ Technical Highlights

* **Reactive State with Signals:** Leveraging Angular 17’s Signal API for granular reactivity and optimized change detection.
* **AI Data Orchestration:** Asynchronous processing of image data via Gemini 1.5 Flash Vision, transforming raw pixels into structured JSON.
* **Capacitor Native Bridge:** High-efficiency implementation of Camera and Filesystem APIs for 120fps UI performance.
* **Resilient Engineering:** Advanced error handling for real-world mobile scenarios, including blur detection, network latency masking, and partial-success states.
* **Clean Architecture:** Strict separation of concerns following the Feature-Folder pattern, ensuring the codebase is scalable and testable.
