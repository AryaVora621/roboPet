const roadmapData = [
    {
        phase: 1,
        title: "Phase 1: Microcontroller Walker",
        duration: "1 Month",
        sections: [
            {
                id: "days-1-4",
                title: "DAYS 1–4 — BENCH BRING-UP (no filament, electronics only)",
                badge: "Crucial",
                description: "The goal is to prove every single component works before it goes inside a chassis. A bug on the breadboard takes five minutes to fix; after assembly, it takes three hours.",
                subsections: [
                    {
                        title: "Day 1 — Power system only",
                        tasks: [
                            { id: "d1-t1", text: "Set up bench: 3S pack, fuse holder, power switch, both XL4016s, multimeter" },
                            { id: "d1-t2", text: "Bring up XL4016 #1 with no load, trim to exactly 7.2 V" },
                            { id: "d1-t3", text: "Bring up XL4016 #2 to exactly 5.0 V" },
                            { id: "d1-t4", text: "Wire both bucks in parallel from the pack and confirm both rails hold voltages" },
                            { id: "d1-t5", text: "Add 1000 µF cap on each output rail and measure again (check for voltage pull-down)" }
                        ],
                        notes: [
                            { type: "Learning", text: "A buck converter is a switching regulator. Always verify power before connecting. Mis-set rail = dead ESP32." },
                            { type: "Video idea", text: "'I'm building a walking robot from scratch and this is literally day one' - show voltage dropping from 12.6V to 7.2V. Explain why separate rails matter." }
                        ]
                    },
                    {
                        title: "Day 2 — ESP32 and digital peripherals",
                        tasks: [
                            { id: "d2-t1", text: "Power ESP32 from 5 V logic rail via VIN pin, confirm it boots" },
                            { id: "d2-t2", text: "Blink an LED on a GPIO pin" },
                            { id: "d2-t3", text: "Bring up OLED over I2C (print 'roboPet')" },
                            { id: "d2-t4", text: "Bring up WS2812 (cycle through colors)" },
                            { id: "d2-t5", text: "Check logic rail current draw with OLED/WS2812 running (< 500 mA)" }
                        ],
                        notes: [
                            { type: "Mini project", text: "Write a startup sequence: WS2812 fades red to green, OLED shows progress bar then face. Learn timing & non-blocking state machines." },
                            { type: "Video idea", text: "'ESP32 + OLED in 60 seconds — first signs of life.' Show face appearing on OLED." }
                        ]
                    },
                    {
                        title: "Day 3 — Servos and IMU",
                        tasks: [
                            { id: "d3-t1", text: "Plug one servo into 7.2 V rail (not breadboard), signal to ESP32. Sweep 0 to 180°" },
                            { id: "d3-t2", text: "Tune attach() pulse range (500-2500 µs defaults might be wrong). Listen for grinding" },
                            { id: "d3-t3", text: "Wire all 8 servos. Sweep simultaneously and watch 7.2 V rail sag (add bulk caps if below 6.8 V)" },
                            { id: "d3-t4", text: "Wire MPU6050 (I2C 0x68). Print raw accel/gyro to Serial at 100 Hz. Verify gravity on Z axis" }
                        ],
                        notes: [
                            { type: "Mini project", text: "'Panic stop': if IMU reads >45° tilt, command all servos to a safe fold-down pose. First closed-loop behavior." },
                            { type: "Video idea", text: "'Eight servos and why I'm scared to touch them' — show sweep, explain power separation, show multimeter current spike." }
                        ]
                    },
                    {
                        title: "Day 4 — System integration and Lamington Road",
                        tasks: [
                            { id: "d4-t1", text: "Wire everything together on breadboard (rails, ESP32, 8 servos, IMU, OLED, LED)" },
                            { id: "d4-t2", text: "System test: startup sequence -> stream pitch/roll to OLED while servos hold neutral" },
                            { id: "d4-t3", text: "Lamington Road run: buy consumables, look for PCA9685 breakout and cheap 8-channel logic analyzer" }
                        ],
                        notes: [
                            { type: "Gate", text: "Every component proven on the bench simultaneously. Ready to assemble once filament arrives." },
                            { type: "Video idea", text: "'Lamington Road in Mumbai for electronics parts' vlog-style pickup." }
                        ]
                    }
                ]
            },
            {
                id: "week-1",
                title: "WEEK 1 — PRINTING, WIRING, AND CHASSIS ASSEMBLY",
                badge: "Assembly",
                description: "Print PLA structural parts, migrate electronics to perfboard, assemble two-rail power.",
                subsections: [
                    {
                        title: "Mechanical & Electrical Assembly",
                        tasks: [
                            { id: "w1-t1", text: "Print body, legs, brackets (40-50% infill for torque parts, 3+ walls)" },
                            { id: "w1-t2", text: "Add temporary adhesive rubber bumpers to feet" },
                            { id: "w1-t3", text: "Migrate logic electronics from breadboard to perfboard" },
                            { id: "w1-t4", text: "Mount 7.2V terminal block with bulk caps for servo power bus (separate from perfboard)" },
                            { id: "w1-t5", text: "Tie all grounds (7.2V, 5.0V, ESP32, IMU, servos) to a single common ground" }
                        ],
                        notes: [
                            { type: "Mini project", text: "Battery monitor: read pack voltage via voltage divider to ESP32 ADC. Display on OLED. Fold-down & red LED if < 9.6 V." },
                            { type: "Video idea", text: "'Perfboard vs breadboard — why I'm upgrading' (show current limits vs clean result). Also: first print time-lapse." },
                            { type: "Gate", text: "Assembled robot powers up; 8 servos hold neutral for 30s without voltage sag or ESP32 reset. OLED shows live pitch/roll." }
                        ]
                    }
                ]
            },
            {
                id: "week-2",
                title: "WEEK 2 — CALIBRATION, SENSOR FUSION, IK (It Stands)",
                badge: "Core Logic",
                description: "High-density learning week: servo calibration, complementary filter, and 2-link inverse kinematics.",
                subsections: [
                    {
                        title: "Calibration & Stance",
                        tasks: [
                            { id: "w2-t1", text: "Command servos to 90°, measure physical offset, and store in trim[] array" },
                            { id: "w2-t2", text: "Write standPose() function (straight legs, level body)" },
                            { id: "w2-t3", text: "Test standPose() and check for lean due to remaining offsets" }
                        ],
                        notes: [
                            { type: "Video idea", text: "'Why servo calibration matters' - film before and after, showing 7° offset impact." }
                        ]
                    },
                    {
                        title: "Sensor Fusion & IK",
                        tasks: [
                            { id: "w2-t4", text: "Implement complementary filter (pitch = 0.98*(pitch+gyro*dt) + 0.02*accel)" },
                            { id: "w2-t5", text: "Tape robot to a book, tilt it, tune alpha coefficients via Arduino Serial Plotter" },
                            { id: "w2-t6", text: "Implement 2-link IK (math for knee and hip angles from x,y targets)" },
                            { id: "w2-t7", text: "Command leg 0 to specific x,y and verify angles. Repeat for all 4 legs" }
                        ],
                        notes: [
                            { type: "Mini project", text: "Reachability test: command foot in a small circle in XY plane, watch leg trace it." },
                            { type: "Video idea", text: "'How a $3 sensor balances a robot - sensor fusion explained.' Show Serial Plotter tuning." },
                            { type: "Gate", text: "Robot unfolds to stable stand, holds level controlled by proportional balance (pitch error * gain -> foot Y targets)." },
                            { type: "Video idea", text: "'It stands for the first time.' No explanation, just the milestone." }
                        ]
                    }
                ]
            },
            {
                id: "week-3",
                title: "WEEK 3 — GAIT GENERATION (It Walks)",
                badge: "Locomotion",
                description: "Implement a static-stable creep gait (one leg swings, three form a base). Iterative tuning.",
                subsections: [
                    {
                        title: "Gait Implementation",
                        tasks: [
                            { id: "w3-t1", text: "Implement phase clock (0 to 1) with phase offset/duty cycle for each leg" },
                            { id: "w3-t2", text: "Pass x,y targets from gait to IK layer for forward walking" },
                            { id: "w3-t3", text: "Tune step height, length, and frequency until forward walk is stable" },
                            { id: "w3-t4", text: "Implement turning (scale step length differently for left vs right legs)" }
                        ],
                        notes: [
                            { type: "Mini project", text: "Serial command interface: type 'f', 'b', 'l', 'r', 's', 'p' to drive robot over USB." },
                            { type: "Mini project", text: "Parameter tuning mode: send step length/height via Serial to tune on the fly without re-flashing." },
                            { type: "Video idea", text: "'First steps — it barely works.' (Failures are relatable). Also: explain phase clocks & support polygons." },
                            { type: "Gate", text: "Walks forward for at least 1 meter reliably and turns both directions on a clear floor." }
                        ]
                    }
                ]
            },
            {
                id: "week-4",
                title: "WEEK 4 — BALANCE, PERSONALITY, AND FINISHING (It's Alive)",
                badge: "Polish",
                description: "Close the balance loop, add OLED affective states, and finalize Phase 1.",
                subsections: [
                    {
                        title: "Balance & Personality",
                        tasks: [
                            { id: "w4-t1", text: "Add P correction to foot Y/height targets (correction = Kp * pitchError)" },
                            { id: "w4-t2", text: "Add D term to damp oscillation (PD controller)" },
                            { id: "w4-t3", text: "Create OLED face state machine (idle, walking, alert, happy, low battery)" },
                            { id: "w4-t4", text: "Implement WS2812 LED moods (green=healthy, amber=low battery, blue pulse=idle)" },
                            { id: "w4-t5", text: "Integrate low-battery cutoff (finish stride, fold down, tired face, sleep)" }
                        ],
                        notes: [
                            { type: "Stretch goal", text: "Bluetooth remote (ESP32 BT Classic/BLE + smartphone serial app)." },
                            { type: "Stretch goal", text: "Save gait parameters & trim offsets to ESP32 NVS (survives power cycle)." },
                            { type: "Gate", text: "Phase 1 complete demo: fold to stand, walk, turn, resist tilt, show low battery warning." },
                            { type: "Video idea", text: "'It balances now - PID controller.' and 'I gave my robot personality - emotion state machines.'" }
                        ]
                    }
                ]
            },
            {
                id: "habits",
                title: "DAILY HABITS & CONTENT STRATEGY",
                badge: "Logistics",
                description: "Rules for sustainability: 3 outputs a day (work, git, film). Filming takes 5 mins.",
                subsections: [
                    {
                        title: "Content & Git",
                        tasks: [
                            { id: "hab-t1", text: "Commit any firmware changes daily with a note" },
                            { id: "hab-t2", text: "Take a physical photo of the build daily" },
                            { id: "hab-t3", text: "Update DEVLOG.md (What worked, what failed, what's next)" },
                            { id: "hab-t4", text: "Film a 20-30s daily clip (Progress, Explainer, or Failure)" }
                        ],
                        notes: [
                            { type: "Content Strategy", text: "60% progress, 30% explainer, 10% honest failures. Use hashtags: #robotics #mechatronics #engineeringstudent #buildlog" }
                        ]
                    }
                ]
            }
        ]
    }
];

