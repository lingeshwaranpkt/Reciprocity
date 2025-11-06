// Circuit parameters (all in ohms)
const R1 = 1000; // Left series
const R2 = 1000; // Middle
const R3 = 1000; // Right series
const kOhm = 1000; // For output scaling

// Theoretical calculations
function calculateTheoretical(V, isCircuit1) {
    // Total resistance seen by source: for Circuit 1, R1 + (R2 || R3) = 1000 + (1000 || 1000) = 1000 + 500 = 1500 Ω
    // Current through source branch: I_source = V / 1500
    // Then Ia = I_source * (R3 / (R2 + R3)) = (V / 1500) * (1000 / 2000) = (V / 1500) * 0.5
    // Simplified: Ia = V / 3000 A
    const Ia_theo = (V / 3000) * 1000; // mA
    const Raa_theo = (V / (Ia_theo / 1000)) / kOhm; // kΩ
    return { current: Ia_theo, resistance: Raa_theo };
}

// "Practical" simulation: Add 1% random tolerance to mimic real-world (seed for consistency, but varies slightly on calc)
function calculatePractical(V, isCircuit1) {
    const tol = 0.01; // 1% tolerance
    const R1p = R1 * (1 + (Math.random() - 0.5) * tol * 2);
    const R2p = R2 * (1 + (Math.random() - 0.5) * tol * 2);
    const R3p = R3 * (1 + (Math.random() - 0.5) * tol * 2);
    
    const parallel = (R2p * R3p) / (R2p + R3p);
    const totalR = (isCircuit1 ? R1p : R3p) + parallel;
    const I_source = V / totalR;
    const I_meas = I_source * (isCircuit1 ? R3p : R1p) / (R2p + (isCircuit1 ? R3p : R1p));
    
    const current_mA = I_meas * 1000;
    const resistance_kOhm = (V / I_meas) / kOhm;
    return { current: current_mA, resistance: resistance_kOhm };
}

// Update table for Circuit 1
function updateCircuit1() {
    const V = parseFloat(document.getElementById('va-slider').value);
    document.getElementById('va-value').textContent = V;
    document.getElementById('va-display').textContent = V.toFixed(1);

    const theo = calculateTheoretical(V, true);
    const prac = calculatePractical(V, true);

    document.getElementById('ia-theo').textContent = theo.current.toFixed(1);
    document.getElementById('ia-prac').textContent = prac.current.toFixed(1);
    document.getElementById('raa-theo').textContent = theo.resistance.toFixed(1);
    document.getElementById('raa-prac').textContent = prac.resistance.toFixed(1);

    drawCircuit1(V, prac.current / 1000 * 1000); // Scale for visual
    updateVerification();
}

// Update table for Circuit 2 (symmetric)
function updateCircuit2() {
    const V = parseFloat(document.getElementById('vb-slider').value);
    document.getElementById('vb-value').textContent = V;
    document.getElementById('vb-display').textContent = V.toFixed(1);

    const theo = calculateTheoretical(V, false);
    const prac = calculatePractical(V, false);

    document.getElementById('ib-theo').textContent = theo.current.toFixed(1);
    document.getElementById('ib-prac').textContent = prac.current.toFixed(1);
    document.getElementById('rbb-theo').textContent = theo.resistance.toFixed(1);
    document.getElementById('rbb-prac').textContent = prac.resistance.toFixed(1);

    drawCircuit2(V, prac.current / 1000 * 1000);
    updateVerification();
}

