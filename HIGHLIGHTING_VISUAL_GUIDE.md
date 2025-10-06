# Visual Highlighting Guide 🎨

## Quick Reference Card

```
╔═══════════════════════════════════════════════════════════════╗
║               INTELLIGENT TEXT HIGHLIGHTING                    ║
╚═══════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────┐
│  WHAT GETS HIGHLIGHTED?                                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  1️⃣  IMPORTANT WORDS & BOLD TEXT                             │
│     Example: **organic photovoltaics**                       │
│     Display: ┌──────────────────────────┐                    │
│              │ organic photovoltaics    │  🟣 Purple         │
│              └──────────────────────────┘     background      │
│                                                               │
│  2️⃣  NUMBERS WITH UNITS                                      │
│     Examples: 20%, 100μW, 4V, 25°C                          │
│     Display: ┌─────┐ ┌──────┐ ┌────┐                        │
│              │ 20% │ │ 100μW│ │ 4V │  🌸 Pink               │
│              └─────┘ └──────┘ └────┘     background          │
│                                                               │
│  3️⃣  TECHNICAL TERMS & ACRONYMS                              │
│     Examples: OPVs, PCEs, IoT, 1DTP-ID                      │
│     Display: ┌──────┐ ┌──────┐ ┌─────┐                      │
│              │ OPVs │ │ PCEs │ │ IoT │  💙 Indigo            │
│              └──────┘ └──────┘ └─────┘     background        │
│                                                               │
│  4️⃣  STANDALONE NUMBERS                                      │
│     Examples: 2023, 100, 3.5                                │
│     Display: 2023  100  3.5          🔵 Blue text only       │
│                                                               │
└───────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════╗
║                    REAL EXAMPLE                               ║
╚═══════════════════════════════════════════════════════════════╝

Plain AI Output:
───────────────────────────────────────────────────────────────
The research on organic photovoltaics (OPVs) demonstrates 
that 1DTP-ID molecules achieve PCEs exceeding 20% efficiency 
under 1000 lux indoor lighting, generating 100 μW power at 
4 V voltage, ideal for IoT devices in 2023.


With Highlighting:
───────────────────────────────────────────────────────────────
The research on ┌─────────────────────────┐ (┌──────┐) 
                │ organic photovoltaics   │  │ OPVs │
                └─────────────────────────┘  └──────┘
                      🟣 Purple                💙 Indigo

demonstrates that ┌──────────┐ molecules achieve ┌──────┐
                  │ 1DTP-ID  │                   │ PCEs │
                  └──────────┘                   └──────┘
                   💙 Indigo                      💙 Indigo

exceeding ┌─────┐ efficiency under ┌──────┐ lux indoor
          │ 20% │                  │ 1000 │
          └─────┘                  └──────┘
          🌸 Pink                  🔵 Blue

lighting, generating ┌────────┐ power at ┌────┐ voltage,
                     │ 100 μW │          │ 4V │
                     └────────┘          └────┘
                      🌸 Pink            🌸 Pink

ideal for ┌─────┐ devices in ┌──────┐.
          │ IoT │            │ 2023 │
          └─────┘            └──────┘
          💙 Indigo          🔵 Blue

╔═══════════════════════════════════════════════════════════════╗
║                  COLOR PSYCHOLOGY                             ║
╚═══════════════════════════════════════════════════════════════╝

🟣  PURPLE  →  Important concepts, key terms
               Bold, emphasized content
               User-marked priority

🌸  PINK    →  Measurements, performance metrics
               Results, data points
               Quantifiable achievements

💙  INDIGO  →  Technical terminology
               Domain-specific acronyms
               Professional jargon

🔵  BLUE    →  Supporting numbers
               Years, counts, references
               Less critical data


╔═══════════════════════════════════════════════════════════════╗
║              HIGHLIGHTING IN ACTION                           ║
╚═══════════════════════════════════════════════════════════════╝

Section: Comprehensive Full Summary
─────────────────────────────────────────────────────────────

The research paper by Ryota Arai et al. presents 
                      └─ Plain text

┌───────────────────────────────────────┐ specifically focusing
│ organic photovoltaics                 │
└───────────────────────────────────────┘
            🟣 Purple highlight

on (┌──────┐) for indoor energy harvesting. The new
    │ OPVs │
    └──────┘
    💙 Indigo

┌────────────────────┐ semiconductors, ┌──────────┐ and 
│ small-molecule     │                 │ 1DTP-ID  │
└────────────────────┘                 └──────────┘
   🟣 Purple (if bold)                  💙 Indigo

┌──────────┐, achieve ┌─────┐ efficiency under ┌──────────┐
│ 2DTP-ID  │          │ 20% │                  │ 1000 lux │
└──────────┘          └─────┘                  └──────────┘
  💙 Indigo           🌸 Pink                   🌸 Pink


Key Points:
─────────────────────────────────────────────────────────────

• Introduction of new molecules (┌──────────┐ and ┌──────────┐)
                                 │ 1DTP-ID  │     │ 2DTP-ID  │
                                 └──────────┘     └──────────┘
                                  💙 Indigo        💙 Indigo

• Achievement of ┌──────────┐ exceeding ┌─────┐
                 │ PCEs     │           │ 20% │
                 └──────────┘           └─────┘
                  💙 Indigo             🌸 Pink

• Power output up to ┌────────┐ at ┌────┐
                     │ 100 μW │    │ 4V │
                     └────────┘    └────┘
                      🌸 Pink      🌸 Pink

• Suitable for ┌─────┐ applications
               │ IoT │
               └─────┘
               💙 Indigo


╔═══════════════════════════════════════════════════════════════╗
║                  BEFORE vs AFTER                              ║
╚═══════════════════════════════════════════════════════════════╝

❌  BEFORE (Plain Text):
───────────────────────────────────────────────────────────────
The OPVs achieve PCEs of 20% with 100 μW at 4 V for IoT devices.
Everything looks the same - hard to spot important info!


✅  AFTER (With Highlighting):
───────────────────────────────────────────────────────────────
The [OPVs] achieve [PCEs] of [20%] with [100 μW] at [4 V] for [IoT] devices.
    └─💙        └─💙      └─🌸      └─🌸       └─🌸    └─💙

Key information JUMPS OUT at you! ⚡


╔═══════════════════════════════════════════════════════════════╗
║                  HIGHLIGHTING LEGEND                          ║
╚═══════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│  Symbol  │  Type               │  Example                   │
├──────────┼─────────────────────┼────────────────────────────┤
│  🟣      │  Important/Bold     │  **organic photovoltaics** │
│  🌸      │  Numbers + Units    │  20%, 100μW, 4V           │
│  💙      │  Technical Terms    │  OPVs, PCEs, IoT          │
│  🔵      │  Plain Numbers      │  2023, 100, 3.5           │
└──────────┴─────────────────────┴────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║              UNITS AUTOMATICALLY DETECTED                     ║
╚═══════════════════════════════════════════════════════════════╝

Power:      W, μW, mW, kW, MW, GW, watts
Voltage:    V, mV, kV, volts
Current:    A, μA, mA, kA, amps
Resistance: Ω, kΩ, MΩ, ohms
Percent:    %, percent
Temp:       °C, °F, K, degrees
Frequency:  Hz, kHz, MHz, GHz
Distance:   m, μm, nm, km
And more!


╔═══════════════════════════════════════════════════════════════╗
║                    BENEFITS                                   ║
╚═══════════════════════════════════════════════════════════════╝

✅  Faster reading     →  Important info stands out
✅  Better comprehension → Visual hierarchy guides understanding
✅  Professional look   →  Magazine-quality presentation
✅  Easier scanning     →  Find key facts instantly
✅  Color-coded         →  Different types = different colors
✅  Automatic           →  No manual work needed
✅  Consistent          →  Same highlighting everywhere


╔═══════════════════════════════════════════════════════════════╗
║                   TESTING EXAMPLE                             ║
╚═══════════════════════════════════════════════════════════════╝

Try uploading a research paper and see these highlighted:

📊  Performance metrics:  20%, 15.5 μW, 3.3 V
🔬  Technical terms:      OPVs, PCEs, BHJ, PNP
💡  Key concepts:         **power conversion**, **efficiency**
📅  Numbers & years:      2023, 1000, 3.5


🎉  RESULT: Every important detail is now INSTANTLY VISIBLE!