let globalProgressObj = {};

// Local Storage Fallback Handlers
function getLocalProgress() {
    const saved = localStorage.getItem('roboPet_progress');
    return saved ? JSON.parse(saved) : {};
}

function saveLocalProgress(progressObj) {
    localStorage.setItem('roboPet_progress', JSON.stringify(progressObj));
}

// API Handlers for Vercel KV
async function fetchProgressApi() {
    try {
        const res = await fetch('/api/progress');
        if (res.ok) {
            const data = await res.json();
            if (data.warning) {
                console.warn(data.warning);
                return getLocalProgress();
            }
            return data;
        }
    } catch (e) {
        console.error('API fetch failed, falling back to local storage', e);
    }
    return getLocalProgress();
}

async function executeApiSave(progressObj, password) {
    const tasks = [];
    roadmapData.forEach(phase => {
        phase.sections.forEach(sec => {
            sec.subsections.forEach(sub => {
                if (sub.tasks) {
                    sub.tasks.forEach(t => {
                        tasks.push({
                            id: t.id,
                            text: t.text,
                            completed: !!progressObj[t.id]
                        });
                    });
                }
            });
        });
    });

    try {
        const res = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progressObj, tasks, password })
        });
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'API save failed');
        }
        
        console.log('Successfully synced with GitHub/KV');
        alert('Successfully pushed to GitHub!');
    } catch (e) {
        console.error('API save failed', e);
        alert('Failed to push: ' + e.message);
    }
}

