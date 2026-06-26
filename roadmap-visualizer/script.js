const roadmapData = [
    {
        phase: 1,
        title: "Microcontroller Walker",
        duration: "~4 weeks",
        stages: [
            {
                id: "stage-0",
                title: "Stage 0: Bench bring-up",
                badge: "Pre-build",
                tasks: [
                    { text: "Source consumables + Lamington Road run", completed: false },
                    { text: "Set servo rail to ~7.2 V and logic rail to 5.0 V", completed: false },
                    { text: "Breadboard logic; bring up each component individually", completed: false },
                    { text: "Stand up documentation + posting workflow", completed: false }
                ],
                gate: "Every component proven on the bench"
            },
            {
                id: "stage-1",
                title: "Stage 1: Body + wiring",
                badge: "Assembly",
                tasks: [
                    { text: "Print PLA chassis, 4 legs / 8 joints, mounts, brackets", completed: false },
                    { text: "Assemble two-rail power on-chassis", completed: false },
                    { text: "Move electronics to perfboard; wire 8 servos + IMU + OLED + LED", completed: false }
                ],
                gate: "Assembled robot powers up; all 8 servos sweep without browning out the ESP32"
            },
            {
                id: "stage-2",
                title: "Stage 2: It stands",
                badge: "Core Logic",
                tasks: [
                    { text: "Calibrate joint neutrals (trim offsets)", completed: false },
                    { text: "Implement complementary filter → stable pitch/roll", completed: false },
                    { text: "Write 2-link inverse kinematics; roll out to all four", completed: false }
                ],
                gate: "Robot unfolds and holds a stable, level stance"
            },
            {
                id: "stage-3",
                title: "Stage 3: It walks",
                badge: "Locomotion",
                tasks: [
                    { text: "Gait engine: phase clock + foot trajectories", completed: false },
                    { text: "Forward walking, then turning", completed: false }
                ],
                gate: "Walks forward and turns reliably on flat ground"
            },
            {
                id: "stage-4",
                title: "Stage 4: It's alive (Finish Phase 1)",
                badge: "Polish",
                tasks: [
                    { text: "Close the balance loop: proportional → PID body leveling", completed: false },
                    { text: "OLED face expressions + LED moods", completed: false },
                    { text: "Gain tuning, cable management, low-battery cutoff", completed: false },
                    { text: "Stretch: Bluetooth remote drive", completed: false }
                ],
                gate: "Walking, self-leveling, expressive robot — Phase 1 complete"
            }
        ]
    },
    {
        phase: 2,
        title: "Extend the platform",
        duration: "Back in the US",
        stages: [
            {
                id: "phase-2-goals",
                title: "Phase 2 Goals",
                badge: "Advanced",
                tasks: [
                    { text: "Design 12-servo (3 DOF/leg) version in CAD", completed: false },
                    { text: "Build accurate MJCF/URDF model", completed: false },
                    { text: "RL in simulation (disturbance rejection + terrain)", completed: false },
                    { text: "System-identify real servos; sim-to-real transfer", completed: false },
                    { text: "Add Raspberry Pi 5 high-level layer", completed: false },
                    { text: "Computer vision (object localization)", completed: false },
                    { text: "LLM-as-planner over a skill library", completed: false }
                ],
                gate: "Natural-language commands translate to real world action"
            }
        ]
    }
];

function renderRoadmap() {
    const container = document.getElementById('roadmap-container');
    let delayCounter = 0;
    
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
        
        phaseData.stages.forEach(stage => {
            const card = document.createElement('div');
            card.className = 'stage-card animate-slide-in';
            card.style.animationDelay = `${delayCounter * 0.15}s`;
            delayCounter++;
            
            const dot = document.createElement('div');
            dot.className = 'stage-dot';
            
            const title = document.createElement('h3');
            title.className = 'stage-title';
            title.innerHTML = `
                ${stage.title}
                <span class="stage-badge">${stage.badge}</span>
            `;
            
            const taskList = document.createElement('ul');
            taskList.className = 'task-list';
            
            stage.tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div class="task-checkbox" onclick="toggleTask(this)"></div>
                    <span>${task.text}</span>
                `;
                taskList.appendChild(li);
            });
            
            const gate = document.createElement('div');
            gate.className = 'gate-card';
            gate.innerHTML = `
                <div class="gate-icon">🏁</div>
                <div>
                    <span class="gate-label">Demo Gate</span>
                    <span class="gate-text">${stage.gate}</span>
                </div>
            `;
            
            card.appendChild(dot);
            card.appendChild(title);
            card.appendChild(taskList);
            card.appendChild(gate);
            timeline.appendChild(card);
        });
        
        phaseSection.appendChild(phaseHeader);
        phaseSection.appendChild(timeline);
        container.appendChild(phaseSection);
    });
}

// Simple toggle for the visualizer interactivity
window.toggleTask = function(element) {
    const parent = element.parentElement;
    parent.classList.toggle('completed');
    
    // Add a tiny animation effect on click
    element.style.transform = 'scale(0.8)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
}

document.addEventListener('DOMContentLoaded', renderRoadmap);