// Simple SVG-like drawing on canvas (basic lines/arrows for schematic)
function drawCircuit1(Va, Ia) {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw resistors (zigzag lines), source, ammeter
    // Simplified: horizontal lines for wires, rectangles for components
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Left branch: Va across R1 top and bottom? Wait, from diagram: series R1 top, vertical R_middle, R3 top right
    // But for simplicity: Draw three vertical resistors in parallel-like, but series on sides
    // Position: Left R1 vertical, middle R2 vertical, right R3 vertical, top/bottom horizontals

    const centerY = 100;
    const spacing = 100;

    // Top horizontal
    ctx.beginPath();
    ctx.moveTo(50, centerY - 40);
    ctx.lineTo(350, centerY - 40);
    ctx.stroke();

    // Bottom horizontal
    ctx.beginPath();
    ctx.moveTo(50, centerY + 40);
    ctx.lineTo(350, centerY + 40);
    ctx.stroke();

    // Left R1 (series, but vertical for amp)
    ctx.beginPath();
    ctx.moveTo(50, centerY - 40);
    ctx.lineTo(50, centerY + 40);
    ctx.stroke();
    ctx.fillText('1kΩ', 45, centerY);

    // Middle R2
    ctx.beginPath();
    ctx.moveTo(175, centerY - 40);
    ctx.lineTo(175, centerY + 40);
    ctx.stroke();
    ctx.fillText('1kΩ (Ia)', 160, centerY);
    // Ammeter symbol around middle
    ctx.beginPath();
    ctx.arc(175, centerY, 15, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(`${Ia.toFixed(1)}mA`, 170, centerY + 25);

    // Right R3
    ctx.beginPath();
    ctx.moveTo(300, centerY - 40);
    ctx.lineTo(300, centerY + 40);
    ctx.stroke();
    ctx.fillText('1kΩ', 285, centerY);

    // Va source on left
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(20, centerY - 20, 20, 40);
    ctx.fillStyle = '#000';
    ctx.fillText(`+${Va.toFixed(1)}V-`, 10, centerY + 30);
}

// Symmetric draw for Circuit 2 (mirror)
function drawCircuit2(Vb, Ib) {
    const canvas = document.getElementById('canvas2');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = 100;
    const spacing = 100;

    // Top horizontal
    ctx.beginPath();
    ctx.moveTo(50, centerY - 40);
    ctx.lineTo(350, centerY - 40);
    ctx.stroke();

    // Bottom horizontal
    ctx.beginPath();
    ctx.moveTo(50, centerY + 40);
    ctx.lineTo(350, centerY + 40);
    ctx.stroke();

    // Left R1
    ctx.beginPath();
    ctx.moveTo(50, centerY - 40);
    ctx.lineTo(50, centerY + 40);
    ctx.stroke();
    ctx.fillText('1kΩ', 35, centerY);

    // Middle R2
    ctx.beginPath();
    ctx.moveTo(175, centerY - 40);
    ctx.lineTo(175, centerY + 40);
    ctx.stroke();
    ctx.fillText('1kΩ', 160, centerY);

    // Right R3 (with ammeter)
    ctx.beginPath();
    ctx.moveTo(300, centerY - 40);
    ctx.lineTo(300, centerY + 40);
    ctx.stroke();
    ctx.fillText('1kΩ (Ib)', 275, centerY);
    ctx.beginPath();
    ctx.arc(300, centerY, 15, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(`${Ib.toFixed(1)}mA`, 295, centerY + 25);

    // Vb source on right
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(360, centerY - 20, 20, 40);
    ctx.fillStyle = '#000';
    ctx.fillText(`+${Vb.toFixed(1)}V-`, 350, centerY + 30);
    // Adjust for right side
    ctx.fillText(`+${Vb.toFixed(1)}V`, 355, centerY - 25);
    ctx.fillText('-', 365, centerY + 15);
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Verification check
function updateVerification() {
    const va = parseFloat(document.getElementById('va-slider').value);
    const vb = parseFloat(document.getElementById('vb-slider').value);
    const raa = parseFloat(document.getElementById('raa-prac').textContent) || 0;
    const rbb = parseFloat(document.getElementById('rbb-prac').textContent) || 0;
    let message = '';
    if (Math.abs(va - vb) < 0.1) {
        const diff = Math.abs(raa - rbb);
        if (diff < 0.05) {
            message = `✅ Reciprocity verified! R_aa (${raa.toFixed(2)}) ≈ R_bb (${rbb.toFixed(2)}) kΩ (diff: ${diff.toFixed(3)}).`;
        } else {
            message = `❌ Slight mismatch: R_aa (${raa.toFixed(2)}) vs R_bb (${rbb.toFixed(2)}) kΩ (diff: ${diff.toFixed(3)}). Try exact match.`;
        }
    } else {
        message = 'Set Va = Vb to verify reciprocity.';
    }
    document.getElementById('recip-check').textContent = message;
}

// Event listeners
document.getElementById('va-slider').addEventListener('input', updateCircuit1);
document.getElementById('vb-slider').addEventListener('input', updateCircuit2);

// Initial load
updateCircuit1();
updateCircuit2();