window.handleSyncClick = function() {
    const password = prompt('Enter sync password to push to GitHub:');
    if (!password) return;
    executeApiSave(globalProgressObj, password);
}

async function initRoadmap() {
    globalProgressObj = await fetchProgressApi();
    renderRoadmap();
}

function renderRoadmap() {
    const container = document.getElementById('roadmap-container');
    container.innerHTML = '';
    
    let globalDelay = 0;

    roadmapData.forEach(phaseData => {
        const phaseSection = document.createElement('div');
        phaseSection.className = 'phase-section';
        
        const phaseHeader = document.createElement('h2');
        phaseHeader.className = 'phase-header';
        phaseHeader.innerHTML = `
            <span class="phase-number">${phaseData.phase}</span>
            ${phaseData.title} <span style="font-size: 1rem; color: var(--text-muted); font-weight: 400; margin-left: 10px;">(${phaseData.duration})</span>
        `;
        
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        
        phaseData.sections.forEach(section => {
            const card = document.createElement('div');
            card.className = 'stage-card animate-slide-in';
            card.style.animationDelay = `${globalDelay * 0.1}s`;
            globalDelay++;
            
            const dot = document.createElement('div');
            dot.className = 'stage-dot';
            
            const title = document.createElement('h3');
            title.className = 'stage-title collapsible-header';
            title.innerHTML = `
                <div>
                    ${section.title}
                    <span class="stage-badge">${section.badge}</span>
                </div>
                <div class="collapse-icon">▼</div>
            `;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'collapsible-content';
            
            const desc = document.createElement('p');
            desc.className = 'stage-desc';
            desc.textContent = section.description;
            contentDiv.appendChild(desc);
            
            section.subsections.forEach(sub => {
                const subCard = document.createElement('div');
                subCard.className = 'sub-card';
                
                const subTitle = document.createElement('h4');
                subTitle.textContent = sub.title;
                subCard.appendChild(subTitle);
                
                if (sub.tasks && sub.tasks.length > 0) {
                    const taskList = document.createElement('ul');
                    taskList.className = 'task-list';
                    sub.tasks.forEach(task => {
                        const isCompleted = !!globalProgressObj[task.id];
                        
                        const li = document.createElement('li');
                        li.className = `task-item ${isCompleted ? 'completed' : ''}`;
                        li.dataset.taskId = task.id;
                        
                        li.innerHTML = `
                            <div class="task-checkbox" onclick="toggleTask('${task.id}', this)"></div>
                            <span>${task.text}</span>
                        `;
                        taskList.appendChild(li);
                    });
                    subCard.appendChild(taskList);
                }
                
                if (sub.notes && sub.notes.length > 0) {
                    const notesList = document.createElement('div');
                    notesList.className = 'notes-list';
                    sub.notes.forEach(note => {
                        const n = document.createElement('div');
                        n.className = `note-item note-${note.type.toLowerCase().replace(/ /g, '-')}`;
                        n.innerHTML = `<strong>${note.type}:</strong> ${note.text}`;
                        notesList.appendChild(n);
                    });
                    subCard.appendChild(notesList);
                }
                
                contentDiv.appendChild(subCard);
            });
            
            // Toggle Logic for Accordion
            title.addEventListener('click', () => {
                const isOpen = contentDiv.classList.contains('open');
                if (isOpen) {
                    contentDiv.classList.remove('open');
                    title.querySelector('.collapse-icon').style.transform = 'rotate(0deg)';
                } else {
                    contentDiv.classList.add('open');
                    title.querySelector('.collapse-icon').style.transform = 'rotate(180deg)';
                }
            });
            
            card.appendChild(dot);
            card.appendChild(title);
            card.appendChild(contentDiv);
            timeline.appendChild(card);
        });
        
        phaseSection.appendChild(phaseHeader);
        phaseSection.appendChild(timeline);
        container.appendChild(phaseSection);
    });
}

window.toggleTask = function(taskId, element) {
    const parent = element.parentElement;
    const isNowCompleted = parent.classList.toggle('completed');
    
    // Update global state
    if (isNowCompleted) {
        globalProgressObj[taskId] = true;
    } else {
        delete globalProgressObj[taskId];
    }
    
    // Save to local storage (as backup/fallback)
    saveLocalProgress(globalProgressObj);
    
    // Animation effect
    element.style.transform = 'scale(0.8)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
}

document.addEventListener('DOMContentLoaded', initRoadmap);
